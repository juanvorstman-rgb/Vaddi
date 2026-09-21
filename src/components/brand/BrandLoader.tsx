// src/components/brand/BrandLoader.tsx
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';

export function BrandLoader({ label }: { label?: string }) {
  const { colors, typography, spacing } = useTheme();
  return (
    <View style={[styles.center, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.coral} />
      {label ? (
        <Text style={[typography.small, { color: colors.textMuted, marginTop: spacing.md }]}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
