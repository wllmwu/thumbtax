import { useStore } from "#src/state/useStore";
import { FormSectionTableBody } from "#src/ui/forms/FormSectionTableBody";
import { FormSectionTableHeader } from "#src/ui/forms/FormSectionTableHeader";

import type { FormClass } from "#src/common/types/formClass";

type Props = {
  formClass: FormClass;
};

export function FormTable({ formClass }: Props) {
  const specification = useStore((state) => state.specifications?.[formClass]);
  const instances = useStore(
    (state) => state.applicationState.formInstances[formClass],
  );

  if (!specification || !instances) {
    return null;
  }

  return (
    <div>
      {specification.subtitle && <p>{specification.subtitle}</p>}
      {specification.sections.map((formSection, index) => (
        <table>
          {formSection.heading && <caption>{formSection.heading}</caption>}
          <FormSectionTableHeader
            specification={specification}
            sectionIndex={index}
            instances={instances}
          />
          <FormSectionTableBody
            specification={specification}
            sectionIndex={index}
            instances={instances}
          />
        </table>
      ))}
    </div>
  );
}
