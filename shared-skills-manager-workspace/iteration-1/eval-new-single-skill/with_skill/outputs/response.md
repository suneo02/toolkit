# 如何让 claude-code 和 cursor 使用新写的 git-workflow skill

由于 `git-workflow` 是本地自写的 skill（不是从 GitHub 安装的），推荐使用 **Workflow B**：通过 `union-link.cjs` 在各 agent 目录创建 symlink，直接指向源目录。这样修改源文件后无需重新安装，立即生效。

## 执行命令

```bash
node /Users/hidetoshidekisugi/Documents/suneo-toolkit/skills/shared-skills-manager/scripts/union-link.cjs \
  --agent=claude-code,cursor \
  --src=/Users/hidetoshidekisugi/Documents/suneo-toolkit/skills \
  --skill=git-workflow
```

执行后会创建以下 symlink：
- `~/.claude/skills/git-workflow` → 指向你的源目录（供 Claude Code 使用）
- `~/.cursor/skills/git-workflow` → 指向你的源目录（供 Cursor 使用）

## 验证是否成功

```bash
ls -la ~/.claude/skills/git-workflow
ls -la ~/.cursor/skills/git-workflow
```

## 注意事项

- 因为是 symlink 指向源目录，后续对 `/Users/hidetoshidekisugi/Documents/suneo-toolkit/skills/git-workflow/SKILL.md` 的任何修改都会**立即**对两个 agent 生效，无需重新运行命令。
- 如果想一次性 sync 所有 skills（不限于 `git-workflow`），去掉 `--skill` 参数即可：

```bash
node /Users/hidetoshidekisugi/Documents/suneo-toolkit/skills/shared-skills-manager/scripts/union-link.cjs \
  --agent=claude-code,cursor \
  --src=/Users/hidetoshidekisugi/Documents/suneo-toolkit/skills
```

- 如果 link 已存在但指向其他位置，加 `--force` 强制替换：

```bash
node /Users/hidetoshidekisugi/Documents/suneo-toolkit/skills/shared-skills-manager/scripts/union-link.cjs \
  --agent=claude-code,cursor \
  --src=/Users/hidetoshidekisugi/Documents/suneo-toolkit/skills \
  --skill=git-workflow \
  --force
```

- 想预览操作但不实际执行，加 `--dry-run`：

```bash
node /Users/hidetoshidekisugi/Documents/suneo-toolkit/skills/shared-skills-manager/scripts/union-link.cjs \
  --agent=claude-code,cursor \
  --src=/Users/hidetoshidekisugi/Documents/suneo-toolkit/skills \
  --skill=git-workflow \
  --dry-run
```
