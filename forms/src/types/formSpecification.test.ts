import { describe, expectTypeOf, it } from "vitest";

import { defineFormSpecification } from "./defineFormSpecification";

import type {
  FormBox,
  FormLine,
  FormSection,
  FormSpecification,
} from "./formSpecification";
import type { InputKeyOf } from "./inputKeyOf";
import type { SpecificationRegistry } from "./specificationRegistry";
import type { ValueProvider } from "./valueProvider";
import type { FormClass } from "@thumbtax/common";

const value: ValueProvider = { type: "number_constant", value: 1 };

describe("single vs. multiple columns", () => {
  describe("MultiColumns = false", () => {
    it("accepts FormBox without `column`", () => {
      expectTypeOf({ identifier: "1", value }).toExtend<FormBox<false>>();
    });

    it("rejects FormBox with `column`", () => {
      expectTypeOf({ identifier: "1", value, column: "(a)" }).not.toExtend<
        FormBox<false>
      >();
    });

    it("accepts FormLine with single `box` without `column`", () => {
      expectTypeOf({ index: "1", box: { identifier: "1", value } }).toExtend<
        FormLine<false>
      >();
    });

    it("rejects FormLine with single `box` with `column`", () => {
      expectTypeOf({
        index: "1",
        box: { identifier: "1", value, column: "(a)" },
      }).not.toExtend<FormLine<false>>();
    });

    it("rejects FormLine with multiple `boxes`", () => {
      expectTypeOf({
        index: "1",
        boxes: [{ identifier: "1", value }],
      }).not.toExtend<FormLine<false>>();
    });

    it("accepts FormSection with only single-column lines", () => {
      expectTypeOf({
        lines: [
          { index: "1", box: { identifier: "1", value } },
          { index: "2", box: { identifier: "2", value } },
        ],
      }).toExtend<FormSection<false>>();
    });

    it("rejects FormSection with any multi-column line", () => {
      expectTypeOf({
        lines: [
          { index: "1", box: { identifier: "1", value } },
          { index: "2", boxes: [{ identifier: "2", value }] },
        ],
      }).not.toExtend<FormSection<false>>();
    });

    it("rejects FormSection with `columns`", () => {
      expectTypeOf({
        lines: [
          { index: "1", box: { identifier: "1", value } },
          { index: "2", box: { identifier: "2", value } },
        ],
        columns: [{ index: "(a)" }],
      }).not.toExtend<FormSection<false>>();
    });
  });

  describe("MultiColumns = true", () => {
    it("accepts FormBox with `column`", () => {
      expectTypeOf({ identifier: "1", value, column: "(a)" }).toExtend<
        FormBox<true>
      >();
    });

    it("rejects FormBox without `column`", () => {
      expectTypeOf({ identifier: "1", value }).not.toExtend<FormBox<true>>();
    });

    it("accepts FormLine with multiple `boxes` with `column`", () => {
      expectTypeOf({
        index: "1",
        boxes: [{ identifier: "1", value, column: "(a)" }],
      }).toExtend<FormLine<true>>();
    });

    it("rejects FormLine with multiple `boxes` without `column`", () => {
      expectTypeOf({
        index: "1",
        boxes: [{ identifier: "1", value }],
      }).not.toExtend<FormLine<true>>();
    });

    it("rejects FormLine with single `box`", () => {
      expectTypeOf({
        index: "1",
        box: { identifier: "1", value, column: "(a)" },
      }).not.toExtend<FormLine<true>>();
    });

    it("accepts FormSection with `columns` and only multi-column lines", () => {
      expectTypeOf({
        columns: [{ index: "(a)" }, { index: "(b)" }],
        lines: [
          {
            index: "1",
            boxes: [
              { identifier: "1(a)", value, column: "(a)" },
              { identifier: "1(b)", value, column: "(b)" },
            ],
          },
        ],
      }).toExtend<FormSection<true>>();
    });

    it("rejects FormSection with any single-column line", () => {
      expectTypeOf({
        columns: [{ index: "(a)" }],
        lines: [
          { index: "1", boxes: [{ identifier: "1(a)", value, column: "(a)" }] },
          { index: "2", box: { identifier: "2", value } },
        ],
      }).not.toExtend<FormSection<true>>();
    });

    it("rejects FormSection without `columns`", () => {
      expectTypeOf({
        lines: [
          {
            index: "1",
            boxes: [{ identifier: "1(a)", value, column: "(a)" }],
          },
        ],
      }).not.toExtend<FormSection<true>>();
    });
  });

  it("accepts FormSpecification with mixed column cardinalities", () => {
    expectTypeOf({
      class: "fW2" as const,
      title: "test",
      irsPageUrl: "test",
      category: "income" as const,
      maxInstances: null,
      sections: [
        { lines: [{ index: "1", box: { identifier: "1", value } }] },
        { lines: [{ index: "2", box: { identifier: "2", value } }] },
        {
          columns: [{ index: "(a)" }, { index: "(b)" }],
          lines: [
            {
              index: "3",
              boxes: [
                { identifier: "3(a)", value, column: "(a)" },
                { identifier: "3(b)", value, column: "(b)" },
              ],
            },
          ],
        },
      ],
    }).toExtend<FormSpecification>();
  });

  it("rejects FormSpecification with sections that have incorrect column cardinalities", () => {
    expectTypeOf({
      class: "fW2" as const,
      title: "test",
      irsPageUrl: "test",
      category: "income" as const,
      maxInstances: null,
      sections: [
        { lines: [{ index: "1", box: { identifier: "1", value } }] },
        {
          columns: [{ index: "(a)" }],
          lines: [{ index: "2", box: { identifier: "2", value } }],
        },
        {
          lines: [
            {
              index: "3",
              boxes: [
                { identifier: "3(a)", value, column: "(a)" },
                { identifier: "3(b)", value, column: "(b)" },
              ],
            },
          ],
        },
      ],
    }).not.toExtend<FormSpecification>();
  });
});

describe("input keys", () => {
  const specificationWithInputs = defineFormSpecification({
    class: "f1099INT",
    title: "Form 1099-INT",
    irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-1099-int",
    category: "income",
    maxInstances: null,
    sections: [
      {
        lines: [
          {
            index: "1",
            box: {
              identifier: "1",
              value: { type: "number_input", inputKey: "1" },
            },
          },
          {
            index: "2",
            box: {
              identifier: "2",
              value: { type: "box_reference", box: "1" },
            },
          },
        ],
      },
      {
        columns: [{ index: "(a)" }, { index: "(b)" }],
        lines: [
          {
            index: "3",
            boxes: [
              {
                identifier: "3(a)",
                column: "(a)",
                value: { type: "checkbox_input", inputKey: "exempt" },
              },
              {
                identifier: "3(b)",
                column: "(b)",
                value: {
                  type: "override_number_input",
                  inputKey: "3(b)",
                  computedValue: { type: "number_constant", value: 10 },
                },
              },
            ],
          },
        ],
      },
    ],
  });

  const specificationWithoutInputs = defineFormSpecification({
    class: "f8960",
    title: "Form 8960",
    irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-8960",
    category: "taxes",
    maxInstances: 1,
    sections: [
      {
        lines: [
          {
            index: "1",
            box: {
              identifier: "1",
              value: { type: "number_constant", value: 200000 },
            },
          },
        ],
      },
    ],
  });

  it("infers the exact union of input keys", () => {
    expectTypeOf(specificationWithInputs).toEqualTypeOf<
      FormSpecification<"1" | "exempt" | "3(b)">
    >();
  });

  it("infers no input keys for a specification without inputs", () => {
    expectTypeOf(specificationWithoutInputs).toEqualTypeOf<
      FormSpecification<never>
    >();
  });

  it("defaults the input key type to string", () => {
    expectTypeOf<FormSpecification>().toEqualTypeOf<
      FormSpecification<string>
    >();
  });

  it("rejects an input value provider without an input key", () => {
    expectTypeOf({
      type: "number_input" as const,
    }).not.toExtend<ValueProvider>();
  });

  it("rejects an input key outside the union", () => {
    expectTypeOf({
      identifier: "1",
      value: { type: "date_input" as const, inputKey: "2" as const },
    }).not.toExtend<FormBox<false, "1">>();
  });

  it("is assignable to FormSpecification with the default parameter", () => {
    expectTypeOf(specificationWithInputs).toExtend<FormSpecification>();
    expectTypeOf(specificationWithoutInputs).toExtend<FormSpecification>();
  });

  it("is assignable to SpecificationRegistry", () => {
    expectTypeOf<
      Record<FormClass, FormSpecification<"1" | "exempt">>
    >().toExtend<SpecificationRegistry>();
  });

  describe("InputKeyOf", () => {
    it("extracts the input keys of a specification", () => {
      expectTypeOf<InputKeyOf<typeof specificationWithInputs>>().toEqualTypeOf<
        "1" | "exempt" | "3(b)"
      >();
    });

    it("extracts no input keys from a specification without inputs", () => {
      expectTypeOf<
        InputKeyOf<typeof specificationWithoutInputs>
      >().toEqualTypeOf<never>();
    });

    it("extracts string from a specification with the default parameter", () => {
      expectTypeOf<InputKeyOf<FormSpecification>>().toEqualTypeOf<string>();
    });

    it("extracts no input keys from a non-specification", () => {
      expectTypeOf<InputKeyOf<{ sections: [] }>>().toEqualTypeOf<never>();
    });
  });
});
