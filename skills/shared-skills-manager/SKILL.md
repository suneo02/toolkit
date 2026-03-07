---
name: shared-skills-manager
description: Manage one shared skills source across multiple agents by delegating install/check/update to vercel-labs/skills CLI.
---

# Shared Skills Manager

CN summary:
- 目标是让多个 agent 共用同一份 skills，并把主要安装/更新逻辑交给 `vercel-labs/skills`。
- 真源建议放在项目目录（如 `skills/` 或 `docs/skills`）；agent 侧通过官方 canonical + links 消费。

## When to use

Use this skill when you need one of these:
- Install the same skills source to multiple agents (`codex`, `claude-code`, `gemini-cli`, `cursor`).
- Keep agent-installed skills aligned via `skills check` / `skills update`.
- Standardize shared skills management on top of the official Vercel skills CLI.

## Working model (primary)

- **Source of truth (recommended)**: a project-local folder (for example `skills/` or `docs/skills`).
- **Canonical pool**: managed by `vercel-labs/skills` under `~/.agents/skills`.
- **Agent path**: per-agent directory (for example `~/.codex/skills`) linked from canonical by official tooling.

Note:
- Editing canonical does not automatically sync back to your source folder.
- If you need canonical -> source back-sync, keep it as your own separate script/process.

## Primary workflow (Vercel-first)

Use the official CLI directly:

```bash
npx skills <add|check|update> [options]
```

### 1) Sync source to multiple agents

Install all skills to all agents:

```bash
npx skills add /path/to/skills-source --all
```

Install all skills to selected agents:

```bash
npx skills add /path/to/skills-source --skill '*' --agent codex claude-code gemini-cli --yes
```

For selective publish:

```bash
npx skills add /path/to/skills-source --agent codex --skill shared-skills-manager --yes
```

For copy mode:

```bash
npx skills add /path/to/skills-source --skill '*' --agent codex --copy --yes
```

### 2) Check updates (for installed official sources)

```bash
npx skills check
```

### 3) Apply updates

```bash
npx skills update
```

### 4) Local source edits

If your source folder changed (for example you edited `SKILL.md`), rerun `add` to reinstall.

## Install THIS skill from this repo

This repo stores skills under `skills/`, so source is the repo `skills/` directory:

```bash
npx skills add /Users/hidetoshidekisugi/Documents/suneo-toolkit/skills \
  --agent codex gemini-cli \
  --skill shared-skills-manager \
  --yes
```

## Safety notes

- Prefer explicit `--skill` publish lists for high-safety repos.
- Official CLI may overwrite same-name skills; namespace names to avoid accidental replacement.
- Keep skill folder names in kebab-case.
