import React from "react";

import { Controller, useFieldArray } from "react-hook-form";

import { DEFAULT_INCOME_COMPONENT } from "#src/ui/intake/defaults";
import { IncomeComponentFields } from "#src/ui/intake/IncomeComponentFields";
import { ListItemDisclosure } from "#src/ui/intake/ListItemDisclosure";
import { AriaButton } from "#src/ui/primitives/AriaButton";
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
          />
        </ListItemDisclosure>
      ))}
      <AriaButton
        onPress={() =>
          append({
            income: DEFAULT_INCOME_COMPONENT,
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
