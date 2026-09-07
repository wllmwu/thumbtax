import React from "react";

import { absurd } from "@thumbtax/common";

import { useStore } from "#src/state/useStore";
import { FormList } from "#src/ui/forms/FormList";
import { LoadErrorBanner } from "#src/ui/forms/LoadErrorBanner";
import { IntakeWizard } from "#src/ui/intake/IntakeWizard";
import { Page } from "#src/ui/pages/Page";
import { AriaButton } from "#src/ui/primitives/AriaButton";

import type { TableOfContentsHeading } from "#src/ui/types/tableOfContentsHeading";

type View = "form_list" | "intake_wizard";

export function MainPage() {
  const formClasses = useStore((state) => state.applicationState.formClasses);
  const formInstances = useStore(
    (state) => state.applicationState.formInstances,
  );
  const specifications = useStore((state) => state.specifications);

  const [view, setView] = React.useState<View>("form_list");

  const headings = React.useMemo<TableOfContentsHeading[]>(() => {
    if (!specifications) {
      return [];
    }
    return formClasses
      .filter((formClass) => formInstances[formClass] !== undefined)
      .map((formClass) => ({
        id: formClass,
        label: specifications[formClass].title,
      }));
  }, [formClasses, formInstances, specifications]);

  switch (view) {
    case "form_list":
      return (
        <Page headings={headings} header={<h1>Tax forms</h1>}>
          <LoadErrorBanner />
          <AriaButton
            onPress={() => setView("intake_wizard")}
            variant={formClasses.length === 0 ? "primary" : "secondary"}
          >
            Launch income builder
          </AriaButton>
          <FormList />
        </Page>
      );
    case "intake_wizard":
      return (
        <Page headings={null} header={<h1>Income builder</h1>}>
          <IntakeWizard
            onSubmit={() => {
              setView("form_list");
            }}
          />
        </Page>
      );
    default:
      return absurd(view);
  }
}
