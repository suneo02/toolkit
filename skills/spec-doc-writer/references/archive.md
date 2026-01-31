# Spec Archiving

## When to Archive

- After the task is completed or explicitly closed.
- Ensure the spec and plan statuses are final before archiving.

## Target Location

- Specs can live under any `**/docs/specs/<task>`.
- Move the spec folder to the relative path `**/docs/specs/archive/YYYY-MM/<task>`.
- Do not keep a duplicate under `**/docs/specs/<task>` after archiving.

## Archive Script

Use `scripts/archive-spec.cjs` (stored under the skill folder). Pass the repo root with `--root`.

```bash
node /path/to/skill/scripts/archive-spec.cjs <task> --root /path/to/repo
node /path/to/skill/scripts/archive-spec.cjs docs/specs/<task> --root /path/to/repo
node /path/to/skill/scripts/archive-spec.cjs <task> --root /path/to/repo --dry-run
```

## Behavior Notes

- `<task>` is treated as `docs/specs/<task>` when no path is provided.
- If the target folder already exists, the script exits with an error.
- Use `--dry-run` to preview source and target paths.
