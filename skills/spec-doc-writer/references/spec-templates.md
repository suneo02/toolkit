# Spec 模板示例

## README.md 模板

# <task> Spec

## 状态

- 当前状态：draft

## 索引

- [设计](spec-design.md)
- [API](spec-api.md)
- [测试](spec-testing.md)

## 链接

- 规范：references/spec-doc-rule.md
- 实现计划：implementation-plan.json
- 代码：@see /apps/example/src/index.ts

## implementation-plan.json 模板

[
  {
    "id": "task-1",
    "title": "任务简述",
    "owner": "username",
    "code_paths": ["/apps/example/src/index.ts"],
    "@see": ["/docs/specs/<task>/spec-design.md"],
    "status": "failed",
    "notes": "补充说明"
  }
]

## spec-*.md 模板

# <主题> 规格

## 目标与范围

- ...

## 方案与约束

- ...

## 验证方式

- ...
