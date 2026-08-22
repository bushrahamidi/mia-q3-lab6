/**
 * Determine whether a todo is overdue.
 *
 * A todo is overdue when it has a due date, that due date is strictly
 * before the current local calendar date, and the todo is not completed.
 * Comparison ignores time-of-day (local calendar date only) and this
 * function is pure: it never mutates `todo` and has no side effects.
 *
 * @param {{ dueDate: string|null|undefined, completed: number|boolean }} todo
 * @param {Date} [referenceDate] - defaults to `new Date()`
 * @returns {boolean}
 */
function isOverdue(todo, referenceDate = new Date()) {
  if (!todo || !todo.dueDate) {
    return false;
  }

  if (todo.completed === true || todo.completed === 1) {
    return false;
  }

  const dueDate = parseLocalDate(todo.dueDate);
  const today = toLocalDateOnly(referenceDate);

  return dueDate < today;
}

// Parses a `YYYY-MM-DD` string as a local date (avoids UTC off-by-one shifts).
function parseLocalDate(dueDateString) {
  const [year, month, day] = dueDateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function toLocalDateOnly(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export default isOverdue;
