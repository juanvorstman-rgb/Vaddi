import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';

export default function Index() {
  const { colors, typography } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[typography.display, { color: colors.textPrimary }]}>Vaddi</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
