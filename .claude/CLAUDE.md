# Project conventions

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

- Use absolute paths starting from `#src/` to import from other project files
- Don't abbreviate too much; it's okay to spell out whole words in variable/function/type names
- Put each React component in its own file
  - A small, one-off component can live in its parent's file
