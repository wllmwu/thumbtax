import { describe, expect, it } from "vitest";

import { deserializeUserPreferences } from "#src/persistence/deserializeUserPreferences";

describe("deserializeUserPreferences", () => {
  it("returns the preferences for a valid value", () => {
    const result = deserializeUserPreferences({
      browserSaveEnabled: true,
      maximumHistorySize: 7,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected ok");
    expect(result.value).toEqual({
      browserSaveEnabled: true,
      maximumHistorySize: 7,
    });
    expect(result.errors).toEqual([]);
  });

  it("rejects a non-object", () => {
    const result = deserializeUserPreferences(null);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.errors[0].type).toBe("validation_failed");
  });

  it("rejects a wrong field type", () => {
    const result = deserializeUserPreferences({
      browserSaveEnabled: "yes",
      maximumHistorySize: 7,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.errors[0].type).toBe("validation_failed");
  });

  it("rejects unknown fields (strict)", () => {
    const result = deserializeUserPreferences({
      browserSaveEnabled: true,
      maximumHistorySize: 7,
      bogus: 1,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.errors[0].type).toBe("validation_failed");
  });
});
