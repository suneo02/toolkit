---
name: code-review-report
description: Generate a concise, issue-focused Chinese code review report using a fixed Markdown template. Use when a code review or a structured issue list/risk assessment is requested.
---

# Code Review Report

## Overview

Produce a minimal-length Chinese review report focused on issues, risks, gaps, and recommendations. If there are no issues, say so explicitly.

## Workflow

1) Confirm scope: base branch, commit range, requirements, or spec.
2) Read changes: locate key logic, data flow, and boundary handling.
3) Build issue list: issues only, ordered by severity; each includes file/line, impact, and recommendation.
4) Output with the template: follow it strictly and avoid extra explanation.

## Missing Info Prompts

- What are the base branch and commit range?
- Is there a requirement doc or spec to align with?
- Should I output only the report body (Markdown)?

## Language Requirements

- The report must be written in Chinese.

## References

- references/code-review-rule.md

## Resources (Optional)

- scripts/generate-diff-report.js: generate a change-range summary.
