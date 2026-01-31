---
name: agent-skills-union-manager
description: Manage a global union pool of agent skills by creating per-skill symlinks from multiple repos’ `.agent/skills` into agent global skills directories (e.g. `~/.codex/skills`, `~/.claude/skills`, `~/.gemini/skills`), enforcing globally-unique skill names, detecting conflicts, and optionally pruning managed links.
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
- If a skill link already exists and points elsewhere:
  - default: error (safe)
  - with `--force`: replace the link
- `--prune`: remove only links tracked in the state file that are no longer present in the current union set.

## Notes for agents that don’t have project-local skill roots

- This union strategy assumes an agent reads a *single* global directory.
- You won’t get “per-project priority” without per-process config support; global uniqueness avoids priority conflicts by design.
