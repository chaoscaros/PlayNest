# PlayNest AI 工作约定

## 修改前必读

1. `docs/planning/GPT_PLANNING_BRIEF.md`
2. `docs/planning/AI_HANDOFF.md`
3. `docs/planning/TODO.md`
4. `docs/architecture/ARCHITECTURE.md`
5. `docs/architecture/GAME_PLUGIN_CONTRACT.md`
6. `docs/development/CODE_CONVENTIONS.md`

## 核心边界

- 平台 UI 已通过首次确认；具体游戏仍必须由用户逐个明确确认后开发，禁止 AI 自行批量加入。
- 游客无需注册即可使用；不要把注册变成入口前置条件。
- 平台与游戏模块分离；只有已确认并存在 Game Module 的游戏可以标记 `available`，其他占位保持 `coming-soon`。
- 当前不实现账号、数据库、WebSocket Server、房间或匹配。
- 代码与内部 ID 使用英文；玩家可见文本和文档以简体中文为主。
- 不建立重复的进度、架构或交接文档。

## 每轮完成

1. 运行 `npm run typecheck`、`npm run test`、`npm run build`；有 lint 时运行 `npm run lint`。
2. 更新 `docs/planning/AI_HANDOFF.md` 与 `docs/planning/TODO.md`。
3. 向 `docs/history/DEVLOG.md` 追加记录。
4. 架构、数据、插件协议或重要决策变化时同步更新对应权威文档。
5. 如实区分静态验证、自动化测试和浏览器运行时验证。
