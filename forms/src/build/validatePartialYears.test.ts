import { parse } from "@markdoc/markdoc";
import { describe, expect, it } from "vitest";

import { validatePartialYears } from "./validatePartialYears";

describe("validatePartialYears", () => {
  it("returns no errors when there are no partials", () => {
    const node = parse(`
# Form

{% value type="number_input" inputKey="wages" /%}
`);
    expect(validatePartialYears(node, 2025)).toEqual([]);
  });

  it("returns no errors when every partial is from the given year", () => {
    const node = parse(`
{% value type="_partial_passthrough" %}
- {% partial file="2026/taxComputation" variables={box: "15"} /%}
{% /value %}

{% value type="_partial_passthrough" %}
- {% partial file="2026/alternativeMinimumTaxComputation" /%}
{% /value %}
`);
    expect(validatePartialYears(node, 2026)).toEqual([]);
  });

  it("returns an error for a partial from a different year", () => {
    const node = parse(`
{% value type="_partial_passthrough" %}
- {% partial file="2025/taxComputation" variables={box: "5"} /%}
{% /value %}
`);
    const errors = validatePartialYears(node, 2026);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      id: "partial-wrong-year",
      level: "error",
      message: 'Partial "2025/taxComputation" is not from tax year 2026',
    });
  });

  it("returns an error for a partial without a year prefix", () => {
    const node = parse(`{% partial file="taxComputation" /%}`);
    expect(validatePartialYears(node, 2025)).toMatchObject([
      { message: 'Partial "taxComputation" is not from tax year 2025' },
    ]);
  });

  it("doesn't accept a year that only appears later in the key", () => {
    const node = parse(`{% partial file="shared/2025/taxComputation" /%}`);
    expect(validatePartialYears(node, 2025)).toHaveLength(1);
  });

  it("returns one error per offending partial, located at each one", () => {
    const node = parse(`{% partial file="2026/taxComputation" /%}

{% partial file="2025/taxComputation" /%}

{% partial file="2024/alternativeMinimumTaxComputation" /%}
`);
    const errors = validatePartialYears(node, 2026);
    expect(errors.map(({ location }) => location?.start.line)).toEqual([2, 4]);
  });
});
