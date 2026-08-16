import React from "react";

import { HardDriveUploadIcon } from "lucide-react";
import {
  Dialog,
  FileTrigger,
  Heading,
  Modal,
  Text,
} from "react-aria-components";

import { useUploadSaveFile } from "#src/persistence/useUploadSaveFile";
import { AriaButton } from "#src/ui/primitives/AriaButton";
import { IconButton } from "#src/ui/primitives/IconButton";
import dialogStyles from "#src/ui/primitives/dialogs.module.css";

const ACCEPTED_FILE_TYPES = ["application/json"];

export function UploadSaveFileButton() {
  const uploadSaveFile = useUploadSaveFile();
  const [pendingFile, setPendingFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  async function handleUpload() {
    if (pendingFile === null) {
      return;
    }
    setIsUploading(true);
    await uploadSaveFile(pendingFile);
    setIsUploading(false);
    setPendingFile(null);
  }

  return (
    <>
      <FileTrigger
        acceptedFileTypes={ACCEPTED_FILE_TYPES}
        onSelect={(files) => {
          const file = files?.[0];
          if (file) {
            setPendingFile(file);
          }
        }}
      >
        <IconButton
          icon={HardDriveUploadIcon}
          label="Load from save file"
          tooltipPlacement="bottom"
        />
      </FileTrigger>
      <Modal
        isOpen={pendingFile !== null}
        isDismissable={!isUploading}
        isKeyboardDismissDisabled={isUploading}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setPendingFile(null);
          }
        }}
      >
        <Dialog>
          <div className={dialogStyles.verticalStack}>
            <Heading slot="title">Replace current data?</Heading>
            <Text slot="description">
              Uploading a save file will replace your current data. This can't
              be undone.
            </Text>
            <div className={dialogStyles.buttonGroup}>
              <AriaButton
                isDisabled={isUploading}
                onPress={() => setPendingFile(null)}
              >
                Cancel
              </AriaButton>
              <AriaButton
                variant="primary"
                isDisabled={isUploading}
                onPress={handleUpload}
              >
                Upload
              </AriaButton>
            </div>
          </div>
        </Dialog>
      </Modal>
    </>
  );
}
