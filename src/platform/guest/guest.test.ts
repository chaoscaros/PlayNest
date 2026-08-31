import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createGuestProfile, normalizeDisplayName } from './guest';
import { PlatformStorage } from '../storage/platformStorage';

describe('guest profile', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('crypto', { randomUUID: vi.fn(() => '11111111-2222-4333-8444-0000000012ab') });
  });

  it('creates a guest with a stable ID and valid nickname', () => {
    const profile = createGuestProfile(new Date('2026-08-31T08:00:00.000Z'));
    expect(profile.guestId).toBe('11111111-2222-4333-8444-0000000012ab');
    expect(profile.displayName).toMatch(/^游客 \d{4}$/);
    expect(profile.createdAt).toBe('2026-08-31T08:00:00.000Z');
  });

  it('keeps a guest after storage is reloaded', () => {
    const storage = new PlatformStorage(localStorage);
    const profile = createGuestProfile();
    storage.setGuestProfile(profile);
    expect(new PlatformStorage(localStorage).getGuestProfile()).toEqual(profile);
  });

  it('normalizes and limits a custom nickname', () => {
    expect(normalizeDisplayName('  轻松   玩家  ')).toBe('轻松 玩家');
    expect(normalizeDisplayName('12345678901234567890')).toHaveLength(16);
  });

  it('creates a new identity after reset', () => {
    const storage = new PlatformStorage(localStorage);
    const original = createGuestProfile();
    storage.setGuestProfile(original);
    storage.reset();
    vi.mocked(crypto.randomUUID).mockReturnValue('aaaaaaaa-bbbb-4ccc-8ddd-00000000ffff');
    const next = createGuestProfile();
    storage.setGuestProfile(next);
    expect(storage.getGuestProfile()?.guestId).not.toBe(original.guestId);
  });
});
