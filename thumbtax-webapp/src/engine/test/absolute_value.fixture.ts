import {
  ERROR_PROVIDER,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";

export const absolute_value: ValueProviderFixture[] = [
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
];
