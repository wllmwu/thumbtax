import {
  CURRENT_SCHEMA_VERSION,
  CURRENT_TAX_YEAR,
} from "#src/persistence/config";

import type { PersistedState } from "#src/persistence/persistedState";
import type { ApplicationState } from "#src/state/types/applicationState";

export function serialize(applicationState: ApplicationState): PersistedState {
  return {
    applicationState,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    taxYear: CURRENT_TAX_YEAR,
  };
}
