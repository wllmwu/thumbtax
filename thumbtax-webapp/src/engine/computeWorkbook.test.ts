import { describe, expect, it } from "vitest";

import { computeWorkbook } from "#src/engine/computeWorkbook";
import {
  makeBoxFixture,
  makeBoxFixtureMultiColumn,
  makeLineFixture,
  makeLineFixtureMultiColumn,
  makeRegistryFixture,
  makeSectionFixture,
  makeSectionFixtureMultiColumn,
  makeSpecificationFixture,
} from "#src/specifications/test/fixtures";

import type { FilingStatus } from "#src/common/types/filingStatus";
import type { FormClass } from "#src/common/types/formClass";
import type {
  FormInstance,
  InstanceRegistry,
} from "#src/common/types/formInstance";
import type { FormInstanceId } from "#src/common/types/formInstanceId";
import type { ResolvedBox, Workbook } from "#src/common/types/workbook";
import type { SpecificationRegistry } from "#src/specifications/types/specificationRegistry";
import type { ValueProvider } from "#src/specifications/types/valueProvider";

function makeInstanceFixture(overrides?: Partial<FormInstance>): FormInstance {
  return {
    id: "instance-1",
    class: "fW2",
    label: "",
    inputs: {},
    ...overrides,
  };
}

type ValueProviderFixture = {
  description: string;
  provider?: ValueProvider;
  specificationRegistry?: SpecificationRegistry;
  filingStatus?: FilingStatus;
  instanceRegistry?: InstanceRegistry;
  expected: ResolvedBox;
};

const TEST_CLASS: FormClass = "fW2";
const TEST_INSTANCE_ID = "instance-1";
const BOX_UNDER_TEST_ID = "box-under-test";

function makeTestData(fixture: Omit<ValueProviderFixture, "description">): {
  specificationRegistry: SpecificationRegistry;
  filingStatus: FilingStatus;
  instanceRegistry: InstanceRegistry;
  expected: ResolvedBox;
} {
  const specificationRegistry = fixture.provider
    ? makeRegistryFixture({
        [TEST_CLASS]: makeSpecificationFixture({
          class: TEST_CLASS,
          sections: [
            makeSectionFixture({
              lines: [
                makeLineFixture({
                  box: makeBoxFixture({
                    identifier: BOX_UNDER_TEST_ID,
                    value: fixture.provider,
                  }),
                }),
              ],
            }),
          ],
        }),
      })
    : fixture.specificationRegistry;

  if (!specificationRegistry) {
    throw new Error("No provider or specification registry given");
  }

  return {
    specificationRegistry,
    filingStatus: "single",
    instanceRegistry: {
      [TEST_CLASS]: [
        makeInstanceFixture({ id: TEST_INSTANCE_ID, class: TEST_CLASS }),
      ],
    },
    ...fixture,
  };
}

const ERROR_PROVIDER: ValueProvider = {
  type: "quotient",
  dividend: { type: "number_constant", value: 1 },
  divisor: { type: "number_constant", value: 0 },
};

const providerFixtures: Record<ValueProvider["type"], ValueProviderFixture[]> =
  {
    number_constant: [
      {
        description: "resolves to value",
        provider: { type: "number_constant", value: 42 },
        expected: { value: 42, errors: [] },
      },
      {
        description: "resolves to negative value",
        provider: { type: "number_constant", value: -5 },
        expected: { value: -5, errors: [] },
      },
      {
        description: "resolves to non-integer value",
        provider: { type: "number_constant", value: 1.25 },
        expected: { value: 1.25, errors: [] },
      },
    ],
    number_input: [
      {
        description: "resolves to 0 when input is not present",
        provider: { type: "number_input" },
        expected: { value: 0, errors: [] },
      },
      {
        description: "resolves to user's input",
        provider: { type: "number_input" },
        instanceRegistry: {
          [TEST_CLASS]: [
            makeInstanceFixture({
              id: TEST_INSTANCE_ID,
              inputs: { [BOX_UNDER_TEST_ID]: { type: "number", value: 123 } },
            }),
          ],
        },
        expected: { value: 123, errors: [] },
      },
    ],
    checkbox_input: [
      {
        description: "resolves to 0 when input is not present",
        provider: { type: "checkbox_input" },
        expected: { value: 0, errors: [] },
      },
      {
        description: "resolves to user's input",
        provider: { type: "checkbox_input" },
        instanceRegistry: {
          [TEST_CLASS]: [
            makeInstanceFixture({
              id: TEST_INSTANCE_ID,
              inputs: { [BOX_UNDER_TEST_ID]: { type: "number", value: 1 } },
            }),
          ],
        },
        expected: { value: 1, errors: [] },
      },
      {
        description: "resolves to 1 for non-zero input",
        provider: { type: "checkbox_input" },
        instanceRegistry: {
          [TEST_CLASS]: [
            makeInstanceFixture({
              id: TEST_INSTANCE_ID,
              inputs: { [BOX_UNDER_TEST_ID]: { type: "number", value: 3 } },
            }),
          ],
        },
        expected: { value: 1, errors: [] },
      },
    ],
    list_amounts_input: [
      {
        description: "resolves to 0 when input is not present",
        provider: { type: "list_amounts_input" },
        expected: { value: 0, errors: [] },
      },
      {
        description: "resolves to 0 when there are no entries",
        provider: { type: "list_amounts_input" },
        instanceRegistry: {
          [TEST_CLASS]: [
            makeInstanceFixture({
              id: TEST_INSTANCE_ID,
              inputs: {
                [BOX_UNDER_TEST_ID]: { type: "amount_list", value: [] },
              },
            }),
          ],
        },
        expected: { value: 0, errors: [] },
      },
      {
        description: "resolves to sum of amounts",
        provider: { type: "list_amounts_input" },
        instanceRegistry: {
          [TEST_CLASS]: [
            makeInstanceFixture({
              id: TEST_INSTANCE_ID,
              inputs: {
                [BOX_UNDER_TEST_ID]: {
                  type: "amount_list",
                  value: [
                    { label: "A", amount: 20 },
                    { label: "B", amount: 10 },
                  ],
                },
              },
            }),
          ],
        },
        expected: { value: 30, errors: [] },
      },
    ],
    override_number_input: [
      {
        description: "resolves to override when not null",
        provider: {
          type: "override_number_input",
          computedValue: { type: "number_constant", value: 10 },
        },
        instanceRegistry: {
          [TEST_CLASS]: [
            makeInstanceFixture({
              id: TEST_INSTANCE_ID,
              inputs: {
                [BOX_UNDER_TEST_ID]: {
                  type: "override",
                  override: 20,
                },
              },
            }),
          ],
        },
        expected: { value: 20, errors: [] },
      },
      {
        description: "resolves to computed value when override is null",
        provider: {
          type: "override_number_input",
          computedValue: { type: "number_constant", value: 10 },
        },
        instanceRegistry: {
          [TEST_CLASS]: [
            makeInstanceFixture({
              id: TEST_INSTANCE_ID,
              inputs: {
                [BOX_UNDER_TEST_ID]: {
                  type: "override",
                  override: null,
                },
              },
            }),
          ],
        },
        expected: { value: 10, errors: [] },
      },
      {
        description: "resolves to computed value when input is not present",
        provider: {
          type: "override_number_input",
          computedValue: { type: "number_constant", value: 10 },
        },
        expected: { value: 10, errors: [] },
      },
    ],
    unused: [
      {
        description: "resolves to 0",
        provider: { type: "unused" },
        expected: { value: 0, errors: [] },
      },
    ],
    unsupported: [
      {
        description: "resolves to 0",
        provider: { type: "unsupported" },
        expected: { value: 0, errors: [] },
      },
    ],
    form_instance_count: [
      {
        description: "resolves to number of form instances",
        provider: { type: "form_instance_count", form: "f1040" },
        instanceRegistry: {
          f1040: [
            makeInstanceFixture({ id: "1040-1", class: "f1040" }),
            makeInstanceFixture({ id: "1040-2", class: "f1040" }),
            makeInstanceFixture({ id: "1040-3", class: "f1040" }),
          ],
          [TEST_CLASS]: [
            makeInstanceFixture({ id: TEST_INSTANCE_ID, class: TEST_CLASS }),
            makeInstanceFixture({ id: "W2-2", class: TEST_CLASS }),
          ],
        },
        expected: { value: 3, errors: [] },
      },
      {
        description: "resolves to 0 when the class is not present",
        provider: { type: "form_instance_count", form: "f1040" },
        instanceRegistry: {
          [TEST_CLASS]: [
            makeInstanceFixture({ id: TEST_INSTANCE_ID, class: TEST_CLASS }),
            makeInstanceFixture({ id: "W2-2", class: TEST_CLASS }),
          ],
        },
        expected: { value: 0, errors: [] },
      },
    ],
    box_reference: [
      {
        description: "resolves to the referenced box's value in the same form",
        specificationRegistry: makeRegistryFixture({
          [TEST_CLASS]: makeSpecificationFixture({
            class: TEST_CLASS,
            sections: [
              makeSectionFixture({
                lines: [
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: "box-1",
                      value: { type: "number_constant", value: 10 },
                    }),
                  }),
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: "box-2",
                      value: { type: "number_constant", value: 20 },
                    }),
                  }),
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: BOX_UNDER_TEST_ID,
                      value: { type: "box_reference", box: "box-2" },
                    }),
                  }),
                ],
              }),
            ],
          }),
        }),
        expected: { value: 20, errors: [] },
      },
      {
        description:
          "resolves to the sum of the referenced box's values across all instances when form is given",
        specificationRegistry: makeRegistryFixture({
          [TEST_CLASS]: makeSpecificationFixture({
            class: TEST_CLASS,
            sections: [
              makeSectionFixture({
                lines: [
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: BOX_UNDER_TEST_ID,
                      value: {
                        type: "box_reference",
                        form: "f1040",
                        box: "box-2",
                      },
                    }),
                  }),
                ],
              }),
            ],
          }),
          f1040: makeSpecificationFixture({
            class: "f1040",
            sections: [
              makeSectionFixture({
                lines: [
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: "box-1",
                      value: { type: "number_constant", value: 10 },
                    }),
                  }),
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: "box-2",
                      value: { type: "number_constant", value: 20 },
                    }),
                  }),
                ],
              }),
            ],
          }),
        }),
        instanceRegistry: {
          f1040: [
            makeInstanceFixture({ id: "1040-1", class: "f1040" }),
            makeInstanceFixture({ id: "1040-2", class: "f1040" }),
          ],
          [TEST_CLASS]: [
            makeInstanceFixture({ id: TEST_INSTANCE_ID, class: TEST_CLASS }),
          ],
        },
        expected: { value: 40, errors: [] },
      },
      {
        description: "resolves to 0 when the box does not exist",
        provider: {
          type: "box_reference",
          form: "f1040",
          box: "box-2",
        },
        expected: { value: 0, errors: [] },
      },
      {
        description: "resolves to 0 when no instances of the form exist",
        specificationRegistry: makeRegistryFixture({
          [TEST_CLASS]: makeSpecificationFixture({
            class: TEST_CLASS,
            sections: [
              makeSectionFixture({
                lines: [
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: BOX_UNDER_TEST_ID,
                      value: {
                        type: "box_reference",
                        form: "f1040",
                        box: "box-2",
                      },
                    }),
                  }),
                ],
              }),
            ],
          }),
          f1040: makeSpecificationFixture({
            class: "f1040",
            sections: [
              makeSectionFixture({
                lines: [
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: "box-1",
                      value: { type: "number_constant", value: 10 },
                    }),
                  }),
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: "box-2",
                      value: { type: "number_constant", value: 20 },
                    }),
                  }),
                ],
              }),
            ],
          }),
        }),
        expected: { value: 0, errors: [] },
      },
      {
        description: "works when the referenced line has multiple columns",
        specificationRegistry: makeRegistryFixture({
          [TEST_CLASS]: makeSpecificationFixture({
            class: TEST_CLASS,
            sections: [
              makeSectionFixtureMultiColumn({
                columns: [{ index: "(a)" }, { index: "(b)" }],
                lines: [
                  makeLineFixtureMultiColumn({
                    boxes: [
                      makeBoxFixtureMultiColumn({
                        identifier: "1(a)",
                        value: { type: "number_constant", value: 10 },
                      }),
                      makeBoxFixtureMultiColumn({
                        identifier: "1(b)",
                        value: { type: "number_constant", value: 20 },
                      }),
                    ],
                  }),
                ],
              }),
              makeSectionFixture({
                lines: [
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: BOX_UNDER_TEST_ID,
                      value: { type: "box_reference", box: "1(b)" },
                    }),
                  }),
                ],
              }),
            ],
          }),
        }),
        expected: { value: 20, errors: [] },
      },
      {
        description: "propagates errors from the referenced box",
        specificationRegistry: makeRegistryFixture({
          [TEST_CLASS]: makeSpecificationFixture({
            class: TEST_CLASS,
            sections: [
              makeSectionFixture({
                lines: [
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: "box-1",
                      value: ERROR_PROVIDER,
                    }),
                  }),
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: BOX_UNDER_TEST_ID,
                      value: { type: "box_reference", box: "box-1" },
                    }),
                  }),
                ],
              }),
            ],
          }),
        }),
        expected: {
          value: 0,
          errors: [
            {
              type: "upstream",
              sourceAddress: {
                instance: TEST_INSTANCE_ID,
                box: "box-1",
              },
            },
          ],
        },
      },
    ],
    sum: [
      {
        description: "resolves to the sum of its values",
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
        description: "resolves to 0 for an empty values array",
        provider: { type: "sum", values: [] },
        expected: { value: 0, errors: [] },
      },
      {
        description: "propagates errors",
        provider: {
          type: "sum",
          values: [ERROR_PROVIDER, { type: "number_constant", value: 2 }],
        },
        expected: { value: 2, errors: [{ type: "divide_by_zero" }] },
      },
    ],
    difference: [
      {
        description: "resolves to minuend minus subtrahend",
        provider: {
          type: "difference",
          minuend: { type: "number_constant", value: 10 },
          subtrahend: { type: "number_constant", value: 3 },
        },
        expected: { value: 7, errors: [] },
      },
      {
        description: "propagates errors",
        provider: {
          type: "difference",
          minuend: ERROR_PROVIDER,
          subtrahend: ERROR_PROVIDER,
        },
        expected: {
          value: 0,
          errors: [{ type: "divide_by_zero" }, { type: "divide_by_zero" }],
        },
      },
    ],
    product: [
      {
        description: "resolves to the product of its values",
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
        description: "resolves to 0 for an empty values array",
        provider: { type: "product", values: [] },
        expected: { value: 0, errors: [] },
      },
      {
        description: "propagates errors",
        provider: {
          type: "product",
          values: [{ type: "number_constant", value: 3 }, ERROR_PROVIDER],
        },
        expected: { value: 0, errors: [{ type: "divide_by_zero" }] },
      },
    ],
    quotient: [
      {
        description: "resolves to dividend divided by divisor",
        provider: {
          type: "quotient",
          dividend: { type: "number_constant", value: 10 },
          divisor: { type: "number_constant", value: 4 },
        },
        expected: { value: 2.5, errors: [] },
      },
      {
        description:
          "resolves to 0 with divide_by_zero error when divisor is 0",
        provider: {
          type: "quotient",
          dividend: { type: "number_constant", value: 5 },
          divisor: { type: "number_constant", value: 0 },
        },
        expected: { value: 0, errors: [{ type: "divide_by_zero" }] },
      },
      {
        description: "propagates errors",
        provider: {
          type: "quotient",
          dividend: ERROR_PROVIDER,
          divisor: ERROR_PROVIDER,
        },
        expected: {
          value: 0,
          errors: [
            { type: "divide_by_zero" },
            { type: "divide_by_zero" },
            { type: "divide_by_zero" },
          ],
        },
      },
      {
        description: 'rounds down when round is "down"',
        provider: {
          type: "quotient",
          dividend: { type: "number_constant", value: 7 },
          divisor: { type: "number_constant", value: 2 },
          round: "down",
        },
        expected: { value: 3, errors: [] },
      },
      {
        description: 'rounds up when round is "up"',
        provider: {
          type: "quotient",
          dividend: { type: "number_constant", value: 7 },
          divisor: { type: "number_constant", value: 2 },
          round: "up",
        },
        expected: { value: 4, errors: [] },
      },
    ],
    minimum: [
      {
        description: "resolves to the minimum of its values",
        provider: {
          type: "minimum",
          values: [
            { type: "number_constant", value: 4 },
            { type: "number_constant", value: 7 },
            { type: "number_constant", value: 3 },
          ],
        },
        expected: { value: 3, errors: [] },
      },
      {
        description: "resolves to the minimum including negative values",
        provider: {
          type: "minimum",
          values: [
            { type: "number_constant", value: -4 },
            { type: "number_constant", value: 7 },
            { type: "number_constant", value: 3 },
          ],
        },
        expected: { value: -4, errors: [] },
      },
      {
        description: "resolves to 0 for an empty values array",
        provider: { type: "minimum", values: [] },
        expected: { value: 0, errors: [] },
      },
      {
        description: "propagates errors",
        provider: {
          type: "minimum",
          values: [{ type: "number_constant", value: -5 }, ERROR_PROVIDER],
        },
        expected: { value: -5, errors: [{ type: "divide_by_zero" }] },
      },
    ],
    maximum: [
      {
        description: "resolves to the maximum of its values",
        provider: {
          type: "maximum",
          values: [
            { type: "number_constant", value: 4 },
            { type: "number_constant", value: 7 },
            { type: "number_constant", value: 3 },
          ],
        },
        expected: { value: 7, errors: [] },
      },
      {
        description: "resolves to the maximum including negative values",
        provider: {
          type: "maximum",
          values: [
            { type: "number_constant", value: -4 },
            { type: "number_constant", value: -7 },
            { type: "number_constant", value: -3 },
          ],
        },
        expected: { value: -3, errors: [] },
      },
      {
        description: "resolves to 0 for an empty values array",
        provider: { type: "maximum", values: [] },
        expected: { value: 0, errors: [] },
      },
      {
        description: "propagates errors",
        provider: {
          type: "maximum",
          values: [{ type: "number_constant", value: 5 }, ERROR_PROVIDER],
        },
        expected: { value: 5, errors: [{ type: "divide_by_zero" }] },
      },
    ],
    absolute_value: [
      {
        description: "resolves to the absolute value of a positive number",
        provider: {
          type: "absolute_value",
          value: { type: "number_constant", value: 5 },
        },
        expected: { value: 5, errors: [] },
      },
      {
        description: "resolves to the absolute value of a negative number",
        provider: {
          type: "absolute_value",
          value: { type: "number_constant", value: -5 },
        },
        expected: { value: 5, errors: [] },
      },
      {
        description: "propagates errors",
        provider: { type: "absolute_value", value: ERROR_PROVIDER },
        expected: { value: 0, errors: [{ type: "divide_by_zero" }] },
      },
    ],
    non_negative_clamp: [
      {
        description: "resolves to the value when it is non-negative",
        provider: {
          type: "non_negative_clamp",
          value: { type: "number_constant", value: 5 },
        },
        expected: { value: 5, errors: [] },
      },
      {
        description: "resolves to 0 when the value is negative",
        provider: {
          type: "non_negative_clamp",
          value: { type: "number_constant", value: -5 },
        },
        expected: { value: 0, errors: [] },
      },
      {
        description: "propagates errors",
        provider: { type: "non_negative_clamp", value: ERROR_PROVIDER },
        expected: { value: 0, errors: [{ type: "divide_by_zero" }] },
      },
    ],
    numerical_negation: [
      {
        description: "resolves to the negative of a positive value",
        provider: {
          type: "numerical_negation",
          value: { type: "number_constant", value: 5 },
        },
        expected: { value: -5, errors: [] },
      },
      {
        description: "resolves to the negative of a negative value",
        provider: {
          type: "numerical_negation",
          value: { type: "number_constant", value: -5 },
        },
        expected: { value: 5, errors: [] },
      },
      {
        description: "propagates errors",
        provider: {
          type: "numerical_negation",
          value: ERROR_PROVIDER,
        },
        expected: { value: -0, errors: [{ type: "divide_by_zero" }] },
      },
    ],
    logical_negation: [
      {
        description: "resolves to 1 when value is 0",
        provider: {
          type: "logical_negation",
          value: { type: "number_constant", value: 0 },
        },
        expected: { value: 1, errors: [] },
      },
      {
        description: "resolves to 0 when value is not 0",
        provider: {
          type: "logical_negation",
          value: { type: "number_constant", value: 5 },
        },
        expected: { value: 0, errors: [] },
      },
      {
        description: "propagates errors",
        provider: { type: "logical_negation", value: ERROR_PROVIDER },
        expected: { value: 1, errors: [{ type: "divide_by_zero" }] },
      },
    ],
    comparison: [
      {
        description: "resolves to 1 when value is within bounds",
        provider: {
          type: "comparison",
          value: { type: "number_constant", value: 5 },
          minimum: { type: "number_constant", value: 0 },
          maximum: { type: "number_constant", value: 10 },
        },
        expected: { value: 1, errors: [] },
      },
      {
        description: "resolves to 0 when value is greater than maximum",
        provider: {
          type: "comparison",
          value: { type: "number_constant", value: 15 },
          maximum: { type: "number_constant", value: 10 },
        },
        expected: { value: 0, errors: [] },
      },
      {
        description: "resolves to 1 when not strict and value equals maximum",
        provider: {
          type: "comparison",
          value: { type: "number_constant", value: 10 },
          maximum: { type: "number_constant", value: 10 },
        },
        expected: { value: 1, errors: [] },
      },
      {
        description: "resolves to 0 when strict and value equals maximum",
        provider: {
          type: "comparison",
          value: { type: "number_constant", value: 10 },
          maximum: { type: "number_constant", value: 10 },
          strict: true,
        },
        expected: { value: 0, errors: [] },
      },
      {
        description: "resolves to 0 when value is less than minimum",
        provider: {
          type: "comparison",
          value: { type: "number_constant", value: 5 },
          minimum: { type: "number_constant", value: 10 },
        },
        expected: { value: 0, errors: [] },
      },
      {
        description: "resolves to 1 when not strict and value equals minimum",
        provider: {
          type: "comparison",
          value: { type: "number_constant", value: 10 },
          minimum: { type: "number_constant", value: 10 },
        },
        expected: { value: 1, errors: [] },
      },
      {
        description: "resolves to 0 when strict and value equals minimum",
        provider: {
          type: "comparison",
          value: { type: "number_constant", value: 10 },
          minimum: { type: "number_constant", value: 10 },
          strict: true,
        },
        expected: { value: 0, errors: [] },
      },
      {
        description: "propagates errors",
        provider: {
          type: "comparison",
          value: ERROR_PROVIDER,
          minimum: ERROR_PROVIDER,
          maximum: ERROR_PROVIDER,
        },
        expected: {
          value: 1,
          errors: [
            { type: "divide_by_zero" },
            { type: "divide_by_zero" },
            { type: "divide_by_zero" },
          ],
        },
      },
    ],
    conditional: [
      {
        description: "resolves to the true branch when condition is non-zero",
        provider: {
          type: "conditional",
          condition: { type: "number_constant", value: 1 },
          trueValue: { type: "number_constant", value: 10 },
          falseValue: { type: "number_constant", value: 20 },
        },
        expected: { value: 10, errors: [] },
      },
      {
        description: "resolves to the false branch when condition is zero",
        provider: {
          type: "conditional",
          condition: { type: "number_constant", value: 0 },
          trueValue: { type: "number_constant", value: 10 },
          falseValue: { type: "number_constant", value: 20 },
        },
        expected: { value: 20, errors: [] },
      },
      {
        description: "propagates errors excluding the skipped branch",
        provider: {
          type: "conditional",
          condition: ERROR_PROVIDER,
          trueValue: ERROR_PROVIDER,
          falseValue: ERROR_PROVIDER,
        },
        expected: {
          value: 0,
          errors: [{ type: "divide_by_zero" }, { type: "divide_by_zero" }],
        },
      },
    ],
    filing_status_map: [
      {
        description: "resolves to the value for the matched filing status",
        provider: {
          type: "filing_status_map",
          values: {
            single: { type: "number_constant", value: 5 },
            married_filing_jointly: { type: "number_constant", value: 10 },
          },
          default: { type: "number_constant", value: 15 },
        },
        filingStatus: "single",
        expected: { value: 5, errors: [] },
      },
      {
        description:
          "resolves to the default when no key matches the filing status",
        provider: {
          type: "filing_status_map",
          values: {
            single: { type: "number_constant", value: 10 },
          },
          default: { type: "number_constant", value: 3 },
        },
        filingStatus: "married_filing_jointly",
        expected: { value: 3, errors: [] },
      },
      {
        description: "resolves to 0 when no key matches and no default is set",
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
          values: {
            single: ERROR_PROVIDER,
            married_filing_jointly: ERROR_PROVIDER,
            married_filing_separately: ERROR_PROVIDER,
            head_of_household: ERROR_PROVIDER,
            qualifying_surviving_spouse: ERROR_PROVIDER,
          },
          default: ERROR_PROVIDER,
        },
        filingStatus: "head_of_household",
        expected: { value: 0, errors: [{ type: "divide_by_zero" }] },
      },
      {
        description: "propagates errors from the default",
        provider: {
          type: "filing_status_map",
          values: {
            single: ERROR_PROVIDER,
          },
          default: ERROR_PROVIDER,
        },
        filingStatus: "head_of_household",
        expected: { value: 0, errors: [{ type: "divide_by_zero" }] },
      },
    ],
    selection_input: [
      {
        description: "resolves to 0 when no input is present",
        provider: {
          type: "selection_input",
          options: [
            { label: "A", value: { type: "number_constant", value: 10 } },
          ],
        },
        expected: { value: 0, errors: [] },
      },
      {
        description: "resolves to the value of the selected option",
        provider: {
          type: "selection_input",
          options: [
            { label: "A", value: { type: "number_constant", value: 10 } },
            { label: "B", value: { type: "number_constant", value: 20 } },
            { label: "C", value: { type: "number_constant", value: 30 } },
          ],
        },
        instanceRegistry: {
          [TEST_CLASS]: [
            makeInstanceFixture({
              id: TEST_INSTANCE_ID,
              inputs: {
                [BOX_UNDER_TEST_ID]: { type: "selection", selectedIndex: 1 },
              },
            }),
          ],
        },
        expected: { value: 20, errors: [] },
      },
      {
        description: "propagates errors from the selected option",
        provider: {
          type: "selection_input",
          options: [
            { label: "A", value: ERROR_PROVIDER },
            { label: "B", value: ERROR_PROVIDER },
            { label: "C", value: ERROR_PROVIDER },
          ],
        },
        instanceRegistry: {
          [TEST_CLASS]: [
            makeInstanceFixture({
              id: TEST_INSTANCE_ID,
              inputs: {
                [BOX_UNDER_TEST_ID]: { type: "selection", selectedIndex: 1 },
              },
            }),
          ],
        },
        expected: { value: 0, errors: [{ type: "divide_by_zero" }] },
      },
      {
        description: "resolves to 0 when selectedIndex is out of bounds",
        provider: {
          type: "selection_input",
          options: [
            { label: "A", value: { type: "number_constant", value: 10 } },
          ],
        },
        instanceRegistry: {
          [TEST_CLASS]: [
            makeInstanceFixture({
              id: TEST_INSTANCE_ID,
              inputs: {
                [BOX_UNDER_TEST_ID]: { type: "selection", selectedIndex: 1 },
              },
            }),
          ],
        },
        expected: { value: 0, errors: [] },
      },
    ],
  };

describe("computeWorkbook", () => {
  it.each(
    Object.entries(providerFixtures).flatMap(([type, fixtures]) =>
      fixtures.map((fixture) => ({ type, ...fixture })),
    ),
  )("resolves $type: $description", (fixture) => {
    const { specificationRegistry, instanceRegistry, filingStatus, expected } =
      makeTestData(fixture);

    const result = computeWorkbook(
      specificationRegistry,
      instanceRegistry,
      filingStatus,
      {},
    );

    expect(result[TEST_INSTANCE_ID][BOX_UNDER_TEST_ID]).toEqual(expected);
  });

  it("resolves nested value providers", () => {
    const { specificationRegistry, instanceRegistry, filingStatus, expected } =
      makeTestData({
        provider: {
          type: "conditional",
          condition: {
            type: "logical_negation",
            value: {
              type: "comparison",
              value: {
                type: "filing_status_map",
                values: {
                  single: {
                    type: "form_instance_count",
                    form: TEST_CLASS,
                  },
                },
              },
              maximum: { type: "number_constant", value: 2 },
            },
          },
          trueValue: { type: "number_constant", value: 3 },
          falseValue: {
            type: "product",
            values: [
              { type: "number_constant", value: 4 },
              {
                type: "sum",
                values: [
                  { type: "number_constant", value: 5 },
                  {
                    type: "non_negative_clamp",
                    value: {
                      type: "difference",
                      minuend: { type: "number_constant", value: 6 },
                      subtrahend: {
                        type: "absolute_value",
                        value: { type: "number_constant", value: -7 },
                      },
                    },
                  },
                  ERROR_PROVIDER,
                  {
                    type: "quotient",
                    dividend: { type: "number_constant", value: 5 },
                    divisor: { type: "number_constant", value: 4 },
                  },
                ],
              },
            ],
          },
        },
        expected: { value: 25, errors: [{ type: "divide_by_zero" }] },
      });

    const result = computeWorkbook(
      specificationRegistry,
      instanceRegistry,
      filingStatus,
      {},
    );

    expect(result[TEST_INSTANCE_ID][BOX_UNDER_TEST_ID]).toEqual(expected);
  });

  it("resolves dependency chains", () => {
    const { specificationRegistry, instanceRegistry, filingStatus, expected } =
      makeTestData({
        specificationRegistry: makeRegistryFixture({
          f1040: makeSpecificationFixture({
            class: "f1040",
            sections: [
              makeSectionFixture({
                lines: [
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: "1", // 10
                      value: { type: "number_constant", value: 10 },
                    }),
                  }),
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: "2", // 20, 30
                      value: { type: "number_input" },
                    }),
                  }),
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: "3", // 35, 45
                      value: {
                        type: "sum",
                        values: [
                          { type: "box_reference", box: "1" },
                          { type: "box_reference", box: "2" },
                          { type: "number_constant", value: 5 },
                          ERROR_PROVIDER,
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
                    boxes: [
                      makeBoxFixtureMultiColumn({
                        identifier: "4(a)", // 41
                        column: "(a)",
                        value: { type: "number_constant", value: 41 },
                      }),
                      makeBoxFixtureMultiColumn({
                        identifier: "4(b)", // 35, 41
                        column: "(b)",
                        value: {
                          type: "minimum",
                          values: [
                            { type: "box_reference", box: "3" },
                            { type: "box_reference", box: "4(a)" },
                          ],
                        },
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          [TEST_CLASS]: makeSpecificationFixture({
            class: TEST_CLASS,
            sections: [
              makeSectionFixture({
                lines: [
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: "1", // 46
                      value: { type: "list_amounts_input" },
                    }),
                  }),
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: "2", // 3496
                      value: {
                        type: "product",
                        values: [
                          { type: "box_reference", form: "f1040", box: "4(b)" },
                          { type: "box_reference", box: "1" },
                        ],
                      },
                    }),
                  }),
                ],
              }),
              makeSectionFixture({
                lines: [
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: "3", // 3494
                      value: {
                        type: "difference",
                        minuend: { type: "box_reference", box: "2" },
                        subtrahend: {
                          type: "form_instance_count",
                          form: "f1040",
                        },
                      },
                    }),
                  }),
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: BOX_UNDER_TEST_ID,
                      value: {
                        type: "selection_input",
                        options: [
                          {
                            label: "A", // 3494
                            value: { type: "box_reference", box: "3" },
                          },
                          {
                            label: "B",
                            value: {
                              type: "box_reference",
                              form: "f1040",
                              box: "4(b)",
                            },
                          },
                        ],
                      },
                    }),
                  }),
                ],
              }),
            ],
          }),
        }),
        instanceRegistry: {
          f1040: [
            makeInstanceFixture({
              class: "f1040",
              id: "1040-1",
              inputs: { "2": { type: "number", value: 20 } },
            }),
            makeInstanceFixture({
              class: "f1040",
              id: "1040-2",
              inputs: { "2": { type: "number", value: 30 } },
            }),
          ],
          [TEST_CLASS]: [
            makeInstanceFixture({
              class: TEST_CLASS,
              id: TEST_INSTANCE_ID,
              inputs: {
                "1": {
                  type: "amount_list",
                  value: [
                    { label: "foo", amount: 12 },
                    { label: "bar", amount: 34 },
                  ],
                },
                [BOX_UNDER_TEST_ID]: {
                  type: "selection",
                  selectedIndex: 0,
                },
              },
            }),
          ],
        },
        expected: {
          value: 3494,
          errors: [
            {
              type: "upstream",
              sourceAddress: { instance: TEST_INSTANCE_ID, box: "3" },
            },
          ],
        },
      });

    const result = computeWorkbook(
      specificationRegistry,
      instanceRegistry,
      filingStatus,
      {},
    );

    expect(result[TEST_INSTANCE_ID][BOX_UNDER_TEST_ID]).toEqual(expected);
  });

  describe("referential equality preservation", () => {
    it("preserves box reference when resolved value is unchanged with no errors", () => {
      const originalBox: ResolvedBox = { value: 42, errors: [] };
      const originalWorkbook: Workbook = {
        [TEST_INSTANCE_ID]: { [BOX_UNDER_TEST_ID]: originalBox },
      };
      const {
        specificationRegistry,
        instanceRegistry,
        filingStatus,
        expected,
      } = makeTestData({
        provider: { type: "number_input" },
        instanceRegistry: {
          [TEST_CLASS]: [
            makeInstanceFixture({
              id: TEST_INSTANCE_ID,
              class: TEST_CLASS,
              inputs: {
                [BOX_UNDER_TEST_ID]: { type: "number", value: 42 },
              },
            }),
          ],
        },
        expected: originalBox,
      });

      const newWorkbook = computeWorkbook(
        specificationRegistry,
        instanceRegistry,
        filingStatus,
        originalWorkbook,
      );

      const resultBox = newWorkbook[TEST_INSTANCE_ID][BOX_UNDER_TEST_ID];
      expect(resultBox).toEqual(expected);
      expect(resultBox).toBe(originalBox);
    });

    it("preserves box reference when resolved value is unchanged with same errors", () => {
      const originalBox: ResolvedBox = {
        value: 42,
        errors: [{ type: "divide_by_zero" }],
      };
      const originalWorkbook: Workbook = {
        [TEST_INSTANCE_ID]: { [BOX_UNDER_TEST_ID]: originalBox },
      };
      const {
        specificationRegistry,
        instanceRegistry,
        filingStatus,
        expected,
      } = makeTestData({
        provider: {
          type: "sum",
          values: [{ type: "number_constant", value: 42 }, ERROR_PROVIDER],
        },
        expected: originalBox,
      });

      const newWorkbook = computeWorkbook(
        specificationRegistry,
        instanceRegistry,
        filingStatus,
        originalWorkbook,
      );

      const resultBox = newWorkbook[TEST_INSTANCE_ID][BOX_UNDER_TEST_ID];
      expect(resultBox).toEqual(expected);
      expect(resultBox).toBe(originalBox);
    });

    it("preserves box reference when upstream dependencies change but own value is unchanged", () => {
      const {
        specificationRegistry: specificationRegistry1,
        instanceRegistry: instanceRegistry1,
        filingStatus: filingStatus1,
        expected: expected1,
      } = makeTestData({
        specificationRegistry: makeRegistryFixture({
          [TEST_CLASS]: makeSpecificationFixture({
            class: TEST_CLASS,
            sections: [
              makeSectionFixture({
                lines: [
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: "1",
                      value: { type: "number_input" },
                    }),
                  }),
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: BOX_UNDER_TEST_ID,
                      value: {
                        type: "absolute_value",
                        value: {
                          type: "box_reference",
                          box: "1",
                        },
                      },
                    }),
                  }),
                ],
              }),
            ],
          }),
        }),
        instanceRegistry: {
          [TEST_CLASS]: [
            makeInstanceFixture({
              id: TEST_INSTANCE_ID,
              class: TEST_CLASS,
              inputs: {
                "1": { type: "number", value: 42 },
              },
            }),
          ],
        },
        expected: { value: 42, errors: [] },
      });

      const workbook1 = computeWorkbook(
        specificationRegistry1,
        instanceRegistry1,
        filingStatus1,
        {},
      );

      const originalBox = workbook1[TEST_INSTANCE_ID][BOX_UNDER_TEST_ID];
      expect(originalBox).toEqual(expected1);

      const {
        specificationRegistry: specificationRegistry2,
        instanceRegistry: instanceRegistry2,
        filingStatus: filingStatus2,
        expected: expected2,
      } = makeTestData({
        specificationRegistry: specificationRegistry1,
        instanceRegistry: {
          [TEST_CLASS]: [
            makeInstanceFixture({
              id: TEST_INSTANCE_ID,
              class: TEST_CLASS,
              inputs: {
                "1": { type: "number", value: -42 },
              },
            }),
          ],
        },
        expected: { value: 42, errors: [] },
      });

      const workbook2 = computeWorkbook(
        specificationRegistry2,
        instanceRegistry2,
        filingStatus2,
        workbook1,
      );

      const resultBox = workbook2[TEST_INSTANCE_ID][BOX_UNDER_TEST_ID];
      expect(resultBox).toEqual(expected2);
      expect(resultBox).toBe(originalBox);
    });

    it("creates new box reference when resolved value changes", () => {
      const originalBox: ResolvedBox = { value: 42, errors: [] };
      const originalWorkbook: Workbook = {
        [TEST_INSTANCE_ID]: { [BOX_UNDER_TEST_ID]: originalBox },
      };
      const {
        specificationRegistry,
        instanceRegistry,
        filingStatus,
        expected,
      } = makeTestData({
        provider: { type: "number_input" },
        instanceRegistry: {
          [TEST_CLASS]: [
            makeInstanceFixture({
              id: TEST_INSTANCE_ID,
              class: TEST_CLASS,
              inputs: {
                [BOX_UNDER_TEST_ID]: { type: "number", value: 43 },
              },
            }),
          ],
        },
        expected: { value: 43, errors: [] },
      });

      const newWorkbook = computeWorkbook(
        specificationRegistry,
        instanceRegistry,
        filingStatus,
        originalWorkbook,
      );

      const resultBox = newWorkbook[TEST_INSTANCE_ID][BOX_UNDER_TEST_ID];
      expect(resultBox).toEqual(expected);
      expect(resultBox).not.toBe(originalBox);
    });

    it("creates new box reference when errors change even if value is unchanged", () => {
      const originalBox: ResolvedBox = { value: 0, errors: [] };
      const originalWorkbook: Workbook = {
        [TEST_INSTANCE_ID]: { [BOX_UNDER_TEST_ID]: originalBox },
      };
      const {
        specificationRegistry,
        instanceRegistry,
        filingStatus,
        expected,
      } = makeTestData({
        provider: {
          type: "quotient",
          dividend: { type: "number_constant", value: 0 },
          divisor: { type: "number_constant", value: 0 },
        },
        expected: { value: 0, errors: [{ type: "divide_by_zero" }] },
      });

      const newWorkbook = computeWorkbook(
        specificationRegistry,
        instanceRegistry,
        filingStatus,
        originalWorkbook,
      );

      const resultBox = newWorkbook[TEST_INSTANCE_ID][BOX_UNDER_TEST_ID];
      expect(resultBox).toEqual(expected);
      expect(resultBox).not.toBe(originalBox);
    });

    it("preserves form instance record reference when none of its boxes change", () => {
      const originalWorkbook: Workbook = {
        "1040-1": {
          "1": { value: 10, errors: [] },
        },
        [TEST_INSTANCE_ID]: {
          "1": { value: 10, errors: [] },
          "2": { value: 0, errors: [{ type: "divide_by_zero" }] },
        },
      };
      const specificationRegistry = makeRegistryFixture({
        f1040: makeSpecificationFixture({
          class: "f1040",
          sections: [
            makeSectionFixture({
              lines: [
                makeLineFixture({
                  box: makeBoxFixture({
                    identifier: "1",
                    value: { type: "number_input" },
                  }),
                }),
              ],
            }),
          ],
        }),
        [TEST_CLASS]: makeSpecificationFixture({
          class: TEST_CLASS,
          sections: [
            makeSectionFixture({
              lines: [
                makeLineFixture({
                  box: makeBoxFixture({
                    identifier: "1",
                    value: {
                      type: "minimum",
                      values: [
                        { type: "box_reference", form: "f1040", box: "1" },
                        { type: "number_constant", value: 10 },
                      ],
                    },
                  }),
                }),
                makeLineFixture({
                  box: makeBoxFixture({
                    identifier: "2",
                    value: {
                      type: "quotient",
                      dividend: { type: "box_reference", box: "1" },
                      divisor: { type: "number_constant", value: 0 },
                    },
                  }),
                }),
              ],
            }),
          ],
        }),
      });
      const instanceRegistry: InstanceRegistry = {
        f1040: [
          makeInstanceFixture({
            id: "1040-1",
            class: "f1040",
            inputs: {
              "1": { type: "number", value: 20 },
            },
          }),
        ],
        [TEST_CLASS]: [
          makeInstanceFixture({
            id: TEST_INSTANCE_ID,
            class: TEST_CLASS,
          }),
        ],
      };

      const newWorkbook = computeWorkbook(
        specificationRegistry,
        instanceRegistry,
        "single",
        originalWorkbook,
      );

      expect(newWorkbook).toEqual({
        "1040-1": {
          "1": { value: 20, errors: [] },
        },
        [TEST_INSTANCE_ID]: {
          "1": { value: 10, errors: [] },
          "2": { value: 0, errors: [{ type: "divide_by_zero" }] },
        },
      });
      expect(newWorkbook[TEST_INSTANCE_ID]).toBe(
        originalWorkbook[TEST_INSTANCE_ID],
      );
    });

    it("creates new form instance record reference when any of its boxes change", () => {
      const originalWorkbook: Workbook = {
        [TEST_INSTANCE_ID]: {
          "1": { value: 20, errors: [] },
          "2": { value: 0, errors: [{ type: "divide_by_zero" }] },
        },
      };
      const specificationRegistry = makeRegistryFixture({
        [TEST_CLASS]: makeSpecificationFixture({
          class: TEST_CLASS,
          sections: [
            makeSectionFixture({
              lines: [
                makeLineFixture({
                  box: makeBoxFixture({
                    identifier: "1",
                    value: { type: "number_input" },
                  }),
                }),
                makeLineFixture({
                  box: makeBoxFixture({
                    identifier: "2",
                    value: {
                      type: "quotient",
                      dividend: { type: "box_reference", box: "1" },
                      divisor: { type: "number_constant", value: 0 },
                    },
                  }),
                }),
              ],
            }),
          ],
        }),
      });
      const instanceRegistry: InstanceRegistry = {
        [TEST_CLASS]: [
          makeInstanceFixture({
            id: TEST_INSTANCE_ID,
            class: TEST_CLASS,
            inputs: {
              "1": { type: "number", value: 21 },
            },
          }),
        ],
      };

      const newWorkbook = computeWorkbook(
        specificationRegistry,
        instanceRegistry,
        "single",
        originalWorkbook,
      );

      expect(newWorkbook).toEqual({
        [TEST_INSTANCE_ID]: {
          "1": { value: 21, errors: [] },
          "2": { value: 0, errors: [{ type: "divide_by_zero" }] },
        },
      });
      expect(newWorkbook[TEST_INSTANCE_ID]).not.toBe(
        originalWorkbook[TEST_INSTANCE_ID],
      );
    });

    it("excludes entries for instances no longer in the registry but preserves missing boxes", () => {
      const originalWorkbook: Workbook = {
        "1040-1": {
          "1": { value: 10, errors: [] },
        },
        [TEST_INSTANCE_ID]: {
          "1": { value: 10, errors: [] },
          "2": { value: 0, errors: [{ type: "divide_by_zero" }] },
        },
      };
      const specificationRegistry = makeRegistryFixture({
        [TEST_CLASS]: makeSpecificationFixture({
          class: TEST_CLASS,
          sections: [
            makeSectionFixture({
              lines: [
                makeLineFixture({
                  box: makeBoxFixture({
                    identifier: "1",
                    value: { type: "number_input" },
                  }),
                }),
              ],
            }),
          ],
        }),
      });
      const instanceRegistry: InstanceRegistry = {
        [TEST_CLASS]: [
          makeInstanceFixture({
            id: TEST_INSTANCE_ID,
            class: TEST_CLASS,
            inputs: {
              "1": { type: "number", value: 20 },
            },
          }),
        ],
      };

      const newWorkbook = computeWorkbook(
        specificationRegistry,
        instanceRegistry,
        "single",
        originalWorkbook,
      );

      expect(newWorkbook).toEqual({
        [TEST_INSTANCE_ID]: {
          "1": { value: 20, errors: [] },
          "2": { value: 0, errors: [{ type: "divide_by_zero" }] },
        },
      });
      expect(newWorkbook["1040-1"]).toBeUndefined();
      expect(newWorkbook[TEST_INSTANCE_ID]["2"]).toBe(
        originalWorkbook[TEST_INSTANCE_ID]["2"],
      );
    });

    it("does not mutate the old workbook or its nested records", () => {
      const originalBox: ResolvedBox = { value: 42, errors: [] };
      const originalRecord: Workbook[FormInstanceId] = {
        [BOX_UNDER_TEST_ID]: originalBox,
      };
      const originalWorkbook: Workbook = {
        [TEST_INSTANCE_ID]: originalRecord,
      };
      Object.freeze(originalBox);
      Object.freeze(originalRecord);
      Object.freeze(originalWorkbook);

      const {
        specificationRegistry,
        instanceRegistry,
        filingStatus,
        expected,
      } = makeTestData({
        provider: { type: "number_input" },
        instanceRegistry: {
          [TEST_CLASS]: [
            makeInstanceFixture({
              id: TEST_INSTANCE_ID,
              class: TEST_CLASS,
              inputs: {
                [BOX_UNDER_TEST_ID]: { type: "number", value: 43 },
              },
            }),
          ],
        },
        expected: { value: 43, errors: [] },
      });

      const newWorkbook = computeWorkbook(
        specificationRegistry,
        instanceRegistry,
        filingStatus,
        originalWorkbook,
      );

      expect(newWorkbook[TEST_INSTANCE_ID][BOX_UNDER_TEST_ID]).toEqual(
        expected,
      );
      expect(originalBox).toEqual({ value: 42, errors: [] });
      expect(originalRecord).toEqual({
        [BOX_UNDER_TEST_ID]: { value: 42, errors: [] },
      });
      expect(originalRecord[BOX_UNDER_TEST_ID]).toBe(originalBox);
      expect(originalWorkbook).toEqual({
        [TEST_INSTANCE_ID]: {
          [BOX_UNDER_TEST_ID]: { value: 42, errors: [] },
        },
      });
      expect(originalWorkbook[TEST_INSTANCE_ID]).toBe(originalRecord);
    });
  });
});
