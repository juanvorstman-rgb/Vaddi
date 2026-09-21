import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/brand';
import { ScreenState } from '@/components/ScreenState';
import { useDevState, useScreenState } from '@/dev/devState';
import { useTheme } from '@/theme';

export default function TripScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setForced } = useDevState();
  const state = useScreenState('ready');

  const createTrip = () => router.push('/create-trip');
  const backToContent = () => setForced('ready');

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      <ScreenState
        state={state}
        loadingLabel="Loading your trip…"
        empty={{
          title: 'No trip yet',
          message: 'Start a trip and invite your crew — everyone plans together.',
          actionLabel: 'Create a trip',
          onAction: createTrip,
        }}
        error={{ onAction: backToContent }}
        offline={{ onAction: backToContent }}
      >
        {/* In Phase 1 the "ready" Trip state is itself the no-trip empty. */}
        <EmptyState
          icon="map-outline"
          title="No trip yet"
          message="Start a trip and invite your crew — everyone plans together."
          actionLabel="Create a trip"
          onAction={createTrip}
        />
      </ScreenState>
    </View>
  );
}
