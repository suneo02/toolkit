# Quick Reference: OpenCode Setup on New Machines

## Prerequisites
```bash
# macOS
brew install stow

# Linux
sudo apt install stow  # Debian/Ubuntu
# or: sudo yum install stow  # RHEL/CentOS
```

## Setup Steps

### 1. Clone Repository
```bash
git clone <your-repo-url> ~/Documents/suneo-toolkit
cd ~/Documents/suneo-toolkit
```

### 2. Stow Configuration
```bash
cd dotfiles
stow -t ~ opencode
```

This creates:
```
~/.config/opencode -> ~/Documents/suneo-toolkit/dotfiles/opencode/.config/opencode
```

### 3. Install OpenCode
```bash
npm install -g opencode-ai oh-my-opencode
```

### 4. Authenticate
```bash
opencode auth openai
```

### 5. Verify
```bash
opencode doctor
ls -la ~/.config/opencode/
```

## Maintenance

### Update Configuration
Edit files in `~/.config/opencode/` (which are actually in the repo):
```bash
cd ~/Documents/suneo-toolkit
git add dotfiles/
git commit -m "update opencode config"
git push
```

### Pull Updates on Other Machines
```bash
cd ~/Documents/suneo-toolkit
git pull
# Changes automatically reflected via symlinks!
```

### Remove Symlinks
```bash
cd ~/Documents/suneo-toolkit/dotfiles
stow -D -t ~ opencode
```

### Re-apply Symlinks (after repo move/update)
```bash
cd ~/Documents/suneo-toolkit/dotfiles
stow -R -t ~ opencode
```

## Troubleshooting

### Stow reports conflicts
```bash
# Backup existing config
mv ~/.config/opencode ~/.config/opencode.backup

# Try again
cd ~/Documents/suneo-toolkit/dotfiles
stow -t ~ opencode
```

### Auth.json missing
```bash
# Re-authenticate
opencode auth openai
```

### Check symlink status
```bash
ls -la ~/.config/opencode
readlink ~/.config/opencode
```
