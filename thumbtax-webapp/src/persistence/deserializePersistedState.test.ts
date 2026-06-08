import { describe, expect, it } from "vitest";

import {
  CURRENT_SCHEMA_VERSION,
  CURRENT_TAX_YEAR,
} from "#src/persistence/config";
import { deserializePersistedState } from "#src/persistence/deserializePersistedState";

const validApplicationState = {
  filingStatus: "single",
  formClasses: ["fW2"],
  formInstances: {
    fW2: [
      {
        id: "abc",
        class: "fW2",
        label: "My W-2",
        inputs: { box1: { type: "number", value: 100 } },
      },
    ],
  },
};

function validFile(overrides: Record<string, unknown> = {}) {
  return {
    applicationState: validApplicationState,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    taxYear: CURRENT_TAX_YEAR,
    ...overrides,
  };
}

describe("deserializePersistedState", () => {
  it("returns the application state for a valid current file", () => {
    const result = deserializePersistedState(validFile());
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected ok");
    expect(result.value).toEqual(validApplicationState);
    expect(result.errors).toEqual([]);
  });

  it("rejects a non-object", () => {
    const result = deserializePersistedState(42);
    expect(result.ok).toBe(false);
    expect(result.errors).toEqual([{ type: "not_an_object" }]);
  });

  it("rejects a missing/non-numeric schemaVersion", () => {
    const result = deserializePersistedState({
      applicationState: validApplicationState,
      taxYear: CURRENT_TAX_YEAR,
    });
    expect(result.ok).toBe(false);
    expect(result.errors).toEqual([{ type: "missing_schema_version" }]);
  });

  it("rejects an unsupported (e.g. newer) schema version", () => {
    const result = deserializePersistedState(
      validFile({ schemaVersion: CURRENT_SCHEMA_VERSION + 1 }),
    );
    expect(result.ok).toBe(false);
    expect(result.errors).toEqual([
      {
        type: "unsupported_schema_version",
        saved: CURRENT_SCHEMA_VERSION + 1,
      },
    ]);
  });

  it("rejects a structurally invalid file with dotted-path issues", () => {
    const result = deserializePersistedState(
      validFile({
        applicationState: { ...validApplicationState, filingStatus: "martian" },
      }),
    );
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    const failure = result.errors[0];
    expect(failure.type).toBe("validation_failed");
    if (failure.type !== "validation_failed") throw new Error("wrong type");
    expect(failure.issues).toContainEqual(
      expect.objectContaining({ path: "applicationState.filingStatus" }),
    );
  });

  it("rejects unknown top-level fields (strict)", () => {
    const result = deserializePersistedState(validFile({ bogus: 1 }));
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.errors[0].type).toBe("validation_failed");
  });

  it("loads a valid file from a different tax year with a non-fatal notice", () => {
    const result = deserializePersistedState(
      validFile({ taxYear: CURRENT_TAX_YEAR - 1 }),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected ok");
    expect(result.value).toEqual(validApplicationState);
    expect(result.errors).toEqual([
      {
        type: "tax_year_mismatch",
        saved: CURRENT_TAX_YEAR - 1,
        current: CURRENT_TAX_YEAR,
      },
    ]);
  });
});
