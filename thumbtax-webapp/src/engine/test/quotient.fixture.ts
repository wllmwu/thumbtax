import {
  ERROR_PROVIDER,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";

export const quotient: ValueProviderFixture[] = [
  {
    description: "resolves to dividend divided by divisor",
    provider: {
      type: "quotient",
      dividend: { type: "number_constant", value: 10 },
      divisor: { type: "number_constant", value: 4 },
    },
    expected: { value: 2.5, errors: [] },
  },
  {
    description: "resolves to 0 with divide_by_zero error when divisor is 0",
    provider: {
      type: "quotient",
      dividend: { type: "number_constant", value: 5 },
      divisor: { type: "number_constant", value: 0 },
    },
    expected: { value: 0, errors: [{ type: "divide_by_zero" }] },
  },
  {
    description: "propagates errors",
    provider: {
      type: "quotient",
      dividend: ERROR_PROVIDER,
      divisor: ERROR_PROVIDER,
    },
    expected: {
      value: 0,
      errors: [
        { type: "divide_by_zero" },
        { type: "divide_by_zero" },
        { type: "divide_by_zero" },
      ],
    },
  },
  {
    description: 'rounds down when round is "down"',
    provider: {
      type: "quotient",
      dividend: { type: "number_constant", value: 7 },
      divisor: { type: "number_constant", value: 2 },
      round: "down",
    },
    expected: { value: 3, errors: [] },
  },
  {
    description: 'rounds up when round is "up"',
    provider: {
      type: "quotient",
      dividend: { type: "number_constant", value: 7 },
      divisor: { type: "number_constant", value: 2 },
      round: "up",
    },
    expected: { value: 4, errors: [] },
  },
];
