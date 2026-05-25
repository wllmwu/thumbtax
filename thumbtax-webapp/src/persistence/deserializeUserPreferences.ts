import { DEFAULT_USER_PREFERENCES } from "#src/state/defaults";

import type { LoadError } from "#src/persistence/types/loadError";
import type { UserPreferences } from "#src/state/types/userPreferences";

const KNOWN_FIELDS = new Set(["browserSaveEnabled", "maximumHistorySize"]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function deserializeUserPreferences(raw: unknown): {
  preferences: UserPreferences;
  errors: LoadError[];
} {
  const errors: LoadError[] = [];

  if (!isPlainObject(raw)) {
    errors.push({
      type: "invalid_value",
      path: "",
      reason: "expected object",
    });
    return { preferences: DEFAULT_USER_PREFERENCES, errors };
  }

  let browserSaveEnabled = DEFAULT_USER_PREFERENCES.browserSaveEnabled;
  if ("browserSaveEnabled" in raw) {
    const value = raw.browserSaveEnabled;
    if (typeof value === "boolean") {
      browserSaveEnabled = value;
    } else {
      errors.push({
        type: "invalid_value",
        path: "browserSaveEnabled",
        reason: "expected boolean",
      });
    }
  }

  let maximumHistorySize = DEFAULT_USER_PREFERENCES.maximumHistorySize;
  if ("maximumHistorySize" in raw) {
    const value = raw.maximumHistorySize;
    if (typeof value === "number" && Number.isInteger(value) && value >= 1) {
      maximumHistorySize = value;
    } else {
      errors.push({
        type: "invalid_value",
        path: "maximumHistorySize",
        reason: "expected positive integer",
      });
    }
  }

  for (const key of Object.keys(raw)) {
    if (!KNOWN_FIELDS.has(key)) {
      errors.push({ type: "unknown_field", path: key });
    }
  }

  return {
    preferences: { browserSaveEnabled, maximumHistorySize },
    errors,
  };
}
