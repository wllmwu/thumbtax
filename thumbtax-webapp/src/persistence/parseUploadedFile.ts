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
    return {
      kind: "structural_failure",
      errors: [{ type: "invalid_value", path: "", reason: "invalid JSON" }],
    };
  }

  const { applicationState, errors } = deserializePersistedState(parsed);

  // If the raw payload was structurally invalid (e.g. not an object), the
  // deserializer returns the default ApplicationState. Surface the errors
  // and let the caller skip replacing the user's session.
  const structuralFailure = errors.some(
    (error) =>
      error.type === "invalid_value" &&
      error.path === "" &&
      error.reason === "expected object",
  );
  if (structuralFailure) {
    return { kind: "structural_failure", errors };
  }

  return { kind: "ok", applicationState, errors };
}
