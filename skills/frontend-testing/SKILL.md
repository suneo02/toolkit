---
name: frontend-testing
description: Workflow and standards for React frontend testing, covering writing/generating/adding/refactoring tests, coverage analysis, and test review reports. Default stack is React Testing Library + Vitest; use Jest only when needed; include Storybook interaction tests and MSW API mocks when relevant.
---

# Frontend Testing

## Overview

This skill helps write, fix, and review high-quality test cases in React projects, emphasizing maintainability, stability, and readability.

## Workflow (Trim as Needed)

### 1. Identify Constraints and Current State

- Confirm the test framework: prefer Vitest; if the project already uses Jest, follow existing config.
- Locate test setup and utilities: `setupTests`/`vitest.setup`, custom `render`, test helpers.
- Check whether MSW and Storybook testing are in place; reuse if available.
- Follow project standards: TypeScript forbids `any`; exported functions/components must have Chinese JSDoc; any necessary type assertions must be justified.
- If code and docs must cross-reference, use bidirectional `@see`.

### 2. Design the Test Plan

- Clarify level: unit/component/integration. Prioritize core paths and high-risk logic.
- Case structure: main path, edge cases, error/empty states, permission and fallback behavior.
- Avoid coupling to implementation details; test user-visible behavior and rendered output.

### 3. Write or Extend Tests

- Prefer React Testing Library queries: `role/label/text`; use `data-testid` only when necessary.
- Use `user-event` for interactions; `findBy`/`waitFor` for async rendering.
- API mocks: prefer MSW; use module-level mocks (`vi.mock`/`jest.mock`) only when hard to cover.
- For complex containers/pages, verify error fallback views in abnormal states (use ErrorBoundary when needed).

### 4. Fix/Refactor/Improve Tests

- Find flakiness sources: async timing, timers, random data, external deps.
- Normalize waits: avoid raw `setTimeout`; use `waitFor`/`findBy`.
- Refactor to preserve intent: test names and assertions should describe business behavior, not implementation details.

### 5. Coverage Analysis and Test Review Report

- Run coverage and mark gaps: focus on core logic and branch coverage.
- Output a review report including: requirement coverage, production risk, change scope, conventions compliance, recommendations, and TODOs.

## Common Task Guides

### Write/Generate Tests

- Collect: target component/module, dependent APIs, business rules.
- Draft case list first, then implement tests.
- If Storybook exists, reuse stories as test baselines.

### Add/Fix Tests

- Align failure causes with business expectations; fix assertions and wait strategy first.
- If a component lacks test hooks, add minimal `aria-*` or `data-testid`.

### Refactor/Improve Tests

- Merge duplicate setup; extract test utilities (Chinese JSDoc required).
- Reduce internal-implementation mocks; prefer UI-driven behavior.

### Analyze Coverage / Write Review Report

- Focus coverage gaps on key paths, permission/exception flows, and branch logic.
- Report essentials: issue list, risk level, recommended order of fixes.

## Language Requirements

- Documentation outputs and review reports must be written in Chinese.
- Code comments and JSDoc must be written in Chinese.

## References (Load as Needed)

- `references/rtl.md`: RTL query priority, async patterns, and user interaction.
- `references/vitest.md`: Vitest config, mocks, timers, and coverage.
- `references/jest.md`: Jest differences and migration notes.
- `references/storybook.md`: Storybook interaction testing and story reuse.
- `references/msw.md`: MSW setup and examples in tests.
