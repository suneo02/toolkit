#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../.." && pwd)"

if [ -n "${TARGET_AGENT:-}" ]; then
  target_dir="${HOME}/.${TARGET_AGENT}/skills"
else
  target_dir=""
fi

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -t|--target-dir)
      if [[ "$2" == */skills ]] || [[ "$2" == */skills/ ]]; then
        target_dir="$2"
      else
        target_dir="$2/skills"
      fi
      shift 2
      ;;
    -r|--repo-root)
      repo_root="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1" >&2
      exit 1
      ;;
  esac
done

if [ -z "$target_dir" ]; then
  echo "Error: Target directory not specified. Set TARGET_AGENT env var or use --target-dir." >&2
  exit 1
fi

agent_name="${TARGET_AGENT:-custom}"

echo "Stowing ${agent_name} skills..."

if ! command -v stow >/dev/null 2>&1; then
  echo "stow not found. Install it first (macOS: brew install stow)" >&2
  exit 1
fi

if [ ! -d "$target_dir" ]; then
  mkdir -p "$target_dir"
fi

stow -d "$repo_root" -t "$target_dir" -R --ignore='\.DS_Store$' skills

echo "done"
