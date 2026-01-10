---
name: project-whitepaper
description: Create text-only project whitepapers in Chinese using the STAR-Plus framework. Use when asked to write or structure a project whitepaper, technical asset dossier, or deep project experience report; output must be Chinese and text-only (no code blocks, diagrams, or tables).
---

# Project Whitepaper

## Purpose

Write a full project whitepaper that converts a codebase or project into structured technical assets. Output must be Markdown in Chinese. The whitepaper is a text-only project dossier meant to be read aloud: no code blocks, no diagrams (including Mermaid), and no tables.

## Output Constraints

- Output language: Chinese only.
- Format: text-only Markdown with headings and bullet lists.
- Do not include code blocks, diagrams, or tables.
- All claims must be tied to evidence (paths, commits, metrics, logs, dashboards).
- Replace adjectives with measurable metrics whenever possible.

## Baseline Protocol (Must Follow)

### Axioms of Truth

Rule #1: No Code, No Claim
- Every technical claim must be traceable to a code path or commit.
- Audit question: "Show the exact line of code that proves this."

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
   - Ask for project name, business background, target users, scope, timeline, success metrics.
   - Ask for architecture details, data flow, deployment topology, tech stack choices.
   - Ask for 2-3 core feature modules and their implementation details.
   - Ask for a deep-dive case: symptoms, investigation artifacts, failed attempt, final solution, measurable result.
   - Ask for incidents/post-mortems: timeline, root cause, action items.
   - Ask for reusable knowledge points or pitfalls to include (text-only).
   - Ask for evidence links: code paths, commit hashes, logs, dashboards, screenshots.

2. Confirm scope and audience.
   - Confirm whether a full whitepaper is required or a subset of sections.
   - Confirm the intended audience and tone constraints.

3. Draft the whitepaper in the required order.
   - Big Picture: one-sentence business background, textual architecture description, textual tech-choice comparisons.
   - Core Features: 2-3 modules, implementation flow described in steps, data schema described in words.
   - Deep Dive: symptoms, investigation, failed attempt, final solution, key mechanism explanation with code paths/commit references (no code).
   - Post-Mortem: incident timeline, root cause, action items.
   - Knowledge Base: reusable patterns, configs, or pitfalls described in text only.
   - Quality Protocol: checklist confirming baseline compliance and text-only output.

4. Validate.
   - Replace adjectives with metrics.
   - Tie technical choices to business context.
   - Ensure evidence is referenced by path, commit, or metric without quoting code.
   - Ensure no code blocks, diagrams, or tables are present.
   - Add TODOs and a questions list if data is missing.

## Whitepaper Template (Chinese, Text-Only)

# <项目名称> 白皮书

## 1. 全景（Situation & Task）
- 业务背景：
- 架构描述（文字，包含组件关系与数据流）：
- 技术选型对比（文字）：

## 2. 核心功能与实现（Action - Construction）
- 功能 1：
- 功能 2：
- 功能 3（可选）：
- 实现流程（文字步骤）：
- 数据结构（文字字段说明）：
- 复杂度说明：

## 3. 深挖案例（Action - Optimization & Result）
- 现象：
- 排查过程：
- 方案 V1（失败）：
- 方案 V2（最终）：
- 关键实现说明（附路径/commit，不贴代码）：
- 量化结果：

## 4. 事故复盘（Action & Legacy）
- 时间线：
- 根因：
- 行动项：

## 5. 知识库（Legacy）
- 片段 1（文字说明）：
- 片段 2（文字说明）：
- 注意事项：

## 6. 质量协议清单
- [ ] 证据检查（前后对比指标或证据）
- [ ] 文字化检查（无代码块/图表/表格）
- [ ] 逻辑检查（技术选择与业务关联）
