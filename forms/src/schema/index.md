# `schema` module

This module contains code used by the Markdoc schema.

- `forms/src/schema/`
  - `makeTransformer.ts`: Creates a transform function for a Markdoc tag
  - `unwrapInlineTagChildren.ts`: Unwraps an inline tag
  - `unwrapListItemChildren.ts`: Unwraps list items
  - `validateChildren.ts`: Validates a Markdoc node's children
  - `validatePlainTextContent.ts`: Checks that a node contains only plain text
  - `validateProseContent.ts`: Checks that a node contains only prose
  - `valueTag.ts`: Schema definitions for the `value` tag and related tags
