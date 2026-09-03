import { useForm } from "react-hook-form";

import { EmploymentIncomeSection } from "#src/ui/intake/EmploymentIncomeSection";
import { OtherIncomeSection } from "#src/ui/intake/OtherIncomeSection";

import type { IntakeWizardState } from "#src/ui/intake/types/intakeWizardState";
import type React from "react";

export function IntakeWizard(): React.ReactNode {
  const { control, handleSubmit } = useForm<IntakeWizardState>();

  return (
    <form onSubmit={handleSubmit((data) => console.log(JSON.stringify(data)))}>
      <EmploymentIncomeSection control={control} />
      <OtherIncomeSection control={control} />
    </form>
  );
}
