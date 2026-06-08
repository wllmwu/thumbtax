import { describe, expect, it } from "vitest";

import { deserializeUiState } from "#src/persistence/deserializeUiState";

describe("deserializeUiState", () => {
  it("returns the ui state for a valid value", () => {
    const result = deserializeUiState({
      connectionsGraphNodePositions: { fW2: { x: 1, y: 2 } },
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected ok");
    expect(result.value).toEqual({
      connectionsGraphNodePositions: { fW2: { x: 1, y: 2 } },
    });
    expect(result.errors).toEqual([]);
  });

  it("rejects a non-object", () => {
    const result = deserializeUiState(7);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.errors[0].type).toBe("validation_failed");
  });

  it("rejects an unknown form class key", () => {
    const result = deserializeUiState({
      connectionsGraphNodePositions: { bogus: { x: 1, y: 2 } },
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.errors[0].type).toBe("validation_failed");
  });

  it("rejects an invalid position", () => {
    const result = deserializeUiState({
      connectionsGraphNodePositions: { fW2: { x: "no", y: 2 } },
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.errors[0].type).toBe("validation_failed");
  });

  it("rejects unknown top-level fields (strict)", () => {
    const result = deserializeUiState({
      connectionsGraphNodePositions: {},
      bogus: 1,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.errors[0].type).toBe("validation_failed");
  });
});
