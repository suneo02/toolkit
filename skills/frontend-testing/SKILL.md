---
name: frontend-testing
description: 面向 React 前端测试的流程与规范，覆盖“写测试/生成测试/补充测试/重构改进测试/分析测试覆盖/编写测试 review 报告”等需求；默认使用 React Testing Library + Vitest，必要时使用 Jest；涉及 Storybook 交互测试与 MSW API Mock 时使用。
---

# 前端测试

## 总览

该技能用于在 React 项目中高质量地编写、修复与评审测试用例，强调可维护性、稳定性与可读性。

## 工作流（按需裁剪）

### 1. 识别约束与现状

- 确认测试框架：优先 Vitest；若项目已使用 Jest，则遵循既有配置。
- 查找测试入口与工具：`setupTests`/`vitest.setup`、自定义 `render`、测试工具库。
- 判断是否已接入 MSW、Storybook 测试流程；能复用就不要重造。
- 保持项目规范：TypeScript 禁止 `any`；导出函数/组件必须有中文 JSDoc；必要断言需说明原因。
- 代码与文档若涉及联动，请用 `@see` 做双向引用。

### 2. 设计测试方案

- 明确测试层级：单元/组件/集成。优先覆盖核心路径与高风险逻辑。
- 用例结构：主路径、边界条件、错误/空态、权限与异常回退。
- 避免实现细节耦合；测试用户可感知行为与渲染结果。

### 3. 编写或补充测试

- React Testing Library 优先：`role/label/text` 查询；`data-testid` 仅在必要时使用。
- 交互使用 `user-event`，异步渲染使用 `findBy`/`waitFor`。
- API Mock 首选 MSW；仅在难以覆盖时使用模块级 mock（`vi.mock`/`jest.mock`）。
- 复杂容器/页面出现异常态时，应验证错误兜底视图（必要时配合 ErrorBoundary）。

### 4. 修复/重构/改进测试

- 先定位不稳定点：异步时序、定时器、随机数据、外部依赖。
- 收敛等待策略：减少裸 `setTimeout`，统一用 `waitFor`/`findBy`。
- 重构优先保持意图：测试名称与断言围绕“业务行为”而非“实现细节”。

### 5. 覆盖率分析与测试 Review 报告

- 运行覆盖率并标注缺口：重点看核心逻辑与分支覆盖。
- 输出 review 报告，包含：需求覆盖、线上风险、变更范围、规范符合性、建议与待办。

## 常见任务指引

### 写测试/生成测试

- 先收集：目标组件/模块、依赖 API、业务规则。
- 用例清单先行，再落地到测试实现。
- 若 Storybook 已存在，可复用 story 作为测试基线。

### 补充测试/修复测试

- 对齐失败原因与业务预期，优先修复断言逻辑与等待方式。
- 若发现组件无可测入口，可补充最小可用的 `aria-*` 或 `data-testid`。

### 重构/改进测试

- 合并重复 setup，提取测试工具函数（需中文 JSDoc）。
- 减少对内部实现的 mock；更倾向通过 UI 行为驱动。

### 分析覆盖/写 review 测试报告

- 覆盖缺口聚焦：关键路径、权限/异常、分支逻辑。
- 报告要点：问题清单、风险等级、建议修复顺序。

## 参考资料（按需加载）

- `references/rtl.md`：React Testing Library 查询优先级、异步与用户交互模式。
- `references/vitest.md`：Vitest 配置、Mock、定时器与覆盖率实践。
- `references/jest.md`：Jest 差异点与迁移注意事项。
- `references/storybook.md`：Storybook 交互测试与复用故事。
- `references/msw.md`：MSW 在测试中的标准接入方式与示例。
