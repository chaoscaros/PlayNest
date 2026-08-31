# 测试

## 命令

```bash
npm run typecheck
npm run test
npm run build
npm run lint
```

Vitest 使用 jsdom。当前测试覆盖：Guest 首次生成、有效昵称、刷新持久化、重置新身份；Game Registry 唯一 ID、查询、分类、未知 ID 与全量 `coming-soon`；PlatformStorage 版本、读写、损坏数据回退和最近访问顺序。

不测试任何具体游戏规则，因为当前没有游戏。CSS 不追求单元测试覆盖率；响应式与最终视觉通过真实浏览器在 375px、768px、1440px 验收。
