import {
  ERROR_PROVIDER,
  INPUT_UNDER_TEST_KEY,
  makeInstanceFixture,
  TEST_CLASS,
  TEST_INSTANCE_ID,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";

export const number_input: ValueProviderFixture[] = [
  {
    description: "resolves to 0 when input is not present",
    provider: { type: "number_input", inputKey: INPUT_UNDER_TEST_KEY },
    expected: { value: 0, errors: [] },
  },
  {
    description: "resolves to user's input",
    provider: { type: "number_input", inputKey: INPUT_UNDER_TEST_KEY },
    instanceRegistry: {
      [TEST_CLASS]: [
        makeInstanceFixture({
          id: TEST_INSTANCE_ID,
          inputs: { [INPUT_UNDER_TEST_KEY]: { type: "number", value: 123 } },
        }),
      ],
    },
    expected: { value: 123, errors: [] },
  },
  {
    description: "resolves to user's input when skip condition is 0",
    provider: {
      type: "number_input",
      inputKey: INPUT_UNDER_TEST_KEY,
      skipCondition: { type: "number_constant", value: 0 },
    },
    instanceRegistry: {
      [TEST_CLASS]: [
        makeInstanceFixture({
          id: TEST_INSTANCE_ID,
          inputs: { [INPUT_UNDER_TEST_KEY]: { type: "number", value: 123 } },
        }),
      ],
    },
    expected: { value: 123, errors: [] },
  },
  {
    description:
      "resolves to 0 when skip condition is non-zero, ignoring input",
    provider: {
      type: "number_input",
      inputKey: INPUT_UNDER_TEST_KEY,
      skipCondition: { type: "number_constant", value: 1 },
    },
    instanceRegistry: {
      [TEST_CLASS]: [
        makeInstanceFixture({
          id: TEST_INSTANCE_ID,
          inputs: { [INPUT_UNDER_TEST_KEY]: { type: "number", value: 123 } },
        }),
      ],
    },
    expected: { value: 0, errors: [], skipped: true },
  },
  {
    description: "propagates errors from skip condition",
    provider: {
      type: "number_input",
      inputKey: INPUT_UNDER_TEST_KEY,
      skipCondition: ERROR_PROVIDER,
    },
    expected: { value: 0, errors: [{ type: "divide_by_zero" }] },
  },
];
