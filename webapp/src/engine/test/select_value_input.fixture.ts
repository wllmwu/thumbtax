import {
  BOX_UNDER_TEST_ID,
  ERROR_PROVIDER,
  makeInstanceFixture,
  TEST_CLASS,
  TEST_INSTANCE_ID,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";

export const select_value_input: ValueProviderFixture[] = [
  {
    description: "resolves to 0 when no input is present",
    provider: {
      type: "select_value_input",
      options: [
        { key: "a", label: "A", value: { type: "number_constant", value: 10 } },
      ],
    },
    expected: { value: 0, errors: [] },
  },
  {
    description: "resolves to the value of the selected option",
    provider: {
      type: "select_value_input",
      options: [
        { key: "a", label: "A", value: { type: "number_constant", value: 10 } },
        { key: "b", label: "B", value: { type: "number_constant", value: 20 } },
        { key: "c", label: "C", value: { type: "number_constant", value: 30 } },
      ],
    },
    instanceRegistry: {
      [TEST_CLASS]: [
        makeInstanceFixture({
          id: TEST_INSTANCE_ID,
          inputs: {
            [BOX_UNDER_TEST_ID]: { type: "selection", selectedKey: "b" },
          },
        }),
      ],
    },
    expected: { value: 20, errors: [] },
  },
  {
    description: "propagates errors from the selected option",
    provider: {
      type: "select_value_input",
      options: [
        { key: "a", label: "A", value: ERROR_PROVIDER },
        { key: "b", label: "B", value: ERROR_PROVIDER },
        { key: "c", label: "C", value: ERROR_PROVIDER },
      ],
    },
    instanceRegistry: {
      [TEST_CLASS]: [
        makeInstanceFixture({
          id: TEST_INSTANCE_ID,
          inputs: {
            [BOX_UNDER_TEST_ID]: { type: "selection", selectedKey: "b" },
          },
        }),
      ],
    },
    expected: { value: 0, errors: [{ type: "divide_by_zero" }] },
  },
  {
    description: "resolves to 0 when selectedKey does not match any option",
    provider: {
      type: "select_value_input",
      options: [
        { key: "a", label: "A", value: { type: "number_constant", value: 10 } },
      ],
    },
    instanceRegistry: {
      [TEST_CLASS]: [
        makeInstanceFixture({
          id: TEST_INSTANCE_ID,
          inputs: {
            [BOX_UNDER_TEST_ID]: { type: "selection", selectedKey: "b" },
          },
        }),
      ],
    },
    expected: { value: 0, errors: [] },
  },
];
