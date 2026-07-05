import { parse, Tag, transform, validate } from "@markdoc/markdoc";
import { describe, expect, it } from "vitest";

import { optionTag, pieceTag, valueTag } from "./valueTag";

import type { RenderableTreeNode, ValidationError } from "@markdoc/markdoc";

function expectTag(maybeTag: unknown): asserts maybeTag is Tag {
  expect(Tag.isTag(maybeTag)).toEqual(true);
}

function transformValueTags(document: string): RenderableTreeNode[] {
  const parsed = parse(document);
  const transformed = transform(parsed, {
    partials: {
      testPartial: parse(`{% value type="checkbox_input" /%}`),
    },
    tags: { value: valueTag, option: optionTag, piece: pieceTag },
  });
  expectTag(transformed);
  expect(transformed.name).toEqual("article");
  return transformed.children;
}

function validateValueTags(document: string): ValidationError[] {
  const parsed = parse(document);
  return validate(parsed, {
    tags: { value: valueTag, option: optionTag, piece: pieceTag },
  }).map(({ error }) => error);
}

describe("valueTag", () => {
  describe("transform: _partial_passthrough", () => {
    it("transforms _partial_passthrough value tag into contents of partial", () => {
      const document = `
{% value type="_partial_passthrough" %}
- {% partial file="testPartial" /%}
{% /value %}
`;
      const node = transformValueTags(document)[0];
      expectTag(node);
      expect(node.name).toEqual("value");
      expect(node.attributes).toEqual({ type: "checkbox_input" });
    });

    it("copies attributes from _partial_passthrough value tag onto partial root", () => {
      const document = `
{% value type="filing_status_map" %}
- {% value filingStatusKey="single" type="_partial_passthrough" %}
  - {% partial file="testPartial" /%}
  {% /value %}
- {% value slot="default" type="_partial_passthrough" %}
  - {% partial file="testPartial" /%}
  {% /value %}
{% /value %}
`;
      const mapNode = transformValueTags(document)[0];
      expectTag(mapNode);
      const [singleNode, defaultNode] = mapNode.children;
      expectTag(singleNode);
      expectTag(defaultNode);
      expect(singleNode.attributes).toEqual({
        filingStatusKey: "single",
        type: "checkbox_input",
      });
      expect(defaultNode.attributes).toEqual({
        slot: "default",
        type: "checkbox_input",
      });
    });
  });

  describe("validate: no children", () => {
    it("accepts when tag has no children", () => {
      const document = `{% value type="checkbox_input" /%}`;
      const errors = validateValueTags(document);
      expect(errors).toEqual([]);
    });

    it("rejects when tag has children", () => {
      const document = `
{% value type="checkbox_input" %}
- {% value type="number_input" /%}
{% /value %}
`;
      const errors = validateValueTags(document);
      expect(errors).toEqual([expect.objectContaining({ id: "extra-child" })]);
    });
  });

  describe("validate: single child with no slot", () => {
    it("accepts when tag contains one value with no slot", () => {
      const document = `
{% value type="absolute_value" %}
- {% value type="number_input" /%}
{% /value %}
`;
      const errors = validateValueTags(document);
      expect(errors).toEqual([]);
    });

    it("rejects when tag doesn't have correct child structure", () => {
      const document1 = `
{% value type="absolute_value" %}
{% value type="number_input" /%}
{% /value %}
`;
      const errors1 = validateValueTags(document1);
      expect(errors1).toEqual([
        expect.objectContaining({ id: "child-invalid" }),
        expect.objectContaining({ id: "missing-required-child" }),
      ]);

      const document2 = `
{% value type="absolute_value" %}
- {% value type="number_input" /%}

- {% value type="number_input" /%}
{% /value %}
`;
      const errors2 = validateValueTags(document2);
      expect(errors2).toEqual([expect.objectContaining({ id: "extra-child" })]);
    });

    it("rejects when tag contains multiple values", () => {
      const document = `
{% value type="absolute_value" %}
- {% value type="number_input" /%}
- {% value type="number_input" /%}
{% /value %}
`;
      const errors = validateValueTags(document);
      expect(errors).toEqual([expect.objectContaining({ id: "extra-child" })]);
    });

    it("rejects when child value has a slot", () => {
      const document = `
{% value type="absolute_value" %}
- {% value slot="maximum" type="number_input" /%}
{% /value %}
`;
      const errors = validateValueTags(document);
      expect(errors).toEqual([
        {
          id: "unexpected-slot",
          level: "error",
          message: "Child number 1 should not have a slot",
        },
      ]);
    });
  });

  describe("validate: multiple children with no slots", () => {
    it("accepts when tag contains one value with no slot", () => {
      const document = `
{% value type="sum" %}
- {% value type="number_input" /%}
{% /value %}
`;
      const errors = validateValueTags(document);
      expect(errors).toEqual([]);
    });

    it("accepts when tag contains multiple values with no slots", () => {
      const document = `
{% value type="product" %}
- {% value type="number_input" /%}
- {% value type="number_constant" value=5 /%}
- {% value type="number_constant" value=10 /%}
{% /value %}
`;
      const errors = validateValueTags(document);
      expect(errors).toEqual([]);
    });

    it("rejects when tag has no children", () => {
      const document = `
{% value type="conjunction" %}
{% /value %}
`;
      const errors = validateValueTags(document);
      expect(errors).toEqual([
        expect.objectContaining({ id: "missing-required-child" }),
      ]);
    });

    it("rejects when a child has a slot", () => {
      const document = `
{% value type="sum" %}
- {% value slot="minimum" type="number_input" /%}
{% /value %}
`;
      const errors = validateValueTags(document);
      expect(errors).toEqual([
        expect.objectContaining({ id: "unexpected-slot" }),
      ]);
    });
  });

  describe("validate: ordered slots", () => {
    it("accepts required slots in order", () => {
      const document = `
{% value type="difference" %}
- {% value slot="minuend" type="number_input" /%}
- {% value slot="subtrahend" type="number_constant" value=5 /%}
{% /value %}
`;
      const errors = validateValueTags(document);
      expect(errors).toEqual([]);
    });

    it("rejects when child has incorrect slot", () => {
      const document = `
{% value type="difference" %}
- {% value slot="minimum" type="number_constant" value=5 /%}
- {% value slot="minuend" type="number_input" /%}
{% /value %}
`;
      const errors = validateValueTags(document);
      expect(errors).toEqual([
        expect.objectContaining({ id: "child-attributes" }),
      ]);
    });

    it("rejects when required slots are out of order", () => {
      const document = `
{% value type="difference" %}
- {% value slot="subtrahend" type="number_constant" value=5 /%}
- {% value slot="minuend" type="number_input" /%}
{% /value %}
`;
      const errors = validateValueTags(document);
      expect(errors).toEqual([
        expect.objectContaining({ id: "child-attributes" }),
      ]);
    });

    it("rejects when required slot is missing", () => {
      const document = `
{% value type="difference" %}
- {% value slot="minuend" type="number_input" /%}
{% /value %}
`;
      const errors = validateValueTags(document);
      expect(errors).toEqual([
        expect.objectContaining({ id: "missing-required-child" }),
      ]);
    });

    it("accepts when optional slot is omitted", () => {
      const document = `
{% value type="number_input" %}
{% /value %}
`;
      const errors = validateValueTags(document);
      expect(errors).toEqual([]);
    });

    it("accepts when optional slot is present", () => {
      const document = `
{% value type="number_input" %}
- {% value slot="skipCondition" type="checkbox_input" /%}
{% /value %}
`;
      const errors = validateValueTags(document);
      expect(errors).toEqual([]);
    });

    it("rejects when slot is repeated", () => {
      const document = `
{% value type="number_input" %}
- {% value slot="skipCondition" type="checkbox_input" /%}
- {% value slot="skipCondition" type="checkbox_input" /%}
{% /value %}
`;
      const errors = validateValueTags(document);
      expect(errors).toEqual([expect.objectContaining({ id: "extra-child" })]);
    });
  });

  describe("validate: comparison children", () => {
    it("accepts valid shapes", () => {
      const documents = [
        `
{% value type="comparison" %}
- {% value type="number_input" /%}
{% /value %}
`,
        `
{% value type="comparison" %}
- {% value type="number_input" /%}
- {% value slot="minimum" type="number_constant" value=5 /%}
{% /value %}
`,
        `
{% value type="comparison" %}
- {% value type="number_input" /%}
- {% value slot="maximum" type="number_constant" value=10 /%}
{% /value %}
`,
        `
{% value type="comparison" %}
- {% value type="number_input" /%}
- {% value slot="minimum" type="number_constant" value=5 /%}
- {% value slot="maximum" type="number_constant" value=10 /%}
{% /value %}
`,
      ];
      for (const [index, document] of documents.entries()) {
        const errors = validateValueTags(document);
        expect(errors, `test input index ${index}`).toEqual([]);
      }
    });
  });

  describe("validate: piecewise_function children", () => {
    it("accepts valid shapes", () => {
      const documents = [
        `
{% value type="piecewise_function" %}
- {% value slot="input" type="box_reference" box="1" /%}
- {% piece %}
  - {% value slot="inputUpperBound" type="number_constant" value=100 /%}
  - {% value slot="output" type="number_constant" value=5 /%}
  {% /piece %}
- {% value slot="lastOutput" type="number_constant" value=10 /%}
{% /value %}
`,
        `
{% value type="piecewise_function" %}
- {% value slot="input" type="box_reference" box="1" /%}
- {% piece %}
  - {% value slot="inputUpperBound" type="number_constant" value=100 /%}
  - {% value slot="output" type="number_constant" value=5 /%}
  {% /piece %}
- {% piece %}
  - {% value slot="inputUpperBound" type="number_constant" value=200 /%}
  - {% value slot="output" type="number_constant" value=10 /%}
  {% /piece %}
- {% piece %}
  - {% value slot="inputUpperBound" type="number_constant" value=300 /%}
  - {% value slot="output" type="number_constant" value=15 /%}
  {% /piece %}
- {% value slot="lastOutput" type="number_constant" value=20 /%}
{% /value %}
`,
      ];
      for (const [index, document] of documents.entries()) {
        const errors = validateValueTags(document);
        expect(errors, `test input index ${index}`).toEqual([]);
      }
    });

    it("rejects invalid shapes", () => {
      const documents = [
        `
{% value type="piecewise_function" %}
- {% piece %}
  - {% value slot="inputUpperBound" type="number_constant" value=100 /%}
  - {% value slot="output" type="number_constant" value=5 /%}
  {% /piece %}
- {% value slot="lastOutput" type="number_constant" value=10 /%}
{% /value %}
`,
        `
{% value type="piecewise_function" %}
- {% value slot="input" type="box_reference" box="1" /%}
- {% value slot="lastOutput" type="number_constant" value=10 /%}
{% /value %}
`,
        `
{% value type="piecewise_function" %}
- {% value slot="input" type="box_reference" box="1" /%}
- {% piece %}
  - {% value slot="inputUpperBound" type="number_constant" value=100 /%}
  - {% value slot="output" type="number_constant" value=5 /%}
  {% /piece %}
{% /value %}
`,
      ];
      for (const [index, document] of documents.entries()) {
        const errors = validateValueTags(document);
        expect(errors.length, `test input index ${index}`).not.toEqual(0);
      }
    });
  });

  describe("validate: filing_status_map children", () => {
    it("accepts valid shapes", () => {
      const documents = [
        `{% value type="filing_status_map" /%}`,
        `
{% value type="filing_status_map" %}
- {% value type="number_constant" value=1 filingStatusKey="married_filing_jointly" /%}
{% /value %}
`,
        `
{% value type="filing_status_map" %}
- {% value type="number_constant" value=1 filingStatusKey="head_of_household" /%}
- {% value type="number_constant" value=2 filingStatusKey="married_filing_jointly" /%}
- {% value type="number_constant" value=3 filingStatusKey="married_filing_separately" /%}
- {% value type="number_constant" value=4 filingStatusKey="qualifying_surviving_spouse" /%}
- {% value type="number_constant" value=5 filingStatusKey="single" /%}
{% /value %}
`,
        `
{% value type="filing_status_map" %}
- {% value slot="default" type="number_constant" value=1 /%}
{% /value %}
`,
        `
{% value type="filing_status_map" %}
- {% value type="number_constant" value=5 filingStatusKey="single" /%}
- {% value slot="default" type="number_constant" value=10 /%}
{% /value %}
`,
        `
{% value type="filing_status_map" %}
- {% value type="number_constant" value=1 filingStatusKey="head_of_household" /%}
- {% value type="number_constant" value=2 filingStatusKey="married_filing_jointly" /%}
- {% value type="number_constant" value=3 filingStatusKey="married_filing_separately" /%}
- {% value type="number_constant" value=4 filingStatusKey="qualifying_surviving_spouse" /%}
- {% value type="number_constant" value=5 filingStatusKey="single" /%}
- {% value slot="default" type="number_constant" value=10 /%}
{% /value %}
`,
      ];
      for (const [index, document] of documents.entries()) {
        const errors = validateValueTags(document);
        expect(errors, `test input index ${index}`).toEqual([]);
      }
    });

    it("rejects invalid shapes", () => {
      const documents = [
        `
{% value type="filing_status_map" %}
- {% value type="number_constant" value=1 filingStatusKey="married_filing_jointly" /%}
- {% value type="number_constant" value=2 filingStatusKey="married_filing_jointly" /%}
- {% value type="number_constant" value=5 filingStatusKey="single" /%}
{% /value %}
`,
        `
{% value type="filing_status_map" %}
- {% value type="number_constant" value=1 filingStatusKey="married_filing_jointly" /%}
- {% value slot="default" type="number_constant" value=10 /%}
- {% value type="number_constant" value=5 filingStatusKey="single" /%}
{% /value %}
`,
        `
{% value type="filing_status_map" %}
- {% value type="number_constant" value=1 /%}
{% /value %}
`,
      ];
      for (const [index, document] of documents.entries()) {
        const errors = validateValueTags(document);
        expect(errors.length, `test input index ${index}`).not.toEqual(0);
      }
    });
  });

  describe("validate: select_instance_boxes_input children", () => {
    it("accepts one option", () => {
      const document = `
{% value type="select_instance_boxes_input" %}
- {% option form="fW2" box="1" /%}
{% /value %}
`;
      const errors = validateValueTags(document);
      expect(errors).toEqual([]);
    });

    it("accepts multiple options", () => {
      const document = `
{% value type="select_instance_boxes_input" %}
- {% option form="fW2" box="1" /%}
- {% option form="f1099NEC" box="1" /%}
{% /value %}
`;
      const errors = validateValueTags(document);
      expect(errors).toEqual([]);
    });

    it("rejects when there are no options", () => {
      const document = `
{% value type="select_instance_boxes_input" %}
{% /value %}
`;
      const errors = validateValueTags(document);
      expect(errors).toEqual([
        expect.objectContaining({ id: "missing-required-child" }),
      ]);
    });

    it("rejects when child isn't an option tag", () => {
      const document = `
{% value type="select_instance_boxes_input" %}
- {% value type="number_input" /%}
{% /value %}
`;
      const errors = validateValueTags(document);
      expect(errors).toEqual([expect.objectContaining({ id: "child-type" })]);
    });
  });

  describe("validate: select_value_input children", () => {
    it("accepts one option", () => {
      const document = `
{% value type="select_value_input" %}
- {% value type="number_constant" value=1 label="First" /%}
{% /value %}
`;
      const errors = validateValueTags(document);
      expect(errors).toEqual([]);
    });

    it("accepts multiple options", () => {
      const document = `
{% value type="select_value_input" %}
- {% value type="number_constant" value=1 label="First" /%}
- {% value type="number_constant" value=2 label="Second" /%}
- {% value type="number_constant" value=3 label="Third" /%}
{% /value %}
`;
      const errors = validateValueTags(document);
      expect(errors).toEqual([]);
    });

    it("rejects when there are no options", () => {
      const document = `
{% value type="select_value_input" %}
{% /value %}
`;
      const errors = validateValueTags(document);
      expect(errors).toEqual([
        expect.objectContaining({ id: "missing-required-child" }),
      ]);
    });
  });
});
