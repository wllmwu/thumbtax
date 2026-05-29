import {
  ERROR_PROVIDER,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";

export const comparison: ValueProviderFixture[] = [
  {
    description: "resolves to 1 when value is within bounds",
    provider: {
      type: "comparison",
      value: { type: "number_constant", value: 5 },
      minimum: { type: "number_constant", value: 0 },
      maximum: { type: "number_constant", value: 10 },
    },
    expected: { value: 1, errors: [] },
  },
  {
    description: "resolves to 0 when value is greater than maximum",
    provider: {
      type: "comparison",
      value: { type: "number_constant", value: 15 },
      maximum: { type: "number_constant", value: 10 },
    },
    expected: { value: 0, errors: [] },
  },
  {
    description: "resolves to 1 when not strict and value equals maximum",
    provider: {
      type: "comparison",
      value: { type: "number_constant", value: 10 },
      maximum: { type: "number_constant", value: 10 },
    },
    expected: { value: 1, errors: [] },
  },
  {
    description: "resolves to 0 when strict and value equals maximum",
    provider: {
      type: "comparison",
      value: { type: "number_constant", value: 10 },
      maximum: { type: "number_constant", value: 10 },
      strict: true,
    },
    expected: { value: 0, errors: [] },
  },
  {
    description: "resolves to 0 when value is less than minimum",
    provider: {
      type: "comparison",
      value: { type: "number_constant", value: 5 },
      minimum: { type: "number_constant", value: 10 },
    },
    expected: { value: 0, errors: [] },
  },
  {
    description: "resolves to 1 when not strict and value equals minimum",
    provider: {
      type: "comparison",
      value: { type: "number_constant", value: 10 },
      minimum: { type: "number_constant", value: 10 },
    },
    expected: { value: 1, errors: [] },
  },
  {
    description: "resolves to 0 when strict and value equals minimum",
    provider: {
      type: "comparison",
      value: { type: "number_constant", value: 10 },
      minimum: { type: "number_constant", value: 10 },
      strict: true,
    },
    expected: { value: 0, errors: [] },
  },
  {
    description: "propagates errors",
    provider: {
      type: "comparison",
      value: ERROR_PROVIDER,
      minimum: ERROR_PROVIDER,
      maximum: ERROR_PROVIDER,
    },
    expected: {
      value: 1,
      errors: [
        { type: "divide_by_zero" },
        { type: "divide_by_zero" },
        { type: "divide_by_zero" },
      ],
    },
  },
];
