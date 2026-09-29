# `generated` module

This module contains the generated form specification objects.
There is no business logic in this module, only static objects.

- `forms/src/generated/`
  - `{year}/`: Form specifications for one tax year, such as `2025/`
    - `f1040.ts`, `fW2.ts`, etc.: Each form specification is a const export from the file named after its FormClass identifier
    - `index.ts`: The year's specification registry, which maps every FormClass to its specification
  - `glossary.ts`: Glossary entries, shared across all years
