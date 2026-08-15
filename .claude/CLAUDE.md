# Project context

This repository contains the code for a tax return estimation web app called Thumbtax.

## Stack

- TypeScript
- Vite
- React 19

## Code organization

The code is split into these top-level Node packages:

- `common` (`@thumbtax/common`): Shared types
- `forms` (`@thumbtax/forms`): Static tax form data
- `webapp`: Frontend React app

Each package has an `index.md` file at its root and additional `index.md` files in each child directory (module).
Read these files for context about the contents of each package or module, for example when deciding where new code belongs.

## Patterns

- Don't abbreviate too much.
  Prefer to spell out whole words in variable/function/type names.
- Keep code type-safe.
  Don't use the exclamation mark operator or type casts and don't disable the typechecker or linter.
- Use the `absurd(x: never)` helper from `@thumbtax/common` for exhaustive type checks.
- Keep helpers discoverable.
  If a helper is used in multiple places, prefer to put it in its own file.
  Don't create dumping-ground files with multiple unrelated exports.

## Commands

The following commands are standardized across all of the packages.
They have to be run from inside each package.

- Type checks: `npm run typecheck` (maps to `tsc`)
- Linter: `npm run lint` (maps to `eslint`)
  - Auto-fix lint issues like formatting and import order: `npm run fixlint` (maps to `eslint --fix`)
- Tests: `npm run test` (maps to `vitest --run`)
  - `common` doesn't have any tests so this one doesn't exist there.

You can target specific files by passing them through npm, such as: `cd common && npm run fixlint -- src/types`.

## Contributing

If asked to write docs, place them in the `agent-docs` directory at the repo top level.

## Technical debt

- Many UI components also don't have unit test coverage.
  Tests should be added/updated for new components and for existing components that have test files.
