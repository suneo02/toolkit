# Jest 指引

## 基本约定

- `@testing-library/jest-dom` 放入 `setupTests.ts`。
- 使用 `jest` API：`jest.fn`、`jest.spyOn`、`jest.mock`。

## Mock 与清理

- `jest.mock('模块路径', () => ({ ... }))` 进行模块替换。
- `jest.spyOn(obj, 'method')` 观察调用。
- `afterEach(() => { jest.clearAllMocks(); })` 保持用例隔离。

## 定时器

- `jest.useFakeTimers()`
- `jest.runAllTimers()` / `jest.advanceTimersByTime(ms)`
- `jest.useRealTimers()` 还原

## 覆盖率

- 运行：`jest --coverage`
- 若已有 `coverageThreshold`，补测试需满足门槛。

## 与 Vitest 差异

- Jest 默认 `jest.mock` 是提升的；Vitest 为 ESM 需要注意导入时机。
- `jest.requireActual` 在 Vitest 对应 `vi.importActual`。
