# Dotfiles

This directory contains configuration files managed with GNU Stow.

## Structure

```
dotfiles/
└── opencode/          # OpenCode configuration package
    └── .config/
        └── opencode/  # Will be symlinked to ~/.config/opencode
```

## Usage

### Install configurations:
```bash
cd ~/Documents/suneo-toolkit/dotfiles
stow opencode
```

### Remove configurations:
```bash
cd ~/Documents/suneo-toolkit/dotfiles
stow -D opencode
```

### Restow (useful after updates):
```bash
cd ~/Documents/suneo-toolkit/dotfiles
stow -R opencode
```

## See Also
- [OpenCode Configuration README](opencode/.config/opencode/README.md)
