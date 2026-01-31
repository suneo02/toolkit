# Spec 模板

## spec-contract.md 模板

```markdown
# <task> 契约

## 目标
- 要实现的核心功能

## 非目标
- 明确不在本次范围

## 约束
- 兼容性/性能/安全要求

## 验收标准
- 如何确认完成

## 关键风险
- 风险项与影响面
```

## implementation-plan.json 模板

```json
[
  {
    "id": "task-1",
    "title": "任务简述",
    "status": "failed",
    "validation": "npm test -- feature.test.ts",
    "code_paths": ["/apps/example/src/index.ts"],
    "@see": ["/docs/specs/<task>/spec-design.md"]
  }
]
```

## spec-design.md 模板（可选）

```markdown
# <task> 设计

## 技术选型
- 选择与理由

## 方案
- 描述
- 探索发现支撑

## 复用组件
- `<Component>` @see /packages/ui/Component.tsx

## 验证计划
- 测试覆盖/手工验证步骤
```
