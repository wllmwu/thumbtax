import type { ValueProviderFixture } from "#src/engine/test/fixtures";

export const number_constant: ValueProviderFixture[] = [
  {
    description: "resolves to value",
    provider: { type: "number_constant", value: 42 },
    expected: { value: 42, errors: [] },
  },
  {
    description: "resolves to negative value",
    provider: { type: "number_constant", value: -5 },
    expected: { value: -5, errors: [] },
  },
  {
    description: "resolves to non-integer value",
    provider: { type: "number_constant", value: 1.25 },
    expected: { value: 1.25, errors: [] },
  },
];
