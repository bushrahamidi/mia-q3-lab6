---

description: "Task list for Support for Overdue Todo Items"
---

# Tasks: Support for Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todos/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/isOverdue.md, quickstart.md

**Tests**: Included — the spec explicitly requires automated tests covering the overdue determination logic and its display (FR-008), so test tasks are part of each user story phase.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. All work is confined to `packages/frontend/src` — no backend changes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Web app monorepo: `packages/frontend/src/`, `packages/backend/src/`
- This feature only touches `packages/frontend/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the new module location for the overdue utility

- [X] T001 Create `packages/frontend/src/utils/` directory with a `__tests__/` subfolder (new location for the derived-overdue utility; no other project init or new dependencies are needed since this feature adds no libraries)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The `isOverdue` pure function is consumed by every user story (list badge, edit-mode badge, re-evaluation behavior) and MUST exist before any story's UI work begins

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 [P] Write unit tests for `isOverdue` in `packages/frontend/src/utils/__tests__/overdue.test.js` covering the contract table from [contracts/isOverdue.md](./contracts/isOverdue.md): no due date → false, past date + completed → false, past date + incomplete → true, due today + incomplete → false, future date + incomplete → false
- [X] T003 Implement `isOverdue(todo, referenceDate = new Date())` as a pure function in `packages/frontend/src/utils/overdue.js` per the contract (local calendar-date comparison, no mutation, no throw on missing fields) (depends on T002 to define expected behavior; makes T002 pass)

**Checkpoint**: Foundation ready — `isOverdue` is implemented and unit-tested; user story implementation can now begin

---

## Phase 3: User Story 1 - See overdue todos at a glance (Priority: P1) 🎯 MVP

**Goal**: Incomplete todos with a past due date are visually distinguished in the todo list, while completed, today-due, future-due, and undated todos are not

**Independent Test**: Render a list with incomplete past-due, completed past-due, today-due, future-due, and undated todos; verify only the incomplete past-due todo shows the overdue indication

### Tests for User Story 1

- [X] T004 [P] [US1] Extend `packages/frontend/src/components/__tests__/TodoCard.test.js` with read-only card view assertions: overdue badge renders for an incomplete past-due todo, and does NOT render for a completed past-due, today-due, future-due, or undated todo

### Implementation for User Story 1

- [X] T005 [US1] Import `isOverdue` and conditionally render an "Overdue" badge in the read-only card view of `packages/frontend/src/components/TodoCard.js` (depends on T003)
- [X] T006 [US1] Add overdue badge styles reusing the existing `--danger-color` token, with a text/icon cue (not color-only) and WCAG AA contrast in both light and dark themes (implemented in `packages/frontend/src/App.css` alongside the other `.todo-card` component styles, matching existing convention, rather than `theme.css` which holds only design tokens)

**Checkpoint**: User Story 1 is fully functional and independently testable — this is the shippable MVP

---

## Phase 4: User Story 2 - Keep overdue status current (Priority: P2)

**Goal**: Overdue status is always derived from the current date and the todo's live `completed`/`dueDate` values, with no stale indication after a toggle, edit, or day rollover

**Independent Test**: Evaluate a todo due today against today's date and then against the following date, verifying overdue flips from false to true; verify toggling complete or editing the due date removes the badge immediately

### Tests for User Story 2

- [X] T007 [P] [US2] Add day-rollover tests to `packages/frontend/src/utils/__tests__/overdue.test.js`: a todo due "today" is not overdue against that date but becomes overdue when `referenceDate` advances to the next calendar day
- [X] T008 [P] [US2] Add tests to `packages/frontend/src/components/__tests__/TodoCard.test.js` verifying the overdue badge disappears immediately after toggling an overdue todo complete, and after editing its due date to today, a future date, or no date

### Implementation for User Story 2

- [X] T009 [US2] Verify `TodoCard.js` re-renders overdue state immediately from its existing `onToggle`/`onEdit` state flow (no stored overdue field, no timers); adjust only if T007/T008 reveal a gap in `packages/frontend/src/components/TodoCard.js` (verified via T008 — no gap found, `isOverdue(todo)` is recomputed on every render from props with no stored state)

**Checkpoint**: User Stories 1 and 2 both work independently — overdue status never goes stale

---

## Phase 5: User Story 3 - See overdue status while editing (Priority: P3)

**Goal**: An incomplete, overdue todo shows a small overdue badge/label above the inline edit form's input fields

**Independent Test**: Open an incomplete past-due todo for editing and verify the overdue badge appears above the title/due-date inputs

### Tests for User Story 3

- [X] T010 [P] [US3] Add a test to `packages/frontend/src/components/__tests__/TodoCard.test.js` confirming the overdue badge renders above the edit form's title/due-date inputs when an incomplete, overdue todo is opened for inline editing, and does not render when editing a non-overdue todo

### Implementation for User Story 3

- [X] T011 [US3] Render the overdue badge above the edit-form inputs in the `isEditing` branch of `packages/frontend/src/components/TodoCard.js`, reusing the badge markup/styles from T005/T006

**Checkpoint**: All user stories are independently functional — overdue is visible in both list and edit views and stays current

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all stories

- [X] T012 [P] Run `npm run test:frontend` and `npm test` from repo root; fix any regressions across `packages/frontend/src/utils/__tests__/overdue.test.js` and `packages/frontend/src/components/__tests__/TodoCard.test.js` (70 frontend + 27 backend tests pass, no regressions; verified badge text/border contrast against WCAG AA in both themes)
- [ ] T013 [P] Perform the manual validation steps in [quickstart.md](./quickstart.md), including toggling dark/light theme to confirm the badge remains legible and non-color-only in both (requires a human running the app in a browser — not automatable in this session; see Completion Report for guidance)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion only
- **User Story 2 (Phase 4)**: Depends on Foundational completion; its `TodoCard.js` checks build on the badge added in US1 (T005), so implement after US1's T005 lands
- **User Story 3 (Phase 5)**: Depends on Foundational completion; reuses badge markup/styles from US1 (T005/T006), so implement after US1
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories — deliverable as a standalone MVP
- **User Story 2 (P2)**: Logically independent (tests `isOverdue`'s date behavior and re-render timing), but its `TodoCard.js` assertions assume the badge from US1 exists
- **User Story 3 (P3)**: Logically independent (edit-mode badge), but shares the same `TodoCard.js` file as US1/US2 — implement sequentially to avoid edit conflicts even though the code paths (read view vs. edit view) don't overlap

### Within Each User Story

- Tests are written before/alongside implementation and should fail until the corresponding implementation task lands
- Foundational utility (T003) before any story's implementation
- Story complete and checkpoint validated before moving to the next priority

### Parallel Opportunities

- T002 (foundational tests) can be written in parallel with T001 (directory setup)
- T004, T007, T008, T010 (test-writing tasks across different assertions) can be drafted in parallel since they add independent test cases, but converge on the same two test files, so coordinate merges
- T012 and T013 (final validation) can run in parallel

---

## Parallel Example: Foundational Phase

```bash
Task: "Write unit tests for isOverdue in packages/frontend/src/utils/__tests__/overdue.test.js"
Task: "Create packages/frontend/src/utils/ directory with __tests__/ subfolder"
```

## Parallel Example: User Story 1

```bash
Task: "Extend TodoCard.test.js with read-only card view overdue assertions"
Task: "Add overdue badge styles to theme.css reusing --danger-color"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (T002-T003) — CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1 (T004-T006)
4. **STOP and VALIDATE**: Run `npm run test:frontend` and manually confirm the badge in the list view per quickstart.md
5. Deploy/demo the MVP if ready

### Incremental Delivery

1. Setup + Foundational → `isOverdue` exists and is fully unit-tested
2. Add User Story 1 → test independently → MVP badge in the list view
3. Add User Story 2 → test independently → confirm status never goes stale (toggle, edit, day rollover)
4. Add User Story 3 → test independently → confirm badge shows above edit-form inputs
5. Polish phase → full regression run + manual quickstart validation
