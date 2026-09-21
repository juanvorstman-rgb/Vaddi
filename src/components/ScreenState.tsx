// src/components/ScreenState.tsx
// Renders the designed loading / empty / error / offline states (v4 §5.8), each
// with a next step (v4 §5.10). When state is 'ready' it renders the children.
import type { ReactNode } from 'react';

import { BrandLoader, EmptyState } from '@/components/brand';
import type { ScreenStateKind } from '@/dev/devState';

interface StateCopy {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ScreenState({
  state,
  loadingLabel,
  empty,
  error,
  offline,
  children,
}: {
  state: ScreenStateKind;
  loadingLabel?: string;
  empty: StateCopy;
  error?: Partial<StateCopy>;
  offline?: Partial<StateCopy>;
  children: ReactNode;
}) {
  if (state === 'loading') return <BrandLoader label={loadingLabel ?? 'Loading…'} />;

  if (state === 'empty') {
    return <EmptyState icon="compass-outline" {...empty} />;
  }

  if (state === 'error') {
    return (
      <EmptyState
        icon="alert-circle-outline"
        tone="error"
        title={error?.title ?? 'Something went wrong'}
        message={error?.message ?? 'That didn’t load. Give it another go.'}
        actionLabel={error?.actionLabel ?? 'Try again'}
        onAction={error?.onAction}
      />
    );
  }

  if (state === 'offline') {
    return (
      <EmptyState
        icon="cloud-offline-outline"
        title={offline?.title ?? 'You’re offline'}
        message={offline?.message ?? 'Showing what we’ve got. Reconnect to refresh.'}
        actionLabel={offline?.actionLabel ?? 'Retry'}
        onAction={offline?.onAction}
      />
    );
  }

  return <>{children}</>;
}
