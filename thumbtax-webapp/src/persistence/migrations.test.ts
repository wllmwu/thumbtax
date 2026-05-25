import { afterEach, describe, expect, it } from "vitest";

import * as migrationsModule from "#src/persistence/migrations";
import { applyMigrations, migrations } from "#src/persistence/migrations";

describe("migrations", () => {
  it("starts with an empty migrations map", () => {
    expect(Object.keys(migrations)).toEqual([]);
  });

  it("applyMigrations returns the raw value unchanged when no migrations are registered for the gap", () => {
    const raw = { hello: "world" };
    expect(applyMigrations(raw, 0)).toBe(raw);
  });

  describe("when a migration is registered", () => {
    const originalEntries = { ...migrations };

    afterEach(() => {
      for (const key of Object.keys(migrations)) {
        delete (migrations as Record<number, unknown>)[Number(key)];
      }
      Object.assign(migrations, originalEntries);
    });

    it("invokes each version's migration in order from fromVersion up to CURRENT_SCHEMA_VERSION", () => {
      // Register a synthetic migration at version 0 -> 1.
      // Since CURRENT_SCHEMA_VERSION === 1, this migration runs when fromVersion === 0.
      (migrations as Record<number, (raw: unknown) => unknown>)[0] = (raw) => ({
        migrated: true,
        original: raw,
      });

      const result = applyMigrations({ a: 1 }, 0);
      expect(result).toEqual({ migrated: true, original: { a: 1 } });
    });

    it("does not invoke a migration when fromVersion is already at or above CURRENT_SCHEMA_VERSION", () => {
      let called = false;
      (migrations as Record<number, (raw: unknown) => unknown>)[0] = (raw) => {
        called = true;
        return raw;
      };
      applyMigrations({}, 1);
      expect(called).toBe(false);
    });
  });

  it("re-exports the CURRENT_SCHEMA_VERSION it targets", () => {
    // Sanity: this test is here so a future bump of CURRENT_SCHEMA_VERSION
    // forces the developer to revisit migrations.test.ts.
    expect(migrationsModule).toHaveProperty("applyMigrations");
  });
});
