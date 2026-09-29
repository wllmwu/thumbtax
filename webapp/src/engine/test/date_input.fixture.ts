import {
  INPUT_UNDER_TEST_KEY,
  makeInstanceFixture,
  TEST_CLASS,
  TEST_INSTANCE_ID,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";

export const date_input: ValueProviderFixture[] = [
  {
    description: "resolves to 0 when input is not present",
    provider: { type: "date_input", inputKey: INPUT_UNDER_TEST_KEY },
    expected: { value: 0, errors: [] },
  },
  {
    description: "resolves to user's input",
    provider: { type: "date_input", inputKey: INPUT_UNDER_TEST_KEY },
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
    description: "ignores an input of the wrong type",
    provider: { type: "date_input", inputKey: INPUT_UNDER_TEST_KEY },
    instanceRegistry: {
      [TEST_CLASS]: [
        makeInstanceFixture({
          id: TEST_INSTANCE_ID,
          inputs: {
            [INPUT_UNDER_TEST_KEY]: { type: "override", override: 20089 },
          },
        }),
      ],
    },
    expected: { value: 0, errors: [] },
  },
];
