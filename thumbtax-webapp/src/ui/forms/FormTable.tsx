import { useStore } from "#src/state/useStore";
import { FormBoxTableCell } from "#src/ui/forms/FormBoxTableCell";

import type { FormClass } from "#src/common/types/formClass";
import type { FormInstance } from "#src/common/types/formInstance";
import type { FormSpecification } from "#src/specifications/types/formSpecification";

type Props = {
  formClass: FormClass;
};

function FormSectionTableHeader({
  specification,
  sectionIndex,
  instances,
}: {
  specification: FormSpecification;
  sectionIndex: number;
  instances: FormInstance[];
}) {
  const formSection = specification.sections[sectionIndex];
  const allowsMultipleInstances =
    specification.maxInstances === null || specification.maxInstances > 1;

  if (allowsMultipleInstances && formSection.columns) {
    return (
      <>
        <colgroup>
          <col />
          <col />
          {instances.map((instance) => (
            <col key={instance.id} span={formSection.columns.length} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th scope="col" rowSpan={2}>
              Line
            </th>
            <th scope="col" rowSpan={2}>
              Instructions
            </th>
            {instances.map((instance) => (
              <th
                key={instance.id}
                scope="colgroup"
                colSpan={formSection.columns.length}
              >
                {instance.label}
              </th>
            ))}
          </tr>
          <tr>
            {instances.map((instance) =>
              formSection.columns.map((column) => (
                <th key={`${instance.id}-${column.index}`} scope="col">
                  <b>{column.index}</b>
                  {column.description && (
                    <>
                      <br />
                      {column.description}
                    </>
                  )}
                </th>
              )),
            )}
          </tr>
        </thead>
      </>
    );
  } else {
    return (
      <thead>
        <tr>
          <th scope="col">Line</th>
          <th scope="col">Instructions</th>
          {allowsMultipleInstances ? (
            instances.map((instance) => (
              <th key={instance.id} scope="col">
                {instance.label}
              </th>
            ))
          ) : formSection.columns ? (
            formSection.columns.map((column) => (
              <th key={column.index} scope="col">
                <b>{column.index}</b>
                {column.description && (
                  <>
                    <br />
                    {column.description}
                  </>
                )}
              </th>
            ))
          ) : (
            <th scope="col">Value</th>
          )}
        </tr>
      </thead>
    );
  }
}

function FormSectionTableBody({
  specification,
  sectionIndex,
  instances,
}: {
  specification: FormSpecification;
  sectionIndex: number;
  instances: FormInstance[];
}) {
  const formSection = specification.sections[sectionIndex];

  return (
    <tbody>
      {formSection.lines.map((line) => (
        <tr key={line.index}>
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
