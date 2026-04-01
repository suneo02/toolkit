---
name: shared-skills-manager
description: Manage one shared skills source across multiple agents. Use this skill when the user wants to install, update, remove, check, or sync skills across agents (Claude Code, Codex, Gemini CLI, Cursor, Antigravity). Covers two workflows: (1) remote/GitHub skills via vercel-labs/skills CLI, (2) locally-authored skills via bundled union-link.cjs symlinks for live-edit maintenance. Trigger on any mention of syncing, linking, installing, or managing skills across agents.
---

# Shared Skills Manager

管理跨 agent 共享的 skills，支持两种工作流：

| 场景 | 方式 | 特点 |
|---|---|---|
| **网上/GitHub skills** | `npx skills add` (vercel-labs/skills CLI) | 下载到 `~/.agents/skills/`，再 symlink 到各 agent |
| **自写 skills** (本 repo) | `<skill-dir>/scripts/union-link.cjs` | 直接 symlink 到源目录，编辑即生效 |

> **`<skill-dir>`** = 本 SKILL.md 所在目录（安装后为 `~/.claude/skills/shared-skills-manager` 等）。
> 若不确定路径，先运行 `ls ~/.claude/skills/shared-skills-manager/scripts/` 确认。

---

## Workflow A: 网上 skills — vercel-labs/skills CLI

### Install from GitHub (most common)

```bash
# 安装全部 skills，非交互模式
npx skills add owner/repo \
  -s '*' -a codex -a claude-code -a gemini-cli -a cursor -a antigravity -g -y

# 只安装指定 skill
npx skills add owner/repo \
  -s skill-name -a claude-code -a cursor -g -y

# 指定分支
npx skills add owner/repo@develop -g -y

# 预览可用 skills（不安装）
npx skills add owner/repo --list
```

> **注意**: 始终明确指定 5 个 agent（`-a codex -a claude-code -a gemini-cli -a cursor -a antigravity`）加 `-g`，避免使用 `--agent '*'`。

### Check & update

```bash
npx skills check -g
npx skills update -g
```

### Remove / list

```bash
npx skills remove -s skill-name -g -y
npx skills remove --all -g
npx skills list -g
```

### 支持的来源格式

| Format | 示例 |
|---|---|
| GitHub shorthand | `owner/repo` |
| GitHub URL | `https://github.com/owner/repo` |
| 带分支 | `owner/repo@branch` |
| 带子路径 | `owner/repo/path/to/skills` |
| 本地路径 | `/path/to/skills` 或 `./skills` |

### CLI 速查

| 命令 | 别名 | 说明 |
|---|---|---|
| `add [source]` | `a`, `i`, `install` | 安装 |
| `remove` | `rm`, `r` | 卸载 |
| `list` | `ls` | 列出已安装 |
| `find [query]` | `f`, `search` | 搜索 |
| `check` | | 检查更新 |
| `update` | `upgrade` | 应用更新 |
| `init [name]` | | 新建 skill 模板 |

**`add` 常用参数**

| 参数 | 说明 |
|---|---|
| `-g, --global` | 安装到用户级 `~/.agents/skills/` |
| `-a, --agent <agents>` | 目标 agents（逗号分隔） |
| `-s, --skill <skills>` | 选择 skills（逗号分隔，`*` 为全部） |
| `-y, --yes` | 跳过确认（非交互模式） |
| `--copy` | 复制文件而非 symlink |
| `-l, --list` | 预览不安装 |

---

## Workflow B: 自写 skills — union-link.cjs（推荐用于本 repo）

自写的 skill 通过 skill 内置的 `scripts/union-link.cjs` 在各 agent 目录创建 symlink，直接指向源目录。**修改源文件后无需重新安装，立即生效。**

### 使用方法

```bash
# 全量 sync 到所有 agents（global）
node <skill-dir>/scripts/union-link.cjs \
  --agent=claude-code,codex,gemini-cli,cursor,antigravity \
  --src=<path-to-your-skills-dir>

# 只 sync 特定 skill
node <skill-dir>/scripts/union-link.cjs \
  --agent=claude-code,codex,gemini-cli,cursor,antigravity \
  --src=<path-to-your-skills-dir> \
  --skill=my-skill-name

# dry-run 预览
node <skill-dir>/scripts/union-link.cjs \
  --agent=claude-code \
  --src=<path-to-your-skills-dir> \
  --dry-run

# 替换冲突 link
node <skill-dir>/scripts/union-link.cjs \
  --agent=all \
  --src=<path-to-your-skills-dir> \
  --force
```

### 安装 / 更新 THIS skill 本身

```bash
node ~/.claude/skills/shared-skills-manager/scripts/union-link.cjs \
  --agent=claude-code,codex,gemini-cli,cursor,antigravity \
  --src=<path-to-your-skills-dir>
```

### 参数说明

| 参数 | 说明 |
|---|---|
| `--agent=<names\|all>` | 目标 agent，逗号分隔，或 `all`（自动检测已安装） |
| `--src=<path>` | 源 skills 目录（必须）|
| `--local` | link 到 project-local 目录而非 global |
| `--skill=<name>` | 只 link 指定 skill（可重复） |
| `--skills=<a,b,c>` | 逗号分隔的 skill 列表 |
| `--force` | 替换已存在但指向其他位置的 link |
| `--dry-run` | 预览操作，不实际变更 |
| `--no-clean-broken` | 不自动清理失效 symlink（默认自动清理） |

### 源目录结构要求

```
your-skills/
├── skill-a/
│   └── SKILL.md        ← 必须存在
├── skill-b/
│   └── SKILL.md
└── shared-skills-manager/
    ├── SKILL.md
    └── scripts/        ← 本 skill 的内置脚本
        ├── union-link.cjs
        └── lib/
            ├── agents.cjs
            ├── args.cjs
            ├── fs-utils.cjs
            ├── scanner.cjs
            └── sync-engine.cjs
```

### Supported Agents

| Agent | Global Path | Local Path |
|---|---|---|
| `claude-code` | `~/.claude/skills` | `.claude/skills` |
| `codex` | `~/.codex/skills` | `.agents/skills` |
| `gemini-cli` | `~/.gemini/skills` | `.agents/skills` |
| `cursor` | `~/.cursor/skills` | `.agents/skills` |
| `antigravity` | `~/.gemini/antigravity/skills` | `.agent/skills` |

---

## 两种方式的区别

| | `npx skills add` | `union-link.cjs` |
|---|---|---|
| 适合场景 | 第三方 GitHub skills | 自己维护的 skills |
| Symlink 指向 | `~/.agents/skills/`（中间存储）| 源目录（直接） |
| 编辑后反映 | 需要重新 `update` | **即时生效** |
| 版本追踪 | lock file | Git |
| 私有 repo | 需要 `GITHUB_TOKEN` | 不需要 |

---

## 注意事项

- 同名 skill 会被覆盖，使用带命名空间的名称避免冲突。
- `union-link.cjs` 遇到非 symlink 的同名路径会报错（不会覆盖真实目录）。
- `--force` 不加时，若 link 指向其他位置会报错。
- 私有 GitHub repo 需设置 `GITHUB_TOKEN`、`GH_TOKEN` 或 `gh auth token`。
