---
name: spec-doc-writer
description: 编写与维护项目 spec 文档与 implementation-plan.json 的工作流与规范（docs/specs/任务名/README.md、implementation-plan.json、spec-*.md）。当需要做任务拆解、验证计划、生成 spec 索引或更新 spec 状态时使用，尤其需要遵循 docs/rule/doc-spec-rule.md 的格式与 @see 引用规则。
---

# Spec Doc Writer

## Overview

遵循仓库 spec 规范，生成或更新 docs/specs/<task>/ 下的 README.md、implementation-plan.json 与 spec-*.md，并保持双向 @see 引用与任务状态跟踪。

## Workflow

1. 收集输入：任务名称、目标/范围、owner、关键代码路径、验收标准、需要的子文档类型（design/api/testing 等）。
2. 确定目录：在 docs/specs/<task>/ 创建 README.md、implementation-plan.json、spec-*.md。
3. 编写 README.md：包含状态、索引、链接；使用 references/spec-templates.md 中的模板；保持中文。
4. 编写 implementation-plan.json：列出任务数组；所有任务初始 status 为 failed；使用绝对路径与 @see。
5. 编写 spec-*.md：每个主题独立文件，控制长度 <= 150 行；避免大段代码，只保留必要片段。
6. 建立双向引用：文档内用 @see 指向代码；代码内用注释指向 spec。
7. 校验规则：对照 references/spec-doc-rule.md 的清单；状态更新必须逐条验证，保持原子提交。
8. 输出结果：汇报新增/更新的文件路径与待确认问题。

## Prompts To Ask When Info Is Missing

- 任务名称与目录名用什么？
- owner 与验收标准是什么？
- 需要哪些子文档（design/api/testing/others）？
- 关键代码路径与 @see 目标是什么？

## References

- 规范摘要：references/spec-doc-rule.md
- 模板示例：references/spec-templates.md
- 仓库规范源：/docs/rule/doc-spec-rule.md
