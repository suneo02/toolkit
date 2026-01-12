#!/usr/bin/env bash
set -euo pipefail

if [ -z "${TARGET_AGENT:-}" ]; then
  echo "Error: TARGET_AGENT environment variable is not set." >&2
  exit 1
fi

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../.." && pwd)"
repo_dir="${repo_root}/skills"
target_dir="${HOME}/.${TARGET_AGENT}/skills"

echo "Adopting skills for ${TARGET_AGENT}..."

if ! command -v stow >/dev/null 2>&1; then
  echo "stow not found. Install it first: brew install stow" >&2
  exit 1
fi

if [ ! -d "$repo_dir" ]; then
  echo "Repo skills dir not found: $repo_dir" >&2
  exit 1
fi

if [ ! -d "$target_dir" ]; then
  echo "${TARGET_AGENT} skills dir not found: $target_dir" >&2
  exit 1
fi

adopt_one() {
  local name="$1"
  local src="$target_dir/$name"
  local dst="$repo_dir/$name"

  if [ "$name" = ".system" ]; then
    echo "skip: $name (system)"
    return 0
  fi

  if [ ! -e "$src" ]; then
    echo "skip: $name (missing)"
    return 0
  fi

  if [ -L "$src" ]; then
    echo "skip: $name (already stowed)"
    return 0
  fi

  if [ ! -d "$src" ]; then
    echo "skip: $name (not a directory)"
    return 0
  fi

  if [ -e "$dst" ]; then
    echo "skip: $name (repo already has it)"
    return 0
  fi

  echo "adopt: $name -> $dst"
  mv "$src" "$dst"
}

if [ "$#" -gt 0 ]; then
  for name in "$@"; do
    adopt_one "$name"
  done
else
  for d in "$target_dir"/*; do
    [ -d "$d" ] || continue
    [ -L "$d" ] && continue
    adopt_one "$(basename "$d")"
  done
fi

stow -d "$repo_root" -t "$target_dir" --ignore='\.DS_Store$' skills

echo "done"
