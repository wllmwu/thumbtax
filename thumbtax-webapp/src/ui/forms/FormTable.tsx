import React from "react";

import classNames from "classnames";
import { Button, DialogTrigger, Modal } from "react-aria-components";

import { useStore } from "#src/state/useStore";
import { FormBoxContent } from "#src/ui/forms/FormBoxContent";
import { FormLabelDialog } from "#src/ui/forms/FormLabelDialog";
import styles from "#src/ui/forms/FormTable.module.css";

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
  if (line.virtual) {
    return null;
  }
  return (
    <div className={styles.formTableRow}>
      <span className={styles.formTableRowHeader}>{line.index}</span>
      <span className={styles.formTableRowHeader}>{line.description}</span>
      {"boxes" in line ? (
        line.boxes.map((box, index) => (
          <span
            key={box.identifier}
            className={styles.formLineColumn}
            style={
              {
                "--box-index": index,
                "--column-count": line.boxes.length,
              } as React.CSSProperties
            }
          >
            <FormBoxContent instance={instance} box={box} />
          </span>
        ))
      ) : (
        <span className={styles.formLineColumn}>
          <FormBoxContent instance={instance} box={line.box} />
        </span>
      )}
    </div>
  );
}

export function FormTable({ specification, instances }: Props) {
  const moveFormInstance = useStore((state) => state.moveFormInstance);

  const allowsMultipleInstances =
    specification.maxInstances === null || specification.maxInstances > 1;

  const rowCount = React.useMemo(() => {
    let count = allowsMultipleInstances ? 1 : 0;
    for (const section of specification.sections) {
      if (section.heading) {
        count++;
      }
      count++;
      count += section.lines.length;
    }
    return count;
  }, [allowsMultipleInstances, specification.sections]);

  return (
    <div
      className={styles.formTable}
      style={
        {
          "--instance-count": instances.length,
          "--max-column-count": Math.max(
            ...specification.sections.map(
              ({ columns }) => columns?.length ?? 1,
            ),
          ),
          "--row-count": rowCount,
        } as React.CSSProperties
      }
    >
      {instances.map((instance, index) => (
        <div key={instance.id} className={styles.formInstance}>
          {allowsMultipleInstances && (
            <div className={styles.formTableRow}>
              <div className={styles.formInstanceLabelCell}>
                <span>{instance.label}</span>
                <DialogTrigger>
                  <Button>Edit</Button>
                  <Modal isDismissable>
                    <FormLabelDialog
                      formClass={instance.class}
                      instanceId={instance.id}
                    />
                  </Modal>
                </DialogTrigger>
                <Button
                  isDisabled={index <= 0}
                  onPress={() =>
                    moveFormInstance(instance.class, instance.id, -1)
                  }
                >
                  Move left
                </Button>
                <Button
                  isDisabled={index >= instances.length - 1}
                  onPress={() =>
                    moveFormInstance(instance.class, instance.id, 1)
                  }
                >
                  Move right
                </Button>
              </div>
            </div>
          )}
          {specification.sections.map((section, index) => (
            <React.Fragment key={index}>
              {section.heading && (
                <div className={styles.formTableRow}>
                  <div
                    className={classNames(
                      styles.formSectionHeadingCell,
                      styles.formTableRowHeader,
                    )}
                  >
                    {section.heading}
                  </div>
                </div>
              )}
              <div className={styles.formTableRow}>
                <span className={styles.formTableRowHeader}>Line</span>
                <span className={styles.formTableRowHeader}>Instructions</span>
                {section.columns ? (
                  section.columns.map((column, index) => (
                    <span
                      key={column.index}
                      className={styles.formLineColumn}
                      style={
                        {
                          "--box-index": index,
                          "--column-count": section.columns.length,
                        } as React.CSSProperties
                      }
                    >
                      {column.index} {column.description}
                    </span>
                  ))
                ) : (
                  <span className={styles.formLineColumn}>Value</span>
                )}
              </div>
              {section.lines.map((line) => (
                <React.Fragment key={line.index}>
                  <FormLineTableRow
                    key={line.index}
                    line={line}
                    instance={instance}
                  />
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}
