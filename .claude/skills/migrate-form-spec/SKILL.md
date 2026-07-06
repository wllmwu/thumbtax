---
name: migrate-form-spec
description: Use when migrating a legacy webapp/src/specifications/data/*.ts form specification to the Markdoc schema in forms/src/data
---

# Migrating a form specification to Markdoc

Older tax form specifications live as hand-written `FormSpecification` object literals in
`webapp/src/specifications/data/{name}.ts`, using a pre-Markdoc shape (`description: string` instead of
`instructions`). These no longer match the current `FormSpecification` type in
`forms/src/types/formSpecification.ts` (which expects `instructions?: RenderableTreeNodes`), so any
unmigrated file causes a `webapp` typecheck error. Migrating means transcribing that object 1:1 into a
`.mdoc` file and regenerating it — this is NOT re-authoring the form from IRS instructions.

**REQUIRED BACKGROUND:** Use write-form-specification for the Markdoc tag syntax, schema files, and general
authoring conventions. This skill only covers the migration-specific parts: field mapping and the
end-to-end process.

## Process

1. Read the old file at `webapp/src/specifications/data/{name}.ts` in full.
2. Confirm the form's class is already in `FORM_CLASSES` (`common/src/types/formClass.ts`) — for a
   migration it almost always already is, since the old file already exports a working spec.
3. Transcribe the object into `forms/src/data/{formClass}.mdoc` using the field mapping below.
   Preserve the structure and every value provider exactly — don't reinterpret, simplify, or "improve"
   the encoding, and don't drop `commentary` or `virtual` lines if the old file has them.
4. Run `cd forms && npm run build:forms -- {formClass}.mdoc`. Fix any schema validation errors and
   re-run until it succeeds (see "Empty lines" note below for the most common cause).
5. Diff the generated `forms/src/generated/{formClass}.ts` against the old file's data field-by-field
   (title, subtitle, category, irsPageUrl, maxInstances, and every line/box/value) to confirm nothing
   was lost or changed in the transcription.
6. Add the form to the `specifications` export in `forms/src/index.ts` (import from `./generated/{formClass}`
   and add `{formClass},` to the object), then run `cd forms && npm install`.
   You should see a type error that `specifications` is missing the remaining forms, but no other issues.
7. Delete the old `webapp/src/specifications/data/{name}.ts` file.

## Field mapping (old TS → Markdoc)

| Old field | Markdoc |
|---|---|
| `title` | `# Heading` (form-level) |
| `class`, `category`, `irsPageUrl`, `maxInstances` | `{% form %}` attributes (omit `maxInstances` if `null`) |
| `subtitle` | `{% subtitle %}...{% /subtitle %}` |
| section `heading` | `## Heading` (first child of `{% section %}`) |
| section/line `subtitle` | `{% subtitle %}...{% /subtitle %}` |
| `description` (line or box level in old files) | `{% instructions %}...{% /instructions %}` |
| `commentary` | `{% commentary %}...{% /commentary %}` |
| `virtual: true` on a line | `virtual="true"` attribute on `{% line %}` |
| `columns` on a section | `{% columns %}` with one `{% column index="..." %}` per entry |
| line `index` | `{% line index="..." %}` |
| box `identifier` / `column` / `format` | `{% box identifier="..." column="..." format="..." %}` |

## Value provider mapping

Every `value: {...}` object becomes a `{% value type="..." %}` tag with the same `type`. Map each
provider's TS fields to Markdoc as follows (full authoritative list: `forms/src/types/valueProvider.ts`
and `forms/src/schema/valueTag.ts`):

| Type | TS fields → Markdoc |
|---|---|
| `number_constant` | `value` → attribute: `{% value type="number_constant" value=123 /%}` |
| `box_reference` | `box`, `form?`, `required?` → attributes |
| `form_instance_count` | `form` → attribute |
| `sum`, `product`, `minimum`, `maximum`, `conjunction`, `disjunction` | `values: [...]` → unslotted `{% value %}` children, one per entry |
| `difference` | `minuend`/`subtrahend` → children with `slot="minuend"` / `"subtrahend"` |
| `quotient` | `dividend`/`divisor` → `slot="dividend"` / `"divisor"`; `round?` → attribute |
| `absolute_value`, `non_negative_clamp`, `non_positive_clamp`, `numerical_negation`, `logical_negation` | `value` → single unslotted child |
| `comparison` | `value` → unslotted child; `minimum?`/`maximum?` → `slot="minimum"` / `"maximum"`; `strict?` → attribute |
| `conditional` | `condition`/`trueValue`/`falseValue` → `slot="condition"` / `"trueValue"` / `"falseValue"`, in that order |
| `piecewise_function` | `input` → `slot="input"`; each `pieces` entry → `{% piece %}` with `slot="inputUpperBound"` then `slot="output"` children; `lastOutput` → `slot="lastOutput"` |
| `filing_status_map` | each `values[status]` → child with `filingStatusKey="status"`; `default?` → child with `slot="default"` (must be last) |
| `number_input` / `override_number_input` | `coerceSign?` → attribute; `skipCondition?`/`computedValue` → `slot="skipCondition"` (optional) / `slot="computedValue"` (required) |
| `select_instance_boxes_input` | each `options` entry → `{% option form="..." box="..." /%}` |
| `select_value_input` | each `options` entry → child with `label="..."` attribute wrapped as `slot="options"` |
| `checkbox_input`, `list_amounts_input`, `unused`, `unsupported` | no children/attributes |

## After migrating

- `forms/src/index.ts`'s `specifications` registry is typed as `SpecificationRegistry`
  (`Record<FormClass, FormSpecification>`), so it will keep failing typecheck
  (`missing the following properties...`) until every `FormClass` has been migrated. This is expected —
  leave it.
- `webapp/src/specifications/specificationClient.ts` still imports the old per-form TS files directly; a
  migrated form's import there will start failing once you delete the old file. This is also expected and
  gets resolved once all forms are migrated — don't patch around it per-migration.
