#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/.." && pwd)"
repo_dir="${repo_root}/skills"
target_dir="${HOME}/.codex/skills"
backup_dir="${target_dir}.backup-$(date +%Y%m%d-%H%M%S)"

if ! command -v stow >/dev/null 2>&1; then
  echo "stow not found. Install it first (macOS: brew install stow)" >&2
  exit 1
fi

if [ ! -d "$repo_dir" ]; then
  echo "Repo skills dir not found: $repo_dir" >&2
  exit 1
fi

if [ ! -d "$target_dir" ]; then
  echo "Codex skills dir not found: $target_dir" >&2
  exit 1
fi

mkdir -p "$backup_dir"

for d in "$repo_dir"/*; do
  [ -d "$d" ] || continue
  name="$(basename "$d")"
  if [ -e "$target_dir/$name" ] || [ -L "$target_dir/$name" ]; then
    mv "$target_dir/$name" "$backup_dir/"
  fi
done

stow -d "$repo_root" -t "$target_dir" --ignore='\.DS_Store$' skills

echo "done"
