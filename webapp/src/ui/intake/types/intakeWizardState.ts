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

type IncomeType =
  | "brokerage_sale"
  | "dividends"
  | "interest"
  | "non_employee_compensation"
  | "other"
  | "retirement_distributions"
  | "wages";

type IncomeComponent<TIncomeType extends IncomeType> = {
  dateRange: DateRange;
  label: string;
  paymentSchedule: PaymentSchedule;
  prorationBasis: "day" | "weekday";
  type: TIncomeType;
  withholding: Withholding;
};

type Job = {
  employer: string;
  wages: IncomeComponent<"wages">[];
};

type OtherIncome = {
  source: string;
  income: IncomeComponent<Exclude<IncomeType, "wages">>;
};

export type IntakeWizardState = {
  jobs: Job[];
  otherIncome: OtherIncome[];
};
