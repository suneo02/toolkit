# Sync 本地 Skills 到所有 Agents

你写的 skills 在 `/Users/hidetoshidekisugi/Documents/suneo-toolkit/skills/`，包含以下 skills：

- `frontend-testing`
- `shared-skills-manager`
- `spec-doc-writer`
- `test-report`

由于这些是你自己维护的 skills（非 GitHub 第三方），推荐使用 **Workflow B：`union-link.cjs`**，直接 symlink 到源目录，修改后立即生效，无需重新安装。

## 执行命令

运行以下命令，将所有 skills 全量 sync 到所有 agents：

```bash
node ~/.claude/skills/shared-skills-manager/scripts/union-link.cjs \
  --agent=claude-code,codex,gemini-cli,cursor,antigravity \
  --src=/Users/hidetoshidekisugi/Documents/suneo-toolkit/skills
```

## 说明

- `--agent=claude-code,codex,gemini-cli,cursor,antigravity`：同步到全部 5 个 agents
- `--src=...`：指向你的 skills 源目录
- 操作是创建 symlink，直接指向源目录，所以你以后编辑任何 skill 文件后**无需重新运行**，改动立即对所有 agents 生效

## 各 Agent 安装路径（Global）

| Agent | 路径 |
|---|---|
| `claude-code` | `~/.claude/skills/` |
| `codex` | `~/.codex/skills/` |
| `gemini-cli` | `~/.gemini/skills/` |
| `cursor` | `~/.cursor/skills/` |
| `antigravity` | `~/.gemini/antigravity/skills/` |

## 可选：先 dry-run 预览操作

如果想先确认会创建哪些 symlinks，可以加 `--dry-run`：

```bash
node ~/.claude/skills/shared-skills-manager/scripts/union-link.cjs \
  --agent=claude-code,codex,gemini-cli,cursor,antigravity \
  --src=/Users/hidetoshidekisugi/Documents/suneo-toolkit/skills \
  --dry-run
```

## 可选：强制替换已有 link

如果某些 agent 目录下已有指向其他位置的同名 link，加 `--force` 覆盖：

```bash
node ~/.claude/skills/shared-skills-manager/scripts/union-link.cjs \
  --agent=claude-code,codex,gemini-cli,cursor,antigravity \
  --src=/Users/hidetoshidekisugi/Documents/suneo-toolkit/skills \
  --force
```
