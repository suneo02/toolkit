# Repo Rules / 仓库规则

本文件定义在此仓库中编写/维护内容的规则。
This file defines how agents should work in this repo.

## Scope / 适用范围
- Applies to skills, rules, and docs under this repo.
- If unsure, ask before large changes.

## Language / 语言
- 中文为主；skills、rules、prompt 内容偏 English 以便 AI 理解。
- Default to ASCII; only use Unicode when needed.

## Skills / 技能
- Skills live under `skills/` and are managed by the skills manager.
- Use kebab-case names; keep descriptions concise.
- Keep a short CN summary + EN detail if needed.

## Docs / 文档
- Workflow notes go under `docs/coding-process/`.
- Skills system doc is `docs/skills-management.md`.
- Update `README.md` links when adding/removing docs.
- Prefer new docs over overwriting older notes.

## Update flow / 更新方式
- Draft → link in README → review for clarity.
- Prefer links over long command lists in high-level docs.
