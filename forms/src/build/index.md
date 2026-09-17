# `build` module

This module contains code used by the `buildForms` script.
It was mostly written by Claude Code.

- `forms/src/build/`
  - `attributeRequires.ts`: Helpers for coercing Markdoc attribute types
  - `extractPlainText.ts`: Helper that coerces a Markdoc node into its plain text content
  - `extractProse.ts`: Helper that coerces a Markdoc node into its prose content
  - `isTagNamed.ts`: Helper that narrows a Markdoc node into a named tag
  - `mapFormSpecification.ts`: The mapping from Markdoc renderable tree to form specification object
  - `mapGlossary.ts`: The mapping from Markdoc renderable tree to glossary entries
  - `mapValueProvider.ts`: Subroutine for mapping value providers
