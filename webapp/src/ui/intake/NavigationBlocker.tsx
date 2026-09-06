import React from "react";

import { Dialog, Heading, Modal } from "react-aria-components";
import { useBeforeUnload, useBlocker } from "react-router";

import { AriaButton } from "#src/ui/primitives/AriaButton";
import { DialogFooter } from "#src/ui/primitives/DialogFooter";

type Props = {
  isFormDirty: boolean;
};

export function NavigationBlocker({ isFormDirty }: Props): React.ReactNode {
  const beforeUnload = React.useCallback(
    (event: BeforeUnloadEvent) => {
      if (isFormDirty) {
        event.stopPropagation();
        event.returnValue = true;
        return true;
      }
    },
    [isFormDirty],
  );
  useBeforeUnload(beforeUnload);

  const blocker = useBlocker(isFormDirty);

  return (
    <Modal
      isDismissable
      isOpen={blocker.state === "blocked"}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          blocker.reset?.();
        }
      }}
    >
      <Dialog>
        <Heading>Leave income builder?</Heading>
        <p>
          You have pending changes in the income builder. If you leave without
          submitting the builder, your changes will be lost.
        </p>
        <DialogFooter>
          <AriaButton onPress={blocker.reset}>Stay</AriaButton>
          <AriaButton onPress={blocker.proceed} variant="destructive">
            Leave
          </AriaButton>
        </DialogFooter>
      </Dialog>
    </Modal>
  );
}
