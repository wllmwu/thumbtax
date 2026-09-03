import React from "react";

import { Controller, useFieldArray } from "react-hook-form";

import { DEFAULT_INCOME_COMPONENT } from "#src/ui/intake/defaults";
import { IncomeComponentFields } from "#src/ui/intake/IncomeComponentFields";
import { AriaButton } from "#src/ui/primitives/AriaButton";
import { TextField } from "#src/ui/primitives/TextField";

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
          <IncomeComponentFields
            control={control}
            path={`jobs.${jobIndex}.wages.${index}.income`}
          />
        </div>
      ))}
      <AriaButton
        onPress={() => append({ income: DEFAULT_INCOME_COMPONENT, label: "" })}
      >
        Add compensation
      </AriaButton>
    </div>
  );
}
