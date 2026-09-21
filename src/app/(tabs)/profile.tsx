import { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/brand';
import { ScreenState } from '@/components/ScreenState';
import { DevStateControl } from '@/dev/DevStateControl';
import { useDevState, useScreenState } from '@/dev/devState';
import { useTheme } from '@/theme';

export default function ProfileScreen() {
  const { colors, typography, spacing, radii } = useTheme();
  const insets = useSafeAreaInsets();
  const { setForced } = useDevState();
  const state = useScreenState('ready');
  const [name, setName] = useState('');

  const backToContent = () => setForced('ready');

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      {/* Dev control is pinned above the state region so it stays usable even
          when the content below is forced into loading/error/offline. */}
      <View style={{ padding: spacing.lg, gap: spacing.md }}>
        <Text style={[typography.display, { color: colors.textPrimary }]}>Profile</Text>
        <DevStateControl />
      </View>

      <View style={{ flex: 1 }}>
        <ScreenState
          state={state}
          loadingLabel="Loading profile…"
          empty={{
            title: 'No profile yet',
            message: 'Add a display name so your crew knows who’s who.',
          }}
          error={{ onAction: backToContent }}
          offline={{ onAction: backToContent }}
        >
          <ScrollView
            contentContainerStyle={{
              padding: spacing.lg,
              paddingBottom: insets.bottom + spacing.xl,
              gap: spacing.xl,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <BrandMark size={40} />
              <View style={{ flex: 1 }}>
                <Text style={[typography.bodyStrong, { color: colors.textPrimary }]}>
                  Browsing as a guest
                </Text>
                <Text style={[typography.small, { color: colors.textMuted }]}>
                  No account needed. Sign-in comes later.
                </Text>
              </View>
            </View>

            <View style={{ gap: spacing.sm }}>
              <Text style={[typography.caption, { color: colors.textMuted }]}>DISPLAY NAME</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Add your name"
                placeholderTextColor={colors.textMuted}
                style={[
                  typography.body,
                  {
                    color: colors.textPrimary,
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                    borderRadius: radii.md,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.md,
                  },
                ]}
              />
              <Text style={[typography.small, { color: colors.textMuted }]}>
                Saves to your profile in the next step.
              </Text>
            </View>
          </ScrollView>
        </ScreenState>
      </View>
    </View>
  );
}
