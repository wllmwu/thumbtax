import {
  ERROR_PROVIDER,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";

export const maximum: ValueProviderFixture[] = [
  {
    description: "resolves to the maximum of its values",
    provider: {
      type: "maximum",
      values: [
        { type: "number_constant", value: 4 },
        { type: "number_constant", value: 7 },
        { type: "number_constant", value: 3 },
      ],
    },
    expected: { value: 7, errors: [] },
  },
  {
    description: "resolves to the maximum including negative values",
    provider: {
      type: "maximum",
      values: [
        { type: "number_constant", value: -4 },
        { type: "number_constant", value: -7 },
        { type: "number_constant", value: -3 },
      ],
    },
    expected: { value: -3, errors: [] },
  },
  {
    description: "resolves to 0 for an empty values array",
    provider: { type: "maximum", values: [] },
    expected: { value: 0, errors: [] },
  },
  {
    description: "propagates errors",
    provider: {
      type: "maximum",
      values: [{ type: "number_constant", value: 5 }, ERROR_PROVIDER],
    },
    expected: { value: 5, errors: [{ type: "divide_by_zero" }] },
  },
];
