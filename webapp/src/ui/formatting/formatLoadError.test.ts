import { describe, expect, it } from "vitest";

import { formatLoadError } from "#src/ui/formatting/formatLoadError";

describe("formatLoadError", () => {
  it("formats a not_an_object error", () => {
    expect(formatLoadError({ type: "not_an_object" })).toEqual({
      message: "Your saved data isn't in a format Thumbtax recognizes.",
    });
  });

  it("formats a missing_schema_version error", () => {
    expect(formatLoadError({ type: "missing_schema_version" })).toEqual({
      message: "Your saved data is missing required version information.",
    });
  });

  it("formats an unsupported_schema_version error with the saved version", () => {
    expect(
      formatLoadError({ type: "unsupported_schema_version", saved: 7 }),
    ).toEqual({
      message: "Your saved data uses an unsupported format version (7).",
    });
  });

  it("formats a validation_failed error with a detail per issue", () => {
    expect(
      formatLoadError({
        type: "validation_failed",
        issues: [
          {
            path: "applicationState.filingStatus",
            message: "Required",
          },
          {
            path: "applicationState.formClasses.0",
            message: "Invalid form class",
          },
        ],
      }),
    ).toEqual({
      message: "Your saved data failed validation.",
      details: [
        "applicationState.filingStatus: Required",
        "applicationState.formClasses.0: Invalid form class",
      ],
    });
  });

  it("formats a validation_failed error with no issues", () => {
    expect(formatLoadError({ type: "validation_failed", issues: [] })).toEqual({
      message: "Your saved data failed validation.",
      details: [],
    });
  });

  it("formats a migration_failed error with the reason", () => {
    expect(
      formatLoadError({
        type: "migration_failed",
        reason: "unknown form class 'f9999'",
      }),
    ).toEqual({
      message:
        "Your saved data couldn't be upgraded to the current format: unknown form class 'f9999'",
    });
  });

  it("formats an invalid_json error", () => {
    expect(formatLoadError({ type: "invalid_json" })).toEqual({
      message: "Your saved data isn't valid JSON.",
    });
  });

  it("formats a tax_year_mismatch error with the saved and current years", () => {
    expect(
      formatLoadError({
        type: "tax_year_mismatch",
        saved: 2023,
        current: 2026,
      }),
    ).toEqual({
      message:
        "Your saved data is for tax year 2023, but this is tax year 2026.",
    });
  });
});
