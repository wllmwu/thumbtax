import { deserializeVersioned } from "#src/persistence/deserializeVersioned";
import { uiStateMigrations } from "#src/persistence/migrations";
import {
  currentPersistedUiStateSchema,
  uiStateSchemas,
} from "#src/persistence/schemas/uiStateSchemas";

import type { DeserializeResult } from "#src/persistence/types/deserializeResult";
import type { UiState } from "#src/state/types/uiState";

export function deserializeUiState(raw: unknown): DeserializeResult<UiState> {
  const result = deserializeVersioned(
    raw,
    uiStateSchemas,
    currentPersistedUiStateSchema,
    uiStateMigrations,
  );
  if (!result.ok) {
    return result;
  }

  return { ok: true, value: result.value.uiState, errors: [] };
}
