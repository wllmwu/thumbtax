import { Controller } from "react-hook-form";

import { CheckboxField } from "#src/ui/primitives/CheckboxField";
import styles from "#src/ui/intake/AcknowledgementCheckboxes.module.css";

import type { IntakeWizardState } from "#src/ui/intake/types/intakeWizardState";
import type React from "react";
import type { Control } from "react-hook-form";

type Props = {
  control: Control<IntakeWizardState>;
};

export function AcknowledgementCheckboxes({ control }: Props): React.ReactNode {
  return (
    <div className={styles.box}>
      <p>Acknowledge each of the following items by checking the boxes.</p>
      <Controller
        control={control}
        name="acknowledgements.notAdvice"
        render={({ field, fieldState }) => (
          <CheckboxField
            label="Thumbtax does not provide legal, financial, or tax advice and it does not prepare or file tax returns."
            {...field}
            errorMessage={fieldState.error?.message}
          />
        )}
        rules={{ required: "Acknowledgement is required." }}
      />
      <Controller
        control={control}
        name="acknowledgements.notAffiliated"
        render={({ field, fieldState }) => (
          <CheckboxField
            label="Thumbtax is not affiliated with any government entity, financial institution, tax preparation service, or other organization."
            {...field}
            errorMessage={fieldState.error?.message}
          />
        )}
        rules={{ required: "Acknowledgement is required." }}
      />
      <Controller
        control={control}
        name="acknowledgements.notGuaranteed"
        render={({ field, fieldState }) => (
          <CheckboxField
            label="Outputs produced by Thumbtax are not guaranteed to be correct and neither Thumbtax nor its author are responsible for what you do with the outputs."
            {...field}
            errorMessage={fieldState.error?.message}
          />
        )}
        rules={{ required: "Acknowledgement is required." }}
      />
    </div>
  );
}
