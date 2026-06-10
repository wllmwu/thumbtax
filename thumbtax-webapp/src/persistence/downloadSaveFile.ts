import { serializePersistedState } from "#src/persistence/serialize";

import type { ApplicationState } from "#src/state/types/applicationState";

function defaultFilename(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `thumbtax-${year}-${month}-${day}.json`;
}

export function downloadSaveFile(
  applicationState: ApplicationState,
  filename: string = defaultFilename(),
): void {
  const payload = serializePersistedState(applicationState);
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  URL.revokeObjectURL(url);
}
