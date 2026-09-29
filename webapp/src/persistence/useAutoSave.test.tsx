import { act, render, renderHook } from "@testing-library/react";
import { LATEST_TAX_YEAR } from "@thumbtax/common";
import { describe, expect, it, vi } from "vitest";

import { CURRENT_SCHEMA_VERSION } from "#src/persistence/config";
import {
  PREFERENCES_KEY,
  SAVED_STATE_KEY,
  UI_STATE_KEY,
} from "#src/persistence/localStorageKeys";
import { useAutoSave } from "#src/persistence/useAutoSave";
import { useStore } from "#src/state/useStore";
import {
  makeBoxFixture,
  makeLineFixture,
  makeRegistryFixture,
  makeSectionFixture,
  makeSpecificationFixture,
  makeSpecificationsByYearFixture,
} from "#src/test/specificationFixtures";

const TEST_BOX = "box1";
const LATEST_ONLY_BOX = "box2";

function makeTestRegistry(inputKeys: string[]) {
  return makeRegistryFixture({
    fW2: makeSpecificationFixture({
      class: "fW2",
      sections: [
        makeSectionFixture({
          lines: inputKeys.map((inputKey, index) =>
            makeLineFixture({
              index: String(index + 1),
              box: makeBoxFixture({
                identifier: inputKey,
                value: { type: "number_input", inputKey },
              }),
            }),
          ),
        }),
      ],
    }),
  });
}

// Only the latest year recognizes the second box's input.
const TEST_SPECIFICATIONS_BY_YEAR = makeSpecificationsByYearFixture(
  makeTestRegistry([TEST_BOX]),
  { [LATEST_TAX_YEAR]: makeTestRegistry([TEST_BOX, LATEST_ONLY_BOX]) },
);

function Harness() {
  useAutoSave(TEST_SPECIFICATIONS_BY_YEAR);
  return null;
}

function renderUseStore() {
  return renderHook(() => useStore((state) => state));
}

describe("useAutoSave", () => {
  describe("load on mount", () => {
    it("initializes the store with defaults when localStorage is empty", () => {
      const { result, rerender } = renderUseStore();
      render(<Harness />);
      rerender();
      expect(result.current.applicationState.filingStatus).toBe("single");
      expect(result.current.uiState.connectionsGraphNodePositions).toEqual({});
      expect(result.current.uiState.formClassExpansion).toEqual({});
      expect(result.current.userPreferences.browserSaveEnabled).toBe(false);
      expect(result.current.loadErrors).toEqual([]);
      expect(result.current.specificationsByYear).toBe(
        TEST_SPECIFICATIONS_BY_YEAR,
      );
      expect(result.current.applicationState.taxYear).toBe(LATEST_TAX_YEAR);
    });

    it("initializes the store from values present in localStorage", () => {
      localStorage.setItem(
        PREFERENCES_KEY,
        JSON.stringify({
          preferences: { browserSaveEnabled: false, maximumHistorySize: 7 },
          schemaVersion: CURRENT_SCHEMA_VERSION,
        }),
      );
      localStorage.setItem(
        SAVED_STATE_KEY,
        JSON.stringify({
          applicationState: {
            taxYear: 2025,
            filingStatus: "head_of_household",
            formClasses: ["fW2"],
            formInstances: {
              fW2: [
                {
                  id: "abc",
                  class: "fW2",
                  label: "Loaded",
                  inputs: {},
                },
              ],
            },
          },
          schemaVersion: CURRENT_SCHEMA_VERSION,
        }),
      );
      localStorage.setItem(
        UI_STATE_KEY,
        JSON.stringify({
          uiState: {
            connectionsGraphNodePositions: { fW2: { x: 1, y: 2 } },
            formClassExpansion: { fW2: true },
            tableOfContentsExpanded: false,
          },
          schemaVersion: CURRENT_SCHEMA_VERSION,
        }),
      );

      const { result, rerender } = renderUseStore();
      render(<Harness />);
      rerender();

      expect(result.current.userPreferences).toEqual({
        browserSaveEnabled: false,
        maximumHistorySize: 7,
      });
      expect(result.current.applicationState.taxYear).toBe(2025);
      expect(result.current.applicationState.filingStatus).toBe(
        "head_of_household",
      );
      expect(result.current.applicationState.formInstances.fW2?.[0].label).toBe(
        "Loaded",
      );
      expect(result.current.uiState.connectionsGraphNodePositions).toEqual({
        fW2: { x: 1, y: 2 },
      });
      expect(result.current.uiState.formClassExpansion).toEqual({
        fW2: true,
      });
      expect(result.current.uiState.tableOfContentsExpanded).toBe(false);
      expect(result.current.loadErrors).toEqual([]);
    });

    it("surfaces a JSON parse failure as invalid_json", () => {
      localStorage.setItem(SAVED_STATE_KEY, "{ not json");

      const { result, rerender } = renderUseStore();
      render(<Harness />);
      rerender();

      expect(result.current.loadErrors).toContainEqual({
        type: "invalid_json",
      });
    });

    it("boots with defaults and surfaces validation_failed when stored state is valid JSON but fails the schema", () => {
      localStorage.setItem(
        SAVED_STATE_KEY,
        JSON.stringify({
          applicationState: {
            taxYear: 2025,
            filingStatus: "martian",
            formClasses: [],
            formInstances: {},
          },
          schemaVersion: CURRENT_SCHEMA_VERSION,
        }),
      );

      const { result, rerender } = renderUseStore();
      render(<Harness />);
      rerender();

      expect(result.current.applicationState.filingStatus).toBe("single");
      expect(
        result.current.loadErrors.some(
          (error) => error.type === "validation_failed",
        ),
      ).toBe(true);
    });
  });

  describe("load tax year on mount", () => {
    it("loads stored state from an unsupported tax year into the latest year with a warning", () => {
      localStorage.setItem(
        SAVED_STATE_KEY,
        JSON.stringify({
          applicationState: {
            taxYear: 2017,
            filingStatus: "single",
            formClasses: [],
            formInstances: {},
          },
          schemaVersion: CURRENT_SCHEMA_VERSION,
        }),
      );

      const { result, rerender } = renderUseStore();
      render(<Harness />);
      rerender();

      expect(result.current.applicationState.taxYear).toBe(LATEST_TAX_YEAR);
      expect(result.current.loadErrors).toEqual([
        {
          type: "unsupported_tax_year",
          saved: 2017,
          loadedAs: LATEST_TAX_YEAR,
        },
      ]);
    });
  });

  describe("autosave (browserSaveEnabled true)", () => {
    it("excludes inputs the current tax year doesn't recognize and includes them again after switching back", () => {
      vi.useFakeTimers();

      localStorage.setItem(
        PREFERENCES_KEY,
        JSON.stringify({
          preferences: { browserSaveEnabled: true, maximumHistorySize: 50 },
          schemaVersion: CURRENT_SCHEMA_VERSION,
        }),
      );
      localStorage.setItem(
        SAVED_STATE_KEY,
        JSON.stringify({
          applicationState: {
            taxYear: LATEST_TAX_YEAR,
            filingStatus: "single",
            formClasses: ["fW2"],
            formInstances: {
              fW2: [
                {
                  id: "w2",
                  class: "fW2",
                  label: "Job",
                  inputs: {
                    [TEST_BOX]: { type: "number", value: 4100 },
                    [LATEST_ONLY_BOX]: { type: "number", value: 350 },
                  },
                },
              ],
            },
          },
          schemaVersion: CURRENT_SCHEMA_VERSION,
        }),
      );

      function readSavedInputs() {
        const saved = localStorage.getItem(SAVED_STATE_KEY);
        if (saved === null) throw new Error("expected saved state");
        const parsed = JSON.parse(saved);
        return {
          taxYear: parsed.applicationState.taxYear,
          inputs: parsed.applicationState.formInstances.fW2[0].inputs,
        };
      }

      const { result } = renderUseStore();
      render(<Harness />);

      act(() => {
        result.current.setTaxYear(2025);
      });
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(readSavedInputs()).toEqual({
        taxYear: 2025,
        inputs: { [TEST_BOX]: { type: "number", value: 4100 } },
      });
      expect(
        result.current.applicationState.formInstances.fW2?.[0].inputs,
      ).toEqual({
        [TEST_BOX]: { type: "number", value: 4100 },
        [LATEST_ONLY_BOX]: { type: "number", value: 350 },
      });

      act(() => {
        result.current.setTaxYear(LATEST_TAX_YEAR);
      });
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(readSavedInputs()).toEqual({
        taxYear: LATEST_TAX_YEAR,
        inputs: {
          [TEST_BOX]: { type: "number", value: 4100 },
          [LATEST_ONLY_BOX]: { type: "number", value: 350 },
        },
      });

      vi.useRealTimers();
    });

    it("writes applicationState changes to SAVED_STATE_KEY after debounce", () => {
      vi.useFakeTimers();

      localStorage.setItem(
        PREFERENCES_KEY,
        JSON.stringify({
          preferences: { browserSaveEnabled: true, maximumHistorySize: 50 },
          schemaVersion: CURRENT_SCHEMA_VERSION,
        }),
      );

      const { result } = renderUseStore();
      render(<Harness />);

      act(() => {
        result.current.addFormInstance("fW2");
      });
      expect(localStorage.getItem(SAVED_STATE_KEY)).toBeNull();

      act(() => {
        vi.advanceTimersByTime(300);
      });

      const saved = localStorage.getItem(SAVED_STATE_KEY);
      expect(saved).not.toBeNull();
      if (saved === null) throw new Error("expected saved state");
      const parsed = JSON.parse(saved);
      expect(parsed.applicationState.formClasses).toEqual(["fW2"]);

      vi.useRealTimers();
    });

    it("writes preferences changes immediately to PREFERENCES_KEY", () => {
      const { result } = renderUseStore();
      render(<Harness />);

      act(() => {
        result.current.updatePreferences({ maximumHistorySize: 99 });
      });

      const saved = localStorage.getItem(PREFERENCES_KEY);
      expect(saved).not.toBeNull();
      if (saved === null) throw new Error("expected saved preferences");
      const parsed = JSON.parse(saved);
      expect(parsed.preferences.maximumHistorySize).toBe(99);
    });
  });

  describe("autosave (browserSaveEnabled false)", () => {
    it("does not write applicationState or uiState while disabled", () => {
      vi.useFakeTimers();

      localStorage.setItem(
        PREFERENCES_KEY,
        JSON.stringify({
          preferences: { browserSaveEnabled: false, maximumHistorySize: 50 },
          schemaVersion: CURRENT_SCHEMA_VERSION,
        }),
      );

      const { result } = renderUseStore();
      render(<Harness />);

      act(() => {
        result.current.addFormInstance("fW2");
      });
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(localStorage.getItem(SAVED_STATE_KEY)).toBeNull();
      expect(localStorage.getItem(UI_STATE_KEY)).toBeNull();

      vi.useRealTimers();
    });
  });

  describe("toggle-off reconciliation", () => {
    it("clears SAVED_STATE_KEY and UI_STATE_KEY when browserSaveEnabled flips true -> false", () => {
      vi.useFakeTimers();

      // Pre-seed preferences with browserSaveEnabled: true so autosave is active from the start.
      localStorage.setItem(
        PREFERENCES_KEY,
        JSON.stringify({
          preferences: { browserSaveEnabled: true, maximumHistorySize: 50 },
          schemaVersion: CURRENT_SCHEMA_VERSION,
        }),
      );
      // Pre-seed UI state in localStorage so the hook loads it on mount.
      localStorage.setItem(
        UI_STATE_KEY,
        JSON.stringify({
          uiState: {
            connectionsGraphNodePositions: { fW2: { x: 1, y: 1 } },
            formClassExpansion: { fW2: true },
            tableOfContentsExpanded: true,
          },
          schemaVersion: CURRENT_SCHEMA_VERSION,
        }),
      );

      const { result } = renderUseStore();
      render(<Harness />);

      // Trigger an applicationState autosave so SAVED_STATE_KEY exists.
      act(() => {
        result.current.addFormInstance("fW2");
      });
      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(localStorage.getItem(SAVED_STATE_KEY)).not.toBeNull();
      expect(localStorage.getItem(UI_STATE_KEY)).not.toBeNull();

      // Flip browserSaveEnabled off.
      act(() => {
        result.current.updatePreferences({ browserSaveEnabled: false });
      });

      expect(localStorage.getItem(SAVED_STATE_KEY)).toBeNull();
      expect(localStorage.getItem(UI_STATE_KEY)).toBeNull();
      // Preferences itself is still written.
      expect(localStorage.getItem(PREFERENCES_KEY)).not.toBeNull();

      vi.useRealTimers();
    });
  });

  describe("unmount", () => {
    it("does not write store changes that happen after unmount", () => {
      vi.useFakeTimers();

      const { result } = renderUseStore();
      const { unmount } = render(<Harness />);

      unmount();

      act(() => {
        result.current.addFormInstance("fW2");
        vi.advanceTimersByTime(1000);
      });

      const saved = localStorage.getItem(SAVED_STATE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        expect(parsed.applicationState.formClasses).not.toContain("fW2");
      }

      vi.useRealTimers();
    });
  });
});
