import { describe, expect, it } from "vitest";

import { deserializeUiState } from "#src/persistence/deserializeUiState";
import { DEFAULT_UI_STATE } from "#src/state/defaults";

describe("deserializeUiState", () => {
  it("returns defaults with no errors when given the default-equivalent object", () => {
    const { uiState, errors } = deserializeUiState({
      connectionsGraphNodePositions: {},
    });
    expect(uiState).toEqual(DEFAULT_UI_STATE);
    expect(errors).toEqual([]);
  });

  it("preserves valid positions for known FormClass keys", () => {
    const { uiState, errors } = deserializeUiState({
      connectionsGraphNodePositions: {
        fW2: { x: 10, y: 20 },
        f1040: { x: -5, y: 0 },
      },
    });
    expect(uiState).toEqual({
      connectionsGraphNodePositions: {
        fW2: { x: 10, y: 20 },
        f1040: { x: -5, y: 0 },
      },
    });
    expect(errors).toEqual([]);
  });

  it("returns defaults and invalid_value when raw is non-object", () => {
    const { uiState, errors } = deserializeUiState(42);
    expect(uiState).toEqual(DEFAULT_UI_STATE);
    expect(errors).toEqual([
      { type: "invalid_value", path: "", reason: "expected object" },
    ]);
  });

  it("drops entries whose key is not a known FormClass", () => {
    const { uiState, errors } = deserializeUiState({
      connectionsGraphNodePositions: {
        fW2: { x: 1, y: 2 },
        unknownForm: { x: 9, y: 9 },
      },
    });
    expect(uiState.connectionsGraphNodePositions).toEqual({
      fW2: { x: 1, y: 2 },
    });
    expect(errors).toContainEqual({
      type: "invalid_value",
      path: "connectionsGraphNodePositions.unknownForm",
      reason: "unknown form class",
    });
  });

  it("drops entries whose value is not a {x, y} object", () => {
    const { uiState, errors } = deserializeUiState({
      connectionsGraphNodePositions: {
        fW2: { x: "bad", y: 2 },
        f1040: null,
      },
    });
    expect(uiState.connectionsGraphNodePositions).toEqual({});
    expect(errors).toContainEqual({
      type: "invalid_value",
      path: "connectionsGraphNodePositions.fW2",
      reason: "expected { x: number, y: number }",
    });
    expect(errors).toContainEqual({
      type: "invalid_value",
      path: "connectionsGraphNodePositions.f1040",
      reason: "expected { x: number, y: number }",
    });
  });

  it("emits invalid_value when connectionsGraphNodePositions itself is the wrong type", () => {
    const { uiState, errors } = deserializeUiState({
      connectionsGraphNodePositions: "nope",
    });
    expect(uiState.connectionsGraphNodePositions).toEqual({});
    expect(errors).toContainEqual({
      type: "invalid_value",
      path: "connectionsGraphNodePositions",
      reason: "expected object",
    });
  });

  it("emits unknown_field for extra top-level keys", () => {
    const { errors } = deserializeUiState({
      connectionsGraphNodePositions: {},
      somethingElse: 1,
    });
    expect(errors).toContainEqual({
      type: "unknown_field",
      path: "somethingElse",
    });
  });
});
