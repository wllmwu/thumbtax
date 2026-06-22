import { absurd } from "@thumbtax/common";

import type { FilingStatus } from "@thumbtax/common";

export function formatFilingStatus(filingStatus: FilingStatus): string {
  switch (filingStatus) {
    case "head_of_household":
      return "Head of household";
    case "married_filing_jointly":
      return "Married filing jointly";
    case "married_filing_separately":
      return "Married filing separately";
    case "qualifying_surviving_spouse":
      return "Qualifying surviving spouse";
    case "single":
      return "Single";
    default:
      absurd(filingStatus);
  }
}
