import {
  INPUT_UNDER_TEST_KEY,
  makeInstanceFixture,
  TEST_CLASS,
  TEST_INSTANCE_ID,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";

export const checkbox_input: ValueProviderFixture[] = [
  {
    description: "resolves to 0 when input is not present",
    provider: { type: "checkbox_input", inputKey: INPUT_UNDER_TEST_KEY },
    expected: { value: 0, errors: [] },
  },
  {
    description: "resolves to user's input",
    provider: { type: "checkbox_input", inputKey: INPUT_UNDER_TEST_KEY },
    instanceRegistry: {
      [TEST_CLASS]: [
        makeInstanceFixture({
          id: TEST_INSTANCE_ID,
          inputs: { [INPUT_UNDER_TEST_KEY]: { type: "number", value: 1 } },
        }),
      ],
    },
    expected: { value: 1, errors: [] },
  },
  {
    description: "resolves to 1 for non-zero input",
    provider: { type: "checkbox_input", inputKey: INPUT_UNDER_TEST_KEY },
    instanceRegistry: {
      [TEST_CLASS]: [
        makeInstanceFixture({
          id: TEST_INSTANCE_ID,
          inputs: { [INPUT_UNDER_TEST_KEY]: { type: "number", value: 3 } },
        }),
      ],
    },
    expected: { value: 1, errors: [] },
  },
  {
    description: "ignores an input of the wrong type",
    provider: { type: "checkbox_input", inputKey: INPUT_UNDER_TEST_KEY },
    instanceRegistry: {
      [TEST_CLASS]: [
        makeInstanceFixture({
          id: TEST_INSTANCE_ID,
          inputs: {
            [INPUT_UNDER_TEST_KEY]: { type: "selection", selectedKey: "yes" },
          },
        }),
      ],
    },
    expected: { value: 0, errors: [] },
  },
];
