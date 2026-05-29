import {
  BOX_UNDER_TEST_ID,
  makeInstanceFixture,
  TEST_CLASS,
  TEST_INSTANCE_ID,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";

export const number_input: ValueProviderFixture[] = [
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
];
