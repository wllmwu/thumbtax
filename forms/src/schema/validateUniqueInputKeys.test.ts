import { parse } from "@markdoc/markdoc";
import { describe, expect, it } from "vitest";

import { validateUniqueInputKeys } from "./validateUniqueInputKeys";

describe("validateUniqueInputKeys", () => {
  it("returns no errors when there are no value tags", () => {
    const node = parse("# Just a heading\n\nSome prose.");
    expect(validateUniqueInputKeys(node)).toEqual([]);
  });

  it("returns no errors for value tags without an inputKey", () => {
    const node = parse(`
{% value type="number_constant" value=400 /%}

{% value type="box_reference" box="1" /%}
`);
    expect(validateUniqueInputKeys(node)).toEqual([]);
  });

  it("returns no errors when input keys are unique", () => {
    const node = parse(`
{% value type="number_input" inputKey="1" /%}

{% value type="checkbox_input" inputKey="taxable" /%}

{% value type="date_input" inputKey="3(a)" /%}
`);
    expect(validateUniqueInputKeys(node)).toEqual([]);
  });

  it("returns an error when two value tags share an inputKey", () => {
    const node = parse(`
{% value type="number_input" inputKey="prizes" /%}

{% value type="override_number_input" inputKey="prizes" /%}
`);
    const errors = validateUniqueInputKeys(node);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      id: "duplicate-input-key",
      level: "error",
      message: 'inputKey "prizes" is already used by another box in this form',
    });
  });

  it("locates the error at the duplicate occurrence, not the first one", () => {
    const node = parse(`{% value type="number_input" inputKey="rate" /%}

Some unrelated line.

{% value type="select_value_input" inputKey="rate" /%}
`);
    const errors = validateUniqueInputKeys(node);
    expect(errors[0]?.location?.start.line).toEqual(4);
  });

  it("returns one error per repeated occurrence of an inputKey", () => {
    const node = parse(`
{% value type="number_input" inputKey="rate" /%}

{% value type="number_input" inputKey="rate" /%}

{% value type="number_input" inputKey="rate" /%}
`);
    expect(validateUniqueInputKeys(node)).toHaveLength(2);
  });

  it("returns separate errors for separate duplicated keys", () => {
    const node = parse(`
{% value type="number_input" inputKey="a" /%}

{% value type="number_input" inputKey="b" /%}

{% value type="number_input" inputKey="a" /%}

{% value type="number_input" inputKey="b" /%}
`);
    const errors = validateUniqueInputKeys(node);
    expect(errors.map((error) => error.message)).toEqual([
      'inputKey "a" is already used by another box in this form',
      'inputKey "b" is already used by another box in this form',
    ]);
  });

  it("finds input keys nested arbitrarily deep in the tree", () => {
    const node = parse(`
{% box identifier="1" %}
{% value type="number_input" inputKey="1" /%}
{% /box %}

{% box identifier="2" %}
{% value type="sum" %}
- {% value type="sum" %}
  - {% value type="number_input" inputKey="1" /%}
  {% /value %}
{% /value %}
{% /box %}
`);
    expect(validateUniqueInputKeys(node)).toHaveLength(1);
  });
});
