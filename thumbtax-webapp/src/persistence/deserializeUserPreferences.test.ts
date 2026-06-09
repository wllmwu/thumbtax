import { describe, expect, it } from "vitest";

import { CURRENT_SCHEMA_VERSION } from "#src/persistence/config";
import { deserializeUserPreferences } from "#src/persistence/deserializeUserPreferences";

const validPreferences = {
  browserSaveEnabled: true,
  maximumHistorySize: 7,
};

function validStored(overrides: Record<string, unknown> = {}) {
  return {
    preferences: validPreferences,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    ...overrides,
  };
}

describe("deserializeUserPreferences", () => {
  it("returns the preferences for a valid versioned value", () => {
    const result = deserializeUserPreferences(validStored());
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected ok");
    expect(result.value).toEqual(validPreferences);
    expect(result.errors).toEqual([]);
  });

  it("rejects a non-object", () => {
    const result = deserializeUserPreferences(null);
    expect(result.ok).toBe(false);
    expect(result.errors).toEqual([{ type: "not_an_object" }]);
  });

  it("rejects a missing schema version", () => {
    const result = deserializeUserPreferences({
      preferences: validPreferences,
    });
    expect(result.ok).toBe(false);
    expect(result.errors).toEqual([{ type: "missing_schema_version" }]);
  });

  it("rejects an unsupported schema version", () => {
    const result = deserializeUserPreferences(
      validStored({ schemaVersion: CURRENT_SCHEMA_VERSION + 1 }),
    );
    expect(result.ok).toBe(false);
    expect(result.errors).toEqual([
      { type: "unsupported_schema_version", saved: CURRENT_SCHEMA_VERSION + 1 },
    ]);
  });

  it("rejects a wrong field type", () => {
    const result = deserializeUserPreferences(
      validStored({
        preferences: { browserSaveEnabled: "yes", maximumHistorySize: 7 },
      }),
    );
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.errors[0].type).toBe("validation_failed");
  });

  it("rejects unknown fields in the wrapper (strict)", () => {
    const result = deserializeUserPreferences(validStored({ bogus: 1 }));
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.errors[0].type).toBe("validation_failed");
  });
});
