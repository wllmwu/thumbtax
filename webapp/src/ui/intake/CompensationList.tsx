import React from "react";

import { Controller, useFieldArray } from "react-hook-form";
import { Temporal } from "temporal-polyfill";

import { AriaButton } from "#src/ui/primitives/AriaButton";
import { DatePicker } from "#src/ui/primitives/DatePicker";
import { NumberField } from "#src/ui/primitives/NumberField";
import { SelectField, SelectFieldItem } from "#src/ui/primitives/SelectField";
import { TextField } from "#src/ui/primitives/TextField";

import type { IntakeWizardState } from "#src/ui/intake/types/intakeWizardState";
import type { Control } from "react-hook-form";

type Props = {
  control: Control<IntakeWizardState>;
  jobIndex: number;
};

// TODO: put year in application state
const YEAR = 2026;

export function CompensationList({
  control,
  jobIndex,
}: Props): React.ReactNode {
  const { append, fields } = useFieldArray({
    control,
    name: `jobs.${jobIndex}.wages`,
  });

  return (
    <div>
      <p>Compensation</p>
      {fields.map((field, index) => (
        <div key={field.id}>
          <Controller
            control={control}
            name={`jobs.${jobIndex}.wages.${index}.label`}
            render={({ field }) => <TextField label="Label" {...field} />}
          />
          <Controller
            control={control}
            name={`jobs.${jobIndex}.wages.${index}.paymentSchedule.amount`}
            render={({ field }) => (
              <NumberField format="financial" label="Amount" {...field} />
            )}
          />
          <Controller
            control={control}
            name={`jobs.${jobIndex}.wages.${index}.paymentSchedule.hoursPerWeek`}
            render={({ field }) => (
              <NumberField format="plain" label="Hours per week" {...field} />
            )}
          />
          <Controller
            control={control}
            name={`jobs.${jobIndex}.wages.${index}.paymentSchedule.interval`}
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
            name={`jobs.${jobIndex}.wages.${index}.dateRange.start`}
            render={({ field }) => <DatePicker label="Start date" {...field} />}
          />
          <Controller
            control={control}
            name={`jobs.${jobIndex}.wages.${index}.dateRange.end`}
            render={({ field }) => <DatePicker label="End date" {...field} />}
          />
          <Controller
            control={control}
            name={`jobs.${jobIndex}.wages.${index}.prorationBasis`}
            render={({ field }) => (
              <SelectField label="Proration basis" {...field}>
                <SelectFieldItem id="weekday">Weekdays</SelectFieldItem>
                <SelectFieldItem id="day">Calendar days</SelectFieldItem>
              </SelectField>
            )}
          />
        </div>
      ))}
      <AriaButton
        onPress={() =>
          append({
            dateRange: {
              end: new Temporal.PlainDate(YEAR, 12, 31),
              start: new Temporal.PlainDate(YEAR, 1, 1),
            },
            label: "",
            paymentSchedule: {
              amount: 0,
              hoursPerWeek: 0,
              interval: "one_time",
            },
            prorationBasis: "weekday",
            type: "wages",
            withholding: {
              additionalFederalIncomeAmount: 0,
              additionalMedicare: "off",
              customFederalIncomeRate: 0,
              federalIncome: "off",
              medicare: "off",
              socialSecurity: "off",
            },
          })
        }
      >
        Add compensation
      </AriaButton>
    </div>
  );
}
