---
name: project-experience-baseline
description: Audit or enforce the project-experience baseline protocol and route requests to the correct document type (whitepaper/resume/manuscript). Use when asked to validate or clean project experience content, or when deciding which project-experience document to generate.
---

# Project Experience Baseline

## Quick Start

- Read `references/project-experience-baseline.md` for the full baseline rules.
- Use the decision flow to route requests, or the audit workflow to validate content.

## Decision Flow (Routing)

1. If the user wants full technical depth and evidence, recommend a whitepaper.
2. If the user wants resume bullets, recommend the resume format.
3. If the user wants interview narration or defense, recommend the manuscript.
4. If unclear, ask which audience and purpose they need, plus what inputs they already have.
5. Verify prerequisites:
   - Whitepaper needs code/notes/evidence.
   - Resume needs whitepaper or source notes.
   - Manuscript needs resume bullets or whitepaper.

## Audit Workflow

1. Verify truthfulness: every technical claim must be traceable to evidence.
2. Apply the language filter: remove banned filler words and replace with action verbs.
3. Enforce context: every tech keyword must serve a clear business problem.
4. Apply STAR-Plus: ensure S/T/A/R/L signals appear in the content.
5. Align to leveling matrix: emphasize execution/optimization/decision based on target level.
6. Produce a compliance report and corrected text.

## Output Format

Provide one of the following based on the request:

- Routing result: recommended document type, required inputs, and next action.
- Audit result: short compliance report (pass/fail with must-fix items), revised text, and questions for missing data.

## Language Requirements

- All produced documents and report outputs must be written in Chinese.

## Guardrails

- Do not invent metrics or capabilities.
- If evidence is missing, flag it explicitly.
- Prefer concrete numbers; use approved qualitative proxies only when needed.
