---
name: quality-static-analysis
description: Run static quality checks in JS/TS projects and generate issue reports. Use for dependency cycle analysis, TypeScript tsc checks, basic lint checks, or when a static check issue list and risk summary are required.
---

# Static Quality Analysis

## Overview

Run dependency cycle analysis, tsc type checks, and basic lint checks, then summarize reproducible issues. Prefer existing repo scripts and dependencies. Do not install packages or use the network.

## Workflow

### 1) Identify tools and entry points

- Determine the working root: prefer the repo root (has `package.json`/`pnpm-workspace.yaml`).
- Identify available commands from `package.json` scripts: `lint`, `typecheck`, `tsc`, `depcruise`, `madge`, etc.
- Use only installed dependencies: prefer `pnpm run <script>`, then `pnpm exec <tool>`.

### 2) Dependency cycle analysis

- Preferred paths:
  - If scripts exist: `pnpm run depcruise`/`pnpm run madge`/`pnpm run lint:cycle`.
  - If tools exist:
    - `pnpm exec madge --circular <target_dir>`
    - `pnpm exec depcruise --validate <config_file> <target_dir>`
- Target directory selection: prefer `src` or `packages`, otherwise use `.`, and exclude `node_modules`/`dist`/`build`.
- If no tools are available, note "dependency cycle analysis not configured" in the report.

### 3) tsc type check

- Preferred paths:
  - `pnpm run typecheck`
  - `pnpm run tsc`
- If no scripts:
  - `pnpm exec tsc -p tsconfig.json --noEmit`
- If multiple `tsconfig.json` files exist: prefer the root; if none, run per package and record results separately in the report.

### 4) Basic lint check

- Preferred path:
  - `pnpm run lint`
- If no script but eslint config exists:
  - `pnpm exec eslint . --ext .ts,.tsx,.js,.jsx`
- If no lint tool is available, note "basic lint check not configured" in the report.

### 5) Generate issue report

- Use the unified template to output the report.
- Each issue must include: check item, command, location, key output, impact, and recommendation.
- Record missing tools, failed commands, or reasons a command cannot run.

@see references/report-template.md

## Output requirements

- Report language: Chinese
- Report structure: keep template headings and field order
- Result reliability: record actual commands and key output snippets

## Resources

### references/

- `report-template.md`: static check issue report template
