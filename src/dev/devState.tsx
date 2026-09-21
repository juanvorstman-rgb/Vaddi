// src/dev/devState.tsx
// A dev-only switch that forces any screen into one of the four designed states
// (v4 §5.8) so they can be reviewed on a device. Off in production.
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type ScreenStateKind = 'ready' | 'loading' | 'empty' | 'error' | 'offline';

interface DevStateValue {
  forced: ScreenStateKind;
  setForced: (s: ScreenStateKind) => void;
  enabled: boolean;
}

const DevStateContext = createContext<DevStateValue>({
  forced: 'ready',
  setForced: () => {},
  enabled: false,
});

export function DevStateProvider({ children }: { children: ReactNode }) {
  const [forced, setForced] = useState<ScreenStateKind>('ready');
  const value = useMemo(() => ({ forced, setForced, enabled: __DEV__ }), [forced]);
  return <DevStateContext.Provider value={value}>{children}</DevStateContext.Provider>;
}

export function useDevState(): DevStateValue {
  return useContext(DevStateContext);
}

/** A screen's effective state: the dev override when set, else its real state. */
export function useScreenState(realState: ScreenStateKind = 'ready'): ScreenStateKind {
  const { forced, enabled } = useDevState();
  if (enabled && forced !== 'ready') return forced;
  return realState;
}
