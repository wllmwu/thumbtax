import { Temporal } from "temporal-polyfill";

import type { TaxYear } from "@thumbtax/common";
import type {
  DateRange,
  EmploymentIncomeComponent,
  IntakeWizardState,
  OtherIncomeComponent,
} from "#src/ui/intake/types/intakeWizardState";

function makeFullYearDateRange(taxYear: TaxYear): DateRange {
  return {
    end: new Temporal.PlainDate(taxYear, 12, 31),
    start: new Temporal.PlainDate(taxYear, 1, 1),
  };
}

export function makeDefaultEmploymentIncomeComponent(
  taxYear: TaxYear,
): EmploymentIncomeComponent {
  return {
    dateRange: makeFullYearDateRange(taxYear),
    paymentSchedule: {
      amount: 0,
      hoursPerWeek: 0,
      interval: "year",
    },
    prorationBasis: "weekday",
    withholding: {
      additionalFederalIncomeAmount: 0,
      additionalMedicare: "regular",
      customFederalIncomeRate: 0,
      federalIncome: "regular",
      medicare: "regular",
      socialSecurity: "regular",
    },
  };
}

export function makeDefaultOtherIncomeComponent(
  taxYear: TaxYear,
): OtherIncomeComponent {
  return {
    dateRange: makeFullYearDateRange(taxYear),
    paymentSchedule: {
      amount: 0,
      hoursPerWeek: 0,
      interval: "year",
    },
    prorationBasis: "weekday",
    withholding: {
      federalBackup: false,
    },
  };
}

export const DEFAULT_STATE: IntakeWizardState = {
  acknowledgements: {
    notAdvice: false,
    notAffiliated: false,
    notGuaranteed: false,
  },
  jobs: [],
  otherIncome: [],
};
