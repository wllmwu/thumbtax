import { CURRENT_SCHEMA_VERSION } from "#src/persistence/config";
import { persistedStateSchema } from "#src/persistence/schemas/v1/persistedStateSchema";

import type { ZodType } from "zod";

// Maps a saved file's schemaVersion to the schema that validates that version's
// shape. A version with no entry (including any version newer than current) is
// unsupported. When a future bump breaks a shape, freeze the prior shape into a
// new `vN/` schema and add its entry here.
export const persistedStateSchemas = new Map<number, ZodType>([
  [CURRENT_SCHEMA_VERSION, persistedStateSchema],
]);

// The current-version schema, kept with its precise inferred type so the
// deserializer gets a typed PersistedState out of re-validation.
export const currentPersistedStateSchema = persistedStateSchema;
