// src/components/brand/EmptyState.tsx
// Designed empty/error state — always offers the next step (v4 §5.8, §5.10).
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { hitTarget, useTheme } from '@/theme';

export function EmptyState({
  icon = 'compass-outline',
  title,
  message,
  actionLabel,
  onAction,
  tone = 'coral',
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'coral' | 'error';
}) {
  const { colors, typography, spacing, radii } = useTheme();
  const accent = tone === 'error' ? colors.error : colors.coral;

  return (
    <View style={[styles.wrap, { backgroundColor: colors.background, padding: spacing.xl }]}>
      <Ionicons name={icon} size={44} color={accent} />
      <Text style={[typography.title, { color: colors.textPrimary, marginTop: spacing.lg, textAlign: 'center' }]}>
        {title}
      </Text>
      {message ? (
        <Text
          style={[
            typography.body,
            { color: colors.textSecondary, marginTop: spacing.sm, textAlign: 'center' },
          ]}
        >
          {message}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          style={({ pressed }) => [
            styles.action,
            {
              backgroundColor: accent,
              borderRadius: radii.pill,
              paddingHorizontal: spacing.xl,
              marginTop: spacing.xl,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text style={[typography.bodyStrong, { color: colors.onAccent }]}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  action: {
    minHeight: hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
