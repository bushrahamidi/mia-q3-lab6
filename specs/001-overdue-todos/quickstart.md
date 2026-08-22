# Quickstart: Validate Overdue Todo Indication

## Prerequisites

- Node.js 18+, repo dependencies installed (`npm run install:all` from repo
  root if not already done).

## Automated Validation

Run the frontend test suite, which covers the `isOverdue` utility and its
usage in `TodoCard`:

```bash
npm run test:frontend
```

Expected: all tests pass, including new/updated tests for:

- `packages/frontend/src/utils/__tests__/overdue.test.js` — unit coverage of
  the five acceptance scenarios in User Story 1 (overdue, completed-past-due,
  due-today, future-due, undated) plus the "day rolls over" scenario from
  User Story 2.
- `packages/frontend/src/components/__tests__/TodoCard.test.js` — renders the
  overdue badge only for incomplete past-due todos, confirms it disappears
  after toggling complete or editing the due date, and confirms the badge
  appears above the inline edit form's inputs (User Story 3).

Run the full test suite (frontend + backend) to confirm no regressions:

```bash
npm test
```

## Manual Validation

1. Start the app: `npm start` (serves both backend and frontend).
2. Create todos covering each case:
   - Title "Past due", due date = yesterday → should show the overdue badge.
   - Title "Due today", due date = today → should NOT show the badge.
   - Title "Future", due date = tomorrow → should NOT show the badge.
   - Title "No date", no due date → should NOT show the badge.
3. Mark "Past due" complete → badge disappears immediately.
4. Uncheck it again, then edit its due date to today or a future date →
   badge disappears immediately.
5. Edit an overdue todo (open inline edit form) → confirm the small overdue
   badge/label appears above the title/due-date inputs while editing.
6. Toggle dark/light theme → confirm the badge remains legible and
   distinguishable (not color-only) in both modes.

## Expected Outcome

All scenarios from spec.md's Acceptance Scenarios (User Stories 1–3) and
Edge Cases hold, with no backend changes required and no stored data
mutated by the overdue indication itself.
