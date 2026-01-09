---
name: doc-archive
description: 生成和维护中文对话归档/项目归档文档，遵循 references/doc-archive-rule.md 的结构与格式；支持从 docs/specs 历史与 git commit 历史生成归档条目，并按用户指定的时间范围、作者与模型标记输出。用于：归档对话、补写历史记录、基于 spec 或 git 日志形成归档总结时。
---

# Doc Archive

## 概览
用于在本仓库生成或追加对话归档，并在需要时把历史 spec 文档与 git 提交转化为归档条目。归档内容必须使用中文。

## 工作流
1. 判断对话类型：判定新对话或延续对话，不确定时先询问确认。
2. 澄清关键参数：确认归档来源（对话/spec/git）、时间范围、作者/用户、模型标记、输出目录与文件名。
3. 获取时间戳：执行 `date "+%Y-%m-%d %H:%M"` 作为记录时间。
4. 收集历史数据（需要时）：
   - spec 文档：读取 `docs/specs/**` 与相关 `implementation-plan.json`。
   - git 历史：运行 `scripts/git_history_query.py` 按时间/作者/路径过滤。
5. 生成归档内容：
   - 新建：生成标题候选（关键词 + 日期）并让用户确认；写入文件头。
   - 追加：先读取完整旧文件，拼接新记录，再整体写回。
6. 输出确认信息：主答复后追加“对话记录已更新”块，提示文件状态与摘要。

## 参数澄清清单
- 询问或确认：
  - 归档来源：对话、spec、git 或组合。
  - 时间范围：`since`、`until`。
  - 作者/用户：用于 git 过滤。
  - 模型标记：用于记录标题中的 `【模型】`。
  - 输出目录与文件名：不确定时给出建议并确认。

## Git 历史脚本
- 运行示例：
  - `python3 scripts/git_history_query.py --since "2025-01-01" --until "2025-01-31" --author "alice" --path docs/specs`
  - `python3 scripts/git_history_query.py --since "2025-01-01" --author "alice" --format md --path docs/specs --path apps`
- 使用说明：
  - `--path` 可重复，用于限定目录。
  - 默认输出 JSON；需要可读摘要时使用 `--format md`。
  - 非仓库根目录执行时，使用 `--repo` 指定仓库路径。

## Spec 文档归档要点
- 提取 `docs/specs/<task>/README.md`、`implementation-plan.json` 中的目标、状态与 @see 路径。
- 避免粘贴大段代码；只引用关键文件路径与变更要点。

## 归档格式
- 读取 `references/archive-templates.md` 获取标题、记录块与结尾提示模板。
- 保持中文、结构化、可检索。

## References

- 归档规范：references/doc-archive-rule.md
- 模板：references/archive-templates.md
