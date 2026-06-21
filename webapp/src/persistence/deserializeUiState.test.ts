import { describe, expect, it } from "vitest";

import { CURRENT_SCHEMA_VERSION } from "#src/persistence/config";
import { deserializeUiState } from "#src/persistence/deserializeUiState";

const validUiState = {
  connectionsGraphNodePositions: { fW2: { x: 1, y: 2 } },
};

function validStored(overrides: Record<string, unknown> = {}) {
  return {
    uiState: validUiState,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    ...overrides,
  };
}

describe("deserializeUiState", () => {
  it("returns the ui state for a valid versioned value", () => {
    const result = deserializeUiState(validStored());
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected ok");
    expect(result.value).toEqual(validUiState);
    expect(result.errors).toEqual([]);
  });

  it("rejects a non-object", () => {
    const result = deserializeUiState(7);
    expect(result.ok).toBe(false);
    expect(result.errors).toEqual([{ type: "not_an_object" }]);
  });

  it("rejects a missing schema version", () => {
    const result = deserializeUiState({ uiState: validUiState });
    expect(result.ok).toBe(false);
    expect(result.errors).toEqual([{ type: "missing_schema_version" }]);
  });

  it("rejects an unsupported schema version", () => {
    const result = deserializeUiState(
      validStored({ schemaVersion: CURRENT_SCHEMA_VERSION + 1 }),
    );
    expect(result.ok).toBe(false);
    expect(result.errors).toEqual([
      { type: "unsupported_schema_version", saved: CURRENT_SCHEMA_VERSION + 1 },
    ]);
  });

  it("rejects an unknown form class key", () => {
    const result = deserializeUiState(
      validStored({
        uiState: { connectionsGraphNodePositions: { bogus: { x: 1, y: 2 } } },
      }),
    );
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.errors[0].type).toBe("validation_failed");
  });

  it("rejects an invalid position", () => {
    const result = deserializeUiState(
      validStored({
        uiState: { connectionsGraphNodePositions: { fW2: { x: "no", y: 2 } } },
      }),
    );
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.errors[0].type).toBe("validation_failed");
  });

  it("rejects unknown fields in the wrapper (strict)", () => {
    const result = deserializeUiState(validStored({ bogus: 1 }));
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.errors[0].type).toBe("validation_failed");
  });
});
