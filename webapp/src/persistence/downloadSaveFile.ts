import { serializePersistedState } from "#src/persistence/serialize";

import type { TaxYear } from "@thumbtax/common";
import type { SpecificationRegistry } from "@thumbtax/forms";
import type { ApplicationState } from "#src/state/types/applicationState";

function padTwoDigits(value: number): string {
  return String(value).padStart(2, "0");
}

// Such as `thumbtax-ty2025_2026-09-27-143059.json`.
function defaultFilename(taxYear: TaxYear): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = padTwoDigits(now.getMonth() + 1);
  const day = padTwoDigits(now.getDate());
  const hour = padTwoDigits(now.getHours());
  const minute = padTwoDigits(now.getMinutes());
  const second = padTwoDigits(now.getSeconds());
  return `thumbtax-ty${taxYear}_${year}-${month}-${day}-${hour}${minute}${second}.json`;
}

export function downloadSaveFile(
  applicationState: ApplicationState,
  specifications: SpecificationRegistry,
  filename: string = defaultFilename(applicationState.taxYear),
): void {
  const payload = serializePersistedState(applicationState, specifications);
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
