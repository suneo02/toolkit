---
title: Skills Management
description: Cross-platform skills management system for Codex and Gemini agents using Node.js
---

# Skills Management

## 概述

统一的跨平台技能管理系统，使用 Node.js 实现，支持 Codex 和 Gemini 双 Agent。自动处理 Symlink (Unix) 和 Junction (Windows)，实现技能的 Git 版本管理与本地同步。

**核心优势**：

- ✅ 零代码重复 - 单一核心逻辑
- ✅ 跨平台 - Windows/macOS/Linux 通用
- ✅ 简单易用 - 统一命令接口
- ✅ Git 管理 - 多机同步无缝

## 快速开始

### 首次使用

```bash
# 1. 进入仓库目录
cd ~/Documents/suneo-agent-skills

# 2. 初始化（会自动备份现有内容）
node scripts/codex.js bootstrap     # 初始化 Codex
node scripts/gemini.js bootstrap    # 初始化 Gemini

# 完成！所有技能已链接到 ~/.codex/skills 和 ~/.gemini/skills
```

### 日常使用

```bash
# 同步最新技能（推荐每天运行一次）
node scripts/codex.js sync

# 查看技能状态
node scripts/codex.js list
```

### 新增技能

```bash
# Agent 创建了新技能后，将其纳入 Git 管理
node scripts/codex.js adopt my-new-skill

# 提交到 Git
git add skills/my-new-skill
git commit -m "Add: my-new-skill"
git push
```

## 核心工作流

### 工作流 1: 多机同步

在多台机器间同步技能的完整流程：

```bash
# 机器 A - 创建并推送新技能
node scripts/codex.js adopt awesome-skill
git add skills/awesome-skill
git commit -m "Add: awesome-skill"
git push

# 机器 B - 拉取并同步
node scripts/codex.js sync  # 自动 git pull 并创建链接
```

### 工作流 2: 定期维护

```bash
# 每天或每周运行一次
node scripts/codex.js sync --prune  # 同步并清理无效链接
```

### 工作流 3: 查看和诊断

```bash
# 查看所有技能及其链接状态
node scripts/codex.js list

# 输出示例：
#   ● Linked          code-review-report
#   ● Linked          frontend-design
#   ○ Not linked      new-skill
#   ⚠ Real directory  old-skill
```

## 命令参考

### `sync` - 同步技能

日常最常用的命令，用于获取最新技能并创建链接。

```bash
# 基础用法
node scripts/codex.js sync

# 跳过 git pull
node scripts/codex.js sync --no-pull

# 同时清理无效链接
node scripts/codex.js sync --prune
```

**功能**：

1. 执行 `git pull` 获取最新仓库内容
2. 为所有仓库中的技能创建链接
3. 跳过已存在的真实目录（不会覆盖）

### `bootstrap` - 初始化

首次使用时运行，安全地迁移现有技能到 Git 管理。

```bash
node scripts/codex.js bootstrap
```

**功能**：

1. 备份现有 `~/.codex/skills` 到 `.backup-<timestamp>`
2. 为所有仓库技能创建链接
3. 保证数据零丢失

**何时使用**：

- 第一次设置此系统时
- 需要完全重置时

### `adopt <name>` - 技能入库

将本地创建的技能迁移到 Git 仓库管理。

```bash
node scripts/codex.js adopt my-skill
```

**功能**：

1. 移动 `~/.codex/skills/my-skill` → 仓库 `skills/my-skill`
2. 创建链接回 `~/.codex/skills/my-skill`
3. 提示你提交到 Git

**何时使用**：

- Agent 创建了新技能
- 想将本地技能纳入版本管理

### `prune` - 清理无效链接

删除目标目录中的无效链接（仓库已不存在的技能）。

```bash
node scripts/codex.js prune
```

**安全性**：

- ✅ 只删除链接
- ✅ 不会删除真实目录
- ✅ 保留 `.system` 目录

### `list` - 查看状态

列出所有技能及其链接状态。

```bash
node scripts/codex.js list
```

**输出说明**：

- `● Linked` - 已正确链接
- `○ Not linked` - 仓库中存在但未链接
- `⚠ Real directory` - 是真实目录，不是链接

### `help` - 查看帮助

```bash
node scripts/codex.js help
```

## 高级用法

### 自定义路径

```bash
# 自定义仓库路径
node scripts/codex.js sync --repo=/path/to/custom/repo

# 自定义目标目录
node scripts/codex.js sync --target=/path/to/custom/skills

# 组合使用
node scripts/codex.js bootstrap \
  --repo=/custom/repo \
  --target=/custom/target
```

### 使用 npm scripts

在 `package.json` 中已配置了便捷脚本：

```bash
# Codex
npm run codex:sync
npm run codex:bootstrap
npm run codex:adopt -- my-skill

# Gemini
npm run gemini:sync
npm run gemini:bootstrap
npm run gemini:adopt -- my-skill
```

## 技术细节

### 架构设计

```
scripts/
├── skills-manager.js       # 核心跨平台逻辑（200+ 行）
├── codex.js               # Codex CLI wrapper
└── gemini.js              # Gemini CLI wrapper
```

**设计优势**：

1. **零重复** - 核心逻辑只有一份
2. **跨平台** - 自动检测 OS 并使用正确链接方式
3. **易维护** - 单一职责，清晰 API
4. **用户友好** - 统一命令接口

### 链接方式

- **Windows**: Junction（不需要管理员权限）
- **macOS/Linux**: Symbolic Link

### 目录约定

- 仓库技能目录：`<repo_root>/skills`
  - macOS: `/Users/xxx/Documents/suneo-agent-skills/skills`
  - Windows: `D:\codes\agent-skills\skills`
- 读取目录：
  - Codex: `~/.codex/skills`
  - Gemini: `~/.gemini/skills`

### 系统要求

- Node.js >= 14.0.0
- Windows 7+ / macOS 10.10+ / Linux (任何现代发行版)

## 故障排除

### 问题 1: "node: command not found"

**解决方案**：安装 Node.js

```bash
# macOS
brew install node

# Windows
# 从 https://nodejs.org 下载安装

# Linux
sudo apt install nodejs  # Ubuntu/Debian
sudo yum install nodejs  # CentOS/RHEL
```

### 问题 2: "Permission denied"

**解决方案**：添加执行权限（Unix 系统）

```bash
chmod +x scripts/*.js
```

### 问题 3: Git pull 失败

如果不想自动 pull，可以使用 `--no-pull` 参数：

```bash
node scripts/codex.js sync --no-pull
```

## 参考资料

### 相关命令对照

| npm scripts                     | 直接调用                             |
| ------------------------------- | ------------------------------------ |
| `npm run codex:sync`            | `node scripts/codex.js sync`         |
| `npm run codex:bootstrap`       | `node scripts/codex.js bootstrap`    |
| `npm run codex:adopt -- <name>` | `node scripts/codex.js adopt <name>` |

### Gemini vs Codex

两个 Agent 的命令完全一致，只需替换脚本名：

```bash
# Codex
node scripts/codex.js sync

# Gemini
node scripts/gemini.js sync
```
