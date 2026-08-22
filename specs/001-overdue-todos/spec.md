# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todos`

**Created**: 2026-08-22

**Status**: Draft

**Input**: User description: "Support for Overdue Todo Items - Users need a clear, visual way to identify which todos have not been completed by their due date, so they can prioritize their work and quickly see which tasks are past their due date without manually checking dates against today's date. Must include automated tests covering the overdue determination logic and its display, following existing Jest patterns."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See overdue todos at a glance (Priority: P1)

As a todo application user, when I view my todo list, I want incomplete todos whose due date has already passed to be visually distinguished from other todos, so I can immediately tell which tasks need urgent attention without comparing dates myself.

**Why this priority**: This is the core value of the feature — without a visible overdue indicator, the rest of the feature has no user-facing effect. It is also independently deployable and testable on its own.

**Independent Test**: Seed the list with a mix of todos (some with past due dates and incomplete, some with future due dates, some with no due date, some completed but with past due dates). Load the todo list and verify only the incomplete + past-due items show the overdue indicator.

**Acceptance Scenarios**:

1. **Given** a todo with a due date earlier than today and status incomplete, **When** the todo list is displayed, **Then** that todo is visually marked as overdue (e.g., distinct label/color/icon).
2. **Given** a todo with a due date earlier than today but marked complete, **When** the todo list is displayed, **Then** that todo is NOT marked as overdue.
3. **Given** a todo with a due date of today, **When** the todo list is displayed, **Then** that todo is NOT marked as overdue (it is still due today, not past due).
4. **Given** a todo with a due date in the future, **When** the todo list is displayed, **Then** that todo is NOT marked as overdue.
5. **Given** a todo with no due date set, **When** the todo list is displayed, **Then** that todo is NOT marked as overdue.

---

### User Story 2 - Overdue status updates as time passes (Priority: P2)

As a todo application user, I want a todo's overdue status to be evaluated dynamically (based on the current date), so that a todo automatically becomes marked overdue the day after its due date passes, without me needing to edit it.

**Why this priority**: Reinforces that overdue status is derived, not stored, so it stays correct over time; this is a natural extension of User Story 1 and depends on the same determination logic already being in place.

**Independent Test**: Take a todo due "today" and verify it is not overdue; simulate the passage of one day (advance the reference date used by the determination logic) and verify the same todo is now marked overdue.

**Acceptance Scenarios**:

1. **Given** a todo due on the current date, **When** the current date advances past the due date and the todo remains incomplete, **Then** the todo becomes marked as overdue on next display without any user edit to the todo itself.
2. **Given** a todo marked overdue, **When** the user marks it complete, **Then** the overdue indicator is immediately removed.

---

### User Story 3 - Distinguish overdue todos while editing (Priority: P3)

As a todo application user, I want to still see the overdue indicator (or an equivalent visual cue) when a todo is shown in an editable/detail context, so overdue status remains clear throughout my interaction with a todo, not only in the list view.

**Why this priority**: Nice-to-have consistency improvement; the primary value is already delivered by User Story 1, and most users primarily scan the list view.

**Independent Test**: Open a past-due, incomplete todo for editing and verify the overdue cue is still visible in that view.

**Acceptance Scenarios**:

1. **Given** an overdue todo, **When** the user opens it for editing, **Then** the overdue indicator remains visible in the edit view.

---

### Edge Cases

- What happens when a todo's due date is exactly "today" in the user's local time zone? It is treated as not yet overdue (only becomes overdue starting the day after).
- How does the system handle a todo whose due date is changed from the past to the future (or removed) while overdue? The overdue indicator MUST disappear immediately since it is derived, not stored.
- How does the system handle a todo with no due date at all? It is never eligible to be marked overdue.
- How does the system handle a completed todo whose due date is in the past? It MUST NOT show the overdue indicator, since only incomplete todos can be overdue.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST determine a todo to be "overdue" when, and only when, it has a due date set, that due date is strictly earlier than the current date, and the todo is not marked complete.
- **FR-002**: System MUST visually distinguish overdue todos from non-overdue todos in the todo list (e.g., a distinct label, color, or icon), in a way that meets WCAG AA contrast requirements per existing UI guidelines.
- **FR-003**: System MUST NOT mark a todo as overdue if it has no due date.
- **FR-004**: System MUST NOT mark a todo as overdue if its due date is today or later.
- **FR-005**: System MUST NOT mark a todo as overdue if it is already marked complete, even if its due date has passed.
- **FR-006**: System MUST re-evaluate overdue status based on the current date every time the todo list is rendered, without requiring the stored todo data to change.
- **FR-007**: System MUST remove the overdue indicator immediately when a previously overdue todo is marked complete, or when its due date is edited to today or a future date, or removed.
- **FR-008**: The overdue determination logic MUST be implemented as a reusable, independently testable unit (e.g., a pure function) rather than duplicated inline wherever overdue status is displayed.

### Key Entities

- **Todo**: Existing entity representing a task; relevant existing attributes for this feature are the due date (optional) and completion status. This feature adds a derived, non-persisted "overdue" state computed from those two attributes and the current date — no new stored fields are introduced.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify all overdue todos in their list within 2 seconds of the list loading, without checking any date manually.
- **SC-002**: 100% of incomplete todos with a due date in the past are visually flagged as overdue, verified by automated tests.
- **SC-003**: 0% of completed todos, future-dated todos, or todos without a due date are incorrectly flagged as overdue, verified by automated tests.
- **SC-004**: Overdue status reflects the current date on every view with no stale indicators after a todo is completed or edited.

## Assumptions

- "Overdue" is defined relative to the user's local calendar date (midnight-to-midnight), consistent with how due dates are already displayed elsewhere in the app; a todo due "today" is not yet overdue.
- Overdue status is a derived/computed value, not a new persisted field on the todo record, consistent with the constitution's simplicity principle and the existing data model.
- The visual indicator reuses the existing design system's "Danger" color token (per `docs/ui-guidelines.md`) rather than introducing a new color, to stay consistent with the established palette.
- This feature applies only to the existing single-user todo list scope; no new sorting, filtering, or notification behavior is introduced (out of scope per `docs/functional-requirements.md`).
