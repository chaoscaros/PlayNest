import { describe, expect, it } from 'vitest';
import { placeholderGames } from './catalog';
import { GameRegistry, gameRegistry } from './gameRegistry';

describe('GameRegistry', () => {
  it('lists unique game IDs', () => {
    const ids = gameRegistry.list().map((game) => game.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('rejects duplicate IDs', () => {
    expect(() => new GameRegistry([placeholderGames[0], placeholderGames[0]])).toThrow('unique');
  });

  it('finds a game by ID', () => {
    expect(gameRegistry.getById('daily-brainwave')?.name).toBe('每日灵感');
  });

  it('returns undefined for an unknown ID', () => {
    expect(gameRegistry.getById('missing')).toBeUndefined();
  });

  it('filters by category', () => {
    expect(gameRegistry.getByCategory('board').every((game) => game.category === 'board')).toBe(true);
  });

  it('keeps every placeholder in coming-soon state', () => {
    expect(gameRegistry.list().every((game) => game.status === 'coming-soon')).toBe(true);
  });
});
