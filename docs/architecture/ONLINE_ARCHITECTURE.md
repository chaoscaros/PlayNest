# 在线架构

**Status: Planned**。本文只描述目标方向，当前没有任何在线服务器实现。

```text
Browser
  │ WebSocket
  ▼
Game Server
  ├── Room
  ├── Match
  ├── Game Session
  └── Authoritative Game Logic
```

未来在线游戏优先采用 Server Authoritative：玩家发送 Game Action，服务器验证、修改 Game State 并向房间广播。客户端不能成为比赛结果的唯一权威。

未来议题包括 WebSocket、Room、Match、Reconnect、Server Authority、Spectator、Replay 与 Action 协议；目前全部未实现。当前不建立 NestJS、Fastify、数据库、Redis 或 Docker Compose。

## 麻将未来联机边界

`mahjong-basic` 已将规则封装为确定性的 `MahjongAction → MahjongState` Core。未来客户端只发送座位 Action，服务器维护 Authoritative MahjongState 并验证出牌、吃、碰、暗杠、明杠、加杠、胡和过。未来权威 Action 协议将包含 `DeclareConcealedKong`、`DeclareExposedKong` 与 `DeclareAddedKong`，当前仍未实现任何联网代码。

服务器不能把完整 State 广播给所有人，必须按座位生成 PlayerView / PublicSnapshot：只向本人发送隐藏手牌，其他座位只发送手牌数量、副露和弃牌。本地版本已有 `getVisibleStateForSeat` selector 作为边界验证，但当前没有网络传输或服务端 PlayerView 系统。
