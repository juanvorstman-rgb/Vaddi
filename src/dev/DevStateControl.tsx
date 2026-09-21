// src/dev/DevStateControl.tsx
// Dev-only segmented control (lives in Profile) that forces every screen into a
// given state for on-device review. Hidden in production builds.
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { hitTarget, useTheme } from '@/theme';
import { useDevState, type ScreenStateKind } from './devState';

const OPTIONS: { key: ScreenStateKind; label: string }[] = [
  { key: 'ready', label: 'Normal' },
  { key: 'loading', label: 'Loading' },
  { key: 'empty', label: 'Empty' },
  { key: 'error', label: 'Error' },
  { key: 'offline', label: 'Offline' },
];

export function DevStateControl() {
  const { colors, typography, spacing, radii } = useTheme();
  const { forced, setForced, enabled } = useDevState();
  if (!enabled) return null;

  return (
    <View style={{ gap: spacing.sm }}>
      <Text style={[typography.caption, { color: colors.textMuted }]}>DEV · FORCE SCREEN STATE</Text>
      <View style={styles.row}>
        {OPTIONS.map((o) => {
          const active = forced === o.key;
          return (
            <Pressable
              key={o.key}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setForced(o.key)}
              style={[
                styles.chip,
                {
                  borderRadius: radii.pill,
                  paddingHorizontal: spacing.md,
                  borderColor: active ? colors.coral : colors.border,
                  backgroundColor: active ? colors.coral : colors.surface,
                },
              ]}
            >
              <Text style={[typography.small, { color: active ? colors.navy : colors.textSecondary }]}>
                {o.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    minHeight: hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
