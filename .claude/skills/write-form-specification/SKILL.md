---
name: write-form-specification
description: Write the specification for a tax form based on the PDF
---

1. Read the provided tax form PDF file(s): $ARGUMENTS
2. Add a string literal for each new form to `thumbtax-webapp/src/common/types/formClass.ts`. Keep them in lexicographical order.
3. Write the corresponding TypeScript file(s) to `thumbtax-webapp/src/specifications/data`.
   - Refer to `thumbtax-webapp/src/specifications/data/formW2.ts` for an example and `thumbtax-webapp/src/specifications/types/formSpecification.ts` for the schema.
   - Include all numbered lines/boxes in the specification.
4. Update the following files to include the new form class(es):
   - `thumbtax-webapp/src/specifications/specificationClient.ts`
   - `thumbtax-webapp/src/specifications/test/fixtures.ts`
5. Run `npm run typecheck` and fix any type errors related to your changes.
