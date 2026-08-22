# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-overdue-todos` | **Date**: 2026-08-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-overdue-todos/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Incomplete todos whose due date is before today must be visually flagged as
overdue in the todo list and while being edited. Overdue status is a derived,
non-persisted value computed at render time from each todo's existing
`dueDate` and `completed` fields compared against the current local calendar
date — no backend, schema, or API changes are required. The approach adds a
small, reusable/testable `isOverdue` utility in the frontend and a
theme-aware, non-color-reliant badge used by `TodoCard` (list view and inline
edit form).

## Technical Context

**Language/Version**: JavaScript (Node.js 18+), React 18.2

**Primary Dependencies**: React 18 (frontend, no new dependencies); Express.js
+ better-sqlite3 (backend, unaffected by this feature)

**Storage**: Existing SQLite (`better-sqlite3`) `todos` table; no schema
changes — `dueDate` and `completed` already exist and are sufficient to
derive overdue status

**Testing**: Jest + React Testing Library (frontend, `react-scripts test`);
Jest + Supertest (backend, unaffected)

**Target Platform**: Web browser (desktop-focused), served by the existing
Express API + React SPA

**Project Type**: Web application (existing `packages/frontend` +
`packages/backend` monorepo) — this feature only touches `packages/frontend`

**Performance Goals**: Negligible — overdue determination is a constant-time
comparison per todo, computed during normal list render with no polling or
timers

**Constraints**: No backend/API/schema changes; overdue MUST remain a
derived, non-persisted value; indication MUST meet WCAG AA contrast and MUST
NOT rely on color alone, in both light and dark themes (Constitution IV)

**Scale/Scope**: Single-user list of typically tens of todos; scope limited
to the display layer (`TodoCard`, `TodoList`, one new utility module, and
associated styles/tests) — no new screens or routes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Code Quality & Consistency**: PASS. New logic is a single-purpose
  `isOverdue` utility (camelCase, colocated tests); no changes to import
  order or existing conventions.
- **II. Test-First Coverage**: PASS (planned). New utility gets a colocated
  `__tests__/overdue.test.js`; `TodoCard`/`TodoList` existing tests are
  extended to cover the acceptance scenarios (overdue, completed-past-due,
  today-due, future-due, undated, edit-mode badge).
- **III. Simplicity & Single Responsibility**: PASS. Stays within the
  existing todo model; no new fields, sorting, filtering, or persistence
  added; overdue is computed, not stored.
- **IV. User Experience Consistency**: PASS (planned). Badge reuses the
  existing `--danger-color` token from `theme.css` plus a text/icon cue (not
  color-only), keyboard/no-interaction-required, no new confirmation flow
  needed since this is a passive indicator.
- **V. Persisted, Single-User Data Integrity**: PASS. No new persisted
  state; existing create/update/toggle persistence flows are unchanged, so
  overdue status is always recomputed from the current stored `dueDate` and
  `completed` values.

No violations identified. Complexity Tracking table below is not applicable.

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todos/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
backend/
└── (unchanged — no backend work for this feature)

frontend/
├── src/
│   ├── components/
│   │   ├── TodoCard.js         # add overdue badge (list + inline edit form)
│   │   ├── TodoList.js         # unchanged pass-through, still verified by tests
│   │   └── __tests__/
│   │       └── TodoCard.test.js  # extend with overdue acceptance scenarios
│   ├── utils/                  # NEW directory
│   │   ├── overdue.js           # NEW: isOverdue(todo, referenceDate) pure function
│   │   └── __tests__/
│   │       └── overdue.test.js  # NEW: unit tests for determination logic
│   └── styles/
│       └── theme.css            # add badge styles reusing --danger-color tokens
```

**Structure Decision**: Existing Option 2 (web application) structure is
reused as-is. This feature is additive and confined to
`packages/frontend/src`: a new `utils/overdue.js` module (with colocated
tests) holds the reusable/testable overdue-determination logic (FR-008), and
`TodoCard.js` consumes it to render the badge in both the list view and the
inline edit form. `packages/backend` is untouched since `dueDate` and
`completed` are already returned by the existing API.

## Complexity Tracking

*No violations identified — this section is not applicable.*
