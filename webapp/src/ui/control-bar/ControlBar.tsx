import { RedoIcon, UndoIcon } from "lucide-react";
import {
  DialogTrigger,
  Modal,
  Separator,
  Toolbar,
} from "react-aria-components";

import { useStore } from "#src/state/useStore";
import { AddFormMenu } from "#src/ui/control-bar/AddFormMenu";
import { FilingStatusSelector } from "#src/ui/control-bar/FilingStatusSelector";
import { SettingsDialog } from "#src/ui/control-bar/SettingsDialog";
import { AriaButton } from "#src/ui/primitives/AriaButton";
import { IconButton } from "#src/ui/primitives/IconButton";
import styles from "#src/ui/control-bar/ControlBar.module.css";

export function ControlBar() {
  const isUndoDisabled = useStore((state) => state.history.past.length === 0);
  const isRedoDisabled = useStore((state) => state.history.future.length === 0);
  const undo = useStore((state) => state.undo);
  const redo = useStore((state) => state.redo);

  return (
    <Toolbar aria-label="App controls" className={styles.controlBar}>
      <FilingStatusSelector />
      <Separator orientation="vertical" />
      <IconButton
        icon={UndoIcon}
        isDisabled={isUndoDisabled}
        label="Undo"
        onPress={undo}
        tooltipPlacement="bottom"
      />
      <IconButton
        icon={RedoIcon}
        isDisabled={isRedoDisabled}
        label="Redo"
        onPress={redo}
        tooltipPlacement="bottom"
      />
      <AddFormMenu />
      <Separator orientation="vertical" />
      <DialogTrigger>
        <AriaButton>Settings</AriaButton>
        <Modal isDismissable>
          <SettingsDialog />
        </Modal>
      </DialogTrigger>
    </Toolbar>
  );
}
