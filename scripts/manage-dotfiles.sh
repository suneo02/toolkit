#!/bin/bash
# Wrapper for managing dotfiles with Chezmoi
# Usage: ./manage-dotfiles.sh <command> [args...]

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHEZMOI_BIN="$REPO_ROOT/bin/chezmoi"
DOTFILES_DIR="$REPO_ROOT/dotfiles"

# Check if local binary exists, otherwise check global
if [ ! -f "$CHEZMOI_BIN" ]; then
  if command -v chezmoi &> /dev/null; then
    CHEZMOI_BIN="chezmoi"
  else
    echo "Error: chezmoi not found. Please run 'npm run dotfiles:install' or install it manually."
    exit 1
  fi
fi

# Execute chezmoi with the correct source directory
exec "$CHEZMOI_BIN" --source "$DOTFILES_DIR" "$@"
