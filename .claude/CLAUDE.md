# Project conventions

The project code is in the `thumbtax-webapp` directory.
Run all commands from there.

## Commands

- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Autofix lint errors: `npm run fixlint`
  - Use this to fix formatting and import sort errors

## Stack

- TypeScript
- React 19
- Vite

## Patterns

- Don't abbreviate too much; prefer to spell out whole words in variable/function/type names
- Put each React component in its own file
  - A small, one-off component can live in its parent's file
