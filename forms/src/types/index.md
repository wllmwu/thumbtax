# `types` module

This module defines FormSpecification and supporting types.
String-union type values are also imported by the Markdoc schema to match against during validation.

- `forms/src/types/`
  - `formCategory.ts`: Categories assigned to each form
  - `formSpecification.ts`: Schema for the form specification objects
  - `numberSign.ts`: Positive or negative
  - `roundingDirection.ts`: Up or down
  - `specificationRegistry.ts`: Alias for a record of all form specifications
  - `valueProvider.ts`: Schema for the value provider DSL used by the form specifications
  - `valueProviderType.ts`: All value provider types
  - `valueSlot.ts`: Set of allowed slots used by the Markdoc schema's slot system
