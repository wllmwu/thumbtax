# `engine` module

This module computes the application state based on the user input and static form specifications.

- `webapp/src/engine/`
  - `test/`: Fixtures used in tests for `computeWorkbook`
  - `computeWorkbook.ts`: Core algorithm that consumes user input, form specifications, and current workbook and produces the new workbook
  - `dependencyGraph.ts`: Basic dependency graph utility class used by `computeWorkbook`
