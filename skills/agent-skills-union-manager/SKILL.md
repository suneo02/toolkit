---
name: agent-skills-union-manager
description: Manage a global union pool of agent skills by creating per-skill symlinks from multiple repos’ `.agent/skills` into agent global skills directories (e.g. `~/.codex/skills`, `~/.claude/skills`, `~/.gemini/skills`), enforcing globally-unique skill names, and detecting conflicts.
---

# Agent Skills Union Manager

CN summary:
- `.agent/skills` 做真源；把多个 repo 的 skills 汇总为一个全局 skills 池（union），通过“单个 skill 级别”的 symlink 管理。
- 强约束：全局 skill 名必须唯一（不做“同名优先级”），有冲突就报错并要求改名/命名空间。

## Working model

- **Source of truth (per repo)**: `<repo>/.agent/skills/.../<skill-name>/SKILL.md`
- **Union pool (per agent, global)**: `~/.<agent>/skills/<skill-name> -> <repo>/.agent/skills/.../<skill-name>`
- **Why per-skill links**: If an agent only reads a single global directory, linking the whole directory makes you “activate” only one repo; per-skill links allow union across many repos.

## Constraints and conventions (important)

- **Skill name must be globally unique** across all repos in the union pool.
  - If two repos both have `frontend-dev-rules`, the script must fail.
  - Fix by renaming one skill (recommended) or adding an explicit namespace prefix in the skill folder name.
- Keep skill folders kebab-case.
- Prefer an explicit publish list per repo to avoid linking every skill by accident.

## Repo layout expected

Recommended per-repo layout:

```
<repo>/
  .agent/
    skills/
      general/
        my-skill/
          SKILL.md
      company/
        ...
```

## Primary workflow (use the bundled script)

Use `scripts/union-link.cjs` to build/update the union pool for one agent.
If this skill is installed into an agent skills directory, you can run the script from the skill folder (e.g. `~/.codex/skills/agent-skills-union-manager/`).

1) Collect repos
- Decide which repo roots participate in the union pool.

2) Apply union links
- Run (example for Codex):

```bash
node scripts/union-link.cjs \
  --agent=codex \
  --target=~/.codex/skills \
  --repo=/path/to/repo-a \
  --repo=/path/to/repo-b
```

3) Repeat per tool
- Run again for `--agent=claude` (and its `--target`), etc.

### Install THIS skill into Codex / Gemini

This repo stores skills under `skills/` (not `.agent/skills`), so override with `--skills-dir=skills`.
To link only this skill (and clean broken symlinks in the target dir):

```bash
# Codex
node scripts/union-link.cjs \
  --agent=codex \
  --target=~/.codex/skills \
  --repo=/Users/hidetoshidekisugi/Documents/suneo-toolkit \
  --skills-dir=skills \
  --skill=agent-skills-union-manager \
  --clean-broken

# Gemini
node scripts/union-link.cjs \
  --agent=gemini \
  --target=~/.gemini/skills \
  --repo=/Users/hidetoshidekisugi/Documents/suneo-toolkit \
  --skills-dir=skills \
  --skill=agent-skills-union-manager \
  --clean-broken
```

### Common targets

- Codex CLI: `--target=~/.codex/skills`
- Claude Code: `--target=~/.claude/skills`
- Gemini CLI: `--target=~/.gemini/skills`
- Cursor: only use this if your Cursor setup actually reads a directory-based skill system (otherwise use a “generate rules into project files” approach instead).

### Dry run

```bash
node scripts/union-link.cjs --agent=codex --target=~/.codex/skills --repo=/path/to/repo-a --dry-run
```

## Operations and safety

- The script scans all skills under `<repo>/.agent/skills` (or `--skills-dir`).
- Limit to one/few skills with:
  - `--skill=<name>` (repeatable), or
  - `--skills=<a,b,c>`
- `--clean-broken`: remove broken symlinks in `--target` (safe; does not touch real dirs/files).
- If a skill link already exists and points elsewhere:
  - default: error (safe)
  - with `--force`: replace the link

Note:
- This script does NOT write any state file into the target dir, and does not support `--prune`.

## Notes for agents that don’t have project-local skill roots

- This union strategy assumes an agent reads a *single* global directory.
- You won’t get “per-project priority” without per-process config support; global uniqueness avoids priority conflicts by design.
