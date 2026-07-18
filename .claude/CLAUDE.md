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
These files provide context about the contents of each package or module.

## Patterns

- Don't abbreviate too much.
  Prefer to spell out whole words in variable/function/type names.
- Keep code type-safe.
  Don't use the exclamation mark operator or type casts and don't disable the typechecker or linter.
- Use the `absurd(x: never)` helper from `@thumbtax/common` for exhaustive type checks.
- Keep helpers discoverable.
  If a helper is used in multiple places, prefer to put it in its own file.
  Don't create dumping-ground files with multiple unrelated exports.
