import {
  ERROR_PROVIDER,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";

export const numerical_negation: ValueProviderFixture[] = [
  {
    description: "resolves to the negative of a positive value",
    provider: {
      type: "numerical_negation",
      value: { type: "number_constant", value: 5 },
    },
    expected: { value: -5, errors: [] },
  },
  {
    description: "resolves to the negative of a negative value",
    provider: {
      type: "numerical_negation",
      value: { type: "number_constant", value: -5 },
    },
    expected: { value: 5, errors: [] },
  },
  {
    description: "propagates errors",
    provider: {
      type: "numerical_negation",
      value: ERROR_PROVIDER,
    },
    expected: { value: -0, errors: [{ type: "divide_by_zero" }] },
  },
];
