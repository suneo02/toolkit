---
name: wind-ui-style
description: Style and design work for projects using the Wind UI component library, focusing on Less-based BEM styling, reusable mixins/variables, no CSS gap usage, and priority use of Wind UI CSS variables. Use when creating, refactoring, or reviewing styles/themes for Wind UI components or pages.
---

## 简要摘要 (CN)
- 为引入 Wind UI 的项目编写/调整样式，Less + BEM，复用样式，不用 gap，优先 Wind UI CSS 变量。

## Core Rules (EN)
- Use Less for all styling work.
- Use Less Modules (e.g., `*.module.less`) unless the project dictates otherwise.
- Reuse styles aggressively: extract mixins/variables for repeating patterns.
- Use Less features (variables, mixins, nesting, guards, functions) when they improve reuse and readability.
- Do not use CSS `gap` (grid or flex). Use margins or spacing utilities instead.
- Use strict BEM naming: `block__element--modifier`. Keep blocks aligned to component/feature names.
- Prefer Wind UI CSS variables for colors, radii, spacing, shadows, etc.

## Workflow (EN)
1. Scan existing styles and tokens before creating new ones; prefer extending or mixing in shared patterns.
2. Define the BEM block and state modifiers first; map elements and variants.
3. Implement base styles, then modifiers; keep selectors shallow and scoped to the block.
4. Replace hardcoded values with Wind UI CSS variables from the reference; do not invent variable names. If no suitable variable exists, look up shared tokens in `packages/gel-ui/src/styles/shared/variables.less` and import them via `@import 'gel-ui/variables.less';`. If still missing, use a Less variable with a literal fallback (or a project-level CSS variable if defined).

## Variable Reference (EN)
- Load `reference/wind-ui-vars.css` for the authoritative CSS variable list.
- If the file is missing and precise variable names matter, ask the user to provide the reference.
- For shared Less tokens, check `packages/gel-ui/src/styles/shared/variables.less` and import with `@import 'gel-ui/variables.less';`.

## Spacing Without gap (EN)
- Use sibling selectors: `> * + * { margin-left: @space; }` or `margin-top` for vertical stacks.
- Use `:not(:last-child)` or `:not(:first-child)` when it improves clarity.

## Less + BEM Example (EN)
```less
@block: wind-card;
@space-sm: 8px;
@space-md: 12px;

.@{block} {
  padding: @space-md;
  color: var(--font-color-2, #333);
  background: var(--card-bg, #fff);
  border: 1px solid var(--border-color-split);
  box-shadow: var(--shadow-normal);

  &__header {
    margin-bottom: @space-sm;
  }

  &--compact {
    padding: @space-sm;
  }
}
```
