import {
  ERROR_PROVIDER,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";

export const logical_negation: ValueProviderFixture[] = [
  {
    description: "resolves to 1 when value is 0",
    provider: {
      type: "logical_negation",
      value: { type: "number_constant", value: 0 },
    },
    expected: { value: 1, errors: [] },
  },
  {
    description: "resolves to 0 when value is not 0",
    provider: {
      type: "logical_negation",
      value: { type: "number_constant", value: 5 },
    },
    expected: { value: 0, errors: [] },
  },
  {
    description: "propagates errors",
    provider: { type: "logical_negation", value: ERROR_PROVIDER },
    expected: { value: 1, errors: [{ type: "divide_by_zero" }] },
  },
];
