import type { MahjongSeat, MahjongState, MahjongVisibleState } from './mahjongTypes';
import { MAHJONG_SEATS } from './tiles';

export function getVisibleStateForSeat(state: MahjongState, viewerSeat: MahjongSeat): MahjongVisibleState {
  return {
    viewerSeat,
    players: Object.fromEntries(MAHJONG_SEATS.map((seat) => {
      const player = state.players[seat];
      return [seat, {
        seat,
        concealedCount: player.concealedTiles.length,
        ...(seat === viewerSeat ? { concealedTiles: player.concealedTiles } : {}),
        melds: player.melds,
        discards: player.discards,
      }];
    })) as MahjongVisibleState['players'],
    wallCount: state.wall.length,
    currentSeat: state.currentSeat,
    phase: state.phase,
    lastDiscard: state.lastDiscard,
    winner: state.winner,
    winType: state.winType,
    status: state.status,
  };
}
