import { Button, Disclosure, DisclosurePanel } from "react-aria-components";

import { FormBoxContent } from "#src/ui/forms/FormBoxContent";

import type { FormInstance } from "#src/common/types/formInstance";
import type {
  FormLine,
  FormSpecification,
} from "#src/specifications/types/formSpecification";

type Props = {
  specification: FormSpecification;
  instances: FormInstance[];
};

function FormLineTableRow({
  line,
  instance,
}: {
  line: FormLine<boolean>;
  instance: FormInstance;
}) {
  return (
    <div>
      <span>{line.index}</span>
      <span>{line.description}</span>
      {"boxes" in line ? (
        line.boxes.map((box) => (
          <span key={box.identifier}>
            <FormBoxContent instance={instance} box={box} />
          </span>
        ))
      ) : (
        <span>
          <FormBoxContent instance={instance} box={line.box} />
        </span>
      )}
      {line.children && (
        <Disclosure>
          <Button slot="trigger">Expand/collapse</Button>
          <DisclosurePanel>
            {line.children.map((child) => (
              <FormLineTableRow
                key={child.index}
                line={child}
                instance={instance}
              />
            ))}
          </DisclosurePanel>
        </Disclosure>
      )}
    </div>
  );
}

export function FormTable({ specification, instances }: Props) {
  const allowsMultipleInstances =
    specification.maxInstances === null || specification.maxInstances > 1;

  return (
    <div>
      {instances.map((instance) => (
        <div key={instance.id}>
          {allowsMultipleInstances && <div>{instance.label}</div>}
          {specification.sections.map((section, index) => (
            <div key={index}>
              {section.heading && <div>{section.heading}</div>}
              <div>
                <span>Line</span>
                <span>Instructions</span>
                {section.columns ? (
                  section.columns.map((column) => (
                    <span key={column.index}>
                      {column.index} {column.description}
                    </span>
                  ))
                ) : (
                  <span>Value</span>
                )}
              </div>
              {section.lines.map((line) => (
                <FormLineTableRow
                  key={line.index}
                  line={line}
                  instance={instance}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
