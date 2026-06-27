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

## Commands

Run these commands within each top-level package, unless otherwise noted:

- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Autofix lint errors (formatting, import sort, etc.): `npm run fixlint`
- Test: `npm run test`
  - Not used in `common` since it doesn't have tests

## Patterns

- Don't abbreviate too much.
  Prefer to spell out whole words in variable/function/type names.
- Keep code type-safe.
  Don't use the exclamation mark operator or type casts and don't disable the typechecker or linter.
- Use the `absurd(x: never)` helper from `@thumbtax/common` for exhaustive type checks.
