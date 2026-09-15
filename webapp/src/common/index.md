# `common` module

This module contains shared types for the `webapp` package.
These types and helpers don't belong in the `common` package because they're scoped to the frontend.

- `webapp/src/common/`
  - `types/`
    - `boxAddress.ts`: Uniquely identifies a box on a particular form instance
    - `formInstance.ts`: Concrete instance of a form class, storing the user's inputs for this form, keyed by input key
    - `formInstanceId.ts`: Unique ID for a form instance (currently aliases string)
    - `userInput.ts`: Tagged union of user input types
    - `workbook.ts`: Core artifact produced by the engine and consumed by the UI
  - `utils/`
    - `makeFormInstance.ts`: Builds a form instance whose inputs are type-checked against the input keys of its form class
