import { describe, expect, it } from "vitest";

import {
  applyMigrations,
  persistedStateMigrations,
  uiStateMigrations,
  userPreferencesMigrations,
} from "#src/persistence/migrations";

import type { Migrations } from "#src/persistence/migrations";

describe("migrations", () => {
  it("starts with empty migration tables for every persisted blob", () => {
    expect(Object.keys(persistedStateMigrations)).toEqual([]);
    expect(Object.keys(uiStateMigrations)).toEqual([]);
    expect(Object.keys(userPreferencesMigrations)).toEqual([]);
  });

  it("returns the raw value unchanged when no migration is registered for the gap", () => {
    const raw = { hello: "world" };
    expect(applyMigrations(raw, 0, {})).toBe(raw);
  });

  it("invokes each version's migration in order from fromVersion up to CURRENT_SCHEMA_VERSION", () => {
    // CURRENT_SCHEMA_VERSION === 1, so a 0 -> 1 migration runs when fromVersion === 0.
    const migrations: Migrations = {
      0: (raw) => ({ migrated: true, original: raw }),
    };
    expect(applyMigrations({ a: 1 }, 0, migrations)).toEqual({
      migrated: true,
      original: { a: 1 },
    });
  });

  it("does not invoke a migration when fromVersion is already at or above CURRENT_SCHEMA_VERSION", () => {
    let called = false;
    const migrations: Migrations = {
      0: (raw) => {
        called = true;
        return raw;
      },
    };
    applyMigrations({}, 1, migrations);
    expect(called).toBe(false);
  });
});
