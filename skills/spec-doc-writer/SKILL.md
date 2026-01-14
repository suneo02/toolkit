---
name: spec-doc-writer
description: Workflow and standards for writing and maintaining spec docs and implementation-plan.json (docs/specs/<task>/README.md, implementation-plan.json, spec-*.md). Use for task breakdowns, validation plans, spec index generation, or spec status updates. Follow references/spec-doc-rule.md formats and @see rules.
---

# Spec Doc Writer

## Overview

Follow repo spec conventions to create or update README.md, implementation-plan.json, and spec-*.md under docs/specs/<task>/, maintaining bidirectional @see references and task status tracking.

## Workflow

1. Collect inputs: task name, goals/scope, owner, key code paths, acceptance criteria, and required sub-doc types (design/api/testing, etc.).
2. **Reuse Check**: Before writing specs, search shared UI libraries/design system packages and existing components in the codebase to reuse. Avoid duplication.
3. Confirm directory: create README.md, implementation-plan.json, and spec-*.md under docs/specs/<task>/.
4. Write README.md: include status, index, and links; use templates in references/spec-templates.md; keep it in Chinese.
5. Write implementation-plan.json: list task array; default all task status to failed; use absolute paths and @see.
6. Write spec-*.md: one topic per file, keep length <= 150 lines; avoid large code blocks, include only necessary snippets; **explicitly reference reused components**.
7. Create bidirectional references: docs use @see to point to code; code comments point back to spec.
8. Validate rules: check against references/spec-doc-rule.md; status updates must be verified one by one and kept atomic.
9. Output result: report new/updated file paths and open questions.

## Prompts To Ask When Info Is Missing

- What should the task name and directory be?
- Who is the owner and what are the acceptance criteria?
- Which sub-docs are needed (design/api/testing/others)?
- What are the key code paths and @see targets?
- **Have you checked for existing components to reuse?**

## Language Requirements

- All spec documents and templates must be written in Chinese.
- Code comments used for @see links must be written in Chinese.

## References

- Rule summary: references/spec-doc-rule.md
- Template examples: references/spec-templates.md
