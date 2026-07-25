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
import { Button } from "#src/ui/primitives/Button";
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
      <Button aria-label="Undo" isDisabled={isUndoDisabled} onPress={undo}>
        <UndoIcon />
      </Button>
      <Button aria-label="Redo" isDisabled={isRedoDisabled} onPress={redo}>
        <RedoIcon />
      </Button>
      <AddFormMenu />
      <Separator orientation="vertical" />
      <DialogTrigger>
        <Button>Settings</Button>
        <Modal isDismissable>
          <SettingsDialog />
        </Modal>
      </DialogTrigger>
    </Toolbar>
  );
}
