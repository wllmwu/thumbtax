import { HardDriveDownloadIcon } from "lucide-react";

import { downloadSaveFile } from "#src/persistence/downloadSaveFile";
import { useStore } from "#src/state/useStore";
import { IconButton } from "#src/ui/primitives/IconButton";

export function DownloadSaveFileButton() {
  const applicationState = useStore((state) => state.applicationState);

  return (
    <IconButton
      icon={HardDriveDownloadIcon}
      label="Download save file"
      onPress={() => downloadSaveFile(applicationState)}
      tooltipPlacement="bottom"
    />
  );
}
