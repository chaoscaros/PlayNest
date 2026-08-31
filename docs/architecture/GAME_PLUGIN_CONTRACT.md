# 游戏插件目标协议

**Status: Planned**。当前仅实现 metadata Registry，没有插件 runtime、动态加载器或具体游戏。

## 最小目标边界

未来游戏模块大致提供：

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

当前明确不建立动态 module loader、micro frontend 或过度抽象的插件框架。
