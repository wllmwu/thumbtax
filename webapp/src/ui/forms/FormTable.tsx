import React from "react";

import classNames from "classnames";
import {
  EditIcon,
  MoveLeftIcon,
  MoveRightIcon,
  Trash2Icon,
} from "lucide-react";
import { DialogTrigger, Modal } from "react-aria-components";

import { useStore } from "#src/state/useStore";
import { FormBoxContent } from "#src/ui/forms/FormBoxContent";
import { FormLabelDialog } from "#src/ui/forms/FormLabelDialog";
import { ProseContent } from "#src/ui/forms/ProseContent";
import { AriaButton } from "#src/ui/primitives/AriaButton";
import styles from "#src/ui/forms/FormTable.module.css";

import type { FormLine, FormSpecification } from "@thumbtax/forms";
import type { FormInstance } from "#src/common/types/formInstance";
import type { FormInstanceId } from "#src/common/types/formInstanceId";

type Props = {
  specification: FormSpecification;
  instances: FormInstance[];
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
      {instances.map((instance, index) => (
        <div key={instance.id} className={styles.formInstance}>
          {allowsMultipleInstances && (
            <div className={styles.formTableRow}>
              <div className={styles.formInstanceLabelCell}>
                <h3>{instance.label}</h3>
                <div className={styles.formInstanceButtonGroup}>
                  <DialogTrigger>
                    <AriaButton aria-label="Edit label">
                      <EditIcon />
                    </AriaButton>
                    <Modal isDismissable>
                      <FormLabelDialog
                        formClass={instance.class}
                        instanceId={instance.id}
                      />
                    </Modal>
                  </DialogTrigger>
                  <AriaButton
                    aria-label="Move left"
                    isDisabled={index <= 0}
                    onPress={() =>
                      moveFormInstance(instance.class, instance.id, -1)
                    }
                  >
                    <MoveLeftIcon />
                  </AriaButton>
                  <AriaButton
                    aria-label="Move right"
                    isDisabled={index >= instances.length - 1}
                    onPress={() =>
                      moveFormInstance(instance.class, instance.id, 1)
                    }
                  >
                    <MoveRightIcon />
                  </AriaButton>
                  <AriaButton
                    aria-label="Delete"
                    onPress={() =>
                      removeFormInstance(instance.class, instance.id)
                    }
                  >
                    <Trash2Icon />
                  </AriaButton>
                </div>
              </div>
            </div>
          )}
          {specification.sections.map((section, sectionIndex) => (
            <React.Fragment key={sectionIndex}>
              {section.heading && (
                <div className={styles.formTableRow}>
                  <div
                    className={classNames(
                      styles.formSectionHeaderCell,
                      styles.formTableRowHeader,
                    )}
                  >
                    <div className={styles.formSectionHeading}>
                      {section.heading}
                    </div>
                    {section.subtitle && <div>{section.subtitle}</div>}
                    {section.instructions && (
                      <ProseContent nodes={section.instructions} />
                    )}
                    {section.commentary && (
                      <ProseContent nodes={section.commentary} />
                    )}
                  </div>
                </div>
              )}
              <div className={styles.formTableRow}>
                <span
                  className={classNames(
                    styles.formColumnHeaderCell,
                    styles.formTableRowHeader,
                  )}
                >
                  Line
                </span>
                <span
                  className={classNames(
                    styles.formColumnHeaderCell,
                    styles.formTableRowHeader,
                  )}
                >
                  Instructions
                </span>
                {section.columns ? (
                  section.columns.map((column, index) => (
                    <span
                      key={column.index}
                      className={classNames(
                        styles.formColumnHeaderCell,
                        styles.formLineColumn,
                      )}
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
                  <span
                    className={classNames(
                      styles.formColumnHeaderCell,
                      styles.formLineColumn,
                    )}
                  >
                    Value
                  </span>
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
      ))}
    </div>
  );
}
