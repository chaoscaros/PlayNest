export interface GuestProfile {
  guestId: string;
  displayName: string;
  createdAt: string;
}

export interface RecentGame {
  gameId: string;
  lastVisitedAt: string;
}

export type ThemePreference = 'system' | 'light' | 'dark';

export interface PlatformSettings {
  theme: ThemePreference;
}

export interface PlatformState {
  storageVersion: 1;
  guestProfile: GuestProfile | null;
  recentGames: RecentGame[];
  settings: PlatformSettings;
}
