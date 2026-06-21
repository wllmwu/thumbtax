import { CURRENT_SCHEMA_VERSION } from "#src/persistence/config";
import { persistedUserPreferencesSchema } from "#src/persistence/schemas/v1/persistedUserPreferencesSchema";

import type { ZodType } from "zod";

// Maps a stored preferences value's schemaVersion to the schema that validates
// that version's shape. A version with no entry (including any version newer than
// current) is unsupported. When a future bump breaks the shape, freeze the prior
// shape into a new `vN/` schema and add its entry here.
export const userPreferencesSchemas = new Map<number, ZodType>([
  [CURRENT_SCHEMA_VERSION, persistedUserPreferencesSchema],
]);

// The current-version schema, kept with its precise inferred type so the
// deserializer gets a typed PersistedUserPreferences out of re-validation.
export const currentPersistedUserPreferencesSchema =
  persistedUserPreferencesSchema;
