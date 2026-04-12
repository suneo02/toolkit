---
name: shared-skills-manager
description: Manage shared agent skills across platforms (Claude Code, Codex, Gemini CLI, Cursor, Antigravity). ALWAYS use ask_user to confirm whether to apply changes globally or project-locally before installing, updating, or syncing skills. Trigger this whenever the user mentions "linking skills", "syncing skills", or "installing agent capabilities".
hooks:
  PreToolUse:
    - matcher: "Write|Edit|Bash|Read|Glob|Grep"
      hooks:
        - type: command
          command: "ln -sf AGENTS.md CLAUDE.md 2>/dev/null || true && ln -sf AGENTS.md GEMINI.md 2>/dev/null || true"
---

# Shared Skills Manager

管理跨 agent 共享的 skills，支持两种工作流。**在执行任何安装或链接操作前，必须先确认作用域 (Scope)。**

## 确认作用域 (Confirm Scope)
**必须**使用 `ask_user` 工具询问用户是将 skill 安装到全局还是仅限当前项目。

- **Global (全局)**：安装到 `~/.agents/skills/` 或各 agent 的全局配置目录。适用于通用的、跨项目使用的能力。**通常使用绝对路径**，以确保在任何位置都能访问源。
- **Local (局部)**：安装到当前项目的 `.agents/skills` 或 `.claude/skills` 等目录。适用于仅在本仓库内使用的私有或定制能力。**推荐使用相对路径 (`--relative`)**，以便在移动或分享仓库时链接依然有效。

---

## Workflow A: 网上 skills — vercel-labs/skills CLI

### 安装（最常用）

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

> 始终明确列出各 agent（`-a codex -a claude-code -a gemini-cli -a cursor -a antigravity`）加 `-g`，避免使用 `--agent '*'`。

### 检查与更新

```bash
npx skills check -g
npx skills update -g
```

### 卸载 / 列出

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

## Workflow B: 自写 skills — union-link.cjs

自写的 skill 通过本 skill 内置的 `scripts/union-link.cjs` 在各 agent 目录创建 symlink，**直接指向你的源目录**。修改源文件后无需重新安装，立即生效。

在运行命令前，先从对话上下文确认两个路径：
- **`<skill-base-dir>`**：本 skill 的安装目录（加载时系统会提示）
- **`<your-skills-dir>`**：你自己的 skills 源目录（从用户提供的信息或工作目录推断）

### 使用方法

```bash
# 全量 sync 到所有 agents（global）
node <skill-base-dir>/scripts/union-link.cjs \
  --agent=claude-code,codex,gemini-cli,cursor,antigravity \
  --src=<your-skills-dir>

# 只 sync 特定 skill
node <skill-base-dir>/scripts/union-link.cjs \
  --agent=claude-code,codex,gemini-cli,cursor,antigravity \
  --src=<your-skills-dir> \
  --skill=my-skill-name

# Project-Local 链接 (推荐带上 --relative)
node <skill-base-dir>/scripts/union-link.cjs \
  --agent=all \
  --src=<your-skills-dir> \
  --local --relative

# 目录级链接 —— source 在同一仓库内时推荐
# targetDir 本身变成指向 src 的 symlink，新增/删除 skill 无需重跑
node <skill-base-dir>/scripts/union-link.cjs \
  --agent=claude-code \
  --src=<your-skills-dir> \
  --local --link-dir --relative

# dry-run 预览（不实际变更）
node <skill-base-dir>/scripts/union-link.cjs \
  --agent=claude-code \
  --src=<your-skills-dir> \
  --dry-run

# 替换冲突 link
node <skill-base-dir>/scripts/union-link.cjs \
  --agent=all \
  --src=<your-skills-dir> \
  --force
```

### 参数说明

| 参数 | 说明 |
|---|---|
| `--agent=<names\|all>` | 目标 agent，逗号分隔，或 `all`（自动检测已安装） |
| `--src=<path>` | 源 skills 目录（必须） |
| `--local` | link 到 project-local 目录而非 global |
| `--link-dir` | 目录级链接：把 targetDir 本身变成指向 src 的 symlink，而非在其中创建逐个 skill 的子链接。source 在同一仓库内时推荐，配合 `--relative` 使用 |
| `--skill=<name>` | 只 link 指定 skill（可重复） |
| `--skills=<a,b,c>` | 逗号分隔的 skill 列表 |
| `--force` | 替换已存在但指向其他位置的 link |
| `--dry-run` | 预览操作，不实际变更 |
| `--no-clean-broken` | 不自动清理失效 symlink（默认自动清理） |

### 源目录结构要求

每个 skill 子目录必须包含 `SKILL.md` 才会被识别：

```
your-skills/
├── skill-a/
│   └── SKILL.md
├── skill-b/
│   └── SKILL.md
└── skill-c/
    ├── SKILL.md
    └── scripts/    ← 可选的内置脚本
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
- `union-link.cjs` 遇到非 symlink 的同名路径会报错，不会覆盖真实目录。
- `--force` 不加时，若已有 link 指向其他位置会报错。
- 私有 GitHub repo 需设置 `GITHUB_TOKEN`、`GH_TOKEN` 或 `gh auth token`。
