# `types` module

This module defines FormSpecification and supporting types.
String-union type values are also imported by the Markdoc schema to match against during validation.

- `forms/src/types/`
  - `dateRangeUnit.ts`: Count days or weekdays
  - `formCategory.ts`: Categories assigned to each form
  - `formSpecification.ts`: Schema for the form specification objects
  - `glossaryEntry.ts`: Glossary entry containing the definition for a glossary term
  - `glossaryTerm.ts`: Terms defined in the Glossary page and linked to by `glossaryLink` tags
  - `numberSign.ts`: Positive or negative number
  - `roundingDirection.ts`: Round up or down
  - `specificationRegistry.ts`: Alias for a record of all form specifications
  - `valueProvider.ts`: Schema for the value provider DSL used by the form specifications
  - `valueProviderType.ts`: All value provider types
  - `valueSlot.ts`: Set of allowed slots used by the Markdoc schema's slot system
