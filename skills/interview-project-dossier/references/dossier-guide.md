# Dossier Mode Guide

## Dossier Constraints

- Output Chinese only; text-only Markdown with headings and bullet lists.
- Do not include code blocks, diagrams, or tables.
- Use first-person narrative (我...).
- Avoid project-internal code identifiers; describe modules by roles in plain language.
- Anchor key claims to evidence; keep anchors concise (1-3 per section).
- Replace adjectives with measurable metrics whenever possible.

## Inputs Checklist

- Project design document (path, version/date, key sections to cite)
- Project name, business background, target users, scope, timeline, success metrics
- Architecture details, data flow, deployment topology, tech stack choices
- 2-3 core feature modules and implementation details
- Personal contributions: responsibilities, decisions, measurable outcomes with evidence
- Deep-dive case: symptoms, investigation, failed attempt, final solution, measurable result
- Evidence anchors: design doc sections, PRs/commits, dashboards, post-mortems
- Target level (P5/P6/P7) if applicable

## Workflow (Dossier Mode)

1. Intake inputs and evidence anchors.
2. Confirm scope and audience.
3. Draft the dossier using `references/dossier-template.md`.
4. Validate against `references/baseline.md` and the checklist below.

## Style Guidance (深挖复盘版，默认)

- Use personal interview-prep voice; write as the interview candidate speaking to self.
- Prefer short, direct sentences; keep facts and evidence in the same bullet.
- Emphasize decisions, trade-offs, and measurable outcomes over generic descriptions.
- Explain root causes, constraints, and failure paths; include "why not" and rollback conditions.
- Avoid marketing language; keep scope, boundaries, and non-goals explicit.

## Validation Checklist

- Verify every action has a business context, a trade-off, and a measurable outcome.
- Verify every metric includes baseline, delta, and measurement source.
- Verify failure paths include rollback/mitigation conditions and evidence.
- Verify evidence anchors are concise and grouped (avoid long lists of paths).
- Verify key decisions include at least one rejected option and the reason.
- Verify the dossier states explicit boundaries and non-goals.
- If evidence is missing, add TODOs and questions instead of claims.

## Common Questions (用于补全信息)

- Ask for the 3-5 design doc sections to cite for architecture and flow.
- Ask for key code paths or commits only for internal verification; keep them out of the main text unless requested.
- Ask for before/after metrics, sampling windows, and dashboard or log sources.
- Ask what constraints forced trade-offs (legacy, infra, time, budget, compatibility).
- Ask what options were rejected and why they were rejected.
- Ask what rollback strategy exists and the trigger conditions.
- Ask for the most fragile edge case and how it was covered.
