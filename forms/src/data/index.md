# `data` module

This module contains the Markdoc files that encode each form specification and the glossary.

- `forms/src/data/`
  - `{year}/`: Full set of form specifications for one tax year, such as `2025/`
    - `partials/`: Reusable Markdoc partials.
      Intended for very large/complex rules that are used in multiple places, such as the marginal tax computation.
    - `f1040.mdoc`, `fW2.mdoc`, etc.: Form specifications, named with the corresponding FormClass identifier
  - `glossary/`: Glossary entries
  - `mdoc.d.ts`: Type declaration for importing `.mdoc` files as text
