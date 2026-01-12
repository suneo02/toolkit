#!/usr/bin/env bash
set -euo pipefail

if [ -z "${TARGET_AGENT:-}" ]; then
  echo "Error: TARGET_AGENT environment variable is not set." >&2
  exit 1
fi

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../.." && pwd)"
target_dir="${HOME}/.${TARGET_AGENT}/skills"

echo "Stowing ${TARGET_AGENT} skills..."

if ! command -v stow >/dev/null 2>&1; then
  echo "stow not found. Install it first (macOS: brew install stow)" >&2
  exit 1
fi

if [ ! -d "$target_dir" ]; then
  echo "${TARGET_AGENT} skills dir not found: $target_dir" >&2
  exit 1
fi

stow -d "$repo_root" -t "$target_dir" -R --ignore='\.DS_Store$' skills

echo "done"
