# React Testing Library 指引

## 查询优先级

1. `getByRole`（优先）
2. `getByLabelText` / `getByPlaceholderText`
3. `getByText`
4. `getByTestId`（仅必要时）

## 异步与等待

- 渲染后异步更新：使用 `findBy*`。
- 复杂异步链：使用 `waitFor` 包裹断言。
- 避免裸 `setTimeout`，用框架提供的等待工具。

## 交互建议

- 使用 `userEvent.setup()`，所有交互 `await userEvent.*`。
- 交互后断言 UI 变化与可见结果，而不是内部状态。

## 常见反模式

- 直接断言内部实现细节（例如私有状态、内部函数调用）。
- 滥用 `data-testid`。
- 快照覆盖业务行为（除非稳定结构且需要结构守护）。

## 示例

```ts
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

it('提交表单后显示错误信息', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);

  await user.type(screen.getByLabelText('用户名'), 'demo');
  await user.click(screen.getByRole('button', { name: '登录' }));

  expect(await screen.findByText('密码不能为空')).toBeInTheDocument();
});
```
