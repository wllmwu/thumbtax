---
name: write-form-specification
description: Use when adding or updating the specification for a tax form
---

# Writing a form specification

Tax form specifications are static data files written in Markdoc, an extension of Markdown, in `forms/src/data`.
Follow these steps to write one:

1. Understand the specification schema.
   See below for details.
2. If the form is not included yet in the FormClass type (`common/src/types/formClass.ts`), then add it there and run `cd common && npm install`.
3. Write the specification in `forms/src/data/{formClass}.mdoc`.
   - Write all lines/boxes from the form, including those that don't take a value and just group other lines as children.
   - Do your best to encode each box's instructions using the value provider DSL.
     If the instructions aren't present in the form or the DSL doesn't support it, fall back to a `number_input`.
   - Don't write any commentary or any virtual lines, but preserve them if they already exist.
4. Run `cd forms && npm run build:forms -- {formClass}.mdoc`.
   This script generates the corresponding TypeScript file at `forms/src/generated/{formClass}.ts`.
   - If the script shows any schema validation errors, fix the errors and repeat until it works.
5. If you added the form to FormClass, then also add it to the `specifications` export in `forms/src/index.ts` and run `cd forms && npm install`.

## Specification schema

The primary schema is defined in `forms/src/types/formSpecification.ts` and `forms/src/types/valueProvider.ts`.
For ease of authoring and rich text support, we write the specifications in Markdoc and use the `build:forms` script above to generate the objects matching the primary schema.
The corresponding Markdoc schema is defined in `forms/src/schema.ts` and `forms/src/schema/valueTag.ts`.

Sample Markdoc specification:

```
{% form
   category="income"
   class="fW2"
   irsPageUrl="https://www.irs.gov/forms-pubs/about-form-w-2" %}
# Form W-2

{% subtitle %}Wage and Tax Statement{% /subtitle %}

{% section %}
## Part I

{% subtitle %}Sample Section 1{% /subtitle %}
{% lines %}
- {% line index="1" %}
  - {% instructions %}Instructions for line 1{% /instructions %}
  - {% box identifier="1" %}{% value type="number_input" /%}{% /box %}
  {% /line %}
- {% line index="2" %}
  - {% instructions %}This line "contains" two children{% /instructions %}
  - {% box identifier="2" %}{% value type="unused" /%}{% /box %}
  {% /line %}
- {% line index="2a" %}
  - {% instructions %}First child{% /instructions %}
  - {% box identifier="2a" %}{% value type="number_input" /%}{% /box %}
  {% /line %}
- {% line index="2b" %}
  - {% instructions %}Add lines 1 and 2a{% /instructions %}
  - {% box identifier="2b" %}
    {% value type="sum" %}
    - {% value type="box_reference" box="1" /%}
    - {% value type="box_reference" box="2a" /%}
    {% /value %}
    {% /box %}
  {% /line %}
- {% line index="3" %}
  - {% instructions %}Compute the tax amount{% /instructions %}
  - {% box identifier="3" %}
    {% value type="_partial_passthrough" %}
    - {% partial file="taxComputation" variables={box: "2b"} /%}
    {% /value %}
    {% /box %}
  {% /line %}
{% /lines %}
{% /section %}

{% section %}
## Part II

{% subtitle %}Sample Section 2{% /subtitle %}

{% instructions %}More detailed instructions for this section{% /instructions %}

{% columns %}
- {% column index="(i)" /%}
- {% column index="(ii)" %}
  {% instructions %}Instructions for column (ii){% /instructions %}
  {% /column %}
{% /columns %}

{% lines %}
- {% line index="4" %}
  - {% instructions %}Each line in a section with columns needs a box for each column.{% /instructions %}
  - {% box identifier="4(i)" column="(i)" %}{% value type="number_input" /%}{% /box %}
  - {% box identifier="4(ii)" column="(ii)" %}{% value type="number_input" /%}{% /box %}
  {% /line %}
{% /lines %}
{% /section %}
{% /form %}
```

Due to how list items and tags are parsed, when a line has instructions that are more than one paragraph of text, you might need to write out its box(es) on multiple lines.
