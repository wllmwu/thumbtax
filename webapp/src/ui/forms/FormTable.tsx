import React from "react";

import classNames from "classnames";
import { Button, DialogTrigger, Modal } from "react-aria-components";

import { useStore } from "#src/state/useStore";
import { FormBoxContent } from "#src/ui/forms/FormBoxContent";
import { FormLabelDialog } from "#src/ui/forms/FormLabelDialog";
import { ProseContent } from "#src/ui/forms/ProseContent";
import styles from "#src/ui/forms/FormTable.module.css";

import type { FormLine, FormSpecification } from "@thumbtax/forms";
import type { FormInstance } from "#src/common/types/formInstance";
import type { FormInstanceId } from "#src/common/types/formInstanceId";

type Props = {
  specification: FormSpecification;
  instances: FormInstance[];
  formTitleHeadingId: string;
};

function makeColumnIndexTextId(
  instanceId: FormInstanceId,
  columnIndex: string,
): string {
  return `${instanceId}-column-${columnIndex}-index`;
}

function makeColumnDescriptionTextId(
  instanceId: FormInstanceId,
  columnIndex: string,
): string {
  return `${instanceId}-column-${columnIndex}-description`;
}

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

  const lineIndexTextId = `${instance.id}-line-${line.index}-index`;
  const lineDescriptionTextId = line.instructions
    ? `${instance.id}-line-${line.index}-details`
    : undefined;

  return (
    <div className={styles.formTableRow}>
      <span id={lineIndexTextId} className={styles.formTableRowHeader}>
        {line.index}
      </span>
      <span id={lineDescriptionTextId} className={styles.formTableRowHeader}>
        {line.instructions && (
          <span>
            <ProseContent nodes={line.instructions} />
          </span>
        )}
        {line.commentary && (
          <span>
            <ProseContent nodes={line.commentary} />
          </span>
        )}
      </span>
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
            <FormBoxContent
              instance={instance}
              box={box}
              aria-labelledby={`${lineIndexTextId} ${makeColumnIndexTextId(
                instance.id,
                box.column,
              )}`}
              aria-describedby={lineDescriptionTextId}
            />
          </span>
        ))
      ) : (
        <span className={styles.formLineColumn}>
          <FormBoxContent
            instance={instance}
            box={line.box}
            aria-labelledby={lineIndexTextId}
            aria-describedby={lineDescriptionTextId}
          />
        </span>
      )}
    </div>
  );
}

export function FormTable({
  specification,
  instances,
  formTitleHeadingId,
}: Props) {
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
      if (section.subtitle) {
        count++;
      }
      if (section.instructions) {
        count++;
      }
      if (section.commentary) {
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
      {instances.map((instance, index) => {
        const instanceLabelTextId = `${instance.id}-label`;
        const editLabelButtonId = `${instance.id}-edit-label`;
        const moveLeftButtonId = `${instance.id}-move-left`;
        const moveRightButtonId = `${instance.id}-move-right`;
        const deleteButtonId = `${instance.id}-delete`;

        return (
          <div
            key={instance.id}
            className={styles.formInstance}
            role="group"
            aria-labelledby={
              allowsMultipleInstances ? instanceLabelTextId : formTitleHeadingId
            }
          >
            {allowsMultipleInstances && (
              <div className={styles.formTableRow}>
                <div className={styles.formInstanceLabelCell}>
                  <span id={instanceLabelTextId}>{instance.label}</span>
                  <DialogTrigger>
                    <Button
                      id={editLabelButtonId}
                      aria-labelledby={`${editLabelButtonId} ${instanceLabelTextId}`}
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
                    id={moveLeftButtonId}
                    aria-labelledby={`${moveLeftButtonId} ${instanceLabelTextId}`}
                    isDisabled={index <= 0}
                    onPress={() =>
                      moveFormInstance(instance.class, instance.id, -1)
                    }
                  >
                    Move left
                  </Button>
                  <Button
                    id={moveRightButtonId}
                    aria-labelledby={`${moveRightButtonId} ${instanceLabelTextId}`}
                    isDisabled={index >= instances.length - 1}
                    onPress={() =>
                      moveFormInstance(instance.class, instance.id, 1)
                    }
                  >
                    Move right
                  </Button>
                  <Button
                    id={deleteButtonId}
                    aria-labelledby={`${deleteButtonId} ${instanceLabelTextId}`}
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
                    <h3
                      className={classNames(
                        styles.formSectionHeaderCell,
                        styles.formTableRowHeader,
                      )}
                    >
                      {section.heading}
                    </h3>
                  </div>
                )}
                {section.subtitle && (
                  <div className={styles.formTableRow}>
                    <span
                      className={classNames(
                        styles.formSectionHeaderCell,
                        styles.formTableRowHeader,
                      )}
                    >
                      {section.subtitle}
                    </span>
                  </div>
                )}
                {section.instructions && (
                  <div className={styles.formTableRow}>
                    <span
                      className={classNames(
                        styles.formSectionHeaderCell,
                        styles.formTableRowHeader,
                      )}
                    >
                      <ProseContent nodes={section.instructions} />
                    </span>
                  </div>
                )}
                {section.commentary && (
                  <div className={styles.formTableRow}>
                    <span
                      className={classNames(
                        styles.formSectionHeaderCell,
                        styles.formTableRowHeader,
                      )}
                    >
                      <ProseContent nodes={section.commentary} />
                    </span>
                  </div>
                )}
                <div className={styles.formTableRow}>
                  <span className={styles.formTableRowHeader}>Line</span>
                  <span className={styles.formTableRowHeader}>
                    Instructions
                  </span>
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
                          id={makeColumnIndexTextId(instance.id, column.index)}
                        >
                          {column.index}
                        </span>{" "}
                        <span
                          id={makeColumnDescriptionTextId(
                            instance.id,
                            column.index,
                          )}
                        >
                          <ProseContent nodes={column.instructions} />
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
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
        );
      })}
    </div>
  );
}
