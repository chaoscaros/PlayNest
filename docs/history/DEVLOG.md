# 开发日志

## 2026-08-31 - 建立游戏平台基础

### 目标

从空仓库建立 PlayNest 平台第一版，供用户人工确认 UI / UX，不开发任何具体游戏。

### 完成内容

- 建立 React、TypeScript、Vite、Router、Vitest 和 ESLint 工程。
- 实现首页、游戏大厅、占位详情、游客个人页、设置、关于和 404。
- 实现 Guest ID、自动昵称、昵称修改、版本化 localStorage 和重置。
- 实现只管理 metadata 的 Game Registry、搜索分类和最近访问。
- 建立轻量现代视觉、主题、移动底部导航和响应式布局。
- 建立 planning/product/architecture/development/history 文档体系。

### 技术选择

原生 CSS Variables 与 Lucide 图标；React Context + hooks 管理小规模平台状态；没有引入复杂 store、UI framework 或服务端。

### 游客体系

浏览器安全随机 UUID + 四位游客昵称，本地持久化。清除数据会生成新身份，当前无云同步。

### Game Registry

4 个未确认纯展示占位，全为 `coming-soon`。没有游戏实现、规则、Canvas 或假开始入口。

### 测试

覆盖 Guest、Registry 和 Storage，共 3 个测试文件、14 项测试。最终 `typecheck`、`test`、`build`、`lint` 均通过。

### 已知问题

初次浏览器检查发现 AppShell 滚动 effect 返回值写法触发 React 错误，已改为显式无返回值块。遵照用户要求停止服务并固定开发端口为 9999，修复后的浏览器复验未执行。首发游戏尚未确认是有意的产品状态。

### 下一步

等待用户人工确认游戏平台 UI / UX，根据反馈调整平台。

## 2026-08-31 - 调整开发端口回退策略

- 继续以 9999 作为 Vite 开发服务首选端口。
- 移除 `strictPort`，9999 被占用时自动递补到后续可用端口。
- 固定 TypeScript 6.0.3，避免 pnpm 将 `latest` 解析为当前 typescript-eslint 尚不支持的 7.0。
- 同步更新 README、AI 交接与 TODO；遵照用户要求不代为启动服务。

## 2026-09-01 - 第一款游戏基础麻将

### 目标

实现第一款经过用户确认的真实游戏「PlayNest 基础麻将」，同时首次落地可复用的 Game Module 与纯规则 Core。

### 规则范围

四人、136 张、固定东家、支持摸打吃碰胡过；只认普通四面子一将。无花牌、无杠、无番、无算分、无特殊胡型、一人胡即结束。

### Tile Model 与状态机

区分 34 种 `MahjongTileType` 与 136 个唯一 `MahjongTileInstance`。Core 管理 `awaiting-discard`、`awaiting-reaction`、`ended`，摸牌在无人响应后自动执行。

### 吃碰胡与胡牌算法

使用 count array + 递归拆分顺子/刻子/对子。响应队列确定性执行 `胡 > 碰 > 吃`，同级按座位距离；吃动作携带并复验具体 Tile ID 组合。

### 本地共享设备模式

四个座位共用浏览器。每次换操作玩家先展示遮罩，接手后才显示该座位手牌；其他三家仅显示数量、副露和弃牌。

### Game Plugin

新增 Game Module Registry 与 `/play/:gameId` 通用入口。`mahjong-basic` metadata 标记 `available`，其他占位仍为 `coming-soon`。

### 测试

当前 9 个测试文件、50 项测试通过，覆盖 Tile Set、Solver、Actions、Reactions、发牌、守恒、插件和关键 UI。

### 已知限制

未实现杠、花牌、番型、算分、AI、牌局保存或联网；遵照用户要求，本轮未自行启动开发服务。

### 运行时验收

直接复用用户已打开的 `localhost:9999` 标签页，验证首页进入详情与牌局、东家首次接手、选牌出牌、切换南家及隐私遮罩。375px、768px、1440px 均无页面级横向溢出；手机手牌区可横向滑动，平板和桌面可完整展开 14 张牌。完整刷新后页面无当前运行时错误。

### 下一步

等待用户试玩基础麻将后决定下一阶段。

## 2026-09-01 - 基础麻将真实牌面

- 根据用户试玩反馈移除文字牌面，接入 `react-riichi-mahjong-tiles` 2.1.0 的彩色 SVG artwork。
- 新增模块内 Tile Type adapter，完整映射万、筒、索、风牌与三元牌共 34 种业务类型；规则 Core 保持无 UI 依赖。
- 牌体、选中反馈、阴影、触控尺寸与移动横向滚动继续由 PlayNest CSS 控制。
- 新增全部牌型 SVG 渲染与无障碍名称测试，并记录 CC BY 4.0 署名。
- 将 Game Module 改为路由级懒加载，麻将 SVG 独立构建为游戏 chunk，不增加平台首页主包负担。
- 复用用户已打开的 `localhost:9999` 标签页完成桌面与 375px 手机端视觉验证，未自行启动开发服务。

## 2026-09-01 - 基础麻将单屏布局

- 根据用户截图定位纵向滚动来自平台 Header、游戏头部、固定高度牌桌、手牌区与平台 Footer 的叠加。
- `/play/` 切换为全屏游戏会话，隐藏平台 Header、Footer 和移动底部导航，保留游戏内部返回详情、标题与规则入口。
- 牌桌使用可伸缩 Grid 占据剩余空间，手牌区收紧间距和牌体尺寸；桌面无需滚动即可同时看到牌桌、14 张手牌和操作按钮。
- 修复移动 Grid 的 intrinsic width 撑宽问题；375×812 下页面宽高与 viewport 一致，仅手牌轨道内部横向滑动，并消除牌墙信息与东家标题重叠。
- 运行时直接复用用户已打开的 `localhost:9999` 标签页，未自行启动开发服务。
