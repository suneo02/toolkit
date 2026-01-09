# MSW 测试指引

## 基本接入

- Node 测试环境使用 `setupServer`。
- 统一在 `handlers.ts` 维护 API Mock。

## 测试生命周期

```ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## 常用技巧

- 单个用例覆盖异常分支：`server.use(rest.get(...))` 临时覆盖 handler。
- 优先模拟真实响应结构，避免过度简化导致断言失真。
- 对于错误提示或空态，直接用 MSW 返回 4xx/5xx 或空数据。
