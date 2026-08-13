import { useStore } from "#src/state/useStore";
import { FormList } from "#src/ui/forms/FormList";
import { PageWithTableOfContents } from "#src/ui/table-of-contents/PageWithTableOfContents";

import type { TableOfContentsHeading } from "#src/ui/table-of-contents/tableOfContentsHeading";

export function MainPage() {
  const formClasses = useStore((state) => state.applicationState.formClasses);
  const formInstances = useStore(
    (state) => state.applicationState.formInstances,
  );
  const specifications = useStore((state) => state.specifications);

  const headings: TableOfContentsHeading[] = specifications
    ? formClasses
        .filter((formClass) => formInstances[formClass] !== undefined)
        .map((formClass) => ({
          id: formClass,
          label: specifications[formClass].title,
        }))
    : [];

  return (
    <PageWithTableOfContents headings={headings}>
      <h1>Tax forms</h1>
      <FormList />
    </PageWithTableOfContents>
  );
}
