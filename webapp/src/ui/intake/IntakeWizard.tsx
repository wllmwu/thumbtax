import React from "react";

import { useForm } from "react-hook-form";

import { EmploymentIncomeSection } from "#src/ui/intake/EmploymentIncomeSection";
import { NavigationBlocker } from "#src/ui/intake/NavigationBlocker";
import { OtherIncomeSection } from "#src/ui/intake/OtherIncomeSection";
import { AriaButton } from "#src/ui/primitives/AriaButton";
import { racn } from "#src/ui/utils/racn";
import styles from "#src/ui/intake/IntakeWizard.module.css";

import type { IntakeWizardState } from "#src/ui/intake/types/intakeWizardState";

export function IntakeWizard(): React.ReactNode {
  const {
    control,
    formState: { isDirty, isSubmitted, isValid },
    handleSubmit,
  } = useForm<IntakeWizardState>({
    defaultValues: { jobs: [], otherIncome: [] },
  });

  const hasErrors = isSubmitted && !isValid;

  return (
    <>
      <NavigationBlocker isFormDirty={isDirty} />
      <form
        onSubmit={handleSubmit((data) => console.log(JSON.stringify(data)))}
      >
        <h2>Income builder</h2>
        <EmploymentIncomeSection control={control} />
        <OtherIncomeSection control={control} />
        <AriaButton
          type="submit"
          className={racn(styles.submitButton)}
          isDisabled={hasErrors}
        >
          Submit
        </AriaButton>
        <div aria-live="polite">
          {hasErrors && (
            <span className={styles.errorFeedback}>
              Invalid form input. Correct the errors and submit again.
            </span>
          )}
        </div>
      </form>
    </>
  );
}
