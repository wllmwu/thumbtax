import {
  ERROR_PROVIDER,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";

export const sum: ValueProviderFixture[] = [
  {
    description: "resolves to the sum of its values",
    provider: {
      type: "sum",
      values: [
        { type: "number_constant", value: 3 },
        { type: "number_constant", value: 4 },
      ],
    },
    expected: { value: 7, errors: [] },
  },
  {
    description: "resolves to 0 for an empty values array",
    provider: { type: "sum", values: [] },
    expected: { value: 0, errors: [] },
  },
  {
    description: "propagates errors",
    provider: {
      type: "sum",
      values: [ERROR_PROVIDER, { type: "number_constant", value: 2 }],
    },
    expected: { value: 2, errors: [{ type: "divide_by_zero" }] },
  },
];
