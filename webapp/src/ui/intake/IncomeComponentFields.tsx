import { Controller } from "react-hook-form";

import { DatePicker } from "#src/ui/primitives/DatePicker";
import { NumberField } from "#src/ui/primitives/NumberField";
import { SelectField, SelectFieldItem } from "#src/ui/primitives/SelectField";

import type { IntakeWizardState } from "#src/ui/intake/types/intakeWizardState";
import type React from "react";
import type { Control } from "react-hook-form";

type Props = {
  control: Control<IntakeWizardState>;
  path:
    | `jobs.${number}.wages.${number}.income`
    | `otherIncome.${number}.income`;
};

export function IncomeComponentFields({
  control,
  path,
}: Props): React.ReactNode {
  return (
    <>
      <Controller
        control={control}
        name={`${path}.paymentSchedule.amount`}
        render={({ field }) => (
          <NumberField format="financial" label="Amount" {...field} />
        )}
      />
      <Controller
        control={control}
        name={`${path}.paymentSchedule.hoursPerWeek`}
        render={({ field }) => (
          <NumberField format="plain" label="Hours per week" {...field} />
        )}
      />
      <Controller
        control={control}
        name={`${path}.paymentSchedule.interval`}
        render={({ field }) => (
          <SelectField label="Interval" {...field}>
            <SelectFieldItem id="one_time">
              One time or whole year
            </SelectFieldItem>
            <SelectFieldItem id="hour">Per hour</SelectFieldItem>
            <SelectFieldItem id="week">Per week</SelectFieldItem>
            <SelectFieldItem id="two_weeks">Per 2 weeks</SelectFieldItem>
            <SelectFieldItem id="month">Per month</SelectFieldItem>
          </SelectField>
        )}
      />
      <Controller
        control={control}
        name={`${path}.dateRange.start`}
        render={({ field }) => <DatePicker label="Start date" {...field} />}
      />
      <Controller
        control={control}
        name={`${path}.dateRange.end`}
        render={({ field }) => <DatePicker label="End date" {...field} />}
      />
      <Controller
        control={control}
        name={`${path}.prorationBasis`}
        render={({ field }) => (
          <SelectField label="Proration basis" {...field}>
            <SelectFieldItem id="weekday">Weekdays</SelectFieldItem>
            <SelectFieldItem id="day">Calendar days</SelectFieldItem>
          </SelectField>
        )}
      />
    </>
  );
}
