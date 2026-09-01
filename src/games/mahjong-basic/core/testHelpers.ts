import type { MahjongPlayerState, MahjongSeat, MahjongState, MahjongTileInstance, MahjongTileType } from './mahjongTypes';
import { MAHJONG_SEATS } from './tiles';

let nextTestTileId = 10_000;

export function testTiles(types: readonly MahjongTileType[]): MahjongTileInstance[] {
  return types.map((tileType) => ({ tileId: nextTestTileId++, tileType }));
}

export function resetTestTileIds(): void {
  nextTestTileId = 10_000;
}

function testPlayer(seat: MahjongSeat): MahjongPlayerState {
  return { seat, concealedTiles: [], melds: [], discards: [] };
}

export function testState(overrides: Partial<MahjongState> = {}): MahjongState {
  return {
    players: Object.fromEntries(MAHJONG_SEATS.map((seat) => [seat, testPlayer(seat)])) as MahjongState['players'],
    wall: testTiles(['north']),
    initialWall: [],
    dealerSeat: 'east',
    currentSeat: 'east',
    phase: 'awaiting-discard',
    lastDiscard: null,
    reactionState: null,
    winner: null,
    winType: null,
    status: 'playing',
    actionCount: 0,
    ...overrides,
  };
}
