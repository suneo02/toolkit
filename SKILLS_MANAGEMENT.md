# Codex Skills 管理方案

## 目标
- 使用 Git 仓库作为唯一源（source of truth）
- 使用 GNU Stow 在 `~/.codex/skills` 下建立目录级软链接
- `.system` 保持本地，不纳入 Git 管理

## 目录约定
- 仓库技能目录：`/Users/hidetoshidekisugi/Documents/suneo-agent-skills/skills`
- Codex 读取目录：`~/.codex/skills`

## 同步行为说明（双向）
### Git 仓库 -> Codex
- 修改/新增文件（在已有技能目录内）：**立即生效**，因为 Codex 访问的是软链接目录
- 新增技能目录（如 `skills/new-skill/`）：**需要执行一次 stow** 才会创建新软链接
- 删除技能目录：**需要执行一次 stow -R** 才会清理旧软链接（否则会留下断链）

推荐命令：
```bash
stow -d /Users/hidetoshidekisugi/Documents/suneo-agent-skills -t ~/.codex/skills -R skills
```

如果遇到 `.DS_Store` 冲突（常见于 macOS），请用忽略参数：
```bash
stow -d /Users/hidetoshidekisugi/Documents/suneo-agent-skills -t ~/.codex/skills -R --ignore='\\.DS_Store$' skills
```

### Codex -> Git 仓库
- 修改/新增文件（在已 stow 的技能目录内）：**立即同步到仓库**
- 删除文件（在已 stow 的技能目录内）：**立即同步到仓库**
- 新增技能目录（在 `~/.codex/skills` 新建一个真实目录）：**不会自动入库**  
  需要用 `codex-skill-adopt` 迁移并重新 stow
- 删除技能目录（直接删 `~/.codex/skills/<skill>` 软链接）：**只会删链接**，仓库不变  
  正确做法是在仓库中删除目录，然后 `stow -R`

> `.system` 始终保持本地，不参与 Git 同步。

## 安装依赖
```bash
brew install stow
```

## 初始化同步（现有技能接管）
建议先备份现有目录，再用 stow 接管。

```bash
repo_root="/Users/hidetoshidekisugi/Documents/suneo-agent-skills"
repo_dir="${repo_root}/skills"
target_dir="${HOME}/.codex/skills"
backup_dir="${target_dir}.backup-$(date +%Y%m%d-%H%M%S)"

mkdir -p "$backup_dir"

# 仅移走与仓库同名的技能目录（避免影响 .system）
for d in "$repo_dir"/*; do
  [ -d "$d" ] || continue
  name="$(basename "$d")"
  if [ -e "$target_dir/$name" ] || [ -L "$target_dir/$name" ]; then
    mv "$target_dir/$name" "$backup_dir/"
  fi
done

# 用 skills 包统一 stow，避免扁平化链接
stow -d "$repo_root" -t "$target_dir" --ignore='\\.DS_Store$' skills
```

## 新增技能入库（手动脚本）
新增 skill 后，推荐用入库脚本将本地真实目录迁移到 Git 仓库并重新 stow。

脚本路径（推荐放在仓库并软链接到本机）：
- 仓库：`/Users/hidetoshidekisugi/Documents/suneo-agent-skills/scripts/codex-skill-adopt`
- 本机：`~/.codex/bin/codex-skill-adopt`

用法：
```bash
# 扫描并入库所有“真实目录”（排除 .system、已 stow 的目录、非目录文件）
codex-skill-adopt

# 仅入库指定 skill
codex-skill-adopt project-whitepaper
```

脚本行为：
- 仅处理“真实目录”，不会触碰 `.system`
- 已经是 symlink 的目录会被跳过
- 非目录文件（如 `*.skill`）会被跳过
- 入库后自动执行 `stow`，确保 `~/.codex/skills` 保持软链接状态

如果 `codex-skill-adopt` 不在 PATH，可在 `~/.zshrc` 里加入：
```bash
export PATH=\"$HOME/.codex/bin:$PATH\"
```

## 脚本位置建议（多机同步）
为了两台电脑同步一致，**建议把脚本放进 Git 仓库并在本机软链接到 `~/.codex/bin`**：

建议仓库路径：
`/Users/hidetoshidekisugi/Documents/suneo-agent-skills/scripts/codex-skill-adopt`

本机链接：
```bash
mkdir -p ~/.codex/bin
ln -s /Users/hidetoshidekisugi/Documents/suneo-agent-skills/scripts/codex-skill-adopt ~/.codex/bin/codex-skill-adopt
```

这样脚本改动也能跟随仓库同步到另一台电脑。

## 注意事项
- **不要用 stow 单独 stow 某个技能目录**（例如直接 stow `code-review-report`），这会导致目录扁平化。
- 推荐统一使用 `skills` 作为 package：
  `stow -d /Users/hidetoshidekisugi/Documents/suneo-agent-skills -t ~/.codex/skills skills`
- `.system` 永远留在本地，避免版本冲突或被 Codex 更新覆盖。
- macOS 下建议忽略 `.DS_Store`，避免 stow 冲突：
  `stow -d /Users/hidetoshidekisugi/Documents/suneo-agent-skills -t ~/.codex/skills -R --ignore='\\.DS_Store$' skills`
