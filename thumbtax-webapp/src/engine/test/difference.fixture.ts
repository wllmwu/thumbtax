import {
  ERROR_PROVIDER,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";

export const difference: ValueProviderFixture[] = [
  {
    description: "resolves to minuend minus subtrahend",
    provider: {
      type: "difference",
      minuend: { type: "number_constant", value: 10 },
      subtrahend: { type: "number_constant", value: 3 },
    },
    expected: { value: 7, errors: [] },
  },
  {
    description: "propagates errors",
    provider: {
      type: "difference",
      minuend: ERROR_PROVIDER,
      subtrahend: ERROR_PROVIDER,
    },
    expected: {
      value: 0,
      errors: [{ type: "divide_by_zero" }, { type: "divide_by_zero" }],
    },
  },
];
