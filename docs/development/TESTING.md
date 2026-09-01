# 测试

## 命令

```bash
npm run typecheck
npm run test
npm run build
npm run lint
```

Vitest 使用 jsdom。平台测试覆盖 Guest、Game Registry、Game Module Registry 和 PlatformStorage。

麻将 Core 测试覆盖：136 张 / 34 种 / 每种 4 张、座位与排序、发牌、出牌与越权、摸牌、吃的多种组合、字牌禁吃、碰、胡牌解析、七对子与十三幺禁用、自摸、点胡、响应优先级与座位顺序、过、牌墙耗尽、确定性和 136 张守恒。UI 测试覆盖东家初始换手、14 张手牌揭示、选择出牌和再次遮挡。

CSS 不追求单元测试覆盖率；响应式与最终视觉仍需通过真实浏览器在 375px、768px、1440px 验收。
