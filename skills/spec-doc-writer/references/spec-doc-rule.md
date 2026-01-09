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

- 文档 -> 代码：@see /apps/chat/src/index.tsx
- 代码 -> 文档：// @see /docs/specs/chat/spec-design.md

## Checklist

- implementation-plan.json 存在且有效
- 任务初始 status 全为 failed
- 状态更新使用原子提交
- 文档长度与引用规范满足要求
