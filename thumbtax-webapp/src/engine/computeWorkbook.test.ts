import { describe, expect, it, test } from "vitest";

import { computeWorkbook } from "#src/engine/computeWorkbook";
import {
  makeBoxFixture,
  makeFormSpecFixture,
  makeLineFixture,
  makeSectionFixture,
} from "#src/specifications/test/fixtures";

import type { BoxIdentifier } from "#src/common/types/boxIdentifier";
import type { FilingStatus } from "#src/common/types/filingStatus";
import type { FormClass } from "#src/common/types/formClass";
import type { FormInstance } from "#src/common/types/formInstance";
import type { UserInput } from "#src/common/types/userInput";
import type { ResolvedBox, Workbook } from "#src/common/types/workbook";
import type { SpecificationRegistry } from "#src/specifications/types/specificationRegistry";
import type { ValueProvider } from "#src/specifications/types/valueProvider";

// ─── Local helpers ───────────────────────────────────────────────────────────

function makeFormInstanceFixture(
  overrides?: Partial<FormInstance>,
): FormInstance {
  return {
    id: "instance-1",
    class: "fW2",
    label: "",
    inputs: {},
    ...overrides,
  };
}

function makeInstancesByClass(
  instances: FormInstance[],
): Partial<Record<FormClass, FormInstance[]>> {
  const result: Partial<Record<FormClass, FormInstance[]>> = {};
  for (const instance of instances) {
    const existing = result[instance.class];
    if (existing) {
      existing.push(instance);
    } else {
      result[instance.class] = [instance];
    }
  }
  return result;
}

// ─── Tabular test infrastructure ─────────────────────────────────────────────

type AdditionalBox = {
  identifier: BoxIdentifier;
  provider: ValueProvider;
  inputs?: Partial<Record<BoxIdentifier, UserInput>>;
};

type ValueProviderFixture = {
  description: string;
  provider: ValueProvider;
  inputs?: Partial<Record<BoxIdentifier, UserInput>>;
  additionalBoxes?: AdditionalBox[];
  filingStatus?: FilingStatus;
  expected: ResolvedBox;
};

const INSTANCE_ID = "instance-1";
const BOX_UNDER_TEST_ID = "box-under-test";

function runFixture(fixture: ValueProviderFixture): ResolvedBox {
  const {
    provider,
    inputs = {},
    additionalBoxes = [],
    filingStatus = "single",
  } = fixture;

  const allInputs: Partial<Record<BoxIdentifier, UserInput>> = {
    ...inputs,
    ...additionalBoxes.reduce<Partial<Record<BoxIdentifier, UserInput>>>(
      (acc, b) => ({ ...acc, ...b.inputs }),
      {},
    ),
  };

  const allBoxes = [
    makeBoxFixture({ identifier: BOX_UNDER_TEST_ID, value: provider }),
    ...additionalBoxes.map((b) =>
      makeBoxFixture({ identifier: b.identifier, value: b.provider }),
    ),
  ];

  const lines = allBoxes.map((box, i) =>
    makeLineFixture({ index: String(i + 1), box }),
  );
  const spec = makeFormSpecFixture({
    class: "fW2",
    sections: [makeSectionFixture({ lines })],
  });

  const formInstance = makeFormInstanceFixture({
    id: INSTANCE_ID,
    class: "fW2",
    inputs: allInputs,
  });

  const registry: SpecificationRegistry = {
    fW2: spec,
    f1040: makeFormSpecFixture({ class: "f1040" }),
  };

  const workbook = computeWorkbook(
    registry,
    { fW2: [formInstance] },
    filingStatus,
    {},
  );

  return workbook[INSTANCE_ID][BOX_UNDER_TEST_ID];
}

// Produces { value: 0, errors: [{ type: "divide_by_zero" }] }
const ERROR_PROVIDER: ValueProvider = {
  type: "quotient",
  dividend: { type: "number_constant", value: 1 },
  divisor: { type: "number_constant", value: 0 },
};

// ─── Provider fixture record ──────────────────────────────────────────────────

const providerFixtures: Record<ValueProvider["type"], ValueProviderFixture[]> =
  {
    // Leaves (no error propagation)
    number_constant: [
      {
        description: "returns the constant value",
        provider: { type: "number_constant", value: 42 },
        expected: { value: 42, errors: [] },
      },
      {
        description: "returns negative constants",
        provider: { type: "number_constant", value: -5 },
        expected: { value: -5, errors: [] },
      },
    ],
    number_input: [
      {
        description: "returns 0 when no input is present",
        provider: { type: "number_input" },
        expected: { value: 0, errors: [] },
      },
      {
        description: "returns the user-supplied number",
        provider: { type: "number_input" },
        inputs: { [BOX_UNDER_TEST_ID]: { type: "number", value: 100 } },
        expected: { value: 100, errors: [] },
      },
    ],
    checkbox_input: [
      {
        description: "returns 0 when no input is present",
        provider: { type: "checkbox_input" },
        expected: { value: 0, errors: [] },
      },
      {
        description: "returns the user-supplied number",
        provider: { type: "checkbox_input" },
        inputs: { [BOX_UNDER_TEST_ID]: { type: "number", value: 1 } },
        expected: { value: 1, errors: [] },
      },
    ],
    list_amounts_input: [
      {
        description: "returns 0 when no input is present",
        provider: { type: "list_amounts_input" },
        expected: { value: 0, errors: [] },
      },
      {
        description: "returns the sum of all amounts",
        provider: { type: "list_amounts_input" },
        inputs: {
          [BOX_UNDER_TEST_ID]: {
            type: "amount_list",
            value: [
              { label: "a", amount: 10 },
              { label: "b", amount: 20 },
            ],
          },
        },
        expected: { value: 30, errors: [] },
      },
    ],
    unused: [
      {
        description: "returns 0",
        provider: { type: "unused" },
        expected: { value: 0, errors: [] },
      },
    ],
    unsupported: [
      {
        description: "returns 0",
        provider: { type: "unsupported" },
        expected: { value: 0, errors: [] },
      },
    ],
    form_instance_count: [
      {
        description:
          "returns 1 for the single fW2 instance created by the harness",
        provider: { type: "form_instance_count", form: "fW2" },
        expected: { value: 1, errors: [] },
      },
      {
        description: "returns 0 for a class with no instances",
        provider: { type: "form_instance_count", form: "f1040" },
        expected: { value: 0, errors: [] },
      },
    ],
    // Same-instance box_reference (uses additionalBoxes)
    box_reference: [
      {
        description: "resolves to the referenced box's value",
        provider: { type: "box_reference", box: "referenced-box" },
        additionalBoxes: [
          {
            identifier: "referenced-box",
            provider: { type: "number_constant", value: 42 },
          },
        ],
        expected: { value: 42, errors: [] },
      },
      {
        description: "wraps upstream errors from the referenced box",
        provider: { type: "box_reference", box: "referenced-box" },
        additionalBoxes: [
          { identifier: "referenced-box", provider: ERROR_PROVIDER },
        ],
        expected: {
          value: 0,
          errors: [
            {
              type: "upstream",
              sourceAddress: { instance: INSTANCE_ID, box: "referenced-box" },
            },
          ],
        },
      },
    ],
    // Arithmetic
    sum: [
      {
        description: "returns the sum of its values",
        provider: {
          type: "sum",
          values: [
            { type: "number_constant", value: 3 },
            { type: "number_constant", value: 4 },
          ],
        },
        expected: { value: 7, errors: [] },
      },
      {
        description: "returns 0 for an empty values array",
        provider: { type: "sum", values: [] },
        expected: { value: 0, errors: [] },
      },
      {
        description: "propagates errors from children",
        provider: {
          type: "sum",
          values: [ERROR_PROVIDER, { type: "number_constant", value: 1 }],
        },
        expected: { value: 1, errors: [{ type: "divide_by_zero" }] },
      },
    ],
    difference: [
      {
        description: "returns minuend minus subtrahend",
        provider: {
          type: "difference",
          minuend: { type: "number_constant", value: 10 },
          subtrahend: { type: "number_constant", value: 3 },
        },
        expected: { value: 7, errors: [] },
      },
      {
        description: "propagates errors from minuend",
        provider: {
          type: "difference",
          minuend: ERROR_PROVIDER,
          subtrahend: { type: "number_constant", value: 1 },
        },
        expected: { value: -1, errors: [{ type: "divide_by_zero" }] },
      },
      {
        description: "propagates errors from subtrahend",
        provider: {
          type: "difference",
          minuend: { type: "number_constant", value: 5 },
          subtrahend: ERROR_PROVIDER,
        },
        expected: { value: 5, errors: [{ type: "divide_by_zero" }] },
      },
    ],
    product: [
      {
        description: "returns the product of its values",
        provider: {
          type: "product",
          values: [
            { type: "number_constant", value: 3 },
            { type: "number_constant", value: 4 },
          ],
        },
        expected: { value: 12, errors: [] },
      },
      {
        description: "returns 0 for an empty values array",
        provider: { type: "product", values: [] },
        expected: { value: 0, errors: [] },
      },
      {
        description: "propagates errors from children",
        provider: {
          type: "product",
          values: [{ type: "number_constant", value: 3 }, ERROR_PROVIDER],
        },
        expected: { value: 0, errors: [{ type: "divide_by_zero" }] },
      },
    ],
    quotient: [
      {
        description: "returns dividend divided by divisor",
        provider: {
          type: "quotient",
          dividend: { type: "number_constant", value: 10 },
          divisor: { type: "number_constant", value: 4 },
        },
        expected: { value: 2.5, errors: [] },
      },
      {
        description: "returns 0 and a divide_by_zero error when divisor is 0",
        provider: {
          type: "quotient",
          dividend: { type: "number_constant", value: 5 },
          divisor: { type: "number_constant", value: 0 },
        },
        expected: { value: 0, errors: [{ type: "divide_by_zero" }] },
      },
      {
        description: "propagates errors from dividend",
        provider: {
          type: "quotient",
          dividend: ERROR_PROVIDER,
          divisor: { type: "number_constant", value: 2 },
        },
        expected: { value: 0, errors: [{ type: "divide_by_zero" }] },
      },
    ],
    minimum: [
      {
        description: "returns the minimum of its values",
        provider: {
          type: "minimum",
          values: [
            { type: "number_constant", value: 3 },
            { type: "number_constant", value: 7 },
            { type: "number_constant", value: 1 },
          ],
        },
        expected: { value: 1, errors: [] },
      },
      {
        description: "returns 0 for an empty values array",
        provider: { type: "minimum", values: [] },
        expected: { value: 0, errors: [] },
      },
      {
        description: "propagates errors from children",
        provider: {
          type: "minimum",
          values: [{ type: "number_constant", value: 5 }, ERROR_PROVIDER],
        },
        expected: { value: 0, errors: [{ type: "divide_by_zero" }] },
      },
    ],
    maximum: [
      {
        description: "returns the maximum of its values",
        provider: {
          type: "maximum",
          values: [
            { type: "number_constant", value: 3 },
            { type: "number_constant", value: 7 },
            { type: "number_constant", value: 1 },
          ],
        },
        expected: { value: 7, errors: [] },
      },
      {
        description: "returns 0 for an empty values array",
        provider: { type: "maximum", values: [] },
        expected: { value: 0, errors: [] },
      },
      {
        description: "propagates errors from children",
        provider: {
          type: "maximum",
          values: [{ type: "number_constant", value: 5 }, ERROR_PROVIDER],
        },
        expected: { value: 5, errors: [{ type: "divide_by_zero" }] },
      },
    ],
    absolute_value: [
      {
        description: "returns the absolute value of a positive number",
        provider: {
          type: "absolute_value",
          value: { type: "number_constant", value: 5 },
        },
        expected: { value: 5, errors: [] },
      },
      {
        description: "returns the absolute value of a negative number",
        provider: {
          type: "absolute_value",
          value: { type: "number_constant", value: -5 },
        },
        expected: { value: 5, errors: [] },
      },
      {
        description: "propagates errors from its child",
        provider: { type: "absolute_value", value: ERROR_PROVIDER },
        expected: { value: 0, errors: [{ type: "divide_by_zero" }] },
      },
    ],
    non_negative: [
      {
        description: "returns the value when it is non-negative",
        provider: {
          type: "non_negative",
          value: { type: "number_constant", value: 5 },
        },
        expected: { value: 5, errors: [] },
      },
      {
        description: "returns 0 when the value is negative",
        provider: {
          type: "non_negative",
          value: { type: "number_constant", value: -5 },
        },
        expected: { value: 0, errors: [] },
      },
      {
        description: "propagates errors from its child",
        provider: { type: "non_negative", value: ERROR_PROVIDER },
        expected: { value: 0, errors: [{ type: "divide_by_zero" }] },
      },
    ],
    numerical_negation: [
      {
        description: "negates a positive value",
        provider: {
          type: "numerical_negation",
          value: { type: "number_constant", value: 5 },
        },
        expected: { value: -5, errors: [] },
      },
      {
        description: "negates a negative value",
        provider: {
          type: "numerical_negation",
          value: { type: "number_constant", value: -5 },
        },
        expected: { value: 5, errors: [] },
      },
      {
        description: "propagates errors from its child",
        // Wrap ERROR_PROVIDER in a sum so the value is non-zero and avoids -0 edge case
        provider: {
          type: "numerical_negation",
          value: {
            type: "sum",
            values: [ERROR_PROVIDER, { type: "number_constant", value: 3 }],
          },
        },
        expected: { value: -3, errors: [{ type: "divide_by_zero" }] },
      },
    ],
    // Control flow
    logical_negation: [
      {
        description: "returns 1 for a zero input",
        provider: {
          type: "logical_negation",
          value: { type: "number_constant", value: 0 },
        },
        expected: { value: 1, errors: [] },
      },
      {
        description: "returns 0 for a non-zero input",
        provider: {
          type: "logical_negation",
          value: { type: "number_constant", value: 5 },
        },
        expected: { value: 0, errors: [] },
      },
      {
        description: "propagates errors from its child",
        // ERROR_PROVIDER has value 0, so logical_negation returns 1
        provider: { type: "logical_negation", value: ERROR_PROVIDER },
        expected: { value: 1, errors: [{ type: "divide_by_zero" }] },
      },
    ],
    comparison: [
      {
        description: "returns 1 when value is within bounds",
        provider: {
          type: "comparison",
          value: { type: "number_constant", value: 5 },
          minimum: { type: "number_constant", value: 0 },
          maximum: { type: "number_constant", value: 10 },
        },
        expected: { value: 1, errors: [] },
      },
      {
        description: "returns 0 when value exceeds maximum",
        provider: {
          type: "comparison",
          value: { type: "number_constant", value: 15 },
          maximum: { type: "number_constant", value: 10 },
        },
        expected: { value: 0, errors: [] },
      },
      {
        description: "returns 1 when value equals bound (non-strict)",
        provider: {
          type: "comparison",
          value: { type: "number_constant", value: 10 },
          maximum: { type: "number_constant", value: 10 },
        },
        expected: { value: 1, errors: [] },
      },
      {
        description: "returns 0 when value equals bound (strict)",
        provider: {
          type: "comparison",
          value: { type: "number_constant", value: 10 },
          maximum: { type: "number_constant", value: 10 },
          strict: true,
        },
        expected: { value: 0, errors: [] },
      },
      {
        description: "propagates errors from the value being compared",
        // ERROR_PROVIDER value=0, minimum=0: 0 >= 0 is true, so inBounds=true, value=1
        provider: {
          type: "comparison",
          value: ERROR_PROVIDER,
          minimum: { type: "number_constant", value: 0 },
        },
        expected: { value: 1, errors: [{ type: "divide_by_zero" }] },
      },
    ],
    conditional: [
      {
        description: "returns the true branch when condition is non-zero",
        provider: {
          type: "conditional",
          condition: { type: "number_constant", value: 1 },
          trueValue: { type: "number_constant", value: 10 },
          falseValue: { type: "number_constant", value: 20 },
        },
        expected: { value: 10, errors: [] },
      },
      {
        description: "returns the false branch when condition is zero",
        provider: {
          type: "conditional",
          condition: { type: "number_constant", value: 0 },
          trueValue: { type: "number_constant", value: 10 },
          falseValue: { type: "number_constant", value: 20 },
        },
        expected: { value: 20, errors: [] },
      },
      {
        description:
          "propagates errors from the condition and the taken branch",
        // ERROR_PROVIDER value=0, so false branch is taken
        provider: {
          type: "conditional",
          condition: ERROR_PROVIDER,
          trueValue: { type: "number_constant", value: 10 },
          falseValue: { type: "number_constant", value: 20 },
        },
        expected: { value: 20, errors: [{ type: "divide_by_zero" }] },
      },
      {
        description: "does not propagate errors from the untaken branch",
        // condition=1 (non-zero) → take trueValue, falseValue (ERROR_PROVIDER) is not evaluated
        provider: {
          type: "conditional",
          condition: { type: "number_constant", value: 1 },
          trueValue: { type: "number_constant", value: 10 },
          falseValue: ERROR_PROVIDER,
        },
        expected: { value: 10, errors: [] },
      },
    ],
    filing_status_map: [
      {
        description: "returns the value for the matched filing status",
        provider: {
          type: "filing_status_map",
          values: { single: { type: "number_constant", value: 5 } },
        },
        filingStatus: "single",
        expected: { value: 5, errors: [] },
      },
      {
        description:
          "returns the default when no key matches the filing status",
        provider: {
          type: "filing_status_map",
          values: {
            married_filing_jointly: { type: "number_constant", value: 10 },
          },
          default: { type: "number_constant", value: 3 },
        },
        filingStatus: "single",
        expected: { value: 3, errors: [] },
      },
      {
        description: "returns 0 when no key matches and no default is set",
        provider: {
          type: "filing_status_map",
          values: {
            married_filing_jointly: { type: "number_constant", value: 10 },
          },
        },
        filingStatus: "single",
        expected: { value: 0, errors: [] },
      },
      {
        description: "propagates errors from the matched provider",
        provider: {
          type: "filing_status_map",
          values: { single: ERROR_PROVIDER },
        },
        filingStatus: "single",
        expected: { value: 0, errors: [{ type: "divide_by_zero" }] },
      },
    ],
    selection_input: [
      {
        description: "returns 0 when no input is present",
        provider: {
          type: "selection_input",
          options: [
            { label: "A", value: { type: "number_constant", value: 10 } },
          ],
        },
        expected: { value: 0, errors: [] },
      },
      {
        description: "resolves the value of the selected option",
        provider: {
          type: "selection_input",
          options: [
            { label: "A", value: { type: "number_constant", value: 10 } },
            { label: "B", value: { type: "number_constant", value: 20 } },
          ],
        },
        inputs: {
          [BOX_UNDER_TEST_ID]: { type: "selection", selectedIndex: 1 },
        },
        expected: { value: 20, errors: [] },
      },
      {
        description: "propagates errors from the selected option",
        provider: {
          type: "selection_input",
          options: [{ label: "error", value: ERROR_PROVIDER }],
        },
        inputs: {
          [BOX_UNDER_TEST_ID]: { type: "selection", selectedIndex: 0 },
        },
        expected: { value: 0, errors: [{ type: "divide_by_zero" }] },
      },
      {
        description: "returns 0 when selectedIndex is out of bounds",
        provider: {
          type: "selection_input",
          options: [
            { label: "A", value: { type: "number_constant", value: 10 } },
          ],
        },
        inputs: {
          [BOX_UNDER_TEST_ID]: { type: "selection", selectedIndex: 99 },
        },
        expected: { value: 0, errors: [] },
      },
    ],
  };

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("computeWorkbook", () => {
  describe("computing values", () => {
    test.each(
      Object.entries(providerFixtures).flatMap(([type, fixtures]) =>
        fixtures.map((fixture) => ({ type, ...fixture })),
      ),
    )(
      "$type: $description",
      ({ provider, inputs, additionalBoxes, filingStatus, expected }) => {
        const result = runFixture({
          description: "",
          provider,
          inputs,
          additionalBoxes,
          filingStatus,
          expected,
        });
        expect(result).toEqual(expected);
      },
    );
  });

  describe("handling dependencies", () => {
    it("sums box_reference values across all instances of a form class", () => {
      const referencedBoxId = "wages";

      const w2Spec = makeFormSpecFixture({
        class: "fW2",
        sections: [
          makeSectionFixture({
            lines: [
              makeLineFixture({
                index: "1",
                box: makeBoxFixture({
                  identifier: referencedBoxId,
                  value: { type: "number_input" },
                }),
              }),
            ],
          }),
        ],
      });

      const f1040BoxId = "total-wages";
      const f1040Spec = makeFormSpecFixture({
        class: "f1040",
        sections: [
          makeSectionFixture({
            lines: [
              makeLineFixture({
                index: "1",
                box: makeBoxFixture({
                  identifier: f1040BoxId,
                  value: {
                    type: "box_reference",
                    form: "fW2",
                    box: referencedBoxId,
                  },
                }),
              }),
            ],
          }),
        ],
      });

      const w2Instance1 = makeFormInstanceFixture({
        id: "w2-1",
        class: "fW2",
        inputs: { [referencedBoxId]: { type: "number", value: 50000 } },
      });
      const w2Instance2 = makeFormInstanceFixture({
        id: "w2-2",
        class: "fW2",
        inputs: { [referencedBoxId]: { type: "number", value: 30000 } },
      });
      const f1040Instance = makeFormInstanceFixture({
        id: "f1040-1",
        class: "f1040",
      });

      const registry: SpecificationRegistry = { fW2: w2Spec, f1040: f1040Spec };

      const workbook = computeWorkbook(
        registry,
        makeInstancesByClass([w2Instance1, w2Instance2, f1040Instance]),
        "single",
        {},
      );

      expect(workbook["f1040-1"][f1040BoxId]).toEqual({
        value: 80000,
        errors: [],
      });
    });

    it("returns 0 when box_reference with form has no matching instances", () => {
      const f1040BoxId = "total-wages";
      const f1040Spec = makeFormSpecFixture({
        class: "f1040",
        sections: [
          makeSectionFixture({
            lines: [
              makeLineFixture({
                index: "1",
                box: makeBoxFixture({
                  identifier: f1040BoxId,
                  value: { type: "box_reference", form: "fW2", box: "wages" },
                }),
              }),
            ],
          }),
        ],
      });

      const f1040Instance = makeFormInstanceFixture({
        id: "f1040-1",
        class: "f1040",
      });
      const registry: SpecificationRegistry = {
        fW2: makeFormSpecFixture({ class: "fW2" }),
        f1040: f1040Spec,
      };

      const workbook = computeWorkbook(
        registry,
        makeInstancesByClass([f1040Instance]),
        "single",
        {},
      );

      expect(workbook["f1040-1"][f1040BoxId]).toEqual({ value: 0, errors: [] });
    });

    it("resolves multi-level dependency chains in topological order", () => {
      const spec = makeFormSpecFixture({
        class: "fW2",
        sections: [
          makeSectionFixture({
            lines: [
              makeLineFixture({
                index: "1",
                box: makeBoxFixture({
                  identifier: "box-a",
                  value: { type: "number_constant", value: 5 },
                }),
              }),
              makeLineFixture({
                index: "2",
                box: makeBoxFixture({
                  identifier: "box-b",
                  value: { type: "box_reference", box: "box-a" },
                }),
              }),
              makeLineFixture({
                index: "3",
                box: makeBoxFixture({
                  identifier: "box-c",
                  value: { type: "box_reference", box: "box-b" },
                }),
              }),
            ],
          }),
        ],
      });

      const instance = makeFormInstanceFixture({ id: "inst-1", class: "fW2" });
      const registry: SpecificationRegistry = {
        fW2: spec,
        f1040: makeFormSpecFixture({ class: "f1040" }),
      };

      const workbook = computeWorkbook(
        registry,
        { fW2: [instance] },
        "single",
        {},
      );

      expect(workbook["inst-1"]["box-c"]).toEqual({ value: 5, errors: [] });
    });

    it("returns the count of instances of a form class", () => {
      const spec = makeFormSpecFixture({
        class: "f1040",
        sections: [
          makeSectionFixture({
            lines: [
              makeLineFixture({
                index: "1",
                box: makeBoxFixture({
                  identifier: "w2-count",
                  value: { type: "form_instance_count", form: "fW2" },
                }),
              }),
            ],
          }),
        ],
      });

      const w2a = makeFormInstanceFixture({ id: "w2-a", class: "fW2" });
      const w2b = makeFormInstanceFixture({ id: "w2-b", class: "fW2" });
      const f1040 = makeFormInstanceFixture({ id: "f1040-1", class: "f1040" });

      const registry: SpecificationRegistry = {
        fW2: makeFormSpecFixture({ class: "fW2" }),
        f1040: spec,
      };

      const workbook = computeWorkbook(
        registry,
        makeInstancesByClass([w2a, w2b, f1040]),
        "single",
        {},
      );

      expect(workbook["f1040-1"]["w2-count"]).toEqual({ value: 2, errors: [] });
    });
  });

  describe("preserving referential equality", () => {
    function makeSingleBoxSpec(boxId: string, provider: ValueProvider) {
      return makeFormSpecFixture({
        class: "fW2",
        sections: [
          makeSectionFixture({
            lines: [
              makeLineFixture({
                index: "1",
                box: makeBoxFixture({ identifier: boxId, value: provider }),
              }),
            ],
          }),
        ],
      });
    }

    const defaultRegistry = (
      spec: ReturnType<typeof makeFormSpecFixture>,
    ): SpecificationRegistry => ({
      fW2: spec,
      f1040: makeFormSpecFixture({ class: "f1040" }),
    });

    it("preserves box reference when resolved value and errors are unchanged", () => {
      const spec = makeSingleBoxSpec("box-1", {
        type: "number_constant",
        value: 42,
      });
      const resolvedBox: ResolvedBox = { value: 42, errors: [] };
      const currentWorkbook: Workbook = { "inst-1": { "box-1": resolvedBox } };
      const instance = makeFormInstanceFixture({ id: "inst-1", class: "fW2" });

      const newWorkbook = computeWorkbook(
        defaultRegistry(spec),
        { fW2: [instance] },
        "single",
        currentWorkbook,
      );

      expect(newWorkbook["inst-1"]["box-1"]).toBe(resolvedBox);
    });

    it("creates new box reference when resolved value changes", () => {
      const spec = makeSingleBoxSpec("box-1", {
        type: "number_constant",
        value: 99,
      });
      const oldResolvedBox: ResolvedBox = { value: 42, errors: [] };
      const currentWorkbook: Workbook = {
        "inst-1": { "box-1": oldResolvedBox },
      };
      const instance = makeFormInstanceFixture({ id: "inst-1", class: "fW2" });

      const newWorkbook = computeWorkbook(
        defaultRegistry(spec),
        { fW2: [instance] },
        "single",
        currentWorkbook,
      );

      expect(newWorkbook["inst-1"]["box-1"]).not.toBe(oldResolvedBox);
      expect(newWorkbook["inst-1"]["box-1"]).toEqual({ value: 99, errors: [] });
    });

    it("creates new box reference when errors change even if value is unchanged", () => {
      const spec = makeSingleBoxSpec("box-1", {
        type: "quotient",
        dividend: { type: "number_constant", value: 0 },
        divisor: { type: "number_constant", value: 0 },
      });
      const oldResolvedBox: ResolvedBox = { value: 0, errors: [] };
      const currentWorkbook: Workbook = {
        "inst-1": { "box-1": oldResolvedBox },
      };
      const instance = makeFormInstanceFixture({ id: "inst-1", class: "fW2" });

      const newWorkbook = computeWorkbook(
        defaultRegistry(spec),
        { fW2: [instance] },
        "single",
        currentWorkbook,
      );

      expect(newWorkbook["inst-1"]["box-1"]).not.toBe(oldResolvedBox);
      expect(newWorkbook["inst-1"]["box-1"]).toEqual({
        value: 0,
        errors: [{ type: "divide_by_zero" }],
      });
    });

    it("preserves box reference when upstream dependencies change but own value is unchanged", () => {
      const spec = makeFormSpecFixture({
        class: "fW2",
        sections: [
          makeSectionFixture({
            lines: [
              makeLineFixture({
                index: "1",
                box: makeBoxFixture({
                  identifier: "box-a",
                  value: { type: "number_input" },
                }),
              }),
              makeLineFixture({
                index: "2",
                box: makeBoxFixture({
                  identifier: "box-b",
                  value: {
                    type: "maximum",
                    values: [
                      { type: "box_reference", box: "box-a" },
                      { type: "number_constant", value: 100 },
                    ],
                  },
                }),
              }),
            ],
          }),
        ],
      });
      const registry: SpecificationRegistry = {
        fW2: spec,
        f1040: makeFormSpecFixture({ class: "f1040" }),
      };

      const instance1 = makeFormInstanceFixture({
        id: "inst-1",
        class: "fW2",
        inputs: { "box-a": { type: "number", value: 50 } },
      });
      const workbook1 = computeWorkbook(
        registry,
        { fW2: [instance1] },
        "single",
        {},
      );
      const boxBRef = workbook1["inst-1"]["box-b"];
      expect(boxBRef).toEqual({ value: 100, errors: [] });

      const instance2 = makeFormInstanceFixture({
        id: "inst-1",
        class: "fW2",
        inputs: { "box-a": { type: "number", value: 75 } },
      });
      const workbook2 = computeWorkbook(
        registry,
        { fW2: [instance2] },
        "single",
        workbook1,
      );

      expect(workbook2["inst-1"]["box-b"]).toBe(boxBRef);
    });

    it("creates new form instance record reference when any of its boxes change", () => {
      const spec = makeFormSpecFixture({
        class: "fW2",
        sections: [
          makeSectionFixture({
            lines: [
              makeLineFixture({
                index: "1",
                box: makeBoxFixture({
                  identifier: "box-1",
                  value: { type: "number_input" },
                }),
              }),
              makeLineFixture({
                index: "2",
                box: makeBoxFixture({
                  identifier: "box-2",
                  value: { type: "number_constant", value: 0 },
                }),
              }),
            ],
          }),
        ],
      });
      const registry: SpecificationRegistry = {
        fW2: spec,
        f1040: makeFormSpecFixture({ class: "f1040" }),
      };

      const oldInstanceRecord: Record<string, ResolvedBox> = {
        "box-1": { value: 10, errors: [] },
        "box-2": { value: 0, errors: [] },
      };
      const currentWorkbook: Workbook = { "inst-1": oldInstanceRecord };
      const instance = makeFormInstanceFixture({
        id: "inst-1",
        class: "fW2",
        inputs: { "box-1": { type: "number", value: 20 } },
      });

      const newWorkbook = computeWorkbook(
        registry,
        { fW2: [instance] },
        "single",
        currentWorkbook,
      );

      expect(newWorkbook["inst-1"]).not.toBe(oldInstanceRecord);
      expect(newWorkbook["inst-1"]["box-2"]).toBe(oldInstanceRecord["box-2"]);
    });

    it("preserves form instance record reference when none of its boxes change", () => {
      const spec = makeSingleBoxSpec("box-1", {
        type: "number_constant",
        value: 42,
      });
      const instanceRecord: Record<string, ResolvedBox> = {
        "box-1": { value: 42, errors: [] },
      };
      const currentWorkbook: Workbook = { "inst-1": instanceRecord };
      const instance = makeFormInstanceFixture({ id: "inst-1", class: "fW2" });

      const newWorkbook = computeWorkbook(
        defaultRegistry(spec),
        { fW2: [instance] },
        "single",
        currentWorkbook,
      );

      expect(newWorkbook["inst-1"]).toBe(instanceRecord);
    });

    it("carries over workbook entries not recomputed in the current call", () => {
      const oldRecord: Record<string, ResolvedBox> = {
        "some-box": { value: 999, errors: [] },
      };
      const currentWorkbook: Workbook = { "f1040-old": oldRecord };

      const fW2Instance = makeFormInstanceFixture({
        id: "fw2-1",
        class: "fW2",
      });
      const registry: SpecificationRegistry = {
        fW2: makeFormSpecFixture({ class: "fW2" }),
        f1040: makeFormSpecFixture({ class: "f1040" }),
      };

      const newWorkbook = computeWorkbook(
        registry,
        { fW2: [fW2Instance] },
        "single",
        currentWorkbook,
      );

      expect(newWorkbook["f1040-old"]).toBe(oldRecord);
    });

    it("does not mutate the old workbook or its nested records", () => {
      const spec = makeSingleBoxSpec("box-1", {
        type: "number_constant",
        value: 99,
      });
      const oldResolvedBox: ResolvedBox = { value: 0, errors: [] };
      const oldInstanceRecord: Record<string, ResolvedBox> = {
        "box-1": oldResolvedBox,
      };
      const currentWorkbook: Workbook = { "inst-1": oldInstanceRecord };

      Object.freeze(currentWorkbook);
      Object.freeze(oldInstanceRecord);
      Object.freeze(oldResolvedBox);

      const instance = makeFormInstanceFixture({ id: "inst-1", class: "fW2" });

      expect(() => {
        computeWorkbook(
          defaultRegistry(spec),
          { fW2: [instance] },
          "single",
          currentWorkbook,
        );
      }).not.toThrow();

      expect(currentWorkbook["inst-1"]).toBe(oldInstanceRecord);
      expect(oldInstanceRecord["box-1"]).toBe(oldResolvedBox);
      expect(oldResolvedBox.value).toBe(0);
    });
  });
});
