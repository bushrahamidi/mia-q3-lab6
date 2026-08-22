# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `002-overdue-todos`

**Created**: 2026-08-22

**Status**: Draft

**Input**: User description: "Support for Overdue Todo Items - Users need a clear, visual way to identify which todos have not been completed by their due date, so they can prioritize their work and quickly see which tasks are past their due date without manually checking dates against today's date. Must include automated tests covering the overdue determination logic and its display, following existing Jest patterns."

## Clarifications

### Session 2026-08-22

- Q: How should the overdue indication be shown while a todo is in inline edit mode? → A: Add a small overdue badge/label above the edit form's input fields

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See overdue todos at a glance (Priority: P1)

As a todo application user, I want incomplete todos whose due date has passed to be visually distinguished from other todos, so I can immediately identify tasks that need attention without comparing dates manually.

**Why this priority**: This is the core user value and provides a complete, independently useful feature.

**Independent Test**: Display a list containing incomplete past-due todos, completed past-due todos, today-due todos, future-due todos, and undated todos. Verify that only incomplete past-due todos receive the overdue indication.

**Acceptance Scenarios**:

1. **Given** an incomplete todo with a due date before today, **When** the todo list is displayed, **Then** the todo is visibly marked as overdue.
2. **Given** a completed todo with a due date before today, **When** the todo list is displayed, **Then** the todo is not marked as overdue.
3. **Given** a todo with a due date of today, **When** the todo list is displayed, **Then** the todo is not marked as overdue.
4. **Given** a todo with a due date in the future, **When** the todo list is displayed, **Then** the todo is not marked as overdue.
5. **Given** a todo without a due date, **When** the todo list is displayed, **Then** the todo is not marked as overdue.

---

### User Story 2 - Keep overdue status current (Priority: P2)

As a todo application user, I want overdue status to be evaluated using the current date, so a todo becomes overdue on the day after its due date without requiring me to edit it.

**Why this priority**: Derived status must remain correct as time passes and as the todo changes.

**Independent Test**: Evaluate a todo due today against today’s date and then against the following date. Verify that its overdue status changes from false to true while the todo remains incomplete.

**Acceptance Scenarios**:

1. **Given** an incomplete todo due today, **When** the current date advances to the next day and the list is displayed, **Then** the todo is marked as overdue.
2. **Given** an overdue todo, **When** the user marks it complete, **Then** the overdue indication is removed immediately.
3. **Given** an overdue todo, **When** the user changes its due date to today, a future date, or no date, **Then** the overdue indication is removed immediately.

---

### User Story 3 - See overdue status while editing (Priority: P3)

As a todo application user, I want an overdue todo to remain identifiable while I edit it, so its status is clear throughout the interaction.

**Why this priority**: Consistent status visibility improves editing confidence after the core list experience is delivered.

**Independent Test**: Open an incomplete past-due todo in its editable context and verify that a small overdue badge/label appears above the edit form's input fields.

**Acceptance Scenarios**:

1. **Given** an incomplete overdue todo, **When** the user opens it for editing, **Then** a small overdue badge/label is displayed above the edit form's input fields.

### Edge Cases

- A due date exactly matching today in the user’s local time zone is not overdue; overdue begins on the following calendar day.
- A completed todo with a past due date is not overdue.
- A todo without a due date is never overdue.
- Changing an overdue todo’s due date to today, a future date, or no date removes the indication immediately.
- Re-evaluating the same incomplete todo on a later calendar date updates its status without changing the stored todo data.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST determine a todo to be overdue if and only if it has a due date, the due date is strictly before the current local calendar date, and the todo is incomplete.
- **FR-002**: The system MUST visually distinguish overdue todos from non-overdue todos in the todo list using an indication that remains distinguishable in supported light and dark display modes and meets WCAG AA contrast requirements.
- **FR-003**: The system MUST NOT mark a todo as overdue when it has no due date.
- **FR-004**: The system MUST NOT mark a todo as overdue when its due date is today or later.
- **FR-005**: The system MUST NOT mark a completed todo as overdue, even when its due date has passed.
- **FR-006**: The system MUST re-evaluate overdue status from the current local calendar date whenever the todo list is displayed, without requiring stored todo data to change.
- **FR-007**: The system MUST remove the overdue indication immediately when a previously overdue todo is completed or its due date is changed to today, a future date, or no date.
- **FR-008**: The overdue determination MUST be reusable and independently testable, and automated tests MUST cover both the determination behavior and its visual display across the acceptance scenarios.
- **FR-009**: The system MUST display a small overdue badge/label above the edit form's input fields when an incomplete, overdue todo is opened for inline editing.

### Key Entities

- **Todo**: The existing task record with an optional due date and completion status. Overdue is a derived, non-persisted state calculated from these values and the current local calendar date.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify every overdue todo in the displayed list within 2 seconds without manually comparing dates.
- **SC-002**: Automated tests verify that 100% of incomplete todos with due dates before the current local calendar date are visually indicated as overdue.
- **SC-003**: Automated tests verify a 0% false-positive rate for completed, today-due, future-due, and undated todos.
- **SC-004**: After completion or due-date editing, the displayed overdue indication reflects the new state on the next rendered view with no stale indication.

## Assumptions

- Overdue status uses the user’s local calendar date, from midnight to midnight; a todo due today is not overdue.
- Overdue is derived at display time and is not stored as a new todo field.
- The visual indication reuses the existing danger color token while also providing a non-color cue where needed for accessibility.
- This feature applies to the existing single-user todo list and does not add sorting, filtering, notifications, reminders, authentication, or multi-user behavior.
- Existing todo date parsing and display conventions remain the source of truth for valid due dates.
