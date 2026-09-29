import { isTaxYear, LATEST_TAX_YEAR } from "@thumbtax/common";

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

  const persistedApplicationState = result.value.applicationState;
  const savedTaxYear = persistedApplicationState.taxYear;
  if (isTaxYear(savedTaxYear)) {
    return {
      ok: true,
      value: { ...persistedApplicationState, taxYear: savedTaxYear },
      errors: [],
    };
  }

  const errors: LoadError[] = [
    {
      type: "unsupported_tax_year",
      saved: savedTaxYear,
      loadedAs: LATEST_TAX_YEAR,
    },
  ];
  return {
    ok: true,
    value: { ...persistedApplicationState, taxYear: LATEST_TAX_YEAR },
    errors,
  };
}
