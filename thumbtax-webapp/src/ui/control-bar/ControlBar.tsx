import { Button, Toolbar } from "react-aria-components";

import { useStore } from "#src/state/useStore";
import { AddFormMenu } from "#src/ui/control-bar/AddFormMenu";
import { FilingStatusSelector } from "#src/ui/control-bar/FilingStatusSelector";

export function ControlBar() {
  const { undo, redo } = useStore();

  return (
    <Toolbar aria-label="App controls">
      <FilingStatusSelector />
      <Button onPress={undo}>Undo</Button>
      <Button onPress={redo}>Redo</Button>
      <AddFormMenu />
    </Toolbar>
  );
}
