import { applyMigrations } from "#src/persistence/migrations";
import { validationFailed } from "#src/persistence/zodIssuesToLoadError";

import type { Migrations } from "#src/persistence/migrations";
import type { DeserializeResult } from "#src/persistence/types/deserializeResult";
import type { ZodType } from "zod";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Strict, version-keyed deserialization shared by every persisted blob
// (application state, UI state, preferences). It selects a schema by the stored
// schemaVersion, validates against it, migrates up to the current shape, then
// re-validates against the current schema. Callers extract their payload from
// the returned wrapper and add any blob-specific notices (e.g. tax-year).
export function deserializeVersioned<Current>(
  raw: unknown,
  schemasByVersion: Map<number, ZodType>,
  currentSchema: ZodType<Current>,
  migrations: Migrations,
): DeserializeResult<Current> {
  if (!isPlainObject(raw)) {
    return { ok: false, errors: [{ type: "not_an_object" }] };
  }
  if (typeof raw.schemaVersion !== "number") {
    return { ok: false, errors: [{ type: "missing_schema_version" }] };
  }

  const savedVersion = raw.schemaVersion;
  const schema = schemasByVersion.get(savedVersion);
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

  const migrated = applyMigrations(versioned.data, savedVersion, migrations);

  // Re-validate the migrated value against the current schema as a safety net.
  // While the current version is the only registered schema and the migration
  // table is empty, this is a no-op that always succeeds; the branch exists for
  // when older schema versions and their migrations are introduced, at which
  // point a buggy migration would be caught here. We surface zod's summary
  // message directly (rather than structured `issues`) because this is an
  // internal/developer error about migration output, not malformed user data.
  const result = currentSchema.safeParse(migrated);
  if (!result.success) {
    return {
      ok: false,
      errors: [{ type: "migration_failed", reason: result.error.message }],
    };
  }

  return { ok: true, value: result.data, errors: [] };
}
