import { Button, DialogTrigger, Modal, Toolbar } from "react-aria-components";

import { useStore } from "#src/state/useStore";
import { AddFormMenu } from "#src/ui/control-bar/AddFormMenu";
import { FilingStatusSelector } from "#src/ui/control-bar/FilingStatusSelector";
import { SettingsDialog } from "#src/ui/control-bar/SettingsDialog";

export function ControlBar() {
  const isUndoDisabled = useStore((state) => state.history.past.length === 0);
  const isRedoDisabled = useStore((state) => state.history.future.length === 0);
  const undo = useStore((state) => state.undo);
  const redo = useStore((state) => state.redo);

  return (
    <Toolbar aria-label="App controls">
      <FilingStatusSelector />
      <Button isDisabled={isUndoDisabled} onPress={undo}>
        Undo
      </Button>
      <Button isDisabled={isRedoDisabled} onPress={redo}>
        Redo
      </Button>
      <AddFormMenu />
      <DialogTrigger>
        <Button>Settings</Button>
        <Modal isDismissable>
          <SettingsDialog />
        </Modal>
      </DialogTrigger>
    </Toolbar>
  );
}
