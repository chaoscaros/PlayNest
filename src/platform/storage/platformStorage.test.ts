import { beforeEach, describe, expect, it } from 'vitest';
import { PlatformStorage, STORAGE_KEY, STORAGE_VERSION } from './platformStorage';

describe('PlatformStorage', () => {
  beforeEach(() => localStorage.clear());

  it('reads and writes versioned platform state', () => {
    const storage = new PlatformStorage(localStorage);
    storage.setSettings({ theme: 'dark' });
    expect(storage.getSettings()).toEqual({ theme: 'dark' });
    expect(storage.read().storageVersion).toBe(STORAGE_VERSION);
  });

  it('falls back safely when JSON is corrupted', () => {
    localStorage.setItem(STORAGE_KEY, '{broken');
    expect(new PlatformStorage(localStorage).read()).toMatchObject({ storageVersion: 1, guestProfile: null, recentGames: [] });
  });

  it('falls back when the storage version is unknown', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ storageVersion: 99, recentGames: [], settings: {} }));
    expect(new PlatformStorage(localStorage).read().storageVersion).toBe(1);
  });

  it('records recent games once and orders newest first', () => {
    const storage = new PlatformStorage(localStorage);
    storage.addRecentGame('one');
    storage.addRecentGame('two');
    storage.addRecentGame('one');
    expect(storage.getRecentGames().map((item) => item.gameId)).toEqual(['one', 'two']);
  });
});
