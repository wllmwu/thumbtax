import { beforeEach, describe, expect, it } from "vitest";

import {
  CURRENT_SCHEMA_VERSION,
  CURRENT_TAX_YEAR,
} from "#src/persistence/config";
import { loadFromUploadedFile } from "#src/persistence/loadFromUploadedFile";
import {
  makeBoxFixture,
  makeLineFixture,
  makeRegistryFixture,
  makeSectionFixture,
  makeSpecificationFixture,
} from "#src/specifications/test/fixtures";
import {
  DEFAULT_APPLICATION_STATE,
  DEFAULT_UI_STATE,
  DEFAULT_USER_PREFERENCES,
} from "#src/state/defaults";
import { useStore } from "#src/state/useStore";

import type { ApplicationState } from "#src/state/types/applicationState";

function makeTestRegistry() {
  return makeRegistryFixture({
    fW2: makeSpecificationFixture({
      class: "fW2",
      sections: [
        makeSectionFixture({
          lines: [
            makeLineFixture({
              index: "1",
              box: makeBoxFixture({
                identifier: "box1",
                value: { type: "number_input" },
              }),
            }),
          ],
        }),
      ],
    }),
  });
}

function fileFromJson(value: unknown): File {
  return new File([JSON.stringify(value)], "upload.json", {
    type: "application/json",
  });
}

beforeEach(() => {
  useStore
    .getState()
    .initialize(
      DEFAULT_APPLICATION_STATE,
      DEFAULT_UI_STATE,
      DEFAULT_USER_PREFERENCES,
      makeTestRegistry(),
    );
});

describe("loadFromUploadedFile", () => {
  it("replaces application state with the parsed file and surfaces errors", async () => {
    const newApplicationState: ApplicationState = {
      filingStatus: "head_of_household",
      formClasses: ["fW2"],
      formInstances: {
        fW2: [
          {
            id: "abc",
            class: "fW2",
            label: "Loaded",
            inputs: { box1: { type: "number", value: 99 } },
          },
        ],
      },
    };
    const file = fileFromJson({
      applicationState: newApplicationState,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      taxYear: CURRENT_TAX_YEAR,
    });

    await loadFromUploadedFile(file);

    const state = useStore.getState();
    expect(state.applicationState).toEqual(newApplicationState);
    expect(state.loadErrors).toEqual([]);
  });

  it("preserves the current uiState and userPreferences across the load", async () => {
    useStore
      .getState()
      .initialize(
        DEFAULT_APPLICATION_STATE,
        { connectionsGraphNodePositions: { fW2: { x: 7, y: 8 } } },
        { browserSaveEnabled: false, maximumHistorySize: 12 },
        makeTestRegistry(),
      );

    await loadFromUploadedFile(
      fileFromJson({
        applicationState: DEFAULT_APPLICATION_STATE,
        schemaVersion: CURRENT_SCHEMA_VERSION,
        taxYear: CURRENT_TAX_YEAR,
      }),
    );

    const state = useStore.getState();
    expect(state.uiState).toEqual({
      connectionsGraphNodePositions: { fW2: { x: 7, y: 8 } },
    });
    expect(state.userPreferences).toEqual({
      browserSaveEnabled: false,
      maximumHistorySize: 12,
    });
  });

  it("leaves the store unchanged and sets loadErrors when JSON parsing fails", async () => {
    const before = useStore.getState().applicationState;
    const file = new File(["{ not json"], "bad.json");

    await loadFromUploadedFile(file);

    const state = useStore.getState();
    expect(state.applicationState).toBe(before);
    expect(state.loadErrors).toEqual([
      { type: "invalid_value", path: "", reason: "invalid JSON" },
    ]);
  });

  it("leaves the store unchanged and sets loadErrors when the raw payload is not an object", async () => {
    const before = useStore.getState().applicationState;
    const file = fileFromJson(42);

    await loadFromUploadedFile(file);

    const state = useStore.getState();
    expect(state.applicationState).toBe(before);
    expect(state.loadErrors).toContainEqual({
      type: "invalid_value",
      path: "",
      reason: "expected object",
    });
  });

  it("throws if specifications are not yet initialized", async () => {
    // Manually wipe specifications to simulate a too-early call.
    const file = fileFromJson({
      applicationState: DEFAULT_APPLICATION_STATE,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      taxYear: CURRENT_TAX_YEAR,
    });

    useStore.setState({ specifications: undefined });

    await expect(loadFromUploadedFile(file)).rejects.toThrow(/specifications/i);
  });
});
