# Storybook 测试指引

## 复用 Story 作为测试基线

- 使用 `@storybook/testing-react` 的 `composeStories` 将 stories 转为可测试组件。
- 通过 `within(canvasElement)` 约束查询范围，贴近 Story 实际渲染。

## 交互测试建议

- 若项目启用 `@storybook/test-runner`，优先写 play function 测试交互。
- 交互断言仍遵循 RTL 查询优先级与可见行为原则。

## 示例（简化）

```ts
import { composeStories } from '@storybook/testing-react';
import * as stories from './Button.stories';
import { render, screen } from '@testing-library/react';

const { Primary } = composeStories(stories);

it('渲染主按钮', () => {
  render(<Primary />);
  expect(screen.getByRole('button', { name: '提交' })).toBeInTheDocument();
});
```
