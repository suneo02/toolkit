---
name: project-whitepaper
description: Create comprehensive project-level technical whitepapers using the STAR-Plus framework. Use when asked to write or structure a project whitepaper, technical asset documentation, or an in-depth project experience report, including architecture diagrams (Mermaid), ADR decision tables, core feature implementation details, deep-dive case studies, post-mortems, and knowledge base snippets.
---

# Project Whitepaper

## Overview

Write a full project whitepaper that converts a codebase or project into structured technical assets. Default output is Markdown. Default language is Chinese unless the user requests otherwise. Always comply with the baseline rules for evidence, metrics, and business context.

## References

- Load `references/whitepaper.md` for the required sections, ordering, and examples.
- Load `references/baseline.md` for mandatory rules (evidence, metrics, wording constraints).

## Workflow

1. Intake inputs.
   - Ask for project name, business background, target users, scope, timeline, and success metrics.
   - Ask for architecture details, data flow, deployment topology, and tech stack choices.
   - Ask for 2-3 core feature modules and their implementation details.
   - Ask for a deep-dive case: symptoms, investigation artifacts, failed attempt, final solution, and measurable result.
   - Ask for incidents/post-mortems: timeline, root cause, and action items.
   - Ask for reusable snippets or tricky knowledge to include in the knowledge base.
   - Ask for evidence links: code paths, commit hashes, logs, dashboards, or screenshots.

2. Confirm scope and language.
   - Confirm whether a full whitepaper is required or a subset of sections.
   - Confirm output language and any audience constraints.

3. Draft the whitepaper in the reference order.
   - Big Picture: one-sentence business background, Mermaid architecture diagram, and ADR comparison table.
   - Core Features: 2-3 modules, implementation flow (sequence or state machine), and data schema.
   - Deep Dive: symptoms, investigation, failed attempt, successful solution, and a <20-line code snippet with comments.
   - Post-Mortem: incident timeline, root cause, and action items.
   - Knowledge Base: reusable snippets, configs, or pitfalls.
   - Quality Protocol: checklist confirming compliance with baseline rules.

4. Validate against baseline rules.
   - Replace adjectives with metrics.
   - Tie technical choices to business context.
   - Ensure code snippets are anonymized, real, and referenced by path or commit.
   - Add TODOs and a questions list if data is missing.

## Output Skeleton

```markdown
# <Project Name> Whitepaper

## 1. Big Picture (Situation & Task)
- Business background:
- Architecture diagram (Mermaid):
- ADR decision table:

## 2. Core Features & Implementation (Action - Construction)
- Feature 1:
- Feature 2:
- Feature 3 (optional):
- Implementation flow (sequence/state machine):
- Data schema:
- Complexity notes:

## 3. Deep Dive Case Study (Action - Optimization & Result)
- Symptoms:
- Investigation:
- Solution V1 (failed):
- Solution V2 (final):
- Code snippet (<20 lines):
- Measured results:

## 4. Post-Mortem (Action & Legacy)
- Timeline:
- Root cause:
- Action items:

## 5. Knowledge Base (Legacy)
- Snippet 1:
- Snippet 2:
- Pitfalls:

## 6. Quality Protocol Checklist
- [ ] Evidence check (before/after metrics or artifacts)
- [ ] Code check (anonymized, no imports, relevant)
- [ ] Logic check (tech choices tied to business context)
```
