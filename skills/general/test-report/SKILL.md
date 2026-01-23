---
name: test-report
description: Generate structured test reports by consolidating unit test results (Jest/Vitest/React Testing Library), Storybook manual checks, external-platform functional test case lists, and spec docs under docs/specs/<task> (from spec-doc-writer). Use when asked to write/format QA reports, test summaries, verification reports, or release testing notes.
---

# Test Report

CN Summary: 生成中文测试报告，整合单元测试、Storybook 手工验证、外部平台功能测试清单与 spec 文档。

## Overview

Produce a structured Chinese Markdown test report. Do not execute tests; format provided outputs and lists into a report.

## Inputs

- Unit test outputs: jest/vitest/RTL logs, coverage summary if available
- Storybook manual check notes: stories checked and results
- Functional test list: plain text list, optionally with status/evidence
- Spec docs: docs/specs/<task>/spec.md or spec-contract.md + implementation-plan.json
- Optional metadata: project name, version/branch/commit, env, date, tester

## Workflow

1. Collect missing inputs; ask only critical gaps
2. Read spec doc(s); extract change summary, acceptance criteria, and test-plan hints
3. Summarize unit tests; list totals, failures, skips, and coverage if present
4. Summarize Storybook manual checks; list stories and results as "manual"
5. Normalize functional test list into a table; keep original IDs/names
6. Identify gaps/risks; map untested acceptance items to risks
7. Render the report with references/test-report-template.md

## Parsing Rules

- Jest/Vitest: capture suites/tests/passed/failed; list failed test names
- RTL: include key components and interaction coverage if provided
- Storybook manual: list stories and results; label as manual verification
- Functional list: do not invent steps; mark status as provided, otherwise "未提供"

## When Info Missing

- Provide spec doc path or task name under docs/specs/
- Provide unit test output logs or state "not run"
- Provide functional test list with status (Pass/Fail/Blocked/Not run)
- Provide Storybook manual check list (stories + result)

## Output

- Markdown report in Chinese
- Use the template for section order and headings
- Keep factual; highlight failures and risks

## References

- Template: references/test-report-template.md
