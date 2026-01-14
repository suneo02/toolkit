#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../.." && pwd)"

if [ -n "${TARGET_AGENT:-}" ]; then
  target_dir="${HOME}/.${TARGET_AGENT}/skills"
else
  target_dir=""
fi

SKILLS=()

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
    -*)
      echo "Unknown option: $1" >&2
      exit 1
      ;;
    *)
      SKILLS+=("$1")
      shift
      ;;
  esac
done

if [ -z "$target_dir" ]; then
  echo "Error: Target directory not specified. Set TARGET_AGENT env var or use --target-dir." >&2
  exit 1
fi

repo_dir="${repo_root}/skills"
agent_name="${TARGET_AGENT:-custom}"

echo "Adopting skills for ${agent_name}..."

if ! command -v stow >/dev/null 2>&1; then
  echo "stow not found. Install it first: brew install stow" >&2
  exit 1
fi

if [ ! -d "$repo_dir" ]; then
  echo "Repo skills dir not found: $repo_dir" >&2
  exit 1
fi

if [ ! -d "$target_dir" ]; then
  mkdir -p "$target_dir"
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

if [ "${#SKILLS[@]}" -gt 0 ]; then
  for name in "${SKILLS[@]}"; do
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
