# Skills Manager

管理 Codex/Gemini/Claude 以及自定义 Agent 的技能同步。

## 基本用法

```bash
# 初始化
node scripts/skills-manager.js codex bootstrap
node scripts/skills-manager.js gemini bootstrap
node scripts/skills-manager.js claude bootstrap

# 同步
node scripts/skills-manager.js codex sync
node scripts/skills-manager.js gemini sync
node scripts/skills-manager.js claude sync

# 一键同步
node scripts/skills-manager.js all sync

# 列表
node scripts/skills-manager.js codex list
```

## 配置

使用仓库根目录的 `skills-manager.config.json` 定义 Agent 和目标目录。
