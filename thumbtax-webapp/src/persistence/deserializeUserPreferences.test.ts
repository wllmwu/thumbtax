import { describe, expect, it } from "vitest";

import { deserializeUserPreferences } from "#src/persistence/deserializeUserPreferences";
import { DEFAULT_USER_PREFERENCES } from "#src/state/defaults";

describe("deserializeUserPreferences", () => {
  it("returns defaults with no errors when given the default-equivalent object", () => {
    const { preferences, errors } = deserializeUserPreferences({
      browserSaveEnabled: true,
      maximumHistorySize: 50,
    });
    expect(preferences).toEqual(DEFAULT_USER_PREFERENCES);
    expect(errors).toEqual([]);
  });

  it("returns custom valid values verbatim", () => {
    const { preferences, errors } = deserializeUserPreferences({
      browserSaveEnabled: false,
      maximumHistorySize: 25,
    });
    expect(preferences).toEqual({
      browserSaveEnabled: false,
      maximumHistorySize: 25,
    });
    expect(errors).toEqual([]);
  });

  it("returns defaults and an invalid_value error when given a non-object", () => {
    const { preferences, errors } = deserializeUserPreferences("nope");
    expect(preferences).toEqual(DEFAULT_USER_PREFERENCES);
    expect(errors).toEqual([
      { type: "invalid_value", path: "", reason: "expected object" },
    ]);
  });

  it("returns defaults and an invalid_value error when given null", () => {
    const { preferences, errors } = deserializeUserPreferences(null);
    expect(preferences).toEqual(DEFAULT_USER_PREFERENCES);
    expect(errors).toEqual([
      { type: "invalid_value", path: "", reason: "expected object" },
    ]);
  });

  it("defaults missing fields silently", () => {
    const { preferences, errors } = deserializeUserPreferences({});
    expect(preferences).toEqual(DEFAULT_USER_PREFERENCES);
    expect(errors).toEqual([]);
  });

  it("emits invalid_value when browserSaveEnabled is the wrong type", () => {
    const { preferences, errors } = deserializeUserPreferences({
      browserSaveEnabled: "yes",
    });
    expect(preferences.browserSaveEnabled).toBe(
      DEFAULT_USER_PREFERENCES.browserSaveEnabled,
    );
    expect(errors).toContainEqual({
      type: "invalid_value",
      path: "browserSaveEnabled",
      reason: "expected boolean",
    });
  });

  it("emits invalid_value when maximumHistorySize is non-integer or non-positive", () => {
    const cases = [
      { value: 0, reason: "expected positive integer" },
      { value: -3, reason: "expected positive integer" },
      { value: 2.5, reason: "expected positive integer" },
      { value: "10", reason: "expected positive integer" },
    ];
    for (const { value, reason } of cases) {
      const { preferences, errors } = deserializeUserPreferences({
        maximumHistorySize: value,
      });
      expect(preferences.maximumHistorySize).toBe(
        DEFAULT_USER_PREFERENCES.maximumHistorySize,
      );
      expect(errors).toContainEqual({
        type: "invalid_value",
        path: "maximumHistorySize",
        reason,
      });
    }
  });

  it("emits unknown_field for extra top-level keys", () => {
    const { errors } = deserializeUserPreferences({
      browserSaveEnabled: true,
      maximumHistorySize: 50,
      extra: "stuff",
    });
    expect(errors).toContainEqual({
      type: "unknown_field",
      path: "extra",
    });
  });
});
