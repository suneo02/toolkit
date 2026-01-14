# Skills 管理方案

## 目标

- 使用 Git 仓库作为唯一源（source of truth）
- 使用 GNU Stow 在 `~/.codex/skills` (Codex) 和 `~/.gemini/skills` (Gemini) 下建立目录级软链接
- Windows 端使用目录 Junction（避免 symlink 权限问题）
- `.system` 保持本地，不纳入 Git 管理
- **支持多 Agent (Codex / Gemini)**：脚本逻辑已复用，分别提供 wrapper 脚本

## 目录约定

- 仓库技能目录：`<repo_root>/skills`
  - macOS 示例：`/Users/hidetoshidekisugi/Documents/suneo-agent-skills/skills`
  - Windows 示例：`D:\codes\agent-skills\skills`
- 读取目录：
  - Codex: `~/.codex/skills`
  - Gemini: `~/.gemini/skills`

## 脚本清单

所有核心逻辑位于 `scripts/core/`，对外提供特定 Agent 的 Wrapper 脚本。

### Codex Scripts

- Windows 一键更新：`scripts/codex-skills-sync.ps1`
- macOS / Linux 初始化接管：`scripts/codex-skills-bootstrap.sh`
- macOS / Linux 刷新链接：`scripts/codex-skills-stow.sh`
- macOS / Linux 入库迁移：`scripts/codex-skill-adopt`

### Gemini Scripts

- Windows 一键更新：`scripts/gemini-skills-sync.ps1`
- macOS / Linux 初始化接管：`scripts/gemini-skills-bootstrap.sh`
- macOS / Linux 刷新链接：`scripts/gemini-skills-stow.sh`
- macOS / Linux 入库迁移：`scripts/gemini-skill-adopt`

## Windows 端管理（Junction 方式）

> 适用于 Windows。使用目录 Junction，不依赖 stow，且不需要管理员权限。

### 初始化/一键更新

请根据目标 Agent 选择脚本：

```powershell
# Codex
powershell -ExecutionPolicy Bypass -File scripts\codex-skills-sync.ps1

# Gemini
powershell -ExecutionPolicy Bypass -File scripts\gemini-skills-sync.ps1
```

支持参数：

- `-RepoRoot <path>`: 指定仓库路径
- `-TargetDir <path>`: 指定目标目录（默认为 `~/.<agent>/skills`）
- `-Prune`: 清理仓库里已不存在的链接

## macOS / Linux 管理

### 1. 安装依赖

```bash
brew install stow
```

### 2. 初始化同步（现有技能接管）

建议先备份现有目录，再用脚本接管。

Codex:

```bash
./scripts/codex-skills-bootstrap.sh
```

Gemini:

```bash
./scripts/gemini-skills-bootstrap.sh
```

### 3. 日常同步 (Stow)

当仓库有新增目录时，或者需要刷新链接：

Codex:

```bash
./scripts/codex-skills-stow.sh
```

Gemini:

```bash
./scripts/gemini-skills-stow.sh
```

### 4. 新增技能入库 (Adopt)

新增 skill 后，将本地真实目录迁移到 Git 仓库并重新 stow。

Codex:

```bash
./scripts/codex-skill-adopt [skill-name]
```

Gemini:

```bash
./scripts/gemini-skill-adopt [skill-name]
```

### 5. 高级用法 (自定义路径)

所有脚本 (`bootstrap`, `stow`, `adopt`) 均支持以下参数：

- `-t, --target-dir <path>`: 指定目标 skills 目录（默认为 `~/.<agent>/skills`）
- `-r, --repo-root <path>`: 指定仓库根目录

示例：

```bash
./scripts/codex-skills-stow.sh --target-dir /path/to/custom/skills
```

## 脚本逻辑复用说明

- `scripts/core/` 包含通用逻辑（bootstrap, stow, adopt, sync）。
- `scripts/codex-*` 和 `scripts/gemini-*` 仅设置环境变量（如 `TARGET_AGENT`）并调用 core 脚本。
- 如需修改逻辑，请编辑 `scripts/core/` 下的对应文件。
