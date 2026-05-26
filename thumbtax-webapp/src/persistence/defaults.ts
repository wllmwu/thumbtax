import {
  CURRENT_SCHEMA_VERSION,
  CURRENT_TAX_YEAR,
} from "#src/persistence/config";
import { DEFAULT_APPLICATION_STATE } from "#src/state/defaults";

import type { PersistedState } from "#src/persistence/types/persistedState";

// Template used as a runtime source of truth for PersistedState's field set
// and as a fallback when an empty save file needs a value. The specific
// schemaVersion and taxYear baked in are the current ones at module load.
export const DEFAULT_PERSISTED_STATE: PersistedState = {
  applicationState: DEFAULT_APPLICATION_STATE,
  schemaVersion: CURRENT_SCHEMA_VERSION,
  taxYear: CURRENT_TAX_YEAR,
};
