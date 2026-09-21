// src/lib/session.tsx
// Anonymous session on first launch (v4 §5.1 — no account wall), persisted and
// refreshed. Upgrading to a full account comes later; the anon session is real.
import type { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { supabase } from './supabase';

interface SessionValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

const SessionContext = createContext<SessionValue>({ session: null, user: null, loading: true });

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      let current = data.session;
      if (!current) {
        const { data: anon, error } = await supabase.auth.signInAnonymously();
        if (error) {
          console.warn('[session] anonymous sign-in failed:', error.message);
        }
        current = anon.session;
      }
      if (mounted) {
        setSession(current);
        setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<SessionValue>(
    () => ({ session, user: session?.user ?? null, loading }),
    [session, loading],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  return useContext(SessionContext);
}
