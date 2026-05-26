import React, { useState } from "react";

import classNames from "classnames";
import { Button, Disclosure, DisclosurePanel } from "react-aria-components";

import { FormBoxContent } from "#src/ui/forms/FormBoxContent";
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
  const allowsMultipleInstances =
    specification.maxInstances === null || specification.maxInstances > 1;

  const [expandedLines, setExpandedLines] = useState<Set<string>>(new Set());

  const toggleLine = React.useCallback((lineIndex: string) => {
    setExpandedLines((prev) => {
      const next = new Set(prev);
      if (next.has(lineIndex)) {
        next.delete(lineIndex);
      } else {
        next.add(lineIndex);
      }
      return next;
    });
  }, []);

  const lineCount = React.useMemo(() => {
    let count = allowsMultipleInstances ? 1 : 0;
    for (const section of specification.sections) {
      if (section.heading) {
        count++;
      }
      count++;
      for (const line of section.lines) {
        count++;
        if (line.children) {
          count++;
          if (expandedLines.has(line.index)) {
            count += line.children.length;
          }
        }
      }
    }
    return count;
  }, [allowsMultipleInstances, expandedLines, specification.sections]);

  return (
    <div
      className={styles.formTable}
      style={
        {
          "--instance-count": instances.length,
          "--line-count": lineCount,
          "--max-column-count": Math.max(
            ...specification.sections.map(
              ({ columns }) => columns?.length ?? 1,
            ),
          ),
        } as React.CSSProperties
      }
    >
      {instances.map((instance) => (
        <div key={instance.id} className={styles.formInstance}>
          {allowsMultipleInstances && (
            <div className={styles.formTableRow}>
              <div className={styles.formInstanceLabelCell}>
                {instance.label}
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
                  {line.children && (
                    <Disclosure
                      isExpanded={expandedLines.has(line.index)}
                      onExpandedChange={() => toggleLine(line.index)}
                      className={styles.formLineChildrenDisclosure}
                    >
                      <div className={styles.formTableRow}>
                        <Button
                          slot="trigger"
                          className={classNames(
                            styles.formLineChildrenDisclosureTrigger,
                            styles.formTableRowHeader,
                          )}
                        >
                          Expand/collapse
                        </Button>
                      </div>
                      <DisclosurePanel
                        className={styles.formLineChildrenDisclosurePanel}
                      >
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
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}
