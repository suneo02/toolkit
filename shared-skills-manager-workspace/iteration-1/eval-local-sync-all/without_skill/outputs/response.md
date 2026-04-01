# Sync Local Skills to All Agents

你的 skills 目录在 `/Users/hidetoshidekisugi/Documents/suneo-toolkit/skills`，里面包含自己写的 skills（`frontend-testing`、`spec-doc-writer`、`test-report`、`shared-skills-manager`）。

对于本地自写的 skills，推荐用 `shared-skills-manager` skill 内附的 `union-link.cjs` 脚本，它会在各 agent 的 skills 目录创建 symlink，直接指向源目录，修改后立即生效。

---

## 前提：确认脚本存在

```bash
ls /Users/hidetoshidekisugi/Documents/suneo-toolkit/skills/shared-skills-manager/scripts/union-link.cjs
```

---

## 全量 sync 到所有 agents（一条命令）

```bash
node /Users/hidetoshidekisugi/Documents/suneo-toolkit/skills/shared-skills-manager/scripts/union-link.cjs \
  --agent=claude-code,codex,gemini-cli,cursor,antigravity \
  --src=/Users/hidetoshidekisugi/Documents/suneo-toolkit/skills
```

这会在以下目录各创建 symlink：

| Agent | Symlink 目标 |
|---|---|
| Claude Code | `~/.claude/skills/<skill-name>` |
| Codex | `~/.codex/skills/<skill-name>` |
| Gemini CLI | `~/.gemini/skills/<skill-name>` |
| Cursor | `~/.cursor/skills/<skill-name>` |
| Antigravity | `~/.gemini/antigravity/skills/<skill-name>` |

---

## 建议先 dry-run 预览

```bash
node /Users/hidetoshidekisugi/Documents/suneo-toolkit/skills/shared-skills-manager/scripts/union-link.cjs \
  --agent=claude-code,codex,gemini-cli,cursor,antigravity \
  --src=/Users/hidetoshidekisugi/Documents/suneo-toolkit/skills \
  --dry-run
```

确认无误后，去掉 `--dry-run` 执行。

---

## 如果已有旧 link 想强制覆盖

```bash
node /Users/hidetoshidekisugi/Documents/suneo-toolkit/skills/shared-skills-manager/scripts/union-link.cjs \
  --agent=claude-code,codex,gemini-cli,cursor,antigravity \
  --src=/Users/hidetoshidekisugi/Documents/suneo-toolkit/skills \
  --force
```

---

## 验证 sync 结果

```bash
ls -la ~/.claude/skills/
ls -la ~/.codex/skills/
ls -la ~/.gemini/skills/
ls -la ~/.cursor/skills/
ls -la ~/.gemini/antigravity/skills/
```

各目录下应看到 `frontend-testing`、`spec-doc-writer`、`test-report`、`shared-skills-manager` 的 symlink，指向 `/Users/hidetoshidekisugi/Documents/suneo-toolkit/skills/` 对应子目录。

---

## 注意事项

- symlink 直接指向源目录，之后编辑 `skills/` 下的文件会**立即对所有 agent 生效**，无需重新 sync。
- 若某 agent 目录不存在（如 `~/.codex/skills/`），脚本会自动创建。
- 若遇到同名非 symlink 目录（如之前用其他方式安装过），需手动删除后再运行，或加 `--force`。
