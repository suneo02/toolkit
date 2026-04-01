# 安装 vercel-labs/ai-coding-skills 到 claude-code 和 codex

这是一个来自 GitHub 的第三方 skill，使用 **Workflow A**（`npx skills add`）进行安装。

## 运行以下命令

```bash
npx skills add vercel-labs/ai-coding-skills \
  -s '*' -a claude-code -a codex -g -y
```

### 命令参数说明

| 参数 | 含义 |
|---|---|
| `vercel-labs/ai-coding-skills` | GitHub 源（owner/repo 格式） |
| `-s '*'` | 安装该 repo 下的所有 skills |
| `-a claude-code` | 目标 agent：Claude Code |
| `-a codex` | 目标 agent：Codex |
| `-g` | 全局安装，写入 `~/.agents/skills/` 并 symlink 到各 agent 目录 |
| `-y` | 非交互模式，跳过确认提示 |

### 安装后的路径

- Claude Code: `~/.claude/skills/`
- Codex: `~/.codex/skills/`

## 验证安装结果

```bash
npx skills list -g
```

## 后续更新

```bash
npx skills update -g
```

## 备注

- 如果只想安装特定 skill（而非全部），将 `-s '*'` 替换为 `-s skill-name`，例如 `-s ai-coding`。
- 如需查看该 repo 包含哪些 skills，可先运行预览命令（不实际安装）：

  ```bash
  npx skills add vercel-labs/ai-coding-skills --list
  ```
