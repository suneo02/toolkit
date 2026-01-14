---
name: code-review-report
description: Generate a concise, issue-focused Chinese code review report using a fixed Markdown template. Use when a code review or a structured issue list/risk assessment is requested.
---

# Code Review Report

## Overview

Produce a minimal-length Chinese review report focused on issues, risks, gaps, and recommendations. Include a brief review (复核) step to validate completeness and formatting. If there are no issues, say so explicitly.

## Workflow

1) Confirm scope: base branch, commit range, requirements, or spec.
2) Read changes: locate key logic, data flow, and boundary handling.
3) Build issue list: issues only, ordered by severity; each includes file/line, impact, and recommendation.
4) Review pass (复核): check coverage, severity tagging, and template compliance; fix omissions or inconsistencies.
5) Output with the template: follow it strictly and avoid extra explanation.

## Missing Info Prompts

- What are the base branch and commit range?
- Is there a requirement doc or spec to align with?
- Should I output only the report body (Markdown)?
- Is a separate reviewer or specific review checklist required?

## Language Requirements

- The report must be written in Chinese.

## References

- references/code-review-rule.md

## Resources (Optional)

- scripts/generate-diff-report.js: generate an AI-friendly diff report.

## Script Usage

Use the script when a human needs a readable diff summary for AI review.

```bash
node skills/code-review-report/scripts/generate-diff-report.js \
  --base main \
  --head HEAD \
  --repo . \
  --out-dir /tmp/diff-report \
  --max-file-diff-lines 200 \
  --context 3
```

Notes:
- If `--out-dir` is omitted, it writes to `diff-report/` under the repo.
- Use `--out /tmp/diff-report.md` for a single-file report with inline diffs.
- `--max-file-diff-lines 0` means no limit (default).
- `--context` controls diff context lines (default 3).
