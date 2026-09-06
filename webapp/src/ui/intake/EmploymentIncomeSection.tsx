import React from "react";

import { Controller, useFieldArray } from "react-hook-form";

import { CompensationList } from "#src/ui/intake/CompensationList";
import { ListItemDisclosure } from "#src/ui/intake/ListItemDisclosure";
import { AriaButton } from "#src/ui/primitives/AriaButton";
import { TextField } from "#src/ui/primitives/TextField";

import type { IntakeWizardState } from "#src/ui/intake/types/intakeWizardState";
import type { Control } from "react-hook-form";

type Props = {
  control: Control<IntakeWizardState>;
};

export function EmploymentIncomeSection({ control }: Props): React.ReactNode {
  const { append, fields, move, remove } = useFieldArray({
    control,
    name: "jobs",
  });

  return (
    <section>
      <h3>Employment income</h3>
      {fields.map((arrayField, index) => (
        <ListItemDisclosure
          key={arrayField.id}
          canMoveBackward={index > 0}
          canMoveForward={index < fields.length - 1}
          control={control}
          expandedFieldName={`jobs.${index}.ui.expanded`}
          labelFieldName={`jobs.${index}.employer`}
          onDelete={() => remove(index)}
          onMoveBackward={() => move(index, index - 1)}
          onMoveForward={() => move(index, index + 1)}
        >
          <Controller
            control={control}
            name={`jobs.${index}.employer`}
            render={({ field, fieldState }) => (
              <TextField
                label="Employer name"
                {...field}
                errorMessage={fieldState.error?.message}
              />
            )}
            rules={{ required: "Employer name is required." }}
          />
          <CompensationList control={control} jobIndex={index} />
        </ListItemDisclosure>
      ))}
      <AriaButton
        onPress={() =>
          append({ employer: "", ui: { expanded: true }, wages: [] })
        }
      >
        Add job
      </AriaButton>
    </section>
  );
}
