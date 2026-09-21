// src/components/IdeaCard.tsx
// The one card, used everywhere (v4 §6). Photo, name, one-line "why", distance
// or time, price band, group reactions (yes/no + who), one primary action.
// Variants: 'primary' (Vaddi's pick) and 'compact' (the others).
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { hitTarget, useTheme } from '@/theme';
import type { Idea, Vote } from '@/types/idea';

const CATEGORY_ICON: Record<Idea['category'], keyof typeof Ionicons.glyphMap> = {
  eat: 'restaurant-outline',
  drink: 'wine-outline',
  do: 'sparkles-outline',
};

function formatProximity(idea: Idea): string | null {
  if (idea.distanceMeters != null) {
    return idea.distanceMeters >= 1000
      ? `${(idea.distanceMeters / 1000).toFixed(1)} km`
      : `${idea.distanceMeters} m`;
  }
  if (idea.etaMinutes != null) return `${idea.etaMinutes} min walk`;
  return null;
}

function defaultActionLabel(category: Idea['category']): string {
  return category === 'do' ? 'Book' : 'Reserve';
}

export interface IdeaCardProps {
  idea: Idea;
  variant?: 'primary' | 'compact';
  currentUserId?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: (idea: Idea) => void;
  onPress?: (idea: Idea) => void;
}

export function IdeaCard({
  idea,
  variant = 'primary',
  currentUserId = 'u-me',
  primaryActionLabel,
  onPrimaryAction,
  onPress,
}: IdeaCardProps) {
  const { colors, typography, spacing, radii } = useTheme();

  const initialVote = idea.reactions.find((r) => r.userId === currentUserId)?.vote ?? null;
  const [myVote, setMyVote] = useState<Vote | null>(initialVote);

  const others = idea.reactions.filter((r) => r.userId !== currentUserId);
  const yesNames = others.filter((r) => r.vote === 'yes').map((r) => r.name);
  const noNames = others.filter((r) => r.vote === 'no').map((r) => r.name);
  const yesCount = yesNames.length + (myVote === 'yes' ? 1 : 0);
  const noCount = noNames.length + (myVote === 'no' ? 1 : 0);

  // Optimistic, local, instant. Tapping the same vote again clears it.
  const react = (vote: Vote) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMyVote((prev) => (prev === vote ? null : vote));
  };

  const proximity = formatProximity(idea);
  const whoYes = [...yesNames, ...(myVote === 'yes' ? ['you'] : [])];
  const whoLine =
    whoYes.length > 0
      ? `${whoYes.slice(0, 3).join(', ')}${whoYes.length > 3 ? ` +${whoYes.length - 3}` : ''} in`
      : 'No reactions yet';

  const isCompact = variant === 'compact';
  const photoHeight = isCompact ? 84 : 180;

  const MetaRow = (
    <View style={styles.metaRow}>
      <Ionicons name={CATEGORY_ICON[idea.category]} size={14} color={colors.textMuted} />
      <Text style={[typography.small, { color: colors.textMuted }]}>{idea.priceBand}</Text>
      {proximity ? (
        <>
          <Text style={[typography.small, { color: colors.textMuted }]}>·</Text>
          <Text style={[typography.small, { color: colors.textMuted }]}>{proximity}</Text>
        </>
      ) : null}
    </View>
  );

  const ReactionBar = (
    <View style={styles.reactionRow}>
      <ReactionButton
        icon="checkmark"
        count={yesCount}
        active={myVote === 'yes'}
        activeColor={colors.teal}
        onPress={() => react('yes')}
      />
      <ReactionButton
        icon="close"
        count={noCount}
        active={myVote === 'no'}
        activeColor={colors.error}
        onPress={() => react('no')}
      />
      <Text style={[typography.small, { color: colors.textMuted, flexShrink: 1 }]} numberOfLines={1}>
        {whoLine}
      </Text>
    </View>
  );

  const PrimaryAction = onPrimaryAction ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${primaryActionLabel ?? defaultActionLabel(idea.category)} ${idea.name}`}
      onPress={() => onPrimaryAction(idea)}
      style={({ pressed }) => [
        styles.primaryAction,
        {
          backgroundColor: colors.coral,
          borderRadius: radii.pill,
          paddingHorizontal: spacing.lg,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      {/* navy-on-coral = 5.3:1, AA (white-on-coral would fail) */}
      <Text style={[typography.bodyStrong, { color: colors.navy }]}>
        {primaryActionLabel ?? defaultActionLabel(idea.category)}
      </Text>
    </Pressable>
  ) : null;

  // ── compact ───────────────────────────────────────────────────────────────
  if (isCompact) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress ? () => onPress(idea) : undefined}
        style={[
          styles.card,
          styles.compactCard,
          { backgroundColor: colors.elevated, borderColor: colors.border, borderRadius: radii.lg },
        ]}
      >
        <Image
          source={{ uri: idea.photoUrl }}
          style={{ width: photoHeight, height: photoHeight, borderRadius: radii.md }}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />
        <View style={styles.compactBody}>
          <Text style={[typography.bodyStrong, { color: colors.textPrimary }]} numberOfLines={1}>
            {idea.name}
          </Text>
          <Text style={[typography.small, { color: colors.textSecondary }]} numberOfLines={1}>
            {idea.why}
          </Text>
          {MetaRow}
          {ReactionBar}
        </View>
      </Pressable>
    );
  }

  // ── primary ───────────────────────────────────────────────────────────────
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.elevated, borderColor: colors.border, borderRadius: radii.lg },
      ]}
    >
      <Pressable onPress={onPress ? () => onPress(idea) : undefined} accessibilityRole="button">
        <Image
          source={{ uri: idea.photoUrl }}
          style={{ width: '100%', height: photoHeight }}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />
        <View style={{ padding: spacing.lg, gap: spacing.xs }}>
          {MetaRow}
          <Text style={[typography.title, { color: colors.textPrimary }]}>{idea.name}</Text>
          <Text style={[typography.body, { color: colors.textSecondary }]}>{idea.why}</Text>
        </View>
      </Pressable>
      <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, gap: spacing.md }}>
        {ReactionBar}
        {PrimaryAction}
      </View>
    </View>
  );
}

function ReactionButton({
  icon,
  count,
  active,
  activeColor,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  count: number;
  active: boolean;
  activeColor: string;
  onPress: () => void;
}) {
  const { colors, typography, radii, spacing } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.reactionButton,
        {
          minWidth: hitTarget,
          borderRadius: radii.pill,
          paddingHorizontal: spacing.md,
          borderColor: active ? activeColor : colors.border,
          backgroundColor: active ? `${activeColor}22` : 'transparent',
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Ionicons name={icon} size={18} color={active ? activeColor : colors.textMuted} />
      <Text style={[typography.small, { color: active ? activeColor : colors.textMuted }]}>
        {count}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  compactCard: {
    flexDirection: 'row',
    padding: 8,
    gap: 12,
    alignItems: 'center',
  },
  compactBody: { flex: 1, gap: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  reactionRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reactionButton: {
    height: hitTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
  },
  primaryAction: {
    minHeight: hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
