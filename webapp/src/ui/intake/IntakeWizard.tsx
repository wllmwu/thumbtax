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
    <div className={styles.wizard}>
      <NavigationBlocker isFormDirty={isDirty} />
      <p>
        Welcome to Thumbtax, a tool for estimating your U.S. individual tax
        return and learning about the tax return process. Use this income
        builder to model your income for the year, then Thumbtax will
        automatically calculate the tax forms you would file.
      </p>
      <p>
        By using Thumbtax, you agree to the terms of service and privacy policy.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
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
    </div>
  );
}
