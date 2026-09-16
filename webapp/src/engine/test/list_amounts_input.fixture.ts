import {
  INPUT_UNDER_TEST_KEY,
  makeInstanceFixture,
  TEST_CLASS,
  TEST_INSTANCE_ID,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";

export const list_amounts_input: ValueProviderFixture[] = [
  {
    description: "resolves to 0 when input is not present",
    provider: { type: "list_amounts_input", inputKey: INPUT_UNDER_TEST_KEY },
    expected: { value: 0, errors: [] },
  },
  {
    description: "resolves to 0 when there are no entries",
    provider: { type: "list_amounts_input", inputKey: INPUT_UNDER_TEST_KEY },
    instanceRegistry: {
      [TEST_CLASS]: [
        makeInstanceFixture({
          id: TEST_INSTANCE_ID,
          inputs: {
            [INPUT_UNDER_TEST_KEY]: { type: "amount_list", value: [] },
          },
        }),
      ],
    },
    expected: { value: 0, errors: [] },
  },
  {
    description: "resolves to sum of amounts",
    provider: { type: "list_amounts_input", inputKey: INPUT_UNDER_TEST_KEY },
    instanceRegistry: {
      [TEST_CLASS]: [
        makeInstanceFixture({
          id: TEST_INSTANCE_ID,
          inputs: {
            [INPUT_UNDER_TEST_KEY]: {
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
];
