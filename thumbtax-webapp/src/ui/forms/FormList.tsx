import { Button, Disclosure, DisclosurePanel } from "react-aria-components";

import { useStore } from "#src/state/useStore";
import { FormTable } from "#src/ui/forms/FormTable";
import { Badge } from "#src/ui/primitives/Badge";

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
        const formInstances = instances[specification.class];

        if (!formInstances) {
          return null;
        }
        return (
          <li key={formClass}>
            <span>
              <h2>{specification.title}</h2>
              <Badge>{specification.category}</Badge>{" "}
              {specification.maxInstances !== 1 && (
                <Badge>{formInstances.length}</Badge>
              )}
            </span>
            {specification.subtitle && <p>{specification.subtitle}</p>}
            <Disclosure>
              <Button slot="trigger">Show/hide {specification.title}</Button>
              <DisclosurePanel>
                <FormTable
                  specification={specification}
                  instances={formInstances}
                />
              </DisclosurePanel>
            </Disclosure>
          </li>
        );
      })}
    </ul>
  );
}
