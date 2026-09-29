import { act, renderHook } from "@testing-library/react";
import { LATEST_TAX_YEAR } from "@thumbtax/common";
import { describe, expect, it } from "vitest";

import { CURRENT_SCHEMA_VERSION } from "#src/persistence/config";
import { useUploadSaveFile } from "#src/persistence/useUploadSaveFile";
import { DEFAULT_APPLICATION_STATE } from "#src/state/defaults";
import { useStore } from "#src/state/useStore";
import {
  makeBoxFixture,
  makeLineFixture,
  makeRegistryFixture,
  makeSectionFixture,
  makeSpecificationFixture,
  makeSpecificationsByYearFixture,
} from "#src/test/specificationFixtures";

import type { FormLine } from "@thumbtax/forms";
import type { ApplicationState } from "#src/state/types/applicationState";

const TEST_BOX = "box1";
const CONSTANT_BOX_LATEST = "box2";

function makeTestRegistry(extraLines: FormLine<false>[] = []) {
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
                value: { type: "number_input", inputKey: TEST_BOX },
              }),
            }),
            ...extraLines,
          ],
        }),
      ],
    }),
  });
}

// Only the latest year's registry has the constant box, so the workbook shows
// which year's specifications were used.
function makeTestSpecificationsByYear() {
  return makeSpecificationsByYearFixture(makeTestRegistry(), {
    [LATEST_TAX_YEAR]: makeTestRegistry([
      makeLineFixture({
        index: "2",
        box: makeBoxFixture({
          identifier: CONSTANT_BOX_LATEST,
          value: { type: "number_constant", value: 7 },
        }),
      }),
    ]),
  });
}

const LOADED_INSTANCE_ID = "abc";

function makeSaveFile(taxYear: number): File {
  return fileFromJson({
    applicationState: {
      taxYear,
      filingStatus: "single",
      formClasses: ["fW2"],
      formInstances: {
        fW2: [
          {
            id: LOADED_INSTANCE_ID,
            class: "fW2",
            label: "Loaded",
            inputs: { [TEST_BOX]: { type: "number", value: 640 } },
          },
        ],
      },
    },
    schemaVersion: CURRENT_SCHEMA_VERSION,
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
        makeTestSpecificationsByYear(),
      );
    });

    const newApplicationState: ApplicationState = {
      taxYear: 2025,
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

  it("switches to a supported saved tax year without a warning", async () => {
    const { result: upload } = renderHook(() => useUploadSaveFile());
    const { result: store } = renderUseStore();
    act(() => {
      store.current.initialize(
        { ...DEFAULT_APPLICATION_STATE, taxYear: LATEST_TAX_YEAR },
        store.current.uiState,
        store.current.userPreferences,
        makeTestSpecificationsByYear(),
      );
    });

    await act(async () => {
      await upload.current(makeSaveFile(2025));
    });

    expect(store.current.applicationState.taxYear).toBe(2025);
    expect(store.current.workbook[LOADED_INSTANCE_ID]).toEqual({
      [TEST_BOX]: { value: 640, errors: [] },
    });
    expect(store.current.loadErrors).toEqual([]);
  });

  it("loads an unsupported saved tax year into the latest year with a warning", async () => {
    const { result: upload } = renderHook(() => useUploadSaveFile());
    const { result: store } = renderUseStore();
    act(() => {
      store.current.initialize(
        { ...DEFAULT_APPLICATION_STATE, taxYear: 2025 },
        store.current.uiState,
        store.current.userPreferences,
        makeTestSpecificationsByYear(),
      );
    });

    await act(async () => {
      await upload.current(makeSaveFile(2031));
    });

    expect(store.current.applicationState.taxYear).toBe(LATEST_TAX_YEAR);
    expect(store.current.workbook[LOADED_INSTANCE_ID]).toEqual({
      [TEST_BOX]: { value: 640, errors: [] },
      [CONSTANT_BOX_LATEST]: { value: 7, errors: [] },
    });
    expect(store.current.loadErrors).toEqual([
      { type: "unsupported_tax_year", saved: 2031, loadedAs: LATEST_TAX_YEAR },
    ]);
  });
});
