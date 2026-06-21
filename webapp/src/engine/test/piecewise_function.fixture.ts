import {
  ERROR_PROVIDER,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";

export const piecewise_function: ValueProviderFixture[] = [
  {
    description:
      "resolves to output value for first matched interval when input is between bounds",
    provider: {
      type: "piecewise_function",
      input: { type: "number_constant", value: 5 },
      pieces: [
        {
          inputUpperBound: { type: "number_constant", value: 3 },
          output: { type: "number_constant", value: 1 },
        },
        {
          inputUpperBound: { type: "number_constant", value: 6 },
          output: { type: "number_constant", value: 2 },
        },
        {
          inputUpperBound: { type: "number_constant", value: 9 },
          output: { type: "number_constant", value: 3 },
        },
      ],
      lastOutput: { type: "number_constant", value: 4 },
    },
    expected: { value: 2, errors: [] },
  },
  {
    description:
      "resolves to output value for first matched interval when input equals upper bound",
    provider: {
      type: "piecewise_function",
      input: { type: "number_constant", value: 9 },
      pieces: [
        {
          inputUpperBound: { type: "number_constant", value: 3 },
          output: { type: "number_constant", value: 1 },
        },
        {
          inputUpperBound: { type: "number_constant", value: 6 },
          output: { type: "number_constant", value: 2 },
        },
        {
          inputUpperBound: { type: "number_constant", value: 9 },
          output: { type: "number_constant", value: 3 },
        },
      ],
      lastOutput: { type: "number_constant", value: 4 },
    },
    expected: { value: 3, errors: [] },
  },
  {
    description: "resolves to last output value when no intervals match",
    provider: {
      type: "piecewise_function",
      input: { type: "number_constant", value: 9.001 },
      pieces: [
        {
          inputUpperBound: { type: "number_constant", value: 3 },
          output: { type: "number_constant", value: 1 },
        },
        {
          inputUpperBound: { type: "number_constant", value: 6 },
          output: { type: "number_constant", value: 2 },
        },
        {
          inputUpperBound: { type: "number_constant", value: 9 },
          output: { type: "number_constant", value: 3 },
        },
      ],
      lastOutput: { type: "number_constant", value: 4 },
    },
    expected: { value: 4, errors: [] },
  },
  {
    description: "propagates errors from input and each evaluated interval",
    provider: {
      type: "piecewise_function",
      input: ERROR_PROVIDER,
      pieces: [
        {
          inputUpperBound: {
            type: "sum",
            values: [ERROR_PROVIDER, { type: "number_constant", value: -1 }],
          },
          output: ERROR_PROVIDER,
        },
        {
          inputUpperBound: ERROR_PROVIDER,
          output: {
            type: "sum",
            values: [ERROR_PROVIDER, { type: "number_constant", value: 10 }],
          },
        },
        {
          inputUpperBound: {
            type: "sum",
            values: [ERROR_PROVIDER, { type: "number_constant", value: 1 }],
          },
          output: ERROR_PROVIDER,
        },
      ],
      lastOutput: ERROR_PROVIDER,
    },
    expected: {
      value: 10,
      errors: [
        { type: "divide_by_zero" },
        { type: "divide_by_zero" },
        { type: "divide_by_zero" },
        { type: "divide_by_zero" },
      ],
    },
  },
  {
    description:
      "propagates errors from input, all interval bounds, and last output",
    provider: {
      type: "piecewise_function",
      input: ERROR_PROVIDER,
      pieces: [
        {
          inputUpperBound: {
            type: "sum",
            values: [ERROR_PROVIDER, { type: "number_constant", value: -1 }],
          },
          output: ERROR_PROVIDER,
        },
      ],
      lastOutput: {
        type: "sum",
        values: [ERROR_PROVIDER, { type: "number_constant", value: 10 }],
      },
    },
    expected: {
      value: 10,
      errors: [
        { type: "divide_by_zero" },
        { type: "divide_by_zero" },
        { type: "divide_by_zero" },
      ],
    },
  },
];
