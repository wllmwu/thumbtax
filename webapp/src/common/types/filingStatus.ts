export const FILING_STATUSES = [
  "head_of_household",
  "married_filing_jointly",
  "married_filing_separately",
  "qualifying_surviving_spouse",
  "single",
] as const;

export type FilingStatus = (typeof FILING_STATUSES)[number];
