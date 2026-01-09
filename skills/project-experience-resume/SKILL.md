---
name: project-experience-resume
description: Create or rewrite project experience entries in resume format with STAR-L compression, high-density bullets, and baseline compliance. Use when asked to draft, compress, or optimize project experience sections for a resume, convert whitepapers/code/notes into 1-line summary + 3-4 bullet points, or audit resume bullets for signal-to-noise.
---

# Resume Project Experience

## Quick Start

- Read `references/project-experience-resume.md` for formatting and compression rules.
- Read `references/project-experience-baseline.md` for truthfulness and language filters.
- Collect the required inputs, then generate output using the template and quality gates below.

## Inputs Checklist

- Project name, role, and time range
- Business type, user segment, and scale metrics (PV/UV/orders/concurrency)
- Core tech stack used in the project
- Key actions taken and technical methods applied
- Quantified results (ms/%, MB, QPS) or qualitative proxies when metrics are unavailable
- Legacy assets (components, docs, standards) if relevant
- Evidence pointers (code, docs, commits) for each technical claim

## Workflow

1. Extract signals: scale, actions, tech keywords, metrics, and legacy.
2. Construct bullets with STAR-L (Lite): `[action] + [technical object] + [method] + [metric/result]`.
3. Render header and one-line summary, then produce 3-4 bullets ordered by impact.
4. Run density checks and revise until all compliance gates pass.

## Output Format

Use this Markdown template:

```markdown
[Project Name] | [Role] | [Time]
[Business type] platform serving [users], daily [PV/UV/orders]. Stack: [Tech 1] + [Tech 2] + ...
- [Verb] [module/object], using [method] to achieve [metric/result]
- [Verb] [module/object], introducing [tech/mechanism] to move [metric] from [A] to [B]
- [Verb] [module/object], building [asset/standard] to support [business scenario]
- (Optional) [Verb] [quality/stability item], reducing [incident/time/cost] by [ratio]
```

## Quality Gates

- Do not invent metrics; ask for missing data or use a clear qualitative proxy.
- Avoid banned filler words; keep verbs action-oriented.
- Attach every tech keyword to a concrete problem and result.
- Make numbers explicit and emphasize key metrics.
- Keep ATS-safe punctuation and avoid emoji or decorative symbols.

## When Information Is Missing

- Ask targeted questions for metrics, scale, and evidence.
- If the user cannot provide numbers, use approved qualitative substitutes and label them clearly.
