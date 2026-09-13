import type { Temporal } from "temporal-polyfill";

type DateRange = {
  end: Temporal.PlainDate;
  start: Temporal.PlainDate;
};

type PaymentSchedule = {
  amount: number;
  hoursPerWeek: number;
  interval: "hour" | "month" | "one_time" | "two_weeks" | "week" | "year";
};

type FederalEmploymentWithholding = {
  additionalFederalIncomeAmount: number;
  additionalMedicare: "off" | "regular";
  customFederalIncomeRate: number;
  federalIncome: "custom" | "off" | "regular" | "supplemental";
  medicare: "off" | "regular";
  socialSecurity: "off" | "regular";
};

type FederalBackupWithholding = {
  federalBackup: boolean;
};

type IncomeComponent<TWithholding> = {
  dateRange: DateRange;
  paymentSchedule: PaymentSchedule;
  prorationBasis: "day" | "weekday";
  withholding: TWithholding;
};

export type EmploymentIncomeComponent =
  IncomeComponent<FederalEmploymentWithholding>;

export type OtherIncomeComponent = IncomeComponent<FederalBackupWithholding>;

type Wage = {
  income: EmploymentIncomeComponent;
  label: string;
  ui: {
    expanded: boolean;
  };
};

type Job = {
  employer: string;
  ui: {
    expanded: boolean;
  };
  wages: Wage[];
};

export type OtherIncome = {
  income: OtherIncomeComponent;
  label: string;
  source: string;
  type:
    | "brokerage_sale"
    | "dividends"
    | "interest"
    | "non_employee_compensation"
    | "other"
    | "retirement_distributions"
    | null;
  ui: {
    expanded: boolean;
  };
};

export type IntakeWizardState = {
  acknowledgements: {
    notAdvice: boolean;
    notAffiliated: boolean;
    notGuaranteed: boolean;
  };
  jobs: Job[];
  otherIncome: OtherIncome[];
};
