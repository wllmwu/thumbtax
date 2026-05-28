---
name: write-form-specification
description: Write the specification for a tax form based on the PDF
---

1. Read the provided tax form PDF file(s): $ARGUMENTS
2. Add a string literal for each new form to `thumbtax-webapp/src/common/types/formClass.ts`. Keep them in lexicographical order.
3. Write the corresponding TypeScript file(s) to `thumbtax-webapp/src/specifications/data`.
   - Refer to `thumbtax-webapp/src/specifications/data/formW2.ts` for an example and `thumbtax-webapp/src/specifications/types/formSpecification.ts` for the schema.
   - Write all numbered lines/boxes into the specification, including heading lines that just group other lines indented below them. Do not omit any text from the description of each line.
   - If something cannot currently be expressed by the specification schema, default to a "number_input" box and inform the user about the gap.
4. Update the following files to include the new form class(es):
   - `thumbtax-webapp/src/specifications/specificationClient.ts`
5. Run `npm run typecheck` and fix any type errors related to your changes.
