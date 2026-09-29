import { describe, expect, it } from "vitest";

import { filterRecognizedState } from "#src/persistence/filterRecognizedState";
import {
  makeBoxFixture,
  makeBoxFixtureMultiColumn,
  makeLineFixture,
  makeLineFixtureMultiColumn,
  makeRegistryFixture,
  makeSectionFixture,
  makeSectionFixtureMultiColumn,
  makeSpecificationFixture,
} from "#src/test/specificationFixtures";

import type { FormInstance } from "#src/common/types/formInstance";
import type { UserInput } from "#src/common/types/userInput";
import type { ApplicationState } from "#src/state/types/applicationState";

const SPECIFICATIONS = makeRegistryFixture({
  f1040: makeSpecificationFixture({
    class: "f1040",
    sections: [
      makeSectionFixture({
        lines: [
          makeLineFixture({
            index: "1",
            box: makeBoxFixture({
              identifier: "1",
              value: { type: "checkbox_input", inputKey: "blind" },
            }),
          }),
          makeLineFixture({
            index: "2",
            box: makeBoxFixture({
              identifier: "2",
              value: { type: "date_input", inputKey: "birth_date" },
            }),
          }),
          makeLineFixture({
            index: "3",
            box: makeBoxFixture({
              identifier: "3",
              value: { type: "list_amounts_input", inputKey: "other_income" },
            }),
          }),
          makeLineFixture({
            index: "4",
            box: makeBoxFixture({
              identifier: "4",
              value: {
                type: "override_number_input",
                inputKey: "deduction",
                computedValue: { type: "number_constant", value: 15750 },
              },
            }),
          }),
          makeLineFixture({
            index: "5",
            box: makeBoxFixture({
              identifier: "5",
              value: {
                type: "select_instance_boxes_input",
                inputKey: "wages",
                options: [
                  { form: "fW2", box: "1" },
                  { form: "f1099INT", box: "1" },
                ],
              },
            }),
          }),
          makeLineFixture({
            index: "6",
            box: makeBoxFixture({
              identifier: "6",
              value: {
                type: "select_value_input",
                inputKey: "residency",
                options: [
                  {
                    key: "resident",
                    label: "Resident",
                    value: { type: "number_constant", value: 1 },
                  },
                  {
                    key: "nonresident",
                    label: "Nonresident",
                    value: { type: "number_constant", value: 0 },
                  },
                ],
              },
            }),
          }),
        ],
      }),
      makeSectionFixtureMultiColumn({
        columns: [{ index: "(a)" }, { index: "(b)" }],
        lines: [
          makeLineFixtureMultiColumn({
            index: "7",
            boxes: [
              makeBoxFixtureMultiColumn({
                identifier: "7a",
                column: "(a)",
                value: { type: "number_input", inputKey: "7a" },
              }),
              makeBoxFixtureMultiColumn({
                identifier: "7b",
                column: "(b)",
                value: { type: "number_constant", value: 0 },
              }),
            ],
          }),
        ],
      }),
    ],
  }),
  fW2: makeSpecificationFixture({
    class: "fW2",
    sections: [
      makeSectionFixture({
        lines: [
          makeLineFixture({
            box: makeBoxFixture({
              identifier: "1",
              value: { type: "number_input", inputKey: "compensation" },
            }),
          }),
        ],
      }),
    ],
  }),
});

const W2_INSTANCE: FormInstance = {
  id: "w2-1",
  class: "fW2",
  label: "Employer",
  inputs: {},
};
const INTEREST_INSTANCE: FormInstance = {
  id: "int-1",
  class: "f1099INT",
  label: "Bank",
  inputs: {},
};

function makeState(f1040Inputs: Record<string, UserInput>): ApplicationState {
  return {
    taxYear: 2026,
    filingStatus: "married_filing_jointly",
    formClasses: ["fW2", "f1040", "f1099INT"],
    formInstances: {
      fW2: [W2_INSTANCE],
      f1040: [
        { id: "f1040-1", class: "f1040", label: "Return", inputs: f1040Inputs },
      ],
      f1099INT: [INTEREST_INSTANCE],
    },
  };
}

function filterF1040Inputs(
  f1040Inputs: Record<string, UserInput>,
): ApplicationState["formInstances"]["f1040"] {
  return filterRecognizedState(makeState(f1040Inputs), SPECIFICATIONS)
    .formInstances.f1040;
}

const RECOGNIZED_INPUTS: Record<string, UserInput> = {
  blind: { type: "number", value: 1 },
  birth_date: { type: "number", value: 7305 },
  other_income: {
    type: "amount_list",
    value: [{ label: "Jury duty", amount: 240 }],
  },
  deduction: { type: "override", override: 31500 },
  wages: {
    type: "instance_box_selections",
    selected: [
      { instance: "w2-1", box: "1" },
      { instance: "int-1", box: "1" },
    ],
  },
  residency: { type: "selection", selectedKey: "nonresident" },
  "7a": { type: "number", value: -45.5 },
};

describe("filterRecognizedState", () => {
  it("keeps recognized inputs of every provider type, including in multi-column sections", () => {
    const state = makeState(RECOGNIZED_INPUTS);
    expect(filterRecognizedState(state, SPECIFICATIONS)).toEqual(state);
  });

  it("passes everything other than inputs through unchanged", () => {
    const state = makeState({ unknown: { type: "number", value: 3 } });

    const result = filterRecognizedState(state, SPECIFICATIONS);

    expect(result.taxYear).toBe(2026);
    expect(result.filingStatus).toBe("married_filing_jointly");
    expect(result.formClasses).toEqual(["fW2", "f1040", "f1099INT"]);
    expect(result.formInstances.fW2).toEqual([W2_INSTANCE]);
    expect(result.formInstances.f1040).toEqual([
      { id: "f1040-1", class: "f1040", label: "Return", inputs: {} },
    ]);
  });

  it("drops inputs whose key has no input provider", () => {
    expect(
      filterF1040Inputs({
        blind: { type: "number", value: 0 },
        spouse_blind: { type: "number", value: 1 },
        "7b": { type: "number", value: 12 },
      })?.[0].inputs,
    ).toEqual({ blind: { type: "number", value: 0 } });
  });

  it.each<{ inputKey: string; input: UserInput }>([
    { inputKey: "blind", input: { type: "selection", selectedKey: "yes" } },
    { inputKey: "birth_date", input: { type: "override", override: 1 } },
    { inputKey: "other_income", input: { type: "number", value: 240 } },
    { inputKey: "deduction", input: { type: "number", value: 31500 } },
    {
      inputKey: "wages",
      input: { type: "amount_list", value: [{ label: "Pay", amount: 900 }] },
    },
    {
      inputKey: "residency",
      input: { type: "instance_box_selections", selected: [] },
    },
    { inputKey: "7a", input: { type: "override", override: null } },
  ])(
    "drops a $input.type input for provider key $inputKey",
    ({ inputKey, input }) => {
      expect(filterF1040Inputs({ [inputKey]: input })?.[0].inputs).toEqual({});
    },
  );

  it("drops a selection whose key isn't one of the options", () => {
    expect(
      filterF1040Inputs({
        residency: { type: "selection", selectedKey: "part_year" },
      })?.[0].inputs,
    ).toEqual({});
  });

  it("keeps only box selections whose instance exists and whose form and box are options", () => {
    expect(
      filterF1040Inputs({
        wages: {
          type: "instance_box_selections",
          selected: [
            { instance: "w2-1", box: "1" },
            // Instance doesn't exist
            { instance: "w2-deleted", box: "1" },
            // Box isn't an option for this form
            { instance: "w2-1", box: "2" },
            // Instance's form isn't an option
            { instance: "f1040-1", box: "1" },
            { instance: "int-1", box: "1" },
          ],
        },
      })?.[0].inputs,
    ).toEqual({
      wages: {
        type: "instance_box_selections",
        selected: [
          { instance: "w2-1", box: "1" },
          { instance: "int-1", box: "1" },
        ],
      },
    });
  });

  it("keeps a box selections input with an empty list when none of its addresses are recognized", () => {
    expect(
      filterF1040Inputs({
        wages: {
          type: "instance_box_selections",
          selected: [{ instance: "w2-1", box: "12a" }],
        },
      })?.[0].inputs,
    ).toEqual({ wages: { type: "instance_box_selections", selected: [] } });
  });

  it("doesn't mutate the given state", () => {
    const state = makeState({
      blind: { type: "number", value: 1 },
      unknown: { type: "number", value: 3 },
      wages: {
        type: "instance_box_selections",
        selected: [{ instance: "w2-deleted", box: "1" }],
      },
    });
    const snapshot = structuredClone(state);

    filterRecognizedState(state, SPECIFICATIONS);

    expect(state).toEqual(snapshot);
  });
});
