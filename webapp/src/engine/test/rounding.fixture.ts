import {
  ERROR_PROVIDER,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";

export const rounding: ValueProviderFixture[] = [
  {
    description: 'rounds down when direction is "down"',
    provider: {
      type: "rounding",
      direction: "down",
      value: {
        type: "quotient",
        dividend: { type: "number_constant", value: 7 },
        divisor: { type: "number_constant", value: 2 },
      },
    },
    expected: { value: 3, errors: [] },
  },
  {
    description: 'rounds up when direction is "up"',
    provider: {
      type: "rounding",
      direction: "up",
      value: {
        type: "quotient",
        dividend: { type: "number_constant", value: 7 },
        divisor: { type: "number_constant", value: 2 },
      },
    },
    expected: { value: 4, errors: [] },
  },
  {
    description: "propagates errors",
    provider: { type: "rounding", direction: "down", value: ERROR_PROVIDER },
    expected: { value: 0, errors: [{ type: "divide_by_zero" }] },
  },
];
