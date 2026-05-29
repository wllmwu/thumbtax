import {
  ERROR_PROVIDER,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";

export const conditional: ValueProviderFixture[] = [
  {
    description: "resolves to the true branch when condition is non-zero",
    provider: {
      type: "conditional",
      condition: { type: "number_constant", value: 1 },
      trueValue: { type: "number_constant", value: 10 },
      falseValue: { type: "number_constant", value: 20 },
    },
    expected: { value: 10, errors: [] },
  },
  {
    description: "resolves to the false branch when condition is zero",
    provider: {
      type: "conditional",
      condition: { type: "number_constant", value: 0 },
      trueValue: { type: "number_constant", value: 10 },
      falseValue: { type: "number_constant", value: 20 },
    },
    expected: { value: 20, errors: [] },
  },
  {
    description: "propagates errors excluding the skipped branch",
    provider: {
      type: "conditional",
      condition: ERROR_PROVIDER,
      trueValue: ERROR_PROVIDER,
      falseValue: ERROR_PROVIDER,
    },
    expected: {
      value: 0,
      errors: [{ type: "divide_by_zero" }, { type: "divide_by_zero" }],
    },
  },
];
