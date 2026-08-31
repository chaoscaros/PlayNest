# PlayNest

PlayNest 是一个打开浏览器即可探索的现代中文休闲游戏平台。当前处于平台基础阶段：游客无需注册即可浏览首页、游戏大厅、占位详情、个人页和设置，但尚未开发任何具体游戏。

## 技术栈

- React + TypeScript + Vite
- React Router
- Vitest + Testing Library
- 普通 CSS + CSS Variables
- Lucide 图标

## 本地开发

```bash
npm install
npm run dev
npm run typecheck
npm run test
npm run build
npm run lint
```

开发服务固定使用 `http://127.0.0.1:9999`；如果端口被占用会直接报错，不会自动切换端口。

AI / 新开发者首先阅读 [`AGENTS.md`](./AGENTS.md)，项目文档入口见 [`docs/README.md`](./docs/README.md)。

## 当前边界

所有游戏条目只是 `coming-soon` metadata，占位名称不代表首发确认。当前没有游戏规则、账号、在线服务器、房间、匹配或数据库。
