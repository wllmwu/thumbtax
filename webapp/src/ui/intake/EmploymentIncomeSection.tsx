import React from "react";

import { Controller, useFieldArray } from "react-hook-form";

import { CompensationList } from "#src/ui/intake/CompensationList";
import { AriaButton } from "#src/ui/primitives/AriaButton";
import { TextField } from "#src/ui/primitives/TextField";

import type { IntakeWizardState } from "#src/ui/intake/types/intakeWizardState";
import type { Control } from "react-hook-form";

type Props = {
  control: Control<IntakeWizardState>;
};

export function EmploymentIncomeSection({ control }: Props): React.ReactNode {
  const { append, fields } = useFieldArray({ control, name: "jobs" });

  return (
    <section>
      <h3>Employment income</h3>
      {fields.map((field, index) => (
        <div key={field.id}>
          <Controller
            control={control}
            name={`jobs.${index}.employer`}
            render={({ field }) => (
              <>
                <TextField label="Employer name" {...field} />
                <CompensationList control={control} jobIndex={index} />
              </>
            )}
          />
        </div>
      ))}
      <AriaButton onPress={() => append({ employer: "", wages: [] })}>
        Add job
      </AriaButton>
    </section>
  );
}
