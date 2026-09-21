import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/brand';
import { hitTarget, useTheme } from '@/theme';

export default function CreateTripScreen() {
  const { colors, typography, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

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

      <EmptyState
        icon="construct-outline"
        title="Trip creation arrives in Phase 2"
        message="Next we build create-a-trip, the invite link, joining by name, and the shared plan."
        actionLabel="Back"
        onAction={() => router.back()}
      />
    </View>
  );
}
