import type { GuestProfile, PlatformSettings, PlatformState, RecentGame } from './types';

const STORAGE_KEY = 'playnest.platform-state';
const STORAGE_VERSION = 1 as const;

const defaultState = (): PlatformState => ({
  storageVersion: STORAGE_VERSION,
  guestProfile: null,
  recentGames: [],
  settings: { theme: 'system' },
});

function isPlatformState(value: unknown): value is PlatformState {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<PlatformState>;
  return (
    candidate.storageVersion === STORAGE_VERSION &&
    (candidate.guestProfile === null || typeof candidate.guestProfile === 'object') &&
    Array.isArray(candidate.recentGames) &&
    typeof candidate.settings === 'object'
  );
}

export class PlatformStorage {
  constructor(private readonly storage: Storage = window.localStorage) {}

  read(): PlatformState {
    try {
      const raw = this.storage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed: unknown = JSON.parse(raw);
      return isPlatformState(parsed) ? parsed : defaultState();
    } catch {
      return defaultState();
    }
  }

  write(state: PlatformState): void {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  getGuestProfile(): GuestProfile | null {
    return this.read().guestProfile;
  }

  setGuestProfile(profile: GuestProfile): void {
    this.write({ ...this.read(), guestProfile: profile });
  }

  getRecentGames(): RecentGame[] {
    return this.read().recentGames;
  }

  addRecentGame(gameId: string): void {
    const state = this.read();
    const next = [
      { gameId, lastVisitedAt: new Date().toISOString() },
      ...state.recentGames.filter((item) => item.gameId !== gameId),
    ].slice(0, 6);
    this.write({ ...state, recentGames: next });
  }

  getSettings(): PlatformSettings {
    return this.read().settings;
  }

  setSettings(settings: PlatformSettings): void {
    this.write({ ...this.read(), settings });
  }

  reset(): void {
    this.storage.removeItem(STORAGE_KEY);
  }
}

export { STORAGE_KEY, STORAGE_VERSION };
