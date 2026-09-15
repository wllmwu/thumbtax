import { describe, expect, it } from "vitest";

import { assertUniqueInputKeys } from "./assertUniqueInputKeys";

import type {
  FormSection,
  FormSpecification,
} from "../types/formSpecification";

function makeSpecification(
  sections: Array<FormSection<false> | FormSection<true>>,
): FormSpecification {
  return {
    class: "f1040s1",
    irsPageUrl: "https://www.irs.gov/forms-pubs/about-schedule-1-form-1040",
    category: "taxes",
    maxInstances: 1,
    title: "Schedule 1",
    sections,
  };
}

describe("assertUniqueInputKeys", () => {
  it("accepts a specification without inputs", () => {
    const specification = makeSpecification([
      {
        lines: [
          {
            index: "1",
            box: {
              identifier: "1",
              value: { type: "number_constant", value: 400 },
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
    ]);
    expect(() => assertUniqueInputKeys(specification)).not.toThrow();
  });

  it("accepts unique input keys across single- and multi-column sections", () => {
    const specification = makeSpecification([
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
            index: "2a",
            box: {
              identifier: "2a",
              value: { type: "checkbox_input", inputKey: "taxable" },
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
                value: { type: "date_input", inputKey: "3(a)" },
              },
              {
                identifier: "3(b)",
                column: "(b)",
                value: { type: "list_amounts_input", inputKey: "3(b)" },
              },
            ],
          },
        ],
      },
    ]);
    expect(() => assertUniqueInputKeys(specification)).not.toThrow();
  });

  it("accepts an input key that matches another box's identifier", () => {
    const specification = makeSpecification([
      {
        lines: [
          {
            index: "1",
            box: {
              identifier: "1",
              value: { type: "number_constant", value: 12 },
            },
          },
          {
            index: "2",
            box: {
              identifier: "2",
              value: { type: "number_input", inputKey: "1" },
            },
          },
        ],
      },
    ]);
    expect(() => assertUniqueInputKeys(specification)).not.toThrow();
  });

  it("rejects duplicate input keys within a section", () => {
    const specification = makeSpecification([
      {
        lines: [
          {
            index: "8",
            box: {
              identifier: "8a",
              value: { type: "number_input", inputKey: "prizes" },
            },
          },
          {
            index: "9",
            box: {
              identifier: "8b",
              value: {
                type: "override_number_input",
                inputKey: "prizes",
                computedValue: { type: "box_reference", box: "8a" },
              },
            },
          },
        ],
      },
    ]);
    expect(() => assertUniqueInputKeys(specification)).toThrow(
      'Form "f1040s1" has duplicate inputKey "prizes" in boxes "8a" and "8b"',
    );
  });

  it("rejects duplicate input keys across sections", () => {
    const specification = makeSpecification([
      {
        lines: [
          {
            index: "1",
            box: {
              identifier: "1",
              value: {
                type: "select_value_input",
                inputKey: "rate",
                options: [
                  {
                    key: "flat",
                    label: "Flat",
                    value: { type: "number_constant", value: 0.22 },
                  },
                ],
              },
            },
          },
        ],
      },
      {
        columns: [{ index: "(i)" }],
        lines: [
          {
            index: "5",
            boxes: [
              {
                identifier: "5(i)",
                column: "(i)",
                value: {
                  type: "select_instance_boxes_input",
                  inputKey: "rate",
                  options: [{ form: "fW2", box: "2" }],
                },
              },
            ],
          },
        ],
      },
    ]);
    expect(() => assertUniqueInputKeys(specification)).toThrow(
      'Form "f1040s1" has duplicate inputKey "rate" in boxes "1" and "5(i)"',
    );
  });
});
