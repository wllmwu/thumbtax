import React from "react";

import { Controller, useFieldArray } from "react-hook-form";

import { DEFAULT_INCOME_COMPONENT } from "#src/ui/intake/defaults";
import { IncomeComponentFields } from "#src/ui/intake/IncomeComponentFields";
import { AriaButton } from "#src/ui/primitives/AriaButton";
import { SelectField, SelectFieldItem } from "#src/ui/primitives/SelectField";
import { TextField } from "#src/ui/primitives/TextField";

import type { IntakeWizardState } from "#src/ui/intake/types/intakeWizardState";
import type { Control } from "react-hook-form";

type Props = {
  control: Control<IntakeWizardState>;
};

export function OtherIncomeSection({ control }: Props): React.ReactNode {
  const { append, fields } = useFieldArray({ control, name: "otherIncome" });

  return (
    <section>
      <h3>Other income</h3>
      {fields.map((field, index) => (
        <div key={field.id}>
          <Controller
            control={control}
            name={`otherIncome.${index}.source`}
            render={({ field, fieldState }) => (
              <TextField
                label="Income source"
                {...field}
                errorMessage={fieldState.error?.message}
              />
            )}
            rules={{ required: "Income source is required." }}
          />
          <Controller
            control={control}
            name={`otherIncome.${index}.type`}
            render={({ field, fieldState }) => (
              <SelectField
                label="Income type"
                {...field}
                errorMessage={fieldState.error?.message}
              >
                <SelectFieldItem id="brokerage_sale">
                  Brokerage sale
                </SelectFieldItem>
                <SelectFieldItem id="dividends">Dividends</SelectFieldItem>
                <SelectFieldItem id="interest">Interest</SelectFieldItem>
                <SelectFieldItem id="non_employee_compensation">
                  Non-employee compensation
                </SelectFieldItem>
                <SelectFieldItem id="retirement_distributions">
                  Retirement distributions
                </SelectFieldItem>
                <SelectFieldItem id="other">Other</SelectFieldItem>
              </SelectField>
            )}
            rules={{ required: "Income type is required." }}
          />
          <IncomeComponentFields
            control={control}
            path={`otherIncome.${index}.income`}
          />
        </div>
      ))}
      <AriaButton
        onPress={() =>
          append({
            income: DEFAULT_INCOME_COMPONENT,
            source: "",
            type: null,
          })
        }
      >
        Add other income
      </AriaButton>
    </section>
  );
}
