import {
  BOX_UNDER_TEST_ID,
  makeInstanceFixture,
  TEST_CLASS,
  TEST_INSTANCE_ID,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";

export const checkbox_input: ValueProviderFixture[] = [
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
];
