---
name: interview-project-dossier
description: Create text-only project dossiers in Chinese using the STAR-Plus framework for personal interview preparation and deep retrospectives, written in first-person narrative. Use when asked to analyze a project, summarize end-to-end design plus personal contributions, or produce a personal interview dossier citing a user-provided design document; output must be Chinese and text-only (no code blocks, diagrams, or tables).
---

# Interview Project Dossier

## Purpose

Write a full project dossier that converts a project into structured technical assets for personal interview preparation and deep retrospectives. Treat the dossier as a personal full-coverage reference for the interview candidate, prioritizing detailed, evidence-backed details over external marketing. The dossier combines the project design document with the author's personal contributions and outcomes. The project design document must be provided by the user and cited in the dossier. Output must be Markdown in Chinese. The dossier is meant to be read aloud: no code blocks, no diagrams (including Mermaid), and no tables.

## Output Constraints

- Output language: Chinese only.
- Format: text-only Markdown with headings and bullet lists.
- Do not include code blocks, diagrams, or tables.
- Use first-person narrative (我...).
- Avoid project-internal code identifiers (class/function names, API names) in the output; describe modules by roles in plain language.
- Keep design document path references in evidence anchors when provided by the user.
- Anchor key claims to evidence (design doc sections or metric sources), but avoid long evidence lists.
- Prefer section-level or grouped evidence anchors (1-3 per section) instead of per-bullet citations.
- Replace adjectives with measurable metrics whenever possible.
- Cite the user-provided design document by name and section heading in the relevant sections (use clear titles like 《文档名》/章节).
- Assume the primary audience is the interview candidate unless the user specifies otherwise; keep tone direct, internal, and evidence-led.
- Prefer detailed but readable depth: each core section should include 3-7 bullets with mechanism, constraints, and trade-offs when applicable.

## 口径与风格建议（深挖复盘版，默认）

- Use personal interview-prep voice; write as the interview candidate speaking to self.
- Prefer short, direct sentences; keep facts and evidence in the same bullet.
- Emphasize decisions, trade-offs, and measurable outcomes over generic descriptions.
- Explain root causes, constraints, and failure paths; include "why not" and rollback conditions.
- Anchor each key claim with minimal evidence (design doc name + path + section, or metric source), and avoid enumerating full evidence lists.
- Translate code-level mechanisms into interview-friendly module descriptions; only include code terms if the user explicitly asks.
- Avoid marketing language; keep scope, boundaries, and non-goals explicit.

## 深挖复盘版输出检查清单（执行校验）

- Verify every action has a business context, a trade-off, and a measurable outcome.
- Verify every metric includes baseline, delta, and measurement source.
- Verify failure paths include rollback/mitigation conditions and evidence.
- Verify evidence anchors are concise and grouped (avoid long lists of paths).
- Verify key decisions include at least one rejected option and the reason.
- Verify the dossier states explicit boundaries and non-goals.
- If evidence is missing, add TODOs and questions instead of claims.

## 常用追问清单（用于补全信息）

- Ask for the 3-5 design doc sections to cite for architecture and flow.
- Ask for key code paths or commits only for internal verification, and keep them out of the main text unless the user requests.
- Ask for before/after metrics, sampling windows, and dashboard or log sources.
- Ask what constraints forced trade-offs (legacy, infra, time, budget, compatibility).
- Ask what options were rejected and why they were rejected.
- Ask what rollback strategy exists and the trigger conditions.
- Ask for the most fragile edge case and how it was covered.

## Baseline Protocol (Must Follow)

### Axioms of Truth

Rule #1: No Anchor, No Claim

- Every key technical claim must be traceable to a design doc section (with path) and/or a metric source.
- Audit question: "Show the design doc section/path or metric source that proves this."

Rule #2: Metrics over Adjectives

- Do not use vague adjectives (e.g., "significant", "massive").
- Use measurable results (e.g., "FCP reduced by 200ms", "Crash rate reduced by 0.1%").
- If no hard data is available, use verified qualitative signals (e.g., "reduced customer complaints").

Rule #3: Context is King

- Tie technical decisions to business outcomes.
- Bad: "We used Next.js."
- Good: "To reduce SEO acquisition costs, we migrated SPA to Next.js SSR."

### Language Filter

Ban list (avoid in Chinese output):

- 虚词：负责、参与、协助、配合、学习了、了解、熟悉
- 大词：全链路、中台化、赋能、抓手、闭环（除非确有其事）

Whitelist verbs (prefer in Chinese output):

- 建设类：搭建、重构、设计、主导、从 0 到 1
- 优化类：缩减、提升、降低、对齐、迁移
- 保障类：监控、兜底、回滚、覆盖、容灾

### Leveling Guidance (Adjust Emphasis)

- P5 (Execution): focus on Task & Action with concrete implementations.
- P6 (Optimization): focus on Action & Result with measurable improvements.
- P7 (Decision): focus on Situation & Trade-offs with architecture decisions.

### STAR-Plus Structure

- S (Situation): how painful the context is (scale, legacy baggage).
- T (Task): how hard the goal is (time pressure, compatibility).
- A (Action): what technical actions were taken (source-level or architecture-level).
- R (Result): measurable outcomes (metrics, money, efficiency).
- L (Legacy): durable assets (docs, components, standards).

## Workflow

1. Intake inputs.

   - Ask for the project design document (file path, version/date, and key sections to cite).
   - Ask for project name, business background, target users, scope, timeline, success metrics.
   - Ask for architecture details, data flow, deployment topology, tech stack choices.
   - Ask for 2-3 core feature modules and their implementation details.
   - Ask for personal contributions: responsibilities, decisions, and measurable outcomes with evidence.
   - Ask for a deep-dive case: symptoms, investigation artifacts, failed attempt, final solution, measurable result.
   - Ask for process documentation or milestones (optional): key decisions, trade-offs, or delivery phases.
   - Ask for incidents/post-mortems (optional): timeline, root cause, action items.
   - Ask for reusable knowledge points or pitfalls to include (text-only).
   - Ask for evidence anchors: key design doc names/paths/sections and metric sources; keep code paths as internal notes if provided.

2. Confirm scope and audience.

   - Confirm whether a full whitepaper is required or a subset of sections.
   - If not specified, assume a full dossier for personal interview preparation only.
   - Confirm tone constraints only if the user wants a non-personal audience.

3. Draft the whitepaper in the required order.

   - Audience & Usage: state it is a personal interview-prep dossier unless otherwise specified.
   - Big Picture: one-sentence business background, textual architecture description, textual tech-choice comparisons.
   - Design Doc Anchors: cite the design document sections and summarize their key points in text.
   - Core Features: 2-3 modules, implementation flow described in steps, data schema described in words, add concise evidence anchors per module.
   - Personal Contributions: scope, decisions, and measurable outcomes tied to concise evidence anchors.
   - Deep Dive: symptoms, investigation, failed attempt, final solution, key mechanism explanation with minimal anchors (no code, 1-3 anchors).
   - Process Notes (optional): milestones, trade-offs, or delivery phases.
   - Post-Mortem (optional): incident timeline, root cause, action items.
   - Knowledge Base: reusable patterns, configs, or pitfalls described in text only.
   - Quality Protocol: checklist confirming baseline compliance, text-only output, and design doc citations.

4. Validate.
   - Replace adjectives with metrics.
   - Tie technical choices to business context.
   - Ensure evidence is referenced by design doc name/path/section or metric source without quoting code, and keep references concise.
   - Ensure no code identifiers appear in the output.
   - Ensure no code blocks, diagrams, or tables are present.
   - Add TODOs and a questions list if data is missing, using the common question checklist.

## Whitepaper Template (Chinese, Text-Only)

# <项目名称> 复盘档案

## 0. 受众与用途

- 受众：
- 用途：
- 叙述人称：

## 1. 全景（Situation & Task）

- 业务背景：
- 架构描述（文字，包含组件关系与数据流）：
- 技术选型对比（文字）：
- 证据锚点（设计文档名称 + 路径 + 章节，或指标来源，1-3 条）：

## 2. 设计文档引用与要点（必须）

- 设计文档名称/版本：
- 设计文档路径（关键条目即可）：
- 关键章节引用（章节标题 + 关联要点）：

## 3. 核心功能与实现（Action - Construction）

- 功能 1：
- 功能 2：
- 功能 3（可选）：
- 实现流程（文字步骤）：
- 数据结构（文字字段说明）：
- 复杂度说明：
- 证据锚点（设计文档名称 + 路径 + 章节，或指标来源，1-3 条）：

## 4. 个人执行与成果（Action & Result）

- 执行范围与边界：
- 关键决策与执行：
- 量化结果与证据锚点（指标来源/文档名称+路径+章节，1-3 条）：

## 5. 深挖案例（Action - Optimization & Result）

- 现象：
- 排查过程：
- 方案 V1（失败）：
- 方案 V2（最终）：
- 关键机制说明（不贴代码，1-3 条）：
- 量化结果：

## 6. 过程记录（可选）

- 关键里程碑：
- 重要权衡与取舍：
- 交付节奏或流程改进：

## 7. 事故复盘（可选）

- 时间线：
- 根因：
- 行动项：

## 8. 知识库（Legacy）

- 片段 1（文字说明）：
- 片段 2（文字说明）：
- 注意事项：

## 9. 质量协议清单

- [ ] 证据锚点检查（每节 1-3 条，避免长列表）
- [ ] 文字化检查（无代码块/图表/表格）
- [ ] 逻辑检查（技术选择与业务关联）
- [ ] 设计文档引用检查（名称/路径/章节明确）
- [ ] 受众检查（面试者个人复盘与备考用途）
- [ ] 第一人称叙述检查（我...）
- [ ] 深挖复盘版检查（权衡、失败路径、回滚条件）
