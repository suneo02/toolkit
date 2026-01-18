---
name: spec-doc-writer
description: Contract-first spec writing for task planning. Use when breaking down tasks into contract (goals/constraints/acceptance) and execution plan (todos with validation). Creates spec-contract.md and implementation-plan.json under docs/specs/<task>/. Follow references/spec-doc-rule.md for contract-first principles.
---

# Spec Doc Writer

## Overview

Create contract-first spec docs under docs/specs/<task>/ following contract-first principles: write goals/constraints/acceptance before implementation details.

## Workflow

1. Collect inputs: task name, goals, constraints, acceptance criteria, key risks
2. **Reuse Check**: Search existing components/patterns before defining new solutions
3. Create spec-contract.md: goals, non-goals, constraints, acceptance, risks (no implementation details)
4. Create implementation-plan.json: todos with validation methods (all status: "failed" initially)
5. (Optional) Create spec-design.md: technical approach, reused components, exploration findings
6. Validate: check against references/spec-doc-rule.md; ensure todos have validation methods
7. Output: report created files and validation plan

## Key Principles

- **Contract first**: Write what/why before how
- **Validation binding**: Every todo needs validation method
- **Living docs**: Plans update with exploration findings
- **No premature commitment**: Avoid writing implementation details in contract

## Prompts When Info Missing

- What are the goals and non-goals?
- What are the constraints (compatibility/performance/security)?
- How will we verify completion?
- What are the key risks?
- Have you checked for existing components to reuse?

## Language

- All spec documents in Chinese
- Code comments for @see links in Chinese

## References

- Contract-first rules: references/spec-doc-rule.md
- Templates: references/spec-templates.md
