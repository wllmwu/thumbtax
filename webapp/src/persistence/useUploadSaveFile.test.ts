import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  CURRENT_SCHEMA_VERSION,
  CURRENT_TAX_YEAR,
} from "#src/persistence/config";
import { useUploadSaveFile } from "#src/persistence/useUploadSaveFile";
import { useStore } from "#src/state/useStore";
import {
  makeBoxFixture,
  makeLineFixture,
  makeRegistryFixture,
  makeSectionFixture,
  makeSpecificationFixture,
} from "#src/test/specificationFixtures";

import type { ApplicationState } from "#src/state/types/applicationState";

const TEST_BOX = "box1";

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
                identifier: TEST_BOX,
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

function renderUseStore() {
  return renderHook(() => useStore((state) => state));
}

describe("useUploadSaveFile", () => {
  it("replaces applicationState while preserving uiState and userPreferences", async () => {
    const registry = makeTestRegistry();
    const { result: upload } = renderHook(() => useUploadSaveFile());
    const { result: store } = renderUseStore();

    act(() => {
      store.current.initialize(
        store.current.applicationState,
        {
          connectionsGraphNodePositions: { fW2: { x: 7, y: 8 } },
          formClassExpansion: { fW2: true },
          tableOfContentsExpanded: true,
        },
        { browserSaveEnabled: false, maximumHistorySize: 12 },
        registry,
      );
    });

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

    await act(async () => {
      await upload.current(
        fileFromJson({
          applicationState: newApplicationState,
          schemaVersion: CURRENT_SCHEMA_VERSION,
          taxYear: CURRENT_TAX_YEAR,
        }),
      );
    });

    expect(store.current.applicationState).toEqual(newApplicationState);
    expect(store.current.uiState).toEqual({
      connectionsGraphNodePositions: { fW2: { x: 7, y: 8 } },
      formClassExpansion: { fW2: true },
      tableOfContentsExpanded: true,
    });
    expect(store.current.userPreferences).toEqual({
      browserSaveEnabled: false,
      maximumHistorySize: 12,
    });
    expect(store.current.loadErrors).toEqual([]);
  });

  it("leaves applicationState unchanged on structural failure but reports errors", async () => {
    const { result: upload } = renderHook(() => useUploadSaveFile());
    const { result: store } = renderUseStore();

    const before = store.current.applicationState;

    await act(async () => {
      await upload.current(new File(["{ not json"], "bad.json"));
    });

    expect(store.current.applicationState).toBe(before);
    expect(store.current.loadErrors).toEqual([{ type: "invalid_json" }]);
  });
});
