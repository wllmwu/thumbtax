import { ChevronDownIcon, ChevronRightIcon, Trash2Icon } from "lucide-react";
import { Disclosure, DisclosurePanel } from "react-aria-components";
import { Controller, Watch } from "react-hook-form";

import { IconButton } from "#src/ui/primitives/IconButton";
import { MoveButton } from "#src/ui/primitives/MoveButton";
import { racn } from "#src/ui/utils/racn";
import styles from "#src/ui/intake/ListItemDisclosure.module.css";

import type { IntakeWizardState } from "#src/ui/intake/types/intakeWizardState";
import type React from "react";
import type { Control } from "react-hook-form";

type Props = {
  canMoveBackward: boolean;
  canMoveForward: boolean;
  children: React.ReactNode;
  className?: string;
  control: Control<IntakeWizardState>;
  expandedFieldName:
    | `jobs.${number}.ui.expanded`
    | `jobs.${number}.wages.${number}.ui.expanded`
    | `otherIncome.${number}.ui.expanded`;
  labelFieldName:
    | `jobs.${number}.employer`
    | `jobs.${number}.wages.${number}.label`
    | `otherIncome.${number}.source`;
  onDelete: () => void;
  onMoveBackward: () => void;
  onMoveForward: () => void;
};

export function ListItemDisclosure({
  canMoveBackward,
  canMoveForward,
  children,
  className,
  control,
  expandedFieldName,
  labelFieldName,
  onDelete,
  onMoveBackward,
  onMoveForward,
}: Props): React.ReactNode {
  // TODO: confirm before remove
  return (
    <Controller
      control={control}
      name={expandedFieldName}
      render={({ field: expandedField }) => (
        <Disclosure
          className={racn(styles.disclosure, className)}
          isExpanded={expandedField.value}
        >
          <div className={styles.header}>
            <IconButton
              icon={expandedField.value ? ChevronDownIcon : ChevronRightIcon}
              label={expandedField.value ? "Collapse" : "Expand"}
              onPress={() => expandedField.onChange(!expandedField.value)}
            />
            <Watch
              control={control}
              name={labelFieldName}
              render={(label) => (
                <span className={styles.title}>{label || "Untitled"}</span>
              )}
            />
            <MoveButton
              axis="block"
              direction="backward"
              isDisabled={!canMoveBackward}
              onPress={onMoveBackward}
            />
            <MoveButton
              axis="block"
              direction="forward"
              isDisabled={!canMoveForward}
              onPress={onMoveForward}
            />
            <IconButton icon={Trash2Icon} label="Delete" onPress={onDelete} />
          </div>
          <DisclosurePanel className={racn(styles.disclosurePanel)}>
            {children}
          </DisclosurePanel>
        </Disclosure>
      )}
    />
  );
}
