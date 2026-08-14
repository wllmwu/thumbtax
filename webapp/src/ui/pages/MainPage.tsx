import React from "react";

import { useStore } from "#src/state/useStore";
import { FormList } from "#src/ui/forms/FormList";
import { Page } from "#src/ui/pages/Page";

import type { TableOfContentsHeading } from "#src/ui/table-of-contents/types/tableOfContentsHeading";

export function MainPage() {
  const formClasses = useStore((state) => state.applicationState.formClasses);
  const formInstances = useStore(
    (state) => state.applicationState.formInstances,
  );
  const specifications = useStore((state) => state.specifications);

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

  return (
    <Page headings={headings} header={<h1>Tax forms</h1>}>
      <FormList />
    </Page>
  );
}
