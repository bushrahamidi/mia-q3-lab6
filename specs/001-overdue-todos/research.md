# Phase 0 Research: Support for Overdue Todo Items

All items from the feature spec were already resolved during `/speckit-clarify`
(see spec.md "Clarifications"), so no `NEEDS CLARIFICATION` markers remain in
the Technical Context. The research below covers the remaining implementation
decisions needed before design.

## Decision 1: Where overdue determination lives

- **Decision**: Implement a pure, framework-free function
  `isOverdue(todo, referenceDate = new Date())` in a new
  `packages/frontend/src/utils/overdue.js` module, returning a boolean.
- **Rationale**: FR-008 requires the determination to be "reusable and
  independently testable." A pure utility can be unit-tested directly
  (no rendering) and imported by both the list card and the inline edit
  form, avoiding duplicated date logic. No backend change is needed because
  `dueDate` and `completed` are already present on every todo returned by
  the existing API.
- **Alternatives considered**:
  - *Compute overdue in the backend (SQL/service layer)*: rejected — adds
    an API/response-shape change and a persistence-adjacent concept for a
    value that must never be stored (spec explicitly calls it derived,
    non-persisted), and re-derivation on every list fetch is unnecessary
    since the frontend already re-renders on data change.
  - *Inline the date comparison directly inside `TodoCard`*: rejected —
    harder to unit test in isolation and would duplicate logic between the
    list view and the edit-mode badge.
  - *Add a date library (date-fns/moment)*: rejected — native `Date` is
    sufficient for a calendar-day comparison and avoids a new dependency
    (Constitution III: prefer the simplest solution).

## Decision 2: Calendar-day comparison semantics

- **Decision**: Normalize both the todo's `dueDate` and the reference date to
  local calendar dates (strip time-of-day) before comparing; a todo is
  overdue only when `dueDate < today` (strictly before), never when equal.
- **Rationale**: Matches FR-001/FR-004 and the edge case "a due date exactly
  matching today ... is not overdue." Using local calendar date (not UTC or
  timestamp comparison) avoids off-by-one errors around midnight/timezone
  boundaries, consistent with the existing `formatDate` use of
  `toLocaleDateString`.
- **Alternatives considered**: Comparing raw `Date` objects/timestamps —
  rejected, since a due date stored as `YYYY-MM-DD` combined with a
  timestamp comparison could incorrectly flag "due today" as overdue
  depending on time-of-day.

## Decision 3: Visual indication approach

- **Decision**: Render a small text-plus-icon "Overdue" badge (not a
  color-only cue) on the todo card when overdue, using the existing
  `--danger-color` design token (already tuned per light/dark theme in
  `theme.css`) for the badge accent/border, and the same badge above the
  inline edit form's inputs when editing an overdue todo.
- **Rationale**: Constitution IV requires WCAG AA contrast and a
  distinguishable-in-both-themes indication; reusing `--danger-color` keeps
  it consistent with the existing danger/delete affordance instead of
  introducing a new palette entry. Pairing color with text/icon avoids
  relying on color alone (accessibility for color-blind users), satisfying
  FR-002.
- **Alternatives considered**:
  - *Solid red card background*: rejected — visually conflicts with the
    existing completed-state (strike-through, reduced opacity) styling and
    is more disruptive than necessary.
  - *Color-only left border with no text*: rejected — fails the non-color
    cue requirement.

## Decision 4: Re-evaluation timing (no stored state, no timers)

- **Decision**: Compute `isOverdue(...)` inline during render each time
  `TodoCard`/`TodoList` render, using `new Date()` at render time. No
  polling interval or timer is introduced.
- **Rationale**: FR-006 requires re-evaluation "whenever the todo list is
  displayed," which is satisfied by computing at render time; React already
  re-renders on mount, on toggle, and on edit (existing `App.js` state
  updates), which covers FR-007's "immediately" requirement. Adding a timer
  to flip status at midnight while a tab stays open is explicitly out of
  scope per Constitution III (avoid speculative complexity) and is not
  required by any acceptance scenario.
- **Alternatives considered**: `setInterval`/date-change polling — rejected
  as unnecessary complexity beyond what the spec requires.

**Output**: All Technical Context items are resolved; no open
`NEEDS CLARIFICATION` markers remain.
