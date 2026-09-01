# 技术决策

## ADR-001 — React + TypeScript + Vite

**状态：Accepted。** 长期页面与游戏 UI 需要成熟组件生态；Vite 提供轻量开发和构建，TypeScript strict 保持契约清晰。

## ADR-002 — 游客优先

**状态：Accepted。** 首次访问自动建立本地 Guest Profile，注册不是平台入口条件。当前使用 localStorage，未来再提供主动账号迁移。

## ADR-003 — 平台与游戏模块分离

**状态：Accepted。** Registry 只管理 metadata；游戏规则、state 与 actions 属于独立游戏模块。当前不实现插件 runtime。

## ADR-004 — 当前不实现 Server

**状态：Accepted。** 尚无确认游戏或真实联机需求，提前建立 WebSocket、数据库、Redis 会增加无效复杂度。只保留 Server Authoritative 目标文档。

## ADR-005 — 人类可读文本中文优先

**状态：Accepted。** 玩家文案和文档以简体中文为主，代码标识与内部 ID 使用英文。

## ADR-006 — 原生 CSS 设计系统

**状态：Accepted。** 当前组件规模不需要 UI framework；CSS Variables、单一全局样式入口和响应式断点足以提供独特、轻量的视觉。

## ADR-007 — 第一款麻将采用 PlayNest 基础规则

**状态：Accepted。** 第一款游戏固定采用四人、136 张、无花牌、无杠、无番、无特殊胡型、支持吃碰胡、普通四面子一将、固定东家、一人胡即结束的简化规则。

该规则用于优先验证 Mahjong Game Core、Game Plugin、Action / State、响应优先级和未来 Server Authority 演进，不声称完整模拟国标、日麻、四川麻将或其他地区规则。未来变体可以复用 Tile model、seat helpers 与基础 Action primitives，但当前不建立 Universal Mahjong Engine。

## ADR-008 — 本地麻将使用确定性响应队列

**状态：Accepted。** 弃牌响应顺序固定为 `胡 > 碰 > 吃`，同级按距离出牌者的座位顺序。响应逐位询问，不能用 UI 点击速度抢牌；第一位接受最高优先级操作后队列结束，一炮多响当前不支持。
