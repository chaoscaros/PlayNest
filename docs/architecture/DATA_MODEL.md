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

`PlatformState.storageVersion` 当前固定为 `1`。损坏 JSON 或未知版本会回退到默认空状态；暂不实现 migration。最近访问保存 `gameId` 与 `lastVisitedAt`，最多 6 条，按最近时间排列。
