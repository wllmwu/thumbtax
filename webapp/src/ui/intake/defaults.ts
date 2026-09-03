import { Temporal } from "temporal-polyfill";

import type { IncomeComponent } from "#src/ui/intake/types/intakeWizardState";

// TODO: put year in application state
const YEAR = 2026;

export const DEFAULT_INCOME_COMPONENT: IncomeComponent = {
  dateRange: {
    end: new Temporal.PlainDate(YEAR, 12, 31),
    start: new Temporal.PlainDate(YEAR, 1, 1),
  },
  paymentSchedule: {
    amount: 0,
    hoursPerWeek: 0,
    interval: "one_time",
  },
  prorationBasis: "weekday",
  withholding: {
    additionalFederalIncomeAmount: 0,
    additionalMedicare: "off",
    customFederalIncomeRate: 0,
    federalIncome: "off",
    medicare: "off",
    socialSecurity: "off",
  },
};
