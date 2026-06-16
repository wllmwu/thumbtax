import React from "react";

import classNames from "classnames";
import { Button, DialogTrigger, Modal } from "react-aria-components";

import { useStore } from "#src/state/useStore";
import {
  columnDescriptionId,
  columnLabelId,
  formTitleId,
  instanceGroupLabelId,
  lineDescriptionId,
  lineLabelId,
} from "#src/ui/forms/formAccessibilityIds";
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
  sectionIndex,
}: {
  line: FormLine<boolean>;
  instance: FormInstance;
  sectionIndex: number;
}) {
  if (line.virtual) {
    return null;
  }

  const labelId = lineLabelId(instance.id, sectionIndex, line.index);
  const descriptionId = lineDescriptionId(
    instance.id,
    sectionIndex,
    line.index,
  );
  const hasDescription = !!line.description;

  return (
    <div className={styles.formTableRow}>
      <span id={labelId} className={styles.formTableRowHeader}>
        {line.index}
      </span>
      <span id={descriptionId} className={styles.formTableRowHeader}>
        {line.description}
      </span>
      {"boxes" in line ? (
        line.boxes.map((box, index) => {
          const columnLabel = columnLabelId(
            instance.id,
            sectionIndex,
            box.column,
          );
          const columnDescription = columnDescriptionId(
            instance.id,
            sectionIndex,
            box.column,
          );
          return (
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
              <FormBoxContent
                instance={instance}
                box={box}
                ariaLabelledBy={`${labelId} ${columnLabel}`}
                ariaDescribedBy={
                  hasDescription
                    ? `${descriptionId} ${columnDescription}`
                    : columnDescription
                }
              />
            </span>
          );
        })
      ) : (
        <span className={styles.formLineColumn}>
          <FormBoxContent
            instance={instance}
            box={line.box}
            ariaLabelledBy={labelId}
            ariaDescribedBy={hasDescription ? descriptionId : undefined}
          />
        </span>
      )}
    </div>
  );
}

export function FormTable({ specification, instances }: Props) {
  const moveFormInstance = useStore((state) => state.moveFormInstance);
  const removeFormInstance = useStore((state) => state.removeFormInstance);

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
        <div
          key={instance.id}
          className={styles.formInstance}
          role="group"
          aria-labelledby={
            allowsMultipleInstances
              ? instanceGroupLabelId(instance.id)
              : formTitleId(specification.class)
          }
        >
          {allowsMultipleInstances && (
            <div className={styles.formTableRow}>
              <div className={styles.formInstanceLabelCell}>
                <span id={instanceGroupLabelId(instance.id)}>
                  {instance.label}
                </span>
                <DialogTrigger>
                  <Button
                    id={`${instanceGroupLabelId(instance.id)}-edit`}
                    aria-labelledby={`${instanceGroupLabelId(instance.id)}-edit ${instanceGroupLabelId(instance.id)}`}
                  >
                    Edit label
                  </Button>
                  <Modal isDismissable>
                    <FormLabelDialog
                      formClass={instance.class}
                      instanceId={instance.id}
                    />
                  </Modal>
                </DialogTrigger>
                <Button
                  id={`${instanceGroupLabelId(instance.id)}-move-left`}
                  aria-labelledby={`${instanceGroupLabelId(instance.id)}-move-left ${instanceGroupLabelId(instance.id)}`}
                  isDisabled={index <= 0}
                  onPress={() =>
                    moveFormInstance(instance.class, instance.id, -1)
                  }
                >
                  Move left
                </Button>
                <Button
                  id={`${instanceGroupLabelId(instance.id)}-move-right`}
                  aria-labelledby={`${instanceGroupLabelId(instance.id)}-move-right ${instanceGroupLabelId(instance.id)}`}
                  isDisabled={index >= instances.length - 1}
                  onPress={() =>
                    moveFormInstance(instance.class, instance.id, 1)
                  }
                >
                  Move right
                </Button>
                <Button
                  id={`${instanceGroupLabelId(instance.id)}-delete`}
                  aria-labelledby={`${instanceGroupLabelId(instance.id)}-delete ${instanceGroupLabelId(instance.id)}`}
                  onPress={() =>
                    removeFormInstance(instance.class, instance.id)
                  }
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
          {specification.sections.map((section, sectionIndex) => (
            <React.Fragment key={sectionIndex}>
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
                      <span
                        id={columnLabelId(
                          instance.id,
                          sectionIndex,
                          column.index,
                        )}
                      >
                        {column.index}
                      </span>{" "}
                      <span
                        id={columnDescriptionId(
                          instance.id,
                          sectionIndex,
                          column.index,
                        )}
                      >
                        {column.description}
                      </span>
                    </span>
                  ))
                ) : (
                  <span className={styles.formLineColumn}>Value</span>
                )}
              </div>
              {section.lines.map((line) => (
                <FormLineTableRow
                  key={line.index}
                  line={line}
                  instance={instance}
                  sectionIndex={sectionIndex}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}
