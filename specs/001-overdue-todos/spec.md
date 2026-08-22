# Support for Overdue Todo Items

## User Story

**As a** todo application user
**I want to** easily identify and distinguish overdue tasks in my todo list
**So that** I can prioritize my work and quickly see which tasks are past their due date

## Description

Users need a clear, visual way to identify which todos have not been completed by their due date. This helps users quickly spot overdue items without having to manually check dates against today's date.

## Requirements

### Functional Requirements

1. The application shall display a visual indicator on todo items whose due date is in the past and that have not been completed.
2. A todo item is considered overdue if its due date is strictly before today's date (midnight local time) and its status is not complete.
3. The overdue indicator shall be visually distinct from normal todo items (e.g., a badge, icon, or color change).
4. Overdue items shall remain in their original position in the list and shall not be reordered or filtered out.
5. Completed todo items shall never display an overdue indicator, even if their due date is in the past.

### Non-Functional Requirements

1. The overdue determination logic shall be covered by automated unit tests following the existing Jest patterns in the repository.
2. Display of the overdue indicator shall be covered by automated tests.

## Acceptance Criteria

- Given a todo item with a due date in the past and status not complete, when the todo list is rendered, then an overdue indicator is visible on that item.
- Given a todo item with a due date in the past and status complete, when the todo list is rendered, then no overdue indicator is shown.
- Given a todo item with a due date today or in the future, when the todo list is rendered, then no overdue indicator is shown.
- Given a todo item with no due date, when the todo list is rendered, then no overdue indicator is shown.

## Testing

This feature must include automated tests covering the overdue determination logic and its display, following the existing Jest patterns in the repository.

## Clarifications

### Session 2026-08-22

- **Overdue boundary**: A todo item is overdue if its due date is strictly before today's date at midnight local time. Items due today are not overdue.
- **Visual indicator**: The overdue indicator is a text badge (e.g., "Overdue") or icon displayed inline with the todo item title, using a distinct color (e.g., red) to draw attention.
- **Ordering**: Overdue items remain in their original list order; they are not moved to the top or filtered into a separate section.
- **Completed items**: Completed todo items never show an overdue indicator, regardless of their due date.
- **Items without due dates**: Todo items that have no due date set are never considered overdue.
