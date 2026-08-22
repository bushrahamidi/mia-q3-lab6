import isOverdue from '../overdue';

describe('isOverdue', () => {
  it('returns false when the todo has no due date', () => {
    expect(isOverdue({ dueDate: null, completed: 0 }, new Date(2026, 7, 22))).toBe(false);
    expect(isOverdue({ dueDate: undefined, completed: 0 }, new Date(2026, 7, 22))).toBe(false);
  });

  it('returns false for a completed todo with a past due date', () => {
    const todo = { dueDate: '2026-08-01', completed: 1 };
    expect(isOverdue(todo, new Date(2026, 7, 22))).toBe(false);
  });

  it('returns true for an incomplete todo with a past due date', () => {
    const todo = { dueDate: '2026-08-01', completed: 0 };
    expect(isOverdue(todo, new Date(2026, 7, 22))).toBe(true);
  });

  it('returns false for an incomplete todo due today', () => {
    const todo = { dueDate: '2026-08-22', completed: 0 };
    expect(isOverdue(todo, new Date(2026, 7, 22))).toBe(false);
  });

  it('returns false for an incomplete todo due in the future', () => {
    const todo = { dueDate: '2026-08-23', completed: 0 };
    expect(isOverdue(todo, new Date(2026, 7, 22))).toBe(false);
  });

  it('treats a completed boolean true the same as completed 1', () => {
    const todo = { dueDate: '2026-08-01', completed: true };
    expect(isOverdue(todo, new Date(2026, 7, 22))).toBe(false);
  });

  it('does not throw and treats missing fields as not overdue', () => {
    expect(isOverdue({}, new Date(2026, 7, 22))).toBe(false);
  });

  it('is not overdue when evaluated against its due date, but becomes overdue the next calendar day', () => {
    const todo = { dueDate: '2026-08-22', completed: 0 };
    expect(isOverdue(todo, new Date(2026, 7, 22))).toBe(false);
    expect(isOverdue(todo, new Date(2026, 7, 23))).toBe(true);
  });

  it('ignores time-of-day when comparing the reference date to the due date', () => {
    const todo = { dueDate: '2026-08-22', completed: 0 };
    expect(isOverdue(todo, new Date(2026, 7, 22, 23, 59))).toBe(false);
  });
});
