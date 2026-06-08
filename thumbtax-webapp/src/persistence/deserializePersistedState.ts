import { CURRENT_TAX_YEAR } from "#src/persistence/config";
import { applyMigrations } from "#src/persistence/migrations";
import {
  currentPersistedStateSchema,
  persistedStateSchemas,
} from "#src/persistence/schemas/persistedStateSchemas";
import { validationFailed } from "#src/persistence/zodIssuesToLoadError";

import type { DeserializeResult } from "#src/persistence/types/deserializeResult";
import type { LoadError } from "#src/persistence/types/loadError";
import type { ApplicationState } from "#src/state/types/applicationState";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function deserializePersistedState(
  raw: unknown,
): DeserializeResult<ApplicationState> {
  if (!isPlainObject(raw)) {
    return { ok: false, errors: [{ type: "not_an_object" }] };
  }
  if (typeof raw.schemaVersion !== "number") {
    return { ok: false, errors: [{ type: "missing_schema_version" }] };
  }

  const savedVersion = raw.schemaVersion;
  const schema = persistedStateSchemas.get(savedVersion);
  if (schema === undefined) {
    return {
      ok: false,
      errors: [{ type: "unsupported_schema_version", saved: savedVersion }],
    };
  }

  const versioned = schema.safeParse(raw);
  if (!versioned.success) {
    return { ok: false, errors: [validationFailed(versioned.error)] };
  }

  const migrated = applyMigrations(versioned.data, savedVersion);

  // Re-validate the migrated value against the current schema as a safety net.
  // While the current version is the only registered schema and `migrations` is
  // empty, this is a no-op that always succeeds; the branch exists for when older
  // schema versions and their migrations are introduced, at which point a buggy
  // migration would be caught here. We surface zod's summary message directly
  // (rather than structured `issues`) because this is an internal/developer error
  // about migration output, not malformed user data.
  const result = currentPersistedStateSchema.safeParse(migrated);
  if (!result.success) {
    return {
      ok: false,
      errors: [{ type: "migration_failed", reason: result.error.message }],
    };
  }

  const persistedState = result.data;
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
