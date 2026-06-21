import {
  ERROR_PROVIDER,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";

export const filing_status_map: ValueProviderFixture[] = [
  {
    description: "resolves to the value for the matched filing status",
    provider: {
      type: "filing_status_map",
      values: {
        single: { type: "number_constant", value: 5 },
        married_filing_jointly: { type: "number_constant", value: 10 },
      },
      default: { type: "number_constant", value: 15 },
    },
    filingStatus: "single",
    expected: { value: 5, errors: [] },
  },
  {
    description:
      "resolves to the default when no key matches the filing status",
    provider: {
      type: "filing_status_map",
      values: {
        single: { type: "number_constant", value: 10 },
      },
      default: { type: "number_constant", value: 3 },
    },
    filingStatus: "married_filing_jointly",
    expected: { value: 3, errors: [] },
  },
  {
    description: "resolves to 0 when no key matches and no default is set",
    provider: {
      type: "filing_status_map",
      values: {
        married_filing_jointly: { type: "number_constant", value: 10 },
      },
    },
    filingStatus: "single",
    expected: { value: 0, errors: [] },
  },
  {
    description: "propagates errors from the matched provider",
    provider: {
      type: "filing_status_map",
      values: {
        single: ERROR_PROVIDER,
        married_filing_jointly: ERROR_PROVIDER,
        married_filing_separately: ERROR_PROVIDER,
        head_of_household: ERROR_PROVIDER,
        qualifying_surviving_spouse: ERROR_PROVIDER,
      },
      default: ERROR_PROVIDER,
    },
    filingStatus: "head_of_household",
    expected: { value: 0, errors: [{ type: "divide_by_zero" }] },
  },
  {
    description: "propagates errors from the default",
    provider: {
      type: "filing_status_map",
      values: {
        single: ERROR_PROVIDER,
      },
      default: ERROR_PROVIDER,
    },
    filingStatus: "head_of_household",
    expected: { value: 0, errors: [{ type: "divide_by_zero" }] },
  },
];
