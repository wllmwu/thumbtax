import {
  ERROR_PROVIDER,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";

export const product: ValueProviderFixture[] = [
  {
    description: "resolves to the product of its values",
    provider: {
      type: "product",
      values: [
        { type: "number_constant", value: 3 },
        { type: "number_constant", value: 4 },
      ],
    },
    expected: { value: 12, errors: [] },
  },
  {
    description: "resolves to 0 for an empty values array",
    provider: { type: "product", values: [] },
    expected: { value: 0, errors: [] },
  },
  {
    description: "propagates errors",
    provider: {
      type: "product",
      values: [{ type: "number_constant", value: 3 }, ERROR_PROVIDER],
    },
    expected: { value: 0, errors: [{ type: "divide_by_zero" }] },
  },
];
