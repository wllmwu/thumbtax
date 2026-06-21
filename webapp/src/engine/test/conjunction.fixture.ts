import {
  ERROR_PROVIDER,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";

export const conjunction: ValueProviderFixture[] = [
  {
    description: "resolves to 1 when all values are non-zero",
    provider: {
      type: "conjunction",
      values: [
        { type: "number_constant", value: -1 },
        { type: "number_constant", value: 5 },
      ],
    },
    expected: { value: 1, errors: [] },
  },
  {
    description: "resolves to 0 when any value is zero",
    provider: {
      type: "conjunction",
      values: [
        { type: "number_constant", value: 1 },
        { type: "number_constant", value: 0 },
        { type: "number_constant", value: 3 },
      ],
    },
    expected: { value: 0, errors: [] },
  },
  {
    description: "resolves to 1 for an empty values array",
    provider: { type: "conjunction", values: [] },
    expected: { value: 1, errors: [] },
  },
  {
    description: "propagates errors when true",
    provider: {
      type: "conjunction",
      values: [
        {
          type: "sum",
          values: [ERROR_PROVIDER, { type: "number_constant", value: 5 }],
        },
        {
          type: "sum",
          values: [ERROR_PROVIDER, { type: "number_constant", value: 10 }],
        },
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
      type: "conjunction",
      values: [
        {
          type: "sum",
          values: [ERROR_PROVIDER, { type: "number_constant", value: 5 }],
        },
        ERROR_PROVIDER,
      ],
    },
    expected: {
      value: 0,
      errors: [{ type: "divide_by_zero" }, { type: "divide_by_zero" }],
    },
  },
];
