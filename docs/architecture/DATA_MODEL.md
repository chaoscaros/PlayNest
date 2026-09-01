# 数据模型

| 模型 | Owner | 可变 | 持久化 | Source File |
| --- | --- | --- | --- | --- |
| `GuestProfile` | GuestProvider | 昵称可变 | localStorage | `src/platform/storage/types.ts` |
| `PlatformSettings` | GuestProvider | 是 | localStorage | `src/platform/storage/types.ts` |
| `RecentGame` | GuestProvider | 是 | localStorage | `src/platform/storage/types.ts` |
| `PlatformState` | PlatformStorage | 是 | localStorage | `src/platform/storage/types.ts` |
| `GameDefinition` | Game Registry | 否 | 源码 metadata | `src/platform/games/types.ts` |
| `GameCategory` | Game Registry | 否 | 源码 | `src/platform/games/types.ts` |
| `PlayerMode` | Game Registry | 否 | 源码 | `src/platform/games/types.ts` |
| `GameStatus` | Game Registry | 否 | 源码 | `src/platform/games/types.ts` |
| `GameModule` | Game Module Registry | 否 | 源码 | `src/platform/games/gameModuleRegistry.ts` |
| `MahjongTileType` | Mahjong Core | 否 | 不持久化 | `src/games/mahjong-basic/core/mahjongTypes.ts` |
| `MahjongTileInstance` | Mahjong Core | 状态演进 | 不持久化 | `src/games/mahjong-basic/core/mahjongTypes.ts` |
| `MahjongSeat` | Mahjong Core | 否 | 不持久化 | `src/games/mahjong-basic/core/mahjongTypes.ts` |
| `MahjongPlayerState` | Mahjong Core | Action 产生新状态 | 不持久化 | `src/games/mahjong-basic/core/mahjongTypes.ts` |
| `MahjongMeld` / `MahjongMeldType` | Mahjong Core | Action 产生新状态 | 不持久化 | `src/games/mahjong-basic/core/mahjongTypes.ts` |
| `MahjongAction` | Mahjong Core | 否 | 当前不记录 | `src/games/mahjong-basic/core/mahjongTypes.ts` |
| `MahjongReaction` | Mahjong Core | 队列演进 | 不持久化 | `src/games/mahjong-basic/core/mahjongTypes.ts` |
| `MahjongState` | Mahjong Core | Action 产生新状态 | 不持久化 | `src/games/mahjong-basic/core/mahjongTypes.ts` |
| `MahjongPhase` / `MahjongWinType` | Mahjong Core | 状态枚举 | 不持久化 | `src/games/mahjong-basic/core/mahjongTypes.ts` |

`PlatformState.storageVersion` 当前固定为 `1`。损坏 JSON 或未知版本会回退到默认空状态；暂不实现 migration。最近访问保存 `gameId` 与 `lastVisitedAt`，最多 6 条，按最近时间排列。

麻将一局包含 136 个唯一 `tileId`，同类规则判断使用 `tileType`。`initialWall + MahjongAction[]` 是未来回放的目标边界，但本轮不保存牌局或 Action 日志。
