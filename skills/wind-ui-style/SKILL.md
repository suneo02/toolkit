---
name: wind-ui-style
description: Style and design work for projects using the Wind UI component library, focusing on Less-based BEM styling, reusable mixins/variables, no CSS gap usage, and priority use of Wind UI CSS variables. Use when creating, refactoring, or reviewing styles/themes for Wind UI components or pages.
---

## 简要摘要 (CN)
- 为引入 Wind UI 的项目编写/调整样式，Less + BEM，复用样式，不用 gap，优先 Wind UI CSS 变量。

## Core Rules (EN)
- Use Less for all styling work.
- Use Less Modules (e.g., `*.module.less`) unless the project dictates otherwise.
- Nest BEM elements/modifiers inside the block using `&__` and `&--` (do not write flat BEM selectors).
- Reuse styles aggressively: extract mixins/variables for repeating patterns.
- Generic mixins MUST live in `packages/gel-ui/src/styles/mixin/`, not in component-local files. Import with `@import 'gel-ui/mixin/index.less';`.
- Use Less features (variables, mixins, nesting, guards, functions) when they improve reuse and readability.
- Do not use CSS `gap` (grid or flex). Use margins or spacing utilities instead.
- Use strict BEM naming: `block__element--modifier`. Keep blocks aligned to component/feature names.
- Prefer Wind UI CSS variables for colors, radii, spacing, shadows, etc.

```less
// CORRECT: nested BEM
.@{block} {
  &__element { }
  &__element-child { }
  &--modifier { }
}

// WRONG: flat BEM selectors
.@{block}__element { }
.@{block}--modifier { }
```

## Workflow (EN)
1. Check shared mixins first in `packages/gel-ui/src/styles/mixin/`; if a pattern exists, import and reuse it. If a pattern appears 2+ times across components, add a shared mixin and export it in `packages/gel-ui/src/styles/mixin/index.less`.
2. Define the BEM block and state modifiers first; map elements and variants.
3. Implement base styles, then modifiers; keep selectors shallow and scoped to the block.
4. Replace hardcoded values with Wind UI CSS variables from the reference; do not invent variable names. If no suitable variable exists, look up shared tokens in `packages/gel-ui/src/styles/shared/variables.less` and import them via `@import 'gel-ui/variables.less';`. If still missing, use a Less variable with a literal fallback (or a project-level CSS variable if defined).

## Variable Reference (EN)
- Load `reference/wind-ui-vars.css` for the authoritative CSS variable list.
- If the file is missing and precise variable names matter, ask the user to provide the reference.
- For shared Less tokens, check `packages/gel-ui/src/styles/shared/variables.less` and import with `@import 'gel-ui/variables.less';`.

## Spacing Without gap (EN)
- Preferred: use shared layout mixins from `packages/gel-ui/src/styles/mixin/` (import via `@import 'gel-ui/mixin/index.less';`).
- Manual fallback: `> * + * { margin-left: @space; }` or `margin-top` for vertical stacks.
- Use `:not(:last-child)` or `:not(:first-child)` when it improves clarity.

## Shared Mixins Reference (EN)
- Read `packages/gel-ui/src/styles/mixin/index.less` to see available mixins and their names.
- Add new shared mixins under `packages/gel-ui/src/styles/mixin/` and export them in `index.less`.

## Less + BEM Example (EN)
```less
@import 'gel-ui/variables.less';
@import 'gel-ui/mixin/index.less';

@block: wind-card;
@space-sm: 8px; // replace with shared token from variables.less when available
@space-md: 12px; // replace with shared token from variables.less when available

.@{block} {
  .vertical-stack(@space-md); // use actual shared mixin name from gel-ui/mixin
  padding: @space-md;
  color: var(--font-color-2, #333);
  background: var(--card-bg, #fff);
  border: 1px solid var(--border-color-split);
  box-shadow: var(--shadow-normal);

  &__header {
    .horizontal-stack(@space-sm); // use actual shared mixin name from gel-ui/mixin
  }

  &--compact {
    padding: @space-sm;
  }
}
```
