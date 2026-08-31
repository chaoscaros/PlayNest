import { createContext } from 'react';
import type { GuestProfile, PlatformSettings, RecentGame, ThemePreference } from '../../platform/storage/types';

export interface GuestContextValue {
  profile: GuestProfile;
  recentGames: RecentGame[];
  settings: PlatformSettings;
  updateDisplayName: (name: string) => void;
  recordGameVisit: (gameId: string) => void;
  updateTheme: (theme: ThemePreference) => void;
  resetLocalData: () => void;
}

export const GuestContext = createContext<GuestContextValue | null>(null);
