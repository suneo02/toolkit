---
title: Skills Management
description: Cross-platform skills management system for Codex, Gemini, and Claude agents using Node.js
---

# Skills Management

## 概述

统一的跨平台技能管理系统，使用 Node.js 实现，支持 Codex、Gemini、Claude 等 Agent。自动处理 Symlink (Unix) 和 Junction (Windows)，实现技能的 Git 版本管理与本地同步。

**核心优势**：

- ✅ 零代码重复 - 单一核心逻辑
- ✅ 跨平台 - Windows/macOS/Linux 通用
- ✅ 简单易用 - 统一命令接口
- ✅ Git 管理 - 多机同步无缝
- ✅ 可配置 - Agent 目录与扩展可配置

## 目录结构

技能按用途分组，仓库结构如下：

```
skills/
├── company/   # 公司项目相关
├── personal/  # 面试/个人内容
└── general/   # 通识与业界标准
```

## 快速开始

### 首次使用

```bash
# 1. 进入仓库目录
cd ~/Documents/suneo-agent-skills

# 2. 初始化（会自动备份现有内容）
node scripts/skills-manager.js codex bootstrap     # 初始化 Codex
node scripts/skills-manager.js gemini bootstrap    # 初始化 Gemini
node scripts/skills-manager.js claude bootstrap    # 初始化 Claude

# 完成！所有技能已链接到 ~/.codex/skills、~/.gemini/skills、~/.claude/skills
```

### 日常使用

```bash
# 同步最新技能（推荐每天运行一次）
node scripts/skills-manager.js codex sync

# 一键同步所有 Agent
node scripts/skills-manager.js all sync

# 查看技能状态
node scripts/skills-manager.js codex list
```

### 新增技能

```bash
# Agent 创建了新技能后，将其纳入 Git 管理
node scripts/skills-manager.js codex adopt my-new-skill

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
node scripts/skills-manager.js codex adopt awesome-skill
git add skills/awesome-skill
git commit -m "Add: awesome-skill"
git push

# 机器 B - 拉取并同步
node scripts/skills-manager.js codex sync  # 自动 git pull 并创建链接
```

### 工作流 2: 定期维护

```bash
# 每天或每周运行一次
node scripts/skills-manager.js codex sync --prune  # 同步并清理无效链接
```

### 工作流 3: 查看和诊断

```bash
# 查看所有技能及其链接状态
node scripts/skills-manager.js codex list

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
node scripts/skills-manager.js codex sync

# 跳过 git pull
node scripts/skills-manager.js codex sync --no-pull

# 同时清理无效链接
node scripts/skills-manager.js codex sync --prune
```

**功能**：

1. 执行 `git pull` 获取最新仓库内容
2. 为所有仓库中的技能创建链接
3. 跳过已存在的真实目录（不会覆盖）
4. 自动清理断开的链接并重新创建

### `bootstrap` - 初始化

首次使用时运行，安全地迁移现有技能到 Git 管理。

```bash
node scripts/skills-manager.js codex bootstrap
```

**功能**：

1. 备份现有 `~/.codex/skills` 到 `.backup-<timestamp>`
2. 为所有仓库技能创建链接
3. 保证数据零丢失

**何时使用**：

- 第一次设置此系统时
- 需要完全重置时

### `adopt [name]` - 技能入库

将本地创建的技能迁移到 Git 仓库管理。如果不提供技能名称，会自动从当前工作目录推断，或扫描本地技能目录。
默认写入 `skills/general/`，可用 `--group` 指定其他分组。

```bash
# 指定技能名称
node scripts/skills-manager.js codex adopt my-skill

# 指定分组（company/personal/general）
node scripts/skills-manager.js codex adopt my-skill --group=company

# 自动推断（从当前目录）
cd ~/.codex/skills/my-skill
node scripts/skills-manager.js codex adopt

# 自动选择（只有一个本地技能）
node scripts/skills-manager.js codex adopt

# 交互式选择（多个本地技能）
node scripts/skills-manager.js codex adopt
```

**功能**：

1. 自动检测技能名称（从 `cwd` 或扫描本地目录）
2. 移动 `~/.codex/skills/my-skill` → 仓库 `skills/my-skill`
3. 创建链接回 `~/.codex/skills/my-skill`
4. 提示你提交到 Git

**自动检测规则**：

- 如果当前目录在技能目标目录下，使用相对路径的第一段
- 否则扫描目标目录中的真实目录（非链接）
- 仅有一个候选时自动选择，多个时交互式选择
- 非交互式环境（CI/脚本）需明确提供技能名称

**何时使用**：

- Agent 创建了新技能
- 想将本地技能纳入版本管理

### `prune` - 清理无效链接

删除目标目录中的无效链接（仓库已不存在的技能）。

```bash
node scripts/skills-manager.js codex prune
```

**安全性**：

- ✅ 只删除链接
- ✅ 不会删除真实目录
- ✅ 保留 `.system` 目录

### `list` - 查看状态

列出所有技能及其链接状态。

```bash
node scripts/skills-manager.js codex list
```

**输出说明**：

- `● Linked` - 已正确链接
- `○ Not linked` - 仓库中存在但未链接
- `⚠ Real directory` - 是真实目录，不是链接

### `help` - 查看帮助

```bash
node scripts/skills-manager.js codex help
```

### `all sync` - 一键同步所有 Agent

```bash
node scripts/skills-manager.js all sync
```

支持 `--no-pull` 和 `--prune`，作用于所有 Agent。

## 高级用法

### 配置文件

在仓库根目录使用 `skills-manager.config.json` 配置 Agent 列表与目录。该配置用于定义可用 Agent 与目标路径。

```json
{
  "agents": [
    { "name": "codex", "targetDir": "~/.codex/skills" },
    { "name": "gemini", "targetDir": "~/.gemini/skills" },
    { "name": "claude", "targetDir": "~/.claude/skills" },
    {
      "name": "custom",
      "targetDir": {
        "default": "~/.custom/skills",
        "win32": "C:\\Users\\me\\.custom\\skills"
      }
    }
  ]
}
```

- `targetDir` 支持字符串或按平台区分（`win32`/`darwin`/`linux`/`default`）。
- `~` 会自动解析为用户主目录，Windows 也适用。

### 自定义路径

```bash
# 自定义仓库路径
node scripts/skills-manager.js codex sync --repo=/path/to/custom/repo

# 自定义目标目录
node scripts/skills-manager.js codex sync --target=/path/to/custom/skills

# 组合使用
node scripts/skills-manager.js codex bootstrap \
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

# Claude
npm run claude:sync
npm run claude:bootstrap
npm run claude:adopt -- my-skill

# Sync all
npm run agents:sync
```

## 技术细节

### 架构设计

```
scripts/
└── skills-manager.js       # 核心跨平台逻辑 & CLI 入口

skills-manager.config.json  # Agent 配置
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
  - Claude: `~/.claude/skills`

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
node scripts/skills-manager.js codex sync --no-pull
```

## 参考资料

### 相关命令对照

| npm scripts                     | 直接调用                                               |
| ------------------------------- | ------------------------------------------------------ |
| `npm run codex:sync`            | `node scripts/skills-manager.js codex sync`            |
| `npm run codex:bootstrap`       | `node scripts/skills-manager.js codex bootstrap`       |
| `npm run codex:adopt -- <name>` | `node scripts/skills-manager.js codex adopt <name>`    |
| `npm run codex:adopt`          | `node scripts/skills-manager.js codex adopt` (自动检测)  |
| `npm run gemini:sync`           | `node scripts/skills-manager.js gemini sync`           |
| `npm run gemini:bootstrap`      | `node scripts/skills-manager.js gemini bootstrap`      |
| `npm run gemini:adopt -- <name>`| `node scripts/skills-manager.js gemini adopt <name>`   |
| `npm run gemini:adopt`         | `node scripts/skills-manager.js gemini adopt` (自动检测)  |
| `npm run claude:sync`           | `node scripts/skills-manager.js claude sync`           |
| `npm run claude:bootstrap`      | `node scripts/skills-manager.js claude bootstrap`      |
| `npm run claude:adopt -- <name>`| `node scripts/skills-manager.js claude adopt <name>`   |
| `npm run claude:adopt`         | `node scripts/skills-manager.js claude adopt` (自动检测)  |
| `npm run agents:sync`           | `node scripts/skills-manager.js all sync`              |

### Agent 命令一致

多个 Agent 的命令完全一致，只需替换 Agent 名称：

```bash
# Codex
node scripts/skills-manager.js codex sync

# Gemini
node scripts/skills-manager.js gemini sync

# Claude
node scripts/skills-manager.js claude sync
```
