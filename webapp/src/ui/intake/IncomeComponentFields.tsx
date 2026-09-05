import { VisuallyHidden } from "react-aria-components";
import { Controller, useWatch } from "react-hook-form";

import { CheckboxField } from "#src/ui/primitives/CheckboxField";
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
  const paymentIntervalSelection = useWatch({
    control,
    name: `${path}.paymentSchedule.interval`,
  });
  const federalIncomeWithholdingSelection = useWatch({
    control,
    name: `${path}.withholding.federalIncome`,
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
      <p>Withholding</p>
      <Controller
        control={control}
        name={`${path}.withholding.federalIncome`}
        render={({ field }) => (
          <SelectField label="Federal income tax withholding rate" {...field}>
            <SelectFieldItem id="regular">Regular rate</SelectFieldItem>
            <SelectFieldItem id="supplemental">
              Supplemental rate
            </SelectFieldItem>
            <SelectFieldItem id="custom">Custom rate</SelectFieldItem>
            <SelectFieldItem id="off">None</SelectFieldItem>
          </SelectField>
        )}
      />
      <VisuallyHidden aria-live="polite">
        {federalIncomeWithholdingSelection === "custom"
          ? "Set the custom rate in the next input."
          : null}
      </VisuallyHidden>
      <Controller
        control={control}
        name={`${path}.withholding.customFederalIncomeRate`}
        render={({ field }) => (
          <div hidden={federalIncomeWithholdingSelection !== "custom"}>
            <NumberField
              format="percentage"
              label="Custom federal income tax withholding rate"
              {...field}
            />
          </div>
        )}
      />
      <Controller
        control={control}
        name={`${path}.withholding.additionalFederalIncomeAmount`}
        render={({ field }) => (
          <NumberField
            format="financial"
            label="Additional federal income withholding amount"
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name={`${path}.withholding.socialSecurity`}
        render={({ field: { onChange, value, ...field } }) => (
          <CheckboxField
            label="Social Security tax withholding"
            onChange={(isChecked) => onChange(isChecked ? "regular" : "off")}
            value={value === "regular"}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name={`${path}.withholding.medicare`}
        render={({ field: { onChange, value, ...field } }) => (
          <CheckboxField
            label="Medicare tax withholding"
            onChange={(isChecked) => onChange(isChecked ? "regular" : "off")}
            value={value === "regular"}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name={`${path}.withholding.additionalMedicare`}
        render={({ field: { onChange, value, ...field } }) => (
          <CheckboxField
            label="Additional Medicare tax withholding"
            onChange={(isChecked) => onChange(isChecked ? "regular" : "off")}
            value={value === "regular"}
            {...field}
          />
        )}
      />
    </>
  );
}
