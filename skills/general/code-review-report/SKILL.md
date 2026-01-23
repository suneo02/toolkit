---
name: code-review-report
description: Structured Chinese code review report template. Use when formatting review results (from subagent/Oracle or manual review) into a standardized Markdown report with issue tracking, risk assessment, and compliance checks.
---

# Code Review Report Template

## Overview

Format review results into a structured Chinese Markdown report. Does NOT perform the actual review—assumes review findings are already available (from Oracle/subagent or manual analysis).

## Workflow

1. Collect review inputs: scope, findings by category (requirements/risks/scope/standards)
2. Format using template: populate sections with provided findings
3. Add review metadata: branch, commit range, date
4. Output: structured Markdown report

## Template Structure

The report follows a fixed 4-section structure:

1. 需求实现完整性 (Requirements completeness)
2. 线上风险评估 (Production risk assessment)
3. 变更范围控制 (Change scope control)
4. 代码规范符合性 (Code standards compliance)

Each section includes:

- ✅/❌ result indicator
- Issue list (if any): file/line, impact, recommendation
- Risk severity tagging (高/中/低) for risk items

## When Info Missing

- What is the review scope (branch/commit range)?
- What findings should be included in each section?
- Should the report include a 复核记录 (review verification) section?

## Language

All output in Chinese

## References

- Template format: references/code-review-rule.md

## Script (Optional)

`scripts/generate-diff-report.js` generates AI-friendly diff summaries for review input:

```bash
node skills/code-review-report/scripts/generate-diff-report.js --base develop --head HEAD --repo . --out-dir /diff-report
```
