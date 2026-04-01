# 将 vercel-labs/ai-coding-skills 全局安装到 Claude Code 和 Codex

以下是将该技能包全局安装到两个工具的具体命令。

---

## 安装到 Claude Code

Claude Code 使用 `/skill install` 命令来安装技能，`--global` 标志表示全局安装（对所有项目生效）：

```bash
claude skill install vercel-labs/ai-coding-skills --global
```

安装完成后，可以通过以下命令确认已安装的全局技能：

```bash
claude skill list --global
```

---

## 安装到 Codex (OpenAI Codex CLI)

Codex CLI 使用类似的技能管理命令：

```bash
codex skill install vercel-labs/ai-coding-skills --global
```

安装完成后，确认安装：

```bash
codex skill list --global
```

---

## 注意事项

- **全局安装** 意味着该技能对你系统上所有项目都生效，而非仅限于当前工作目录。
- 如果不加 `--global`，技能只会安装在当前项目（本地安装）。
- 技能来源 `vercel-labs/ai-coding-skills` 通常对应 GitHub 上的仓库路径，安装时工具会自动从该仓库拉取技能定义。
- 若遇到权限问题，请确保 CLI 工具已正确登录（`claude auth` 或 `codex auth`）。

---

## 如果上述命令不适用

若你的版本 CLI 命令有所不同，也可以尝试：

```bash
# Claude Code 替代方式
claude skills add vercel-labs/ai-coding-skills --global

# Codex 替代方式
codex skills add vercel-labs/ai-coding-skills --global
```

具体命令语法以各自工具的最新文档为准。
