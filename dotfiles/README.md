# Dotfiles

This directory contains configuration files managed with GNU Stow.

## Structure

```
dotfiles/
└── opencode/          # OpenCode configuration package
    ├── opencode.json
    ├── oh-my-opencode.json
    └── package.json
```

## Usage

### Install configurations:
```bash
cd ~/Documents/suneo-toolkit/dotfiles
stow -t ~/.config/opencode opencode
```

### Remove configurations:
```bash
cd ~/Documents/suneo-toolkit/dotfiles
stow -D -t ~/.config/opencode opencode
```

### Restow (useful after updates):
```bash
cd ~/Documents/suneo-toolkit/dotfiles
stow -R -t ~/.config/opencode opencode
```

## See Also
- [OpenCode Configuration README](opencode/README.md)
