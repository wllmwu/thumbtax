import { Temporal } from "temporal-polyfill";

import type {
  EmploymentIncomeComponent,
  IntakeWizardState,
  OtherIncomeComponent,
} from "#src/ui/intake/types/intakeWizardState";

// TODO: put year in application state
const YEAR = 2026;

export const DEFAULT_EMPLOYMENT_INCOME_COMPONENT: EmploymentIncomeComponent = {
  dateRange: {
    end: new Temporal.PlainDate(YEAR, 12, 31),
    start: new Temporal.PlainDate(YEAR, 1, 1),
  },
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

export const DEFAULT_OTHER_INCOME_COMPONENT: OtherIncomeComponent = {
  dateRange: {
    end: new Temporal.PlainDate(YEAR, 12, 31),
    start: new Temporal.PlainDate(YEAR, 1, 1),
  },
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

export const DEFAULT_STATE: IntakeWizardState = {
  acknowledgements: {
    notAdvice: false,
    notAffiliated: false,
    notGuaranteed: false,
  },
  jobs: [],
  otherIncome: [],
};
