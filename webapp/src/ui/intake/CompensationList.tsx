import React from "react";

import { VisuallyHidden } from "react-aria-components";
import { Controller, useFieldArray } from "react-hook-form";

import { useStore } from "#src/state/useStore";
import { makeDefaultEmploymentIncomeComponent } from "#src/ui/intake/defaults";
import { IncomeComponentFields } from "#src/ui/intake/IncomeComponentFields";
import { ListItemDisclosure } from "#src/ui/intake/ListItemDisclosure";
import { AriaButton } from "#src/ui/primitives/AriaButton";
import { CheckboxField } from "#src/ui/primitives/CheckboxField";
import { NumberField } from "#src/ui/primitives/NumberField";
import { SelectField, SelectFieldItem } from "#src/ui/primitives/SelectField";
import { TextField } from "#src/ui/primitives/TextField";
import styles from "#src/ui/intake/CompensationList.module.css";

import type { IntakeWizardState } from "#src/ui/intake/types/intakeWizardState";
import type { Control } from "react-hook-form";

type Props = {
  control: Control<IntakeWizardState>;
  jobIndex: number;
};

export function CompensationList({
  control,
  jobIndex,
}: Props): React.ReactNode {
  const taxYear = useStore((state) => state.applicationState.taxYear);
  const { append, fields, move, remove } = useFieldArray({
    control,
    name: `jobs.${jobIndex}.wages`,
  });

  return (
    <div className={styles.list}>
      <p className={styles.heading}>Compensation</p>
      {fields.map((arrayField, index) => (
        <ListItemDisclosure
          key={arrayField.id}
          canMoveBackward={index > 0}
          canMoveForward={index < fields.length - 1}
          className={styles.disclosure}
          control={control}
          expandedFieldName={`jobs.${jobIndex}.wages.${index}.ui.expanded`}
          labelFieldName={`jobs.${jobIndex}.wages.${index}.label`}
          onDelete={() => remove(index)}
          onMoveBackward={() => move(index, index - 1)}
          onMoveForward={() => move(index, index + 1)}
        >
          <Controller
            control={control}
            name={`jobs.${jobIndex}.wages.${index}.label`}
            render={({ field, fieldState }) => (
              <TextField
                label="Label"
                {...field}
                errorMessage={fieldState.error?.message}
              />
            )}
            rules={{ required: "Label is required." }}
          />
          <IncomeComponentFields
            control={control}
            path={`jobs.${jobIndex}.wages.${index}.income`}
            withholdingFields={
              <>
                <Controller
                  control={control}
                  name={`jobs.${jobIndex}.wages.${index}.income.withholding.federalIncome`}
                  render={({ field }) => (
                    <>
                      <SelectField
                        label="Federal income tax withholding type"
                        {...field}
                      >
                        <SelectFieldItem id="regular">
                          Regular wages
                        </SelectFieldItem>
                        <SelectFieldItem id="supplemental">
                          Supplemental income
                        </SelectFieldItem>
                        <SelectFieldItem id="custom">
                          Custom withholding rate
                        </SelectFieldItem>
                        <SelectFieldItem id="off">
                          No withholding
                        </SelectFieldItem>
                      </SelectField>
                      <VisuallyHidden aria-live="polite">
                        {field.value === "custom"
                          ? "Set the custom rate in the next input."
                          : null}
                      </VisuallyHidden>
                      <Controller
                        control={control}
                        name={`jobs.${jobIndex}.wages.${index}.income.withholding.customFederalIncomeRate`}
                        render={({ field: customField }) => (
                          <div hidden={field.value !== "custom"}>
                            <NumberField
                              format="percentage"
                              label="Custom withholding rate"
                              {...customField}
                            />
                          </div>
                        )}
                      />
                    </>
                  )}
                />
                <Controller
                  control={control}
                  name={`jobs.${jobIndex}.wages.${index}.income.withholding.additionalFederalIncomeAmount`}
                  render={({ field }) => (
                    <NumberField
                      format="financial"
                      label="Total additional amount to withhold"
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`jobs.${jobIndex}.wages.${index}.income.withholding.socialSecurity`}
                  render={({ field: { onChange, value, ...field } }) => (
                    <CheckboxField
                      label="Social Security tax withholding"
                      onChange={(isChecked) =>
                        onChange(isChecked ? "regular" : "off")
                      }
                      value={value === "regular"}
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`jobs.${jobIndex}.wages.${index}.income.withholding.medicare`}
                  render={({ field: { onChange, value, ...field } }) => (
                    <CheckboxField
                      label="Medicare tax withholding"
                      onChange={(isChecked) =>
                        onChange(isChecked ? "regular" : "off")
                      }
                      value={value === "regular"}
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`jobs.${jobIndex}.wages.${index}.income.withholding.additionalMedicare`}
                  render={({ field: { onChange, value, ...field } }) => (
                    <CheckboxField
                      label="Additional Medicare tax withholding"
                      onChange={(isChecked) =>
                        onChange(isChecked ? "regular" : "off")
                      }
                      value={value === "regular"}
                      {...field}
                    />
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
            income: makeDefaultEmploymentIncomeComponent(taxYear),
            label: "",
            ui: { expanded: true },
          })
        }
      >
        Add compensation
      </AriaButton>
    </div>
  );
}
