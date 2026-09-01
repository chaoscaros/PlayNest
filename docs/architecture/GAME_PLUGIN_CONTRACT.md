# 游戏插件协议

## Current Contract

平台当前通过两层注册接入游戏：

1. `GameRegistry` 管理 `GameDefinition` metadata、查询、分类和 `available` 状态。
2. `GameModuleRegistry` 将同一稳定 ID 映射到可挂载 React `GameComponent`。
3. `/play/:gameId` 仅在 metadata 为 `available` 且模块存在时渲染入口。

第一款真实案例 `mahjong-basic` 在模块内部继续分为纯 Mahjong Core 与 React UI。平台不知道吃碰胡规则；麻将 UI 也不直接修改状态，只派发 `MahjongAction`。

## Future Contract

## 最小目标边界

未来可以在当前最小合同上逐步增加：

- metadata：名称、分类、玩家模式、状态与平台展示信息。
- route / entry：平台可挂载的稳定入口。
- game state：与 React 展示层分离的状态结构。
- actions：清晰、可验证的玩家动作。
- optional local persistence：由平台批准的本地存档适配。
- optional online capability：可序列化 Action 与服务器权威状态同步能力。

平台只需要知道 metadata 与 entry；不能依赖具体游戏规则。规则流应为：

```text
Player Input → Game Action → Game Logic → Game State → UI
```

未来联网时演进为：

```text
Client Action → Server Validation → Authoritative Game State → Clients
```

当前明确不建立动态 module loader、micro frontend、服务端插件分发或过度抽象的插件框架。在线 capability 仍未实现。
