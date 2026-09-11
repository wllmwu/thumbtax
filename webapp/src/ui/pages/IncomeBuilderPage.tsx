import React from "react";

import { useNavigate } from "react-router";

import { useStore } from "#src/state/useStore";
import { IntakeWizard } from "#src/ui/intake/IntakeWizard";
import { Page } from "#src/ui/pages/Page";

export function IncomeBuilderPage(): React.ReactNode {
  const navigate = useNavigate();

  const hasAnyForms = useStore(
    (state) => state.applicationState.formClasses.length > 0,
  );

  return (
    <Page headings={null} header={<h1>Income builder</h1>}>
      <IntakeWizard
        initialState={undefined}
        onCancel={hasAnyForms ? () => navigate("/") : undefined}
        onSubmit={() => {
          navigate("/");
        }}
      />
    </Page>
  );
}
