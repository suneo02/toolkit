---
name: doc-authoring
description: 编写和维护 docs/ 下的通用文档、README、需求文档与设计文档的规范与流程。用于创建或更新 README、需求说明、设计文档时，确保中文表达、结构完整、可视化优先与 @see 引用符合规则；不用于 spec 文档（使用 spec-doc-writer）。
---

# Doc Authoring

## Overview

使用仓库文档规范生成或更新 README、需求文档、设计文档，确保内容中文、结构化、可视化优先，并建立双向 @see 链接。

## Workflow

1. 判断文档类型：README / Requirement / Design / General。若是 Spec，改用 spec-doc-writer。
2. 收集输入：目标与范围、读者、关键流程/状态、相关代码路径与现有文档链接。
3. 选择结构：按对应参考规则组织小节与表格/图。
4. 控制长度与风格：一页以内，重 What/Why/How，避免实现细节。
5. 补充链接：文档内引用相关代码路径；代码内使用 @see 指向文档。
6. 输出结果：列出更新文件与待确认问题。

## Doc Type Checklist

- README：一句话定位、目录树(注释职责)、关键文件、依赖关系、相关文档链接。
- Requirement：概览、模块划分、用户流程、数据与规则、反馈状态。
- Design：概览、信息架构图、页面蓝图表、任务流程、状态定义、组件复用。

## Prompts To Ask When Info Is Missing

- 文档类型与目标读者是什么？
- 是否已有相关需求/设计/代码链接需要 @see？
- 关键流程、状态与限制条件有哪些？

## References

- 规范索引：references/doc-general-rule.md
- README 结构：references/doc-readme-structure-rule.md
- 需求文档：references/doc-requirements-rule.md
- 设计文档：references/doc-design-rule.md
- Spec 文档：/docs/rule/doc-spec-rule.md（使用 spec-doc-writer）
