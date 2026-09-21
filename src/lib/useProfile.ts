// src/lib/useProfile.ts
// Load and save the signed-in user's display_name. Reads/writes are owner-only
// by RLS (migration 0001/0002), so no user id is trusted from the client beyond
// the session's own uid.
import { useCallback, useEffect, useState } from 'react';

import { useSession } from './session';
import { supabase } from './supabase';

export function useProfile() {
  const { user } = useSession();
  const [displayName, setDisplayName] = useState('');
  const [savedName, setSavedName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .maybeSingle();
      if (mounted) {
        const name = data?.display_name ?? '';
        setDisplayName(name);
        setSavedName(name);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user]);

  const save = useCallback(async (): Promise<string | null> => {
    if (!user) return 'No session yet.';
    const trimmed = displayName.trim();
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: trimmed || null })
      .eq('id', user.id);
    setSaving(false);
    if (error) return error.message;
    setSavedName(trimmed);
    return null;
  }, [user, displayName]);

  return {
    displayName,
    setDisplayName,
    save,
    loading,
    saving,
    dirty: displayName.trim() !== savedName,
    ready: !!user,
  };
}
