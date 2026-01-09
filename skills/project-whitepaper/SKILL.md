---
name: project-whitepaper
description: Create comprehensive project-level technical whitepapers using the STAR-Plus framework. Use when asked to write or structure a project whitepaper, technical asset documentation, or an in-depth project experience report, including architecture diagrams (Mermaid), ADR decision tables, core feature implementation details, deep-dive case studies, post-mortems, and knowledge base snippets.
---

# Project Whitepaper

## Overview

Write a full project whitepaper that converts a codebase or project into structured technical assets. Default output is Markdown. Output language must be Chinese. Always comply with the baseline rules for evidence, metrics, and business context.

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
   - Deep Dive: symptoms, investigation, failed attempt, successful solution, and a <20-line code snippet with Chinese comments.
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
# <项目名称> 白皮书

## 1. 全景（Situation & Task）
- 业务背景：
- 架构图（Mermaid）：
- ADR 决策表：

## 2. 核心功能与实现（Action - Construction）
- 功能 1：
- 功能 2：
- 功能 3（可选）：
- 实现流程（时序/状态机）：
- 数据结构：
- 复杂度说明：

## 3. 深挖案例（Action - Optimization & Result）
- 现象：
- 排查过程：
- 方案 V1（失败）：
- 方案 V2（最终）：
- 代码片段（<20 行）：
- 量化结果：

## 4. 事故复盘（Action & Legacy）
- 时间线：
- 根因：
- 行动项：

## 5. 知识库（Legacy）
- 片段 1：
- 片段 2：
- 注意事项：

## 6. 质量协议清单
- [ ] 证据检查（前后对比指标或证据）
- [ ] 代码检查（脱敏、无 import、与问题相关）
- [ ] 逻辑检查（技术选择与业务关联）
```

## Language Requirements

- Whitepaper content must be written in Chinese.
- Code comments inside snippets must be written in Chinese.
