import type { Temporal } from "temporal-polyfill";

type DateRange = {
  end: Temporal.PlainDate;
  start: Temporal.PlainDate;
};

type PaymentSchedule = {
  amount: number;
  hoursPerWeek: number;
  interval: "hour" | "month" | "one_time" | "two_weeks" | "week";
};

type Withholding = {
  additionalFederalIncomeAmount: number;
  additionalMedicare: "off" | "regular";
  customFederalIncomeRate: number;
  federalIncome: "custom" | "off" | "regular" | "supplemental";
  medicare: "off" | "regular";
  socialSecurity: "off" | "regular";
};

export type IncomeComponent = {
  dateRange: DateRange;
  paymentSchedule: PaymentSchedule;
  prorationBasis: "day" | "weekday";
  withholding: Withholding;
};

type Wage = {
  income: IncomeComponent;
  label: string;
};

type Job = {
  employer: string;
  wages: Wage[];
};

type OtherIncome = {
  income: IncomeComponent;
  source: string;
  type:
    | "brokerage_sale"
    | "dividends"
    | "interest"
    | "non_employee_compensation"
    | "other"
    | "retirement_distributions";
};

export type IntakeWizardState = {
  jobs: Job[];
  otherIncome: OtherIncome[];
};
