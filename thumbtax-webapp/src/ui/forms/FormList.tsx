import React from "react";

import { Button, Disclosure, DisclosurePanel } from "react-aria-components";

import { useStore } from "#src/state/useStore";
import { FormTable } from "#src/ui/forms/FormTable";
import { Badge } from "#src/ui/primitives/Badge";

import type { FormClass } from "#src/common/types/formClass";

function CollapsibleFormTable({
  formClass,
  header,
}: {
  formClass: FormClass;
  header: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Disclosure isExpanded={isOpen}>
      <Button onPress={() => setIsOpen((value) => !value)}>{header}</Button>
      <DisclosurePanel>
        <FormTable formClass={formClass} />
      </DisclosurePanel>
    </Disclosure>
  );
}

export function FormList() {
  const specifications = useStore((state) => state.specifications);
  const formClasses = useStore((state) => state.applicationState.formClasses);
  const instances = useStore((state) => state.applicationState.formInstances);

  if (!specifications) {
    return null;
  }

  return (
    <ul>
      {formClasses.map((formClass) => {
        const specification = specifications[formClass];
        return (
          <li key={formClass}>
            <CollapsibleFormTable
              formClass={formClass}
              header={
                <span>
                  {specification.title} <Badge>{specification.category}</Badge>{" "}
                  {specification.maxInstances !== 1 && (
                    <Badge>{instances[formClass]?.length}</Badge>
                  )}
                </span>
              }
            />
          </li>
        );
      })}
    </ul>
  );
}
