import {
  ERROR_PROVIDER,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";

export const minimum: ValueProviderFixture[] = [
  {
    description: "resolves to the minimum of its values",
    provider: {
      type: "minimum",
      values: [
        { type: "number_constant", value: 4 },
        { type: "number_constant", value: 7 },
        { type: "number_constant", value: 3 },
      ],
    },
    expected: { value: 3, errors: [] },
  },
  {
    description: "resolves to the minimum including negative values",
    provider: {
      type: "minimum",
      values: [
        { type: "number_constant", value: -4 },
        { type: "number_constant", value: 7 },
        { type: "number_constant", value: 3 },
      ],
    },
    expected: { value: -4, errors: [] },
  },
  {
    description: "resolves to 0 for an empty values array",
    provider: { type: "minimum", values: [] },
    expected: { value: 0, errors: [] },
  },
  {
    description: "propagates errors",
    provider: {
      type: "minimum",
      values: [{ type: "number_constant", value: -5 }, ERROR_PROVIDER],
    },
    expected: { value: -5, errors: [{ type: "divide_by_zero" }] },
  },
];
