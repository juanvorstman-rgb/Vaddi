import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/brand';
import { ScreenState } from '@/components/ScreenState';
import { DevStateControl } from '@/dev/DevStateControl';
import { useDevState, useScreenState } from '@/dev/devState';
import { useSession } from '@/lib/session';
import { useProfile } from '@/lib/useProfile';
import { hitTarget, useTheme } from '@/theme';

export default function ProfileScreen() {
  const { colors, typography, spacing, radii } = useTheme();
  const insets = useSafeAreaInsets();
  const { setForced } = useDevState();
  const state = useScreenState('ready');
  const { user, loading: sessionLoading } = useSession();
  const { displayName, setDisplayName, save, saving, dirty, ready } = useProfile();
  const [justSaved, setJustSaved] = useState(false);

  const backToContent = () => setForced('ready');

  const onSave = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const err = await save();
    if (err) {
      Alert.alert('Could not save', err);
      return;
    }
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1500);
  };

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
                  {(user?.is_anonymous ?? true) ? 'Browsing as a guest' : 'Signed in'}
                </Text>
                <Text style={[typography.small, { color: colors.textMuted }]}>
                  {sessionLoading ? 'Starting your session…' : 'No account needed. Sign-in comes later.'}
                </Text>
              </View>
            </View>

            <View style={{ gap: spacing.sm }}>
              <Text style={[typography.caption, { color: colors.textMuted }]}>DISPLAY NAME</Text>
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                editable={ready}
                placeholder="Add your name"
                placeholderTextColor={colors.textMuted}
                returnKeyType="done"
                onSubmitEditing={dirty ? onSave : undefined}
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
              {dirty ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={onSave}
                  disabled={saving}
                  style={({ pressed }) => [
                    {
                      minHeight: hitTarget,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: colors.coral,
                      borderRadius: radii.pill,
                      opacity: pressed || saving ? 0.85 : 1,
                    },
                  ]}
                >
                  <Text style={[typography.bodyStrong, { color: colors.navy }]}>
                    {saving ? 'Saving…' : 'Save name'}
                  </Text>
                </Pressable>
              ) : (
                <Text style={[typography.small, { color: colors.textMuted }]}>
                  {justSaved ? 'Saved.' : 'Saved to your profile.'}
                </Text>
              )}
            </View>
          </ScrollView>
        </ScreenState>
      </View>
    </View>
  );
}
