---
name: spec-doc-writer
description: Contract-first spec writing and maintenance. Use to break down tasks and produce docs/specs/<task>/spec-contract.md + implementation-plan.json (or single-file spec.md for simple tasks), then archive completed specs to docs/specs/archive/YYYY-MM/. Includes archive script usage (scripts/archive-spec.cjs).
---

# Spec Doc Writer

## Overview

Write specs with a contract-first approach: goals/constraints/acceptance first, then implementation plan. After completion, archive specs monthly.

## Workflow

1. Collect inputs: task name, goals, constraints, acceptance criteria, key risks
2. **Reuse check**: search for existing components/patterns
3. **Mode selection**: simple tasks (files < 3 or steps < 5) use single-file spec.md; otherwise multi-file
4. Create docs:
   - **Multi-file**: spec-contract.md + implementation-plan.json + optional spec-design.md
   - **Single-file**: spec.md (Contract / optional Design / Plan)
5. Validate against references/spec-doc-rule.md; every todo must have a validation method
6. Output: report created files and validation plan
7. **Archive (after completion)**: move **/docs/specs/<task> to **/docs/specs/archive/YYYY-MM/<task> (see references/archive.md)

## Archiving

For the full archiving process and script usage, see references/archive.md.

## Key Principles

- **Contract-first**: what/why before how
- **Validation binding**: every todo must include a validation method
- **Living docs**: update plans as discovery evolves
- **Avoid over-commitment**: no implementation details in the contract

## Questions When Info Is Missing

- What are goals and non-goals?
- What constraints exist (compatibility/performance/security)?
- How will completion be verified?
- What are the key risks?
- Have existing reusable components been checked?

## Language

- Spec documents and comments must be written in Chinese
- Keep @see bidirectional references consistent

## References

- Contract-first rules: references/spec-doc-rule.md
- Templates: references/spec-templates.md
- Archive script: scripts/archive-spec.cjs (see references/archive.md)
