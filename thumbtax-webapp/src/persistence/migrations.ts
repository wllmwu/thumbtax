import { CURRENT_SCHEMA_VERSION } from "#src/persistence/config";

export const migrations: Record<number, (raw: unknown) => unknown> = {};

export function applyMigrations(raw: unknown, fromVersion: number): unknown {
  let current = raw;
  for (let version = fromVersion; version < CURRENT_SCHEMA_VERSION; version++) {
    const migrate = migrations[version];
    if (migrate) {
      current = migrate(current);
    }
  }
  return current;
}
