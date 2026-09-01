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

**状态：Accepted。** 第一款游戏固定采用四人、136 张、无花牌、无番、无特殊胡型、支持吃碰杠胡、普通四面子一将、固定东家、一人胡即结束的简化规则。

该规则用于优先验证 Mahjong Game Core、Game Plugin、Action / State、响应优先级和未来 Server Authority 演进，不声称完整模拟国标、日麻、四川麻将或其他地区规则。未来变体可以复用 Tile model、seat helpers 与基础 Action primitives，但当前不建立 Universal Mahjong Engine。

## ADR-008 — 本地麻将使用确定性响应队列

**状态：Accepted。** 弃牌响应顺序固定为 `胡 > 明杠 > 碰 > 吃`，同级按距离出牌者的座位顺序。响应逐位询问，不能用 UI 点击速度抢牌；同一玩家持有三张同牌时可在明杠、碰、过之间选择，第一位接受操作后队列结束，一炮多响当前不支持。

## ADR-009 — 游戏实体使用专用矢量视觉资源

**状态：Accepted。** 麻将牌面使用 `react-riichi-mahjong-tiles` 2.1.0 的本地 React SVG 组件，通过模块内 adapter 映射全部 34 种 Tile Type。牌体、触控、选中状态和响应式尺寸仍由 PlayNest CSS 控制，规则 Core 不依赖视觉包。

不引入无法提供游戏图形的通用 UI framework。后续游戏可以按需采用与棋子、卡牌或道具匹配的专用视觉资源；跨游戏 primitive 在出现第二个真实使用方后再抽取，避免提前制造空泛组件层。Game Module 使用路由级懒加载，避免专用视觉资源累积到平台首屏 bundle。

## ADR-010 — 基础麻将优先单人对战三名 AI

**状态：Accepted。** 根据用户试玩反馈，基础麻将默认由玩家固定控制东家，南、西、北三席由基础 AI 自动操作，不再要求四名玩家共用设备换手。

AI 作为 Core 外的纯策略层：能胡必胡，按当前响应队列处理杠、碰、吃、过，并用相同牌、相邻牌和搭子效用确定性选择弃牌。所有 AI Action 仍必须经过 `getLegalActions` 与 `applyMahjongAction`，不直接修改 State，也不读取对手隐藏手牌制定策略。当前不提供难度选择、搜索算法或训练模型。

## ADR-011 — 基础麻将杠规则

**状态：Accepted。** `mahjong-basic` 支持暗杠、明杠、加杠与杠后补牌。普通摸牌使用牌墙头部，三种杠完成后由同一玩家从牌墙尾部补一张；没有补牌时直接流局。每个杠副露拥有四个唯一 TileInstance，但在胡牌结构中仍只贡献一个 meld。

明杠进入确定性响应队列，优先级为 `胡 > 明杠 > 碰 > 吃`。加杠只允许用玩家自己隐藏手牌中的第四张升级已有碰，当前不触发抢杠胡。暂不支持杠分、番型、特殊胡型或任何地区规则扩展；基础 AI 有合法杠就执行，但仍以胡牌为最高优先级，它是规则验证级 AI 而非策略 AI。
