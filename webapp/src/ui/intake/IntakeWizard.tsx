import React from "react";

import { useForm } from "react-hook-form";

import { DEFAULT_STATE } from "#src/ui/intake/defaults";
import { EmploymentIncomeSection } from "#src/ui/intake/EmploymentIncomeSection";
import { NavigationBlocker } from "#src/ui/intake/NavigationBlocker";
import { OtherIncomeSection } from "#src/ui/intake/OtherIncomeSection";
import { AriaButton } from "#src/ui/primitives/AriaButton";
import styles from "#src/ui/intake/IntakeWizard.module.css";

import type { IntakeWizardState } from "#src/ui/intake/types/intakeWizardState";

type Props = {
  onSubmit: (state: IntakeWizardState) => void;
};

export function IntakeWizard({ onSubmit }: Props): React.ReactNode {
  const {
    control,
    formState: { isDirty, isSubmitted, isValid },
    handleSubmit,
  } = useForm<IntakeWizardState>({
    defaultValues: DEFAULT_STATE,
  });

  const hasErrors = isSubmitted && !isValid;

  return (
    <form className={styles.wizard} onSubmit={handleSubmit(onSubmit)}>
      <NavigationBlocker isFormDirty={isDirty} />
      <EmploymentIncomeSection control={control} />
      <OtherIncomeSection control={control} />
      <div className={styles.submitBlock}>
        <AriaButton type="submit" isDisabled={hasErrors} variant="primary">
          Submit
        </AriaButton>
        <div aria-live="polite">
          {hasErrors && (
            <p className={styles.errorFeedback}>
              Invalid form input. Correct the errors and submit again.
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
