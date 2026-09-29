import React from "react";

import { Controller, useFieldArray } from "react-hook-form";

import { useStore } from "#src/state/useStore";
import { makeDefaultOtherIncomeComponent } from "#src/ui/intake/defaults";
import { IncomeComponentFields } from "#src/ui/intake/IncomeComponentFields";
import { ListItemDisclosure } from "#src/ui/intake/ListItemDisclosure";
import { AriaButton } from "#src/ui/primitives/AriaButton";
import { CheckboxField } from "#src/ui/primitives/CheckboxField";
import { SelectField, SelectFieldItem } from "#src/ui/primitives/SelectField";
import { TextField } from "#src/ui/primitives/TextField";

import type { IntakeWizardState } from "#src/ui/intake/types/intakeWizardState";
import type { Control } from "react-hook-form";

type Props = {
  control: Control<IntakeWizardState>;
};

export function OtherIncomeSection({ control }: Props): React.ReactNode {
  const taxYear = useStore((state) => state.applicationState.taxYear);
  const { append, fields, move, remove } = useFieldArray({
    control,
    name: "otherIncome",
  });

  return (
    <section>
      <h2>Other income</h2>
      {fields.map((arrayField, index) => (
        <ListItemDisclosure
          key={arrayField.id}
          canMoveBackward={index > 0}
          canMoveForward={index < fields.length - 1}
          control={control}
          expandedFieldName={`otherIncome.${index}.ui.expanded`}
          labelFieldName={`otherIncome.${index}.source`}
          onDelete={() => remove(index)}
          onMoveBackward={() => move(index, index - 1)}
          onMoveForward={() => move(index, index + 1)}
        >
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
            name={`otherIncome.${index}.label`}
            render={({ field, fieldState }) => (
              <TextField
                label="Label"
                {...field}
                errorMessage={fieldState.error?.message}
              />
            )}
            rules={{ required: "Label is required." }}
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
            withholdingFields={
              <>
                <Controller
                  control={control}
                  name={`otherIncome.${index}.income.withholding.federalBackup`}
                  render={({ field }) => (
                    <CheckboxField label="Backup withholding" {...field} />
                  )}
                />
              </>
            }
          />
        </ListItemDisclosure>
      ))}
      <AriaButton
        onPress={() =>
          append({
            income: makeDefaultOtherIncomeComponent(taxYear),
            label: "",
            source: "",
            type: null,
            ui: { expanded: true },
          })
        }
      >
        Add other income
      </AriaButton>
    </section>
  );
}
