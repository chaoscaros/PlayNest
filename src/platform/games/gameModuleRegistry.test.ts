import { describe, expect, it } from 'vitest';
import { gameRegistry } from './gameRegistry';
import { gameModuleRegistry } from './gameModuleRegistry';

describe('Game plugin registration', () => {
  it('registers mahjong-basic as the one available real game', () => {
    expect(gameRegistry.getById('mahjong-basic')).toMatchObject({ name: '基础麻将', status: 'available' });
    expect(gameModuleRegistry.getById('mahjong-basic')?.GameComponent).toBeTypeOf('function');
  });

  it('does not expose modules for coming-soon placeholders', () => {
    expect(gameRegistry.getById('quiet-board-room')?.status).toBe('coming-soon');
    expect(gameModuleRegistry.getById('quiet-board-room')).toBeUndefined();
  });
});
