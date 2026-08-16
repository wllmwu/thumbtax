import React from "react";

import { parseUploadedFile } from "#src/persistence/parseUploadedFile";
import { useStore } from "#src/state/useStore";

/**
 * Returns a callback that loads a user-selected save file, replacing the
 * current application state on success. Errors (structural or otherwise) are
 * reported through the store's `loadErrors` state either way.
 */
export function useUploadSaveFile(): (file: File) => Promise<void> {
  const setApplicationState = useStore((state) => state.setApplicationState);
  const setLoadErrors = useStore((state) => state.setLoadErrors);

  return React.useCallback(
    async (file: File): Promise<void> => {
      const result = await parseUploadedFile(file);
      if (result.kind === "ok") {
        setApplicationState(result.applicationState);
      }
      setLoadErrors(result.errors);
    },
    [setApplicationState, setLoadErrors],
  );
}
