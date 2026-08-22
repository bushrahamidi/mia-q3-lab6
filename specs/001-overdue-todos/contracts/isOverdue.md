# Contract: `isOverdue` Utility

This feature makes no changes to the backend HTTP API (no new/changed
routes, request bodies, or response shapes). The only "interface" this
feature introduces is an internal, reusable function contract consumed by
frontend components, documented here per FR-008 ("reusable and
independently testable").

## Module

`packages/frontend/src/utils/overdue.js`

## Function Signature

```js
/**
 * @param {{ dueDate: string|null, completed: number|boolean }} todo
 * @param {Date} [referenceDate] - defaults to `new Date()`
 * @returns {boolean}
 */
function isOverdue(todo, referenceDate = new Date())
```

## Behavior Contract

| `dueDate`            | `completed` | `referenceDate` vs `dueDate` | Result  |
|----------------------|-------------|------------------------------|---------|
| `null` / `undefined` | any         | n/a                          | `false` |
| past date            | truthy      | after                        | `false` |
| past date            | falsy       | after                        | `true`  |
| today                | falsy       | same calendar day            | `false` |
| future date          | falsy       | before                       | `false` |

- Comparison MUST use local calendar date only (time-of-day is ignored for
  both `dueDate` and `referenceDate`).
- MUST be a pure function: no side effects, no mutation of `todo`, no
  reliance on module-level or global state other than the injectable
  `referenceDate` parameter.
- MUST NOT throw for a `todo` missing `dueDate`/`completed`; treat missing
  `dueDate` as "no due date" (not overdue).

## Consumers

- `TodoCard.js`: calls `isOverdue(todo)` to decide whether to render the
  overdue badge in both the read-only card view and the inline edit form.

No other contracts (HTTP, CLI, etc.) are affected by this feature.
