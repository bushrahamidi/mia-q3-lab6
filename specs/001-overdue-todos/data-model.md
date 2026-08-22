# Data Model: Support for Overdue Todo Items

No new persisted entities or fields are introduced by this feature. It adds
one derived (non-persisted) concept computed from the existing `Todo` entity.

## Todo (existing, unchanged)

Source of truth: `packages/backend` SQLite `todos` table, returned as-is by
the existing API and consumed by the frontend.

| Field       | Type              | Notes                                             |
|-------------|-------------------|----------------------------------------------------|
| `id`        | number            | Primary key (unchanged)                            |
| `title`     | string, ≤255 chars| Required (unchanged)                               |
| `dueDate`   | string (`YYYY-MM-DD`) or `null` | Optional (unchanged)                 |
| `completed` | 0 or 1            | Completion flag (unchanged)                        |
| `createdAt` | string (timestamp)| Used for list ordering (unchanged)                 |

No changes to columns, validation, or API request/response shapes.

## Derived Value: Overdue (new, not persisted)

| Field       | Type    | Computed as                                                                 |
|-------------|---------|-------------------------------------------------------------------------------|
| `isOverdue` | boolean | `todo.completed !== true/1 && todo.dueDate != null && localCalendarDate(todo.dueDate) < localCalendarDate(referenceDate)` |

- **Inputs**: the existing `dueDate` and `completed` fields of a single
  `Todo`, plus an implicit/injectable reference date (defaults to
  `new Date()` at call time for testability).
- **Lifecycle**: recomputed on every render; never written to the database,
  never included in create/update request payloads, never returned by the
  API.
- **Validation rules** (from spec FR-001 through FR-005):
  - No `dueDate` → never overdue.
  - `dueDate` is today or later (local calendar date) → not overdue.
  - `completed` is truthy → never overdue, regardless of `dueDate`.
  - `dueDate` strictly before today (local calendar date) and `completed`
    is falsy → overdue.
- **State transitions**: Not a stored state machine — `isOverdue` simply
  re-evaluates to `false`/`true` each render based on current `completed`/
  `dueDate` values and the current date. Toggling completion or editing
  `dueDate` changes the *inputs*, which changes the *derived* result on the
  next render; there is no independent transition to manage.

## Relationships

None added. `isOverdue` is a pure function of a single `Todo` record and the
current date; it does not reference other todos or entities.
