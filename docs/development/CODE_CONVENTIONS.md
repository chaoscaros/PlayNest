# 代码约定

- TypeScript strict；不滥用 `any`、`@ts-ignore` 或类型断言。
- 代码、类型、函数和内部 ID 使用英文；玩家可见文本使用简体中文。
- React 使用函数组件与 hooks；状态尽量靠近使用位置。
- 平台数据逻辑放在 `src/platform/`，页面不直接访问 localStorage。
- 平台与游戏分离，Game Registry 不承担规则、存档或联机。
- 普通 CSS 与 CSS Variables 为唯一样式方案；不并存多套框架。
- 公共组件服务于真实复用，不制造无意义 wrapper 或 God Component。
- 每个交互必须有真实行为；尚未实现的设置不显示假 toggle。
- 文档按 planning/product/architecture/development/history 分类，不在根目录堆 Markdown。
