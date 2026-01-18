# OpenCode Configuration

This directory contains OpenCode/Oh My OpenCode configuration files.

## Files
- `opencode.json` - Model and provider configurations
- `oh-my-opencode.json` - Agent configurations
- `antigravity-accounts.json` - Antigravity account settings

## Setup with GNU Stow

### On New Machines:

```bash
# 1. Install stow if not already installed
brew install stow  # macOS
# or: apt install stow  # Linux

# 2. Clone this repository
git clone <your-repo> ~/Documents/suneo-toolkit
cd ~/Documents/suneo-toolkit

# 3. Use stow to create symlinks
cd dotfiles
stow opencode

# This creates: ~/.config/opencode -> dotfiles/opencode/.config/opencode
```

### Authenticate:

```bash
# Install opencode if needed
npm install -g opencode-ai oh-my-opencode

# Login to OpenAI (generates auth.json locally)
opencode auth openai

# Verify setup
opencode doctor
```

### Unstow (Remove symlinks):

```bash
cd ~/Documents/suneo-toolkit/dotfiles
stow -D opencode
```

## Security Notes
- `auth.json` is NOT tracked in Git (contains OAuth tokens)
- Each machine should authenticate independently
- Shared configs: models, agents, accounts
- Stow creates symlinks, so edits in `~/.config/opencode/` automatically sync via Git

## Updating Configuration
Any changes made to files in `~/.config/opencode/` are actually editing files in this repo. Just commit and push to sync across machines.
