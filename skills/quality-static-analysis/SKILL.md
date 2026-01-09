---
name: quality-static-analysis
description: 在 JS/TS 项目中执行静态质量检查并生成问题报告。适用于依赖循环分析、TypeScript tsc 类型检查、基础 lint 规则检查，或需要输出静态检查问题清单与风险摘要的场景。
---

# 质量静态分析

## 概览

执行依赖循环分析、tsc 类型检查与基础 lint 检查，汇总可复现的问题报告。优先使用仓库内已有脚本与依赖，不进行联网安装。

## 工作流

### 1) 识别工具与入口

- 确定运行根目录：优先在仓库根（存在 `package.json`/`pnpm-workspace.yaml`）。
- 从 `package.json` 的 `scripts` 里识别可用命令：`lint`、`typecheck`、`tsc`、`depcruise`、`madge` 等。
- 仅使用已安装依赖：优先 `pnpm run <script>`，其次 `pnpm exec <tool>`。

### 2) 依赖循环分析

- 优先路径：
  - 若存在脚本：`pnpm run depcruise`/`pnpm run madge`/`pnpm run lint:cycle`。
  - 若存在工具：
    - `pnpm exec madge --circular <目标目录>`
    - `pnpm exec depcruise --validate <配置文件> <目标目录>`
- 目标目录选择：优先 `src` 或 `packages`，不存在则用 `.`，排除 `node_modules`/`dist`/`build`。
- 若无工具可用，在报告中标注“未配置依赖循环分析工具”。

### 3) tsc 类型检查

- 优先路径：
  - `pnpm run typecheck`
  - `pnpm run tsc`
- 若无脚本：
  - `pnpm exec tsc -p tsconfig.json --noEmit`
- 若存在多份 `tsconfig.json`：优先根目录；若根目录不存在，按包逐个执行并在报告中分别记录。

### 4) 基础 lint 检查

- 优先路径：
  - `pnpm run lint`
- 若无脚本但存在 eslint 配置：
  - `pnpm exec eslint . --ext .ts,.tsx,.js,.jsx`
- 若无 lint 工具可用，在报告中标注“未配置基础 lint 检查”。

### 5) 生成问题报告

- 使用统一模板输出报告。
- 每个问题必须包含：检查项、触发命令、位置、关键输出、影响与建议。
- 将缺失工具、命令失败或无法运行的原因写入报告。

@see references/report-template.md

## 输出要求

- 报告语言：中文
- 报告结构：保持模板标题与字段顺序
- 结果可信：记录实际运行命令与关键输出片段

## 资源

### references/

- `report-template.md`：静态检查问题报告模板
