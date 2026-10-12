// src/components/brand/BrandGradient.tsx
// The brand gradient: coral left → teal right, matching the J2 Compass V mark
// (VADDI §6). Colours come from the theme; no hex literals live here.
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

export function BrandGradient({
  children,
  style,
}: {
  children?: ReactNode;
  style?: ViewStyle;
}) {
  const { colors } = useTheme();
  return (
    <LinearGradient
      colors={[colors.coral, colors.teal]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.fill, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
