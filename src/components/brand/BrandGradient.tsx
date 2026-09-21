// src/components/brand/BrandGradient.tsx
// NOTE: the real coral→teal gradient needs `expo-linear-gradient`, which is not
// on the Phase 1 pre-approved dependency list. Until it's approved this renders
// a solid coral fill (recorded in STATUS.md / DECISIONS.md). Swapping in a real
// LinearGradient later is a one-line change here — nothing else references it.
import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

export function BrandGradient({
  children,
  style,
}: {
  children?: ReactNode;
  style?: ViewStyle;
}) {
  const { colors } = useTheme();
  return <View style={[styles.fill, { backgroundColor: colors.coral }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
