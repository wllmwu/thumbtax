import React from "react";

import { IntakeWizard } from "#src/ui/intake/IntakeWizard";
import { Page } from "#src/ui/pages/Page";

export function IncomeBuilderPage(): React.ReactNode {
  return (
    <Page headings={null} header={<h1>Income builder</h1>}>
      <IntakeWizard onSubmit={() => {}} />
    </Page>
  );
}
