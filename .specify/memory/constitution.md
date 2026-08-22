<!--
Sync Impact Report
- Version change: [TEMPLATE] → 1.0.0 (initial ratification)
- Modified principles: n/a (first concrete adoption of all 5 principle slots)
- Added sections:
  - Core Principles I-V (Code Quality & Consistency, Test-First Coverage,
    Simplicity & Single Responsibility, User Experience Consistency,
    Persisted Single-User Data Integrity)
  - Technology Stack & Architecture
  - Development Workflow & Quality Gates
  - Governance
- Removed sections: none (template placeholders replaced)
- Templates requiring updates:
  - .specify/templates/plan-template.md ⚠ pending manual review (verify
    Constitution Check gates reference these 5 principles)
  - .specify/templates/spec-template.md ✅ no principle-specific references
  - .specify/templates/tasks-template.md ✅ no principle-specific references
- Follow-up TODOs: none
-->

# Todo App Constitution

## Core Principles

### I. Code Quality & Consistency
All code MUST follow the conventions defined in `docs/coding-guidelines.md`:
2-space indentation, `camelCase` for variables/functions, `UPPER_SNAKE_CASE`
for constants, and `PascalCase` for React components and classes. Imports
MUST be grouped (external libraries, internal modules, styles) and separated
by blank lines. Code MUST be DRY (extract repeated logic into shared
utilities/components), KISS (prefer simple, readable solutions over clever
ones), and follow SOLID principles — each module, component, or function has
a single, well-defined responsibility. Errors from operations that can fail
MUST be caught and surfaced with meaningful, user-facing feedback. Comments
MUST explain "why", not "what"; obvious code MUST NOT be commented.
Rationale: consistent style and single-responsibility design keep a
multi-package monorepo maintainable as contributors change over time.

### II. Test-First Coverage (NON-NEGOTIABLE)
Every new component, service, route handler, and utility function MUST have
corresponding tests colocated in a `__tests__/` directory next to the source
file, named `{filename}.test.js`. Tests MUST verify behavior, not
implementation, follow the Arrange-Act-Assert pattern, and be independent
(no shared state, no reliance on execution order, external dependencies
mocked). The project MUST maintain 80%+ code coverage across packages, with
critical user workflows (create, view, update, delete todo) covered by
integration tests. A pull request MUST NOT merge with failing tests or a
coverage regression on touched files.
Rationale: the todo app's functional requirements are small in number but
must remain correct through refactors; enforced coverage catches regressions
early and documents expected behavior.

### III. Simplicity & Single Responsibility
Implementations MUST stay within the scope defined by
`docs/functional-requirements.md`: create, view, update, complete/incomplete,
and delete a todo with title and optional due date, backed by the existing
Express API, single-user, no authentication. Features explicitly marked
out-of-scope (multi-user support, priority/categories, recurring todos,
reminders, undo/redo, bulk operations, search/filtering, mobile-specific
optimization) MUST NOT be added without a corresponding constitution
amendment and updated functional requirements. Prefer the simplest solution
that satisfies a requirement; avoid speculative abstraction or premature
optimization.
Rationale: a small, well-scoped app stays reliable and easy to reason about;
uncontrolled scope creep undermines the bootcamp's teaching goals.

### IV. User Experience Consistency
All UI work MUST conform to `docs/ui-guidelines.md`: the defined light/dark
color palettes, the 8px spacing scale, Material-Design-inspired card and
button styles, and the Halloween theme accents. Interactive elements MUST be
keyboard accessible, meet WCAG AA color contrast, and provide visible focus
indicators. Destructive actions (delete todo) MUST show a confirmation
dialog before taking effect. Dark/light mode preference MUST persist via
`localStorage` and default to system preference on first visit.
Rationale: a documented design system keeps the interface predictable and
accessible instead of drifting screen by screen.

### V. Persisted, Single-User Data Integrity
All todo mutations (create, update, complete/incomplete, delete) MUST be
persisted to the backend Express API immediately upon user action, so state
survives a page refresh. The application remains single-user: todos are
stored globally with no per-user isolation, and no authentication/authorization
layer may be introduced without a constitution amendment. Backend and
frontend MUST validate required fields (title required, max 255 characters)
at the API boundary before persisting.
Rationale: predictable, immediate persistence is the core contract the
functional requirements and tests rely on; scope stays single-user by design.

## Technology Stack & Architecture

The project is an npm-workspaces monorepo with two packages:
`packages/frontend` (React, CSS, Jest + React Testing Library) and
`packages/backend` (Node.js, Express.js, Jest). New functionality MUST fit
this structure: frontend UI in `src/components/` with colocated
`__tests__/`, frontend data access in `src/services/`, backend routes/logic
in `src/`, backend tests in `__tests__/`. Introducing a new runtime,
framework, or persistence technology requires a constitution amendment.

## Development Workflow & Quality Gates

Contributors MUST run `npm run lint` (or the package-local equivalent) and
`npm test` before opening a pull request; all lint errors and test failures
MUST be resolved first. Work MUST happen on feature branches (e.g.,
`feature/<short-description>`) with atomic, descriptively-messaged commits,
merged via pull request. Before submitting a PR, contributors MUST verify
the code-review checklist in `docs/coding-guidelines.md` (naming, import
order, no lint errors, DRY, single responsibility, error handling, tests
present, no stray `console.log`).

## Governance

This constitution supersedes conflicting ad-hoc practices for this repository.
Amendments require: (1) a documented rationale for the change, (2) an update
to this file including a version bump per semantic versioning — MAJOR for
backward-incompatible principle removals/redefinitions, MINOR for new or
materially expanded principles/sections, PATCH for clarifications and
wording fixes — and (3) synchronization review of dependent templates under
`.specify/templates/`. All pull requests and code reviews MUST verify
compliance with the Core Principles above; any deviation MUST be justified
in the PR description or rejected. Use `docs/coding-guidelines.md`,
`docs/testing-guidelines.md`, `docs/ui-guidelines.md`, and
`docs/functional-requirements.md` as the detailed, runtime reference
documents underlying these principles.

**Version**: 1.0.0 | **Ratified**: 2026-08-22 | **Last Amended**: 2026-08-22
