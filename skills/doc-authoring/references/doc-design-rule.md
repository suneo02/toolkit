# Design Doc Rules

## Quick Standards

- **Language**: All content in Chinese.
- **Focus**: Visible states & User flows.
- **Exclusion**: No implementation details.
- **Visuals**: At least 1 Diagram/Table per task.

## Structure

1. **Overview (概览)**: 范围与关键场景。
2. **Architecture (信息架构)**: Mermaid 图 (Entry -> Pages)。
3. **Blueprint (页面蓝图)**: 区域、数据、动作、可见条件的表格。
4. **Task Flow (任务流程)**: 成功路径与异常回退。
5. **States (状态)**: 加载 (Loading) / 空 (Empty) / 错误 (Error) / 成功 (Success)。
6. **Components (组件复用)**: 复用计划与错误边界。

## Checklist

- [ ] Diagrams present.
- [ ] 4 States (Loading/Empty/Error/Success) defined.
- [ ] Data strategy (Refresh/Cache) clear.
- [ ] Linked to Code via `@see`.
