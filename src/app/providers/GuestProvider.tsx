import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { createGuestProfile, normalizeDisplayName } from '../../platform/guest/guest';
import { PlatformStorage } from '../../platform/storage/platformStorage';
import type { ThemePreference } from '../../platform/storage/types';
import { GuestContext } from './guestContext';

export function GuestProvider({ children }: { children: ReactNode }) {
  const storage = useMemo(() => new PlatformStorage(), []);
  const initialProfile = useMemo(() => {
    const stored = storage.getGuestProfile();
    if (stored) return stored;
    const created = createGuestProfile();
    storage.setGuestProfile(created);
    return created;
  }, [storage]);
  const [profile, setProfile] = useState(initialProfile);
  const [recentGames, setRecentGames] = useState(() => storage.getRecentGames());
  const [settings, setSettings] = useState(() => storage.getSettings());

  const updateDisplayName = useCallback((name: string) => {
    const normalized = normalizeDisplayName(name);
    if (!normalized) return;
    setProfile((current) => {
      const next = { ...current, displayName: normalized };
      storage.setGuestProfile(next);
      return next;
    });
  }, [storage]);

  const recordGameVisit = useCallback((gameId: string) => {
    storage.addRecentGame(gameId);
    setRecentGames(storage.getRecentGames());
  }, [storage]);

  const updateTheme = useCallback((theme: ThemePreference) => {
    const next = { theme };
    storage.setSettings(next);
    setSettings(next);
  }, [storage]);

  const resetLocalData = useCallback(() => {
    storage.reset();
    const nextProfile = createGuestProfile();
    storage.setGuestProfile(nextProfile);
    setProfile(nextProfile);
    setRecentGames([]);
    setSettings({ theme: 'system' });
  }, [storage]);

  const value = useMemo(() => ({ profile, recentGames, settings, updateDisplayName, recordGameVisit, updateTheme, resetLocalData }), [profile, recentGames, settings, updateDisplayName, recordGameVisit, updateTheme, resetLocalData]);

  return <GuestContext.Provider value={value}>{children}</GuestContext.Provider>;
}
