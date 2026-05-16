import type { FormInstance } from "#src/common/types/formInstance";
import type { FormSpecification } from "#src/specifications/types/formSpecification";

type Props = {
  specification: FormSpecification;
  sectionIndex: number;
  instances: FormInstance[];
};

export function FormSectionTableHeader({
  specification,
  sectionIndex,
  instances,
}: Props) {
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
