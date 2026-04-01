# 如何让 claude-code 和 cursor 使用你的 git-workflow skill

要让 AI 工具能够读取并使用你的 skill，需要将 skill 文件放到这些工具能够识别的位置，或在对话中显式引用它。以下是针对两个工具的具体方法：

---

## 1. Claude Code

Claude Code 通过项目中的 `CLAUDE.md` 文件加载上下文和指令。

### 方法一：直接引用 skill 内容（推荐）

将 `git-workflow` skill 的内容复制或 `@import` 到项目根目录的 `CLAUDE.md` 中：

```bash
# 在项目根目录创建或编辑 CLAUDE.md
cat git-workflow/SKILL.md >> CLAUDE.md
```

或者在 `CLAUDE.md` 中写明引用：

```markdown
<!-- CLAUDE.md -->
# Project Instructions

@/path/to/git-workflow/SKILL.md
```

> Claude Code 支持在 `CLAUDE.md` 中用 `@filename` 语法引用其他文件。

### 方法二：全局 CLAUDE.md

如果你希望所有项目都能使用这个 skill，将其加入全局配置：

```bash
# 全局 CLAUDE.md 位置
~/.claude/CLAUDE.md
```

将 skill 内容追加到该文件，或使用 `@` 引用 skill 文件的绝对路径：

```markdown
@/Users/yourname/skills/git-workflow/SKILL.md
```

---

## 2. Cursor

Cursor 使用 `.cursorrules` 文件（旧版）或 `.cursor/rules/` 目录（新版）来加载自定义规则和上下文。

### 方法一：使用 `.cursor/rules/` 目录（推荐，Cursor 0.43+）

在项目根目录创建规则文件：

```bash
mkdir -p .cursor/rules
cp git-workflow/SKILL.md .cursor/rules/git-workflow.md
```

Cursor 会自动加载该目录下的所有 `.md` 文件作为规则。

### 方法二：使用 `.cursorrules` 文件（旧版兼容）

```bash
# 将 skill 内容追加到 .cursorrules
cat git-workflow/SKILL.md >> .cursorrules
```

### 方法三：全局规则（User Rules）

在 Cursor 设置中找到 **Settings > General > Rules for AI**，将 skill 的核心内容粘贴进去，这样对所有项目生效。

---

## 3. 通用建议

- **对话中直接粘贴**：如果是临时使用，直接在对话开头发送 skill 文件内容，告诉 AI "请按照以下规则行事"。
- **版本控制**：将 skill 文件提交到 git 仓库，方便团队共享。
- **路径一致性**：如果多个项目都需要这个 skill，考虑用符号链接统一管理：
  ```bash
  ln -s /path/to/git-workflow/SKILL.md /your-project/.cursor/rules/git-workflow.md
  ```

---

## 快速检查清单

| 工具 | 文件位置 | 作用范围 |
|------|----------|----------|
| Claude Code | `./CLAUDE.md` | 当前项目 |
| Claude Code | `~/.claude/CLAUDE.md` | 全局所有项目 |
| Cursor | `./.cursor/rules/git-workflow.md` | 当前项目 |
| Cursor | Settings > Rules for AI | 全局所有项目 |

按照以上步骤操作后，重新打开对话窗口，AI 就能读取并应用你的 `git-workflow` skill 了。
