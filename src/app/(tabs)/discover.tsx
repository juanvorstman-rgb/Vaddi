import { useRouter } from 'expo-router';
import { Linking, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IdeaCard } from '@/components/IdeaCard';
import { ScreenState } from '@/components/ScreenState';
import { CURRENT_USER, MADRID_IDEAS } from '@/data/fixtures';
import { useDevState, useScreenState } from '@/dev/devState';
import { useTheme } from '@/theme';
import type { Idea } from '@/types/idea';

export default function DiscoverScreen() {
  const { colors, typography, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setForced } = useDevState();
  const state = useScreenState('ready');

  const [pick, ...rest] = MADRID_IDEAS;
  const others = rest.slice(0, 3);

  const openDetail = (idea: Idea) =>
    router.push({ pathname: '/idea/[id]', params: { id: idea.id } });
  const book = (idea: Idea) => {
    if (idea.bookingUrl) Linking.openURL(idea.bookingUrl);
    else openDetail(idea);
  };
  const backToContent = () => setForced('ready');

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      <ScreenState
        state={state}
        loadingLabel="Finding plans near you…"
        empty={{
          title: 'No ideas yet',
          message: 'We couldn’t find plans for this spot. Try again in a moment.',
          actionLabel: 'Refresh',
          onAction: backToContent,
        }}
        error={{ onAction: backToContent }}
        offline={{ onAction: backToContent }}
      >
        <ScrollView
          contentContainerStyle={{
            padding: spacing.lg,
            paddingBottom: insets.bottom + spacing.xl,
            gap: spacing.md,
          }}
        >
          <Text style={[typography.display, { color: colors.textPrimary }]}>Discover</Text>

          <View style={{ gap: spacing.xs }}>
            <Text style={[typography.caption, { color: colors.coral }]}>VADDI’S PICK</Text>
            <IdeaCard
              idea={pick}
              variant="primary"
              currentUserId={CURRENT_USER.id}
              onPress={openDetail}
              onPrimaryAction={book}
            />
          </View>

          <Text style={[typography.caption, { color: colors.textMuted, marginTop: spacing.sm }]}>
            MORE FOR YOUR GROUP
          </Text>
          {others.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              variant="compact"
              currentUserId={CURRENT_USER.id}
              onPress={openDetail}
            />
          ))}
        </ScrollView>
      </ScreenState>
    </View>
  );
}
