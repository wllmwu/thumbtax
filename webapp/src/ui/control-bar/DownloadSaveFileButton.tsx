import { HardDriveDownloadIcon } from "lucide-react";

import { downloadSaveFile } from "#src/persistence/downloadSaveFile";
import { selectSpecifications, useStore } from "#src/state/useStore";
import { IconButton } from "#src/ui/primitives/IconButton";

export function DownloadSaveFileButton() {
  const applicationState = useStore((state) => state.applicationState);
  const specifications = useStore(selectSpecifications);

  return (
    <IconButton
      icon={HardDriveDownloadIcon}
      label="Download save file"
      onPress={() => {
        if (specifications) {
          downloadSaveFile(applicationState, specifications);
        }
      }}
      tooltipPlacement="bottom"
    />
  );
}
