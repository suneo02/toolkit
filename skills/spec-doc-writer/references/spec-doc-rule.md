# Spec 文档规范摘要

## 核心规则

- 语言：中文
- 目标：任务拆解与验证
- 结构：docs/specs/<task>/README.md + implementation-plan.json + spec-*.md
- 原子提交：每次只更新一个任务状态

## 写作要求

- 避免大段代码，必要片段 < 10 行
- 文档长度 <= 150 行，超出需拆分子 spec
- 使用绝对路径或 PR 链接做引用
- **强制组件复用**：在定义 UI 或交互规格前，先搜索设计系统、共享 UI 库或组件目录，优先复用已有组件。
- **引用已有组件**：在 spec 中明确列出复用组件的代码路径（使用 `@see`），并说明复用方式/集成点。

## 文档职责分离 (Separation of Concerns)

- **spec-requirements-*.md (需求文档)**
  - **包含**：用户场景、交互行为、业务逻辑、输入输出定义、错误提示文案。
  - **禁止**：具体的代码实现细节（如 Prop 名称、具体的函数调用、`if (value.endsWith('@'))` 等代码逻辑）。
  - **原则**：描述 "What" (要做什么) 和 "Behavior" (表现是什么)，而不是 "How" (怎么写代码)。

- **spec-design.md (设计文档)**
  - **包含**：组件结构、技术选型、Prop 映射、组件复用策略、数据流、具体实现逻辑引用。
  - **职责**：将需求转化为工程实现的蓝图。

## 目录结构

- docs/specs/<task>/
  - README.md：索引、状态、链接
  - implementation-plan.json：任务追踪源
  - spec-*.md：子文档

## implementation-plan.json 规则

- 数组结构
- 字段：id、title、owner、code_paths、status、@see
- status：failed（初始） | success | blocked | skipped
- 流程：先全量 failed -> 实现&验证 -> 逐条更新 success

## 双向引用示例

- 文档 -> 代码：@see /apps/<app>/src/index.tsx
- 代码 -> 文档：// @see /docs/specs/<task>/spec-design.md
- 组件引用：复用 `<ComponentName>` (@see /packages/<ui-lib>/src/components/<ComponentName>.tsx)

## Checklist

- implementation-plan.json 存在且有效
- 任务初始 status 全为 failed
- 状态更新使用原子提交
- 文档长度与引用规范满足要求
- **已检查并引用现有可复用组件**
- **需求文档中无具体代码逻辑**
