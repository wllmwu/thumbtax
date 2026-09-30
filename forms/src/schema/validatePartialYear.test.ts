import { parse } from "@markdoc/markdoc";
import { describe, expect, it } from "vitest";

import { validatePartialYear } from "./validatePartialYear";

import type { Node } from "@markdoc/markdoc";

function findPartial(node: Node): Node {
  for (const descendant of node.walk()) {
    if (descendant.type === "tag" && descendant.tag === "partial") {
      return descendant;
    }
  }
  throw new Error("No partial tag found in node");
}

describe("validatePartialYear", () => {
  it("returns no errors when the partial is from the document's tax year", () => {
    const node = parse(
      `{% partial file="2026/taxComputation" variables={box: "15"} /%}`,
      { file: "2026/f1040.mdoc" },
    );
    expect(validatePartialYear(findPartial(node))).toEqual([]);
  });

  it("returns an error for a partial from a different year", () => {
    const node = parse(`{% partial file="2025/taxComputation" /%}`, {
      file: "2026/f1040.mdoc",
    });
    const errors = validatePartialYear(findPartial(node));
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      id: "partial-wrong-year",
      level: "error",
      message: 'Partial "2025/taxComputation" is not from tax year 2026',
    });
  });

  it("doesn't accept a year that only appears later in the key", () => {
    const node = parse(`{% partial file="shared/2025/taxComputation" /%}`, {
      file: "2025/f1040.mdoc",
    });
    expect(validatePartialYear(findPartial(node))).toHaveLength(1);
  });

  it("returns no errors when it can't determine the document's tax year", () => {
    const node = parse(`{% partial file="2025/taxComputation" /%}`);
    expect(validatePartialYear(findPartial(node))).toEqual([]);
  });
});
