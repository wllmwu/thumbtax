import { CURRENT_SCHEMA_VERSION } from "#src/persistence/config";

// A migration table maps a from-version N to a transformer that produces the
// version N+1 shape of one persisted blob. Applied in sequence to bring an older
// stored value up to CURRENT_SCHEMA_VERSION. Empty for v1.
export type Migrations = Record<number, (raw: unknown) => unknown>;

export const persistedStateMigrations: Migrations = {};
export const uiStateMigrations: Migrations = {};
export const userPreferencesMigrations: Migrations = {};

export function applyMigrations(
  raw: unknown,
  fromVersion: number,
  migrations: Migrations,
): unknown {
  let current = raw;
  for (let version = fromVersion; version < CURRENT_SCHEMA_VERSION; version++) {
    const migrate = migrations[version];
    if (migrate) {
      current = migrate(current);
    }
  }
  return current;
}
