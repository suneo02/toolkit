#!/bin/bash
# Wrapper for managing dotfiles with Chezmoi
# Usage: ./manage-dotfiles.sh <command> [args...]

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DOTFILES_DIR="$REPO_ROOT/dotfiles"

# Use system chezmoi
if ! command -v chezmoi &> /dev/null; then
  echo "Error: chezmoi not found. Please install it via Homebrew:"
  echo "  brew install chezmoi"
  exit 1
fi

# Execute chezmoi with the correct source directory
exec chezmoi --source "$DOTFILES_DIR" "$@"
