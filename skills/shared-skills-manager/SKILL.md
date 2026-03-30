---
name: shared-skills-manager
description: Manage one shared skills source across multiple agents by delegating install/check/update to vercel-labs/skills CLI.
---

# Shared Skills Manager

管理跨 agent 共享的 skills，基于 `vercel-labs/skills` 官方 CLI。

## When to use

- Install / remove / update skills across multiple agents.
- Keep agent-installed skills aligned via `skills check` / `skills update`.

> **CRITICAL**: Always specify the 5 agents explicitly: `-a codex -a claude-code -a gemini-cli -a cursor -a antigravity` and use `-g` to ensure installation to user-level directories. Avoid `--agent '*'` or `--all` as it may install to unsupported or unintended directories.

## Supported source types

The CLI accepts these source formats directly — **no manual `git clone` needed**:

| Format | Example |
|---|---|
| GitHub shorthand | `owner/repo` |
| GitHub URL | `https://github.com/owner/repo` |
| With branch/tag | `owner/repo@branch` |
| With subpath | `owner/repo/path/to/skills` |
| GitLab | `https://gitlab.com/owner/repo` |
| SSH | `git@github.com:owner/repo.git` |
| Local path | `/path/to/skills` or `./skills` |

## CLI reference

```
npx skills <command> [options]
```

### Commands

| Command | Aliases | Description |
|---|---|---|
| `add [source]` | `a`, `i`, `install` | Install skills from repo, URL, or local path |
| `remove` | `rm`, `r` | Uninstall skills |
| `list` | `ls` | Show installed skills |
| `find [query]` | `f`, `search`, `s` | Search available skills |
| `check` | | Check for updates |
| `update` | `upgrade` | Apply updates |
| `init [name]` | | Create new skill template |

### Key flags for `add`

| Flag | Description |
|---|---|
| `-g, --global` | Install to user-level (`~/.agents/skills/`) instead of project |
| `-a, --agent <agents>` | Target agents (comma-separated, or `*` for all detected) |
| `-s, --skill <skills>` | Select skills by name (comma-separated, or `*` for all) |
| `-y, --yes` | Skip prompts (non-interactive) |
| `--all` | Shorthand for `--skill '*' --agent '*' -y` |
| `--copy` | Copy files instead of symlink |
| `-l, --list` | Preview available skills without installing |

### Key flags for `remove`

| Flag | Description |
|---|---|
| `-g, --global` | Remove from global scope |
| `-a, --agent <agents>` | Target agents |
| `-s, --skill <skills>` | Skills to remove |
| `-y, --yes` | Skip prompts |
| `--all` | Remove all skills from all agents |

### Key flags for `list`

| Flag | Description |
|---|---|
| `-g, --global` | List global skills |
| `-a, --agent <agents>` | Filter by agent |
| `--json` | Machine-readable output |

## Workflows

### Install from GitHub (most common)

```bash
# Interactive — prompts for skill and agent selection
npx skills add owner/repo -g

# Install all skills to the 5 default agents, non-interactive
npx skills add owner/repo \
  -s '*' -a codex -a claude-code -a gemini-cli -a cursor -a antigravity -g -y

# Install specific skill(s) to specific agent(s)
npx skills add owner/repo \
  -s skill-name -a claude-code -a cursor -g -y

# Install from a specific branch
npx skills add owner/repo@develop -g -y

# Preview available skills before installing
npx skills add owner/repo --list
```

### Install from local path

```bash
npx skills add /path/to/skills-source \
  -s '*' -a codex -a claude-code -a gemini-cli -a cursor -a antigravity -g -y

# Copy mode — independent copies per agent, no symlinks
npx skills add /path/to/skills-source \
  -s '*' -a codex -a claude-code -a gemini-cli -a cursor -a antigravity -g -y --copy
```

> If your local source changed (e.g. edited `SKILL.md`), rerun `npx skills add` to reinstall.

### Check & update

```bash
npx skills check -g
npx skills update -g
```

### Remove skills

```bash
npx skills remove -s skill-name -g -y
npx skills remove --all -g
```

### List installed

```bash
npx skills list -g
```

## How it works

- **Canonical storage**: `~/.agents/skills/` (global) or `./<agent>/skills/` (project)
- **Agent linking**: symlinks from each agent dir (e.g. `~/.claude/skills/skill-name`) to canonical (default). Use `--copy` for independent copies.
- **Lock file**: `~/.agents/.skill-lock.json` (global) or `./skills-lock.json` (project) — tracks source, version hash, timestamps for update detection.
- **Scope**: `-g` = global (user-level, cross-project); omit = project-local (committed to git).

## Install THIS skill from this repo

```bash
npx skills add /Users/hidetoshidekisugi/Documents/suneo-toolkit/skills \
  -s shared-skills-manager -a codex -a claude-code -a gemini-cli -a cursor -a antigravity -g -y
```

## Safety notes

- Prefer explicit `-s skill-name` for repos you don't fully trust.
- CLI rejects path traversal (`..` in subpaths).
- Private repos require `GITHUB_TOKEN`, `GH_TOKEN`, or `gh auth token`.
- Same-name skills get overwritten — use namespaced names to avoid collisions.
