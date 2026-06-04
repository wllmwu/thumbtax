import {
  ERROR_PROVIDER,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";

export const disjunction: ValueProviderFixture[] = [
  {
    description: "resolves to 1 when any value is non-zero",
    provider: {
      type: "disjunction",
      values: [
        { type: "number_constant", value: 0 },
        { type: "number_constant", value: 5 },
      ],
    },
    expected: { value: 1, errors: [] },
  },
  {
    description: "resolves to 0 when all values are zero",
    provider: {
      type: "disjunction",
      values: [
        { type: "number_constant", value: 0 },
        { type: "number_constant", value: 0 },
      ],
    },
    expected: { value: 0, errors: [] },
  },
  {
    description: "resolves to 0 for an empty values array",
    provider: { type: "disjunction", values: [] },
    expected: { value: 0, errors: [] },
  },
  {
    description: "propagates errors when true",
    provider: {
      type: "disjunction",
      values: [
        {
          type: "sum",
          values: [ERROR_PROVIDER, { type: "number_constant", value: 5 }],
        },
        ERROR_PROVIDER,
      ],
    },
    expected: {
      value: 1,
      errors: [{ type: "divide_by_zero" }, { type: "divide_by_zero" }],
    },
  },
  {
    description: "propagates errors when false",
    provider: {
      type: "disjunction",
      values: [ERROR_PROVIDER, ERROR_PROVIDER],
    },
    expected: {
      value: 0,
      errors: [{ type: "divide_by_zero" }, { type: "divide_by_zero" }],
    },
  },
];
