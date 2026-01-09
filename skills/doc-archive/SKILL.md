---
name: doc-archive
description: Create and maintain Chinese conversation/project archive docs; supports generating entries from docs/specs and git history. Use for archiving dialogues, backfilling history, or summarizing from spec/git logs.
---

# Doc Archive

## Objective
Create or append conversation/project archives in this repo. Content must be Chinese, structured, and searchable.

## Core Flow
1. Determine dialog type: new or continued; ask if unclear.
2. Confirm parameters: source (dialog/spec/git), time range, author/user, model tag, output dir and filename.
3. Get timestamp: run `date "+%Y-%m-%d %H:%M"`.
4. Collect historical data (when needed):
   - spec: read `docs/specs/**` and `implementation-plan.json`.
   - git: run `scripts/git_history_query.py` with time/author/path filters.
5. Write archive:
   - New: propose a title (keywords + date) and confirm; write the header template.
   - Append: must read the full target file first, then append and write back the merged content.
6. Output confirmation: after the main response, append the "对话记录已更新" block with status and summary.

## Parameters to Confirm
- Archive source: dialog, spec, git, or a combination.
- Time range: `since`, `until`.
- Author/user: for git filtering.
- Model tag: recorded in the title or entries.
- Output directory and filename: no fixed path; confirm with user/project conventions.

## Entry Structure (Minimal Template)
```markdown
## [序号] [YYYY-MM-DD HH:MM] [会话标签]【模型】

**💬 用户输入**：
[完整记录用户提问或指令]

**🤖 本次响应处理**：
- **分析要点**：[…]
- **执行动作**：[…]
- **产出内容**：[…]
- **注意事项**：[…]

**📊 关键结论/成果**：
[1-3 条要点]

**🔗 相关上下文**：
[与历史记录的关联或后续提示]
```

## File Header Template (New File)
```markdown
# [对话主题]

**创建时间**：YYYY-MM-DD HH:MM
**主要参与者**：[用户角色/姓名]
**核心目标**：[1-2 句说明对话目的]
**预计产出**：[文档/代码/方案等]

---
```

## Confirmation Block
```markdown
---

📝 **对话记录已更新**

**文件状态**：[新建/追加] → `文件名.md`
**本次记录摘要**：[1 句总结]
**下次延续提示**：如需继续此话题，请提及"[关键词]"
```

## Archiving Notes (Short)
- spec: extract goals/status/@see paths from `docs/specs/<task>/README.md` and `implementation-plan.json`; avoid large code dumps.
- git: `scripts/git_history_query.py` supports `--since/--until/--author/--path/--format md`.

## Constraints
- Log content must be in Chinese.
- Appends must read the full existing file before writing back.
- Content must match the actual response and keep key details.

## References

- Templates: references/archive-templates.md
