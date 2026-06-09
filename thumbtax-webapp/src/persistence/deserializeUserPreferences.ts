import { deserializeVersioned } from "#src/persistence/deserializeVersioned";
import { userPreferencesMigrations } from "#src/persistence/migrations";
import {
  currentPersistedUserPreferencesSchema,
  userPreferencesSchemas,
} from "#src/persistence/schemas/userPreferencesSchemas";

import type { DeserializeResult } from "#src/persistence/types/deserializeResult";
import type { UserPreferences } from "#src/state/types/userPreferences";

export function deserializeUserPreferences(
  raw: unknown,
): DeserializeResult<UserPreferences> {
  const result = deserializeVersioned(
    raw,
    userPreferencesSchemas,
    currentPersistedUserPreferencesSchema,
    userPreferencesMigrations,
  );
  if (!result.ok) {
    return result;
  }

  return { ok: true, value: result.value.preferences, errors: [] };
}
