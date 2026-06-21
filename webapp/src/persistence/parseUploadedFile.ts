import { deserializePersistedState } from "#src/persistence/deserializePersistedState";

import type { LoadError } from "#src/persistence/types/loadError";
import type { ApplicationState } from "#src/state/types/applicationState";

export type ParseUploadedFileResult =
  | { kind: "ok"; applicationState: ApplicationState; errors: LoadError[] }
  | { kind: "structural_failure"; errors: LoadError[] };

export async function parseUploadedFile(
  file: File,
): Promise<ParseUploadedFileResult> {
  const text = await file.text();

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { kind: "structural_failure", errors: [{ type: "invalid_json" }] };
  }

  const result = deserializePersistedState(parsed);
  if (!result.ok) {
    return { kind: "structural_failure", errors: result.errors };
  }

  return {
    kind: "ok",
    applicationState: result.value,
    errors: result.errors,
  };
}
