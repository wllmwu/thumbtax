import { FormBoxTableCell } from "#src/ui/forms/FormBoxTableCell";

import type { FormInstance } from "#src/common/types/formInstance";
import type { FormSpecification } from "#src/specifications/types/formSpecification";

type Props = {
  specification: FormSpecification;
  sectionIndex: number;
  instances: FormInstance[];
};

export function FormSectionTableBody({
  specification,
  sectionIndex,
  instances,
}: Props) {
  const formSection = specification.sections[sectionIndex];

  return (
    <tbody>
      {formSection.lines.map((line) => (
        <tr>
          <td>{line.index}</td>
          <td>{line.description}</td>
          {instances.map((instance) => {
            const boxes = "boxes" in line ? line.boxes : [line.box];
            return boxes.map((box) => (
              <FormBoxTableCell
                key={`${instance.id}-${box.identifier}`}
                instance={instance}
                box={box}
              />
            ));
          })}
        </tr>
      ))}
    </tbody>
  );
}
