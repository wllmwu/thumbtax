# `data` module

This module contains the Markdoc files that encode each form specification.

- `forms/src/data/`
  - `partials/`: Reusable Markdoc partials.
    Intended for very large/complex rules that are used in multiple places, such as the marginal tax computation.
  - `f1040.mdoc`, `fW2.mdoc`, etc.: Form specifications, named with the corresponding FormClass identifier
