import {
  BOX_UNDER_TEST_ID,
  ERROR_PROVIDER,
  makeInstanceFixture,
  TEST_CLASS,
  TEST_INSTANCE_ID,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";

export const conditional_number_input: ValueProviderFixture[] = [
  {
    description: "resolves to user's input when skip condition is 0",
    provider: {
      type: "conditional_number_input",
      skipCondition: { type: "number_constant", value: 0 },
    },
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
  {
    description: "resolves to 0 when input is not present",
    provider: {
      type: "conditional_number_input",
      skipCondition: { type: "number_constant", value: 0 },
    },
    expected: { value: 0, errors: [] },
  },
  {
    description:
      "resolves to 0 when skip condition is non-zero, ignoring input",
    provider: {
      type: "conditional_number_input",
      skipCondition: { type: "number_constant", value: 1 },
    },
    instanceRegistry: {
      [TEST_CLASS]: [
        makeInstanceFixture({
          id: TEST_INSTANCE_ID,
          inputs: { [BOX_UNDER_TEST_ID]: { type: "number", value: 123 } },
        }),
      ],
    },
    expected: { value: 0, errors: [] },
  },
  {
    description: "propagates errors",
    provider: {
      type: "conditional_number_input",
      skipCondition: ERROR_PROVIDER,
    },
    expected: { value: 0, errors: [{ type: "divide_by_zero" }] },
  },
];
