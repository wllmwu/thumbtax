import { VisuallyHidden } from "react-aria-components";
import { Controller, useWatch } from "react-hook-form";

import { DatePicker } from "#src/ui/primitives/DatePicker";
import { NumberField } from "#src/ui/primitives/NumberField";
import { SelectField, SelectFieldItem } from "#src/ui/primitives/SelectField";
import styles from "#src/ui/intake/IncomeComponentFields.module.css";

import type { IntakeWizardState } from "#src/ui/intake/types/intakeWizardState";
import type React from "react";
import type { Control } from "react-hook-form";

type Props = {
  control: Control<IntakeWizardState>;
  path:
    | `jobs.${number}.wages.${number}.income`
    | `otherIncome.${number}.income`;
  withholdingFields: React.ReactElement;
};

export function IncomeComponentFields({
  control,
  path,
  withholdingFields,
}: Props): React.ReactNode {
  const paymentIntervalSelection = useWatch({
    control,
    name: `${path}.paymentSchedule.interval`,
  });

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
        name={`${path}.paymentSchedule.interval`}
        render={({ field }) => (
          <SelectField label="Interval" {...field}>
            <SelectFieldItem id="one_time">One time</SelectFieldItem>
            <SelectFieldItem id="hour">Per hour</SelectFieldItem>
            <SelectFieldItem id="week">Per week</SelectFieldItem>
            <SelectFieldItem id="two_weeks">Per 2 weeks</SelectFieldItem>
            <SelectFieldItem id="month">Per month</SelectFieldItem>
            <SelectFieldItem id="year">Whole year</SelectFieldItem>
          </SelectField>
        )}
      />
      <VisuallyHidden aria-live="polite">
        {paymentIntervalSelection === "hour"
          ? "Set the hours per week in the next input."
          : null}
      </VisuallyHidden>
      <Controller
        control={control}
        name={`${path}.paymentSchedule.hoursPerWeek`}
        render={({ field }) => (
          <div hidden={paymentIntervalSelection !== "hour"}>
            <NumberField format="plain" label="Hours per week" {...field} />
          </div>
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
      <p className={styles.heading}>Withholding</p>
      {withholdingFields}
    </>
  );
}
