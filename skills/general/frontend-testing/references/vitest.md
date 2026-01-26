# Vitest 指引

## 基本约定

- `@testing-library/jest-dom/vitest` 放入 `setupFiles` 或 `vitest.setup.ts`。
- 使用 `vi` API：`vi.fn`、`vi.spyOn`、`vi.mock`。

## Mock 与清理

- `vi.mock('模块路径', () => ({ ... }))` 用于模块级替换。
- `vi.spyOn(obj, 'method')` 观察调用。
- `afterEach(() => { vi.clearAllMocks(); })` 保持用例隔离。

## 定时器

- `vi.useFakeTimers()`
- `vi.runAllTimers()` / `vi.advanceTimersByTime(ms)`
- `vi.useRealTimers()` 还原

## 覆盖率

- 运行：`vitest --coverage`
- 常见配置：

```ts
// vitest.config.ts
export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});
```

## 迁移/兼容提示

- `vi.mocked` 可用于类型提示更友好的 mock。
- 若项目从 Jest 迁移，注意 `jest.*` API 替换为 `vi.*`。
