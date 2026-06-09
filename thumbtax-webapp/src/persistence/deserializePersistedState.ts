import { CURRENT_TAX_YEAR } from "#src/persistence/config";
import { deserializeVersioned } from "#src/persistence/deserializeVersioned";
import { persistedStateMigrations } from "#src/persistence/migrations";
import {
  currentPersistedStateSchema,
  persistedStateSchemas,
} from "#src/persistence/schemas/persistedStateSchemas";

import type { DeserializeResult } from "#src/persistence/types/deserializeResult";
import type { LoadError } from "#src/persistence/types/loadError";
import type { ApplicationState } from "#src/state/types/applicationState";

export function deserializePersistedState(
  raw: unknown,
): DeserializeResult<ApplicationState> {
  const result = deserializeVersioned(
    raw,
    persistedStateSchemas,
    currentPersistedStateSchema,
    persistedStateMigrations,
  );
  if (!result.ok) {
    return result;
  }

  const persistedState = result.value;
  const errors: LoadError[] = [];
  if (persistedState.taxYear !== CURRENT_TAX_YEAR) {
    errors.push({
      type: "tax_year_mismatch",
      saved: persistedState.taxYear,
      current: CURRENT_TAX_YEAR,
    });
  }

  return { ok: true, value: persistedState.applicationState, errors };
}
