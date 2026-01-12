---
name: interview-project-resume
description: Create or rewrite interview-focused project experience resume entries in Chinese using STAR-L compression, high-density bullets, and evidence-backed baseline rules. Use when asked to draft or optimize resume project bullets, convert notes/whitepapers into a 1-line summary + 3-4 bullets, or audit project experience bullets for interview readiness.
---

# Interview Project Resume

## Quick Start

- Read `references/resume-bullets.md` for formatting and compression rules.
- Read `references/baseline.md` for truthfulness and language filters.
- Collect the required inputs, then generate output using the template and quality gates below.

## Inputs Checklist

- Project name, role, and time range
- Business type, user segment, and scale metrics (PV/UV/orders/concurrency)
- Core tech stack used in the project
- Key actions taken and technical methods applied
- Quantified results (ms/%, MB, QPS) or qualitative proxies when metrics are unavailable
- Legacy assets (components, docs, standards) if relevant
- Evidence anchors (design docs, PRs/commits, dashboards) for each technical claim
- Target level (P5/P6/P7) if applicable

## Workflow

1. Extract signals and evidence anchors: scale, actions, tech keywords, metrics, and legacy.
2. Construct bullets with STAR-L (Lite): `[action] + [technical object] + [method] + [metric/result]`.
3. Render header and one-line summary, then produce 3-4 bullets ordered by impact.
4. Run density checks and revise until all compliance gates pass.

## Output Format

Use this Markdown template:

```markdown
[项目名称] | [角色] | [时间]
[业务类型]平台，服务于[用户群体]，日均[PV/UV/单量]。技术栈：[技术1] + [技术2] + ...
- [动词] [模块/对象]，通过 [方法] 实现 [指标/结果]
- [动词] [模块/对象]，引入 [技术/机制] 将 [指标] 从 [A] 提升/降低至 [B]
- [动词] [模块/对象]，构建 [资产/规范] 支撑 [业务场景]
- （可选）[动词] [质量/稳定性项]，将 [事故/耗时/成本] 降低 [比例]
```

## Language Requirements

- Resume output must be written in Chinese.

## Quality Gates

- Do not invent metrics; ask for missing data or use a clear qualitative proxy.
- Avoid banned filler words; keep verbs action-oriented.
- Attach every tech keyword to a concrete problem and result.
- Make numbers explicit and emphasize key metrics.
- Keep ATS-safe punctuation and avoid emoji or decorative symbols.

## When Information Is Missing

- Ask targeted questions for metrics, scale, and evidence.
- If the user cannot provide numbers, use approved qualitative substitutes and label them clearly.
