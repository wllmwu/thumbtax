import { deserializePersistedState } from "#src/persistence/deserializePersistedState";
import { useStore } from "#src/state/useStore";

export async function loadFromUploadedFile(file: File): Promise<void> {
  const text = await file.text();

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    useStore
      .getState()
      .setLoadErrors([
        { type: "invalid_value", path: "", reason: "invalid JSON" },
      ]);
    return;
  }

  const { applicationState, errors } = deserializePersistedState(parsed);

  // If the raw payload was structurally invalid (e.g. not an object), the
  // deserializer returns the default ApplicationState. Don't blow away the
  // user's session in that case — surface the errors and stop.
  const structuralFailure = errors.some(
    (error) =>
      error.type === "invalid_value" &&
      error.path === "" &&
      error.reason === "expected object",
  );
  if (structuralFailure) {
    useStore.getState().setLoadErrors(errors);
    return;
  }

  const { uiState, userPreferences, specifications } = useStore.getState();
  if (!specifications) {
    throw new Error(
      "Cannot load uploaded file before specifications are initialized",
    );
  }

  useStore
    .getState()
    .initialize(
      applicationState,
      uiState,
      userPreferences,
      specifications,
      errors,
    );
}
