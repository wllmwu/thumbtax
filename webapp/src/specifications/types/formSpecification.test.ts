import { describe, expectTypeOf, it } from "vitest";

import type {
  FormBox,
  FormLine,
  FormSection,
  FormSpecification,
} from "#src/specifications/types/formSpecification";
import type { ValueProvider } from "#src/specifications/types/valueProvider";

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
