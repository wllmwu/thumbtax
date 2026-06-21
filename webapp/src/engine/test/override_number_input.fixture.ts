import {
  BOX_UNDER_TEST_ID,
  makeInstanceFixture,
  TEST_CLASS,
  TEST_INSTANCE_ID,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";

export const override_number_input: ValueProviderFixture[] = [
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
];
