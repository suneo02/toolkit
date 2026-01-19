# Suneo Toolkit Dotfiles

Managed with [Chezmoi](https://www.chezmoi.io/).

## Structure

The `dotfiles` directory acts as the source state for Chezmoi.

```text
dotfiles/
├── .shared/                  # Shared configuration files (not directly applied)
│   └── vscode-settings.json
├── dot_config/               # ~/.config/
│   ├── opencode/             # OpenCode configuration
│   └── Code/                 # VSCode (Linux)
├── Library/                  # ~/Library/ (macOS)
│   └── Application Support/
│       └── Code/
│           └── User/
│               └── settings.json.tmpl
├── AppData/                  # %APPDATA% (Windows)
│   └── Roaming/
│       └── Code/
│           └── User/
│               └── settings.json.tmpl
└── ...
```

## Quick Start

### 1. Install Chezmoi

```bash
npm run dotfiles:install
```

### 2. Apply Configuration

Use the helper script to apply configurations to your home directory:

```bash
npm run dotfiles -- apply -v
```

## Managing Files

### Add a new file

```bash
# Add ~/.zshrc to dotfiles
npm run dotfiles -- add ~/.zshrc
```

### Edit a file

```bash
# Edit managed files in the source directory
npm run dotfiles -- edit ~/.zshrc
```

### Apply changes

```bash
npm run dotfiles -- apply -v
```

## VSCode Settings

VSCode settings are managed via a shared template.

- Source: `dotfiles/.shared/vscode-settings.json`
- Targets: Mapped to correct paths on Windows, macOS, and Linux automatically.

To update VSCode settings, edit `dotfiles/.shared/vscode-settings.json` and run `npm run dotfiles -- apply`.
