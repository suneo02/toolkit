---
name: code-review-report
description: 生成结构化代码审查报告的流程与格式，包含需求实现完整性、线上风险评估、变更范围控制与代码规范符合性四大维度。用于用户要求代码审查或需要输出固定 Markdown 报告时。
---

# Code Review Report

## Overview

根据固定模板输出中文代码审查报告，覆盖需求实现、风险、变更范围与规范符合性四个维度。

## Workflow

1. 确认审查范围：基准分支、提交哈希范围、需求描述或相关 spec。
2. 收集变更：对比 diff，定位涉及的模块与关键逻辑。
   - 可选：运行 scripts/generate-diff-report.js 生成 diff 报告并作为审查输入。
3. 逐项评估：按四个维度给出结论，只有不通过时列出问题与建议。
4. 输出报告：严格使用模板，生成完整 Markdown 文档，避免额外说明。

## Prompts To Ask When Info Is Missing

- 基准分支与审查的提交范围是什么？
- 是否有需求文档或 spec 可以对齐？
- 是否只输出报告正文（Markdown）？

## References

- 审查模板与标准：references/code-review-rule.md

## Resources

### scripts/generate-diff-report.js

生成变更范围的 Markdown 概览（diffstat + 文件列表）。

```bash
node scripts/generate-diff-report.js --base main --head HEAD --repo /path/to/repo --out /tmp/diff-report.md
```
