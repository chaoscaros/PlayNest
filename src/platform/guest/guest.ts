import type { GuestProfile } from '../storage/types';

export function createGuestProfile(now = new Date()): GuestProfile {
  const guestId = crypto.randomUUID();
  const digits = Number.parseInt(guestId.replaceAll('-', '').slice(-8), 16) % 10_000;
  return {
    guestId,
    displayName: `游客 ${digits.toString().padStart(4, '0')}`,
    createdAt: now.toISOString(),
  };
}

export function normalizeDisplayName(name: string): string {
  const trimmed = name.trim().replace(/\s+/g, ' ');
  return trimmed.slice(0, 16);
}
