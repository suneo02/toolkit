#!/usr/bin/env bash
set -euo pipefail

if [ -z "${TARGET_AGENT:-}" ]; then
  echo "Error: TARGET_AGENT environment variable is not set." >&2
  exit 1
fi

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# core is inside scripts, so go up two levels to get to repo root
repo_root="$(cd "$script_dir/../.." && pwd)"
repo_dir="${repo_root}/skills"
target_dir="${HOME}/.${TARGET_AGENT}/skills"
backup_dir="${target_dir}.backup-$(date +%Y%m%d-%H%M%S)"

echo "Bootstrapping ${TARGET_AGENT} skills..."
echo "Repo: $repo_root"
echo "Target: $target_dir"

if ! command -v stow >/dev/null 2>&1; then
  echo "stow not found. Install it first (macOS: brew install stow)" >&2
  exit 1
fi

if [ ! -d "$repo_dir" ]; then
  echo "Repo skills dir not found: $repo_dir" >&2
  exit 1
fi

# Ensure target dir exists
mkdir -p "$target_dir"

mkdir -p "$backup_dir"

# Move existing directories/symlinks to backup
for d in "$repo_dir"/*; do
  [ -d "$d" ] || continue
  name="$(basename "$d")"
  if [ -e "$target_dir/$name" ] || [ -L "$target_dir/$name" ]; then
    echo "Backing up existing $name..."
    mv "$target_dir/$name" "$backup_dir/"
  fi
done

stow -d "$repo_root" -t "$target_dir" --ignore='\.DS_Store$' skills

echo "done"
