import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/brand';
import { IdeaCard } from '@/components/IdeaCard';
import { CURRENT_USER, MADRID_IDEAS } from '@/data/fixtures';
import { hitTarget, useTheme } from '@/theme';
import type { Idea } from '@/types/idea';

export default function IdeaDetailScreen() {
  const { colors, typography, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const idea = MADRID_IDEAS.find((i) => i.id === id);

  const book = (i: Idea) => {
    if (i.bookingUrl) Linking.openURL(i.bookingUrl);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.back()}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.xs,
          minHeight: hitTarget,
          paddingHorizontal: spacing.lg,
        }}
      >
        <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        <Text style={[typography.body, { color: colors.textPrimary }]}>Back</Text>
      </Pressable>

      {idea ? (
        <ScrollView
          contentContainerStyle={{
            padding: spacing.lg,
            paddingBottom: insets.bottom + spacing.xl,
            gap: spacing.md,
          }}
        >
          <IdeaCard
            idea={idea}
            variant="primary"
            currentUserId={CURRENT_USER.id}
            onPrimaryAction={book}
          />
        </ScrollView>
      ) : (
        <EmptyState
          icon="help-circle-outline"
          title="Idea not found"
          message="This idea isn’t available anymore."
          actionLabel="Back to Discover"
          onAction={() => router.replace('/discover')}
        />
      )}
    </View>
  );
}
