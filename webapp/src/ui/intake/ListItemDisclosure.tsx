import React from "react";

import { ChevronDownIcon, ChevronRightIcon, Trash2Icon } from "lucide-react";
import {
  Dialog,
  Disclosure,
  DisclosurePanel,
  Heading,
  Modal,
} from "react-aria-components";
import { Controller, Watch } from "react-hook-form";

import { AriaButton } from "#src/ui/primitives/AriaButton";
import { DialogFooter } from "#src/ui/primitives/DialogFooter";
import { IconButton } from "#src/ui/primitives/IconButton";
import { MoveButton } from "#src/ui/primitives/MoveButton";
import { racn } from "#src/ui/utils/racn";
import styles from "#src/ui/intake/ListItemDisclosure.module.css";

import type { IntakeWizardState } from "#src/ui/intake/types/intakeWizardState";
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
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] =
    React.useState(false);

  return (
    <>
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
              <IconButton
                icon={Trash2Icon}
                label="Delete"
                onPress={() => setShowDeleteConfirmDialog(true)}
              />
            </div>
            <DisclosurePanel className={racn(styles.disclosurePanel)}>
              {children}
            </DisclosurePanel>
          </Disclosure>
        )}
      />
      <Modal
        isDismissable
        isOpen={showDeleteConfirmDialog}
        onOpenChange={setShowDeleteConfirmDialog}
      >
        <Dialog>
          <Watch
            control={control}
            name={labelFieldName}
            render={(label) => <Heading>Delete {label || "Untitled"}?</Heading>}
          />
          <p>This cannot be undone.</p>
          <DialogFooter>
            <AriaButton onPress={() => setShowDeleteConfirmDialog(false)}>
              Cancel
            </AriaButton>
            <AriaButton onPress={onDelete} variant="destructive">
              Delete
            </AriaButton>
          </DialogFooter>
        </Dialog>
      </Modal>
    </>
  );
}
