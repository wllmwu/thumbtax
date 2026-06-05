import {
  ERROR_PROVIDER,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";

export const non_positive_clamp: ValueProviderFixture[] = [
  {
    description: "resolves to the value when it is non-positive",
    provider: {
      type: "non_positive_clamp",
      value: { type: "number_constant", value: -5 },
    },
    expected: { value: -5, errors: [] },
  },
  {
    description: "resolves to 0 when the value is positive",
    provider: {
      type: "non_positive_clamp",
      value: { type: "number_constant", value: 5 },
    },
    expected: { value: 0, errors: [] },
  },
  {
    description: "propagates errors",
    provider: { type: "non_positive_clamp", value: ERROR_PROVIDER },
    expected: { value: 0, errors: [{ type: "divide_by_zero" }] },
  },
];
