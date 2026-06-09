import { act, render, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  CURRENT_SCHEMA_VERSION,
  CURRENT_TAX_YEAR,
} from "#src/persistence/config";
import {
  PREFERENCES_KEY,
  SAVED_STATE_KEY,
  UI_STATE_KEY,
} from "#src/persistence/localStorageKeys";
import { usePersistence } from "#src/persistence/usePersistence";
import {
  makeBoxFixture,
  makeLineFixture,
  makeRegistryFixture,
  makeSectionFixture,
  makeSpecificationFixture,
} from "#src/specifications/test/fixtures";
import { useStore } from "#src/state/useStore";

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

function Harness() {
  usePersistence(makeTestRegistry());
  return null;
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("usePersistence", () => {
  describe("load on mount", () => {
    it("initializes the store with defaults when localStorage is empty", () => {
      const { result, rerender } = renderHook(() => useStore());
      render(<Harness />);
      rerender();
      expect(result.current.applicationState.filingStatus).toBe("single");
      expect(result.current.uiState.connectionsGraphNodePositions).toEqual({});
      expect(result.current.userPreferences.browserSaveEnabled).toBe(false);
      expect(result.current.loadErrors).toEqual([]);
      expect(result.current.specifications).toBeDefined();
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
          taxYear: CURRENT_TAX_YEAR,
        }),
      );
      localStorage.setItem(
        UI_STATE_KEY,
        JSON.stringify({
          uiState: {
            connectionsGraphNodePositions: { fW2: { x: 1, y: 2 } },
          },
          schemaVersion: CURRENT_SCHEMA_VERSION,
        }),
      );

      const { result, rerender } = renderHook(() => useStore());
      render(<Harness />);
      rerender();

      expect(result.current.userPreferences).toEqual({
        browserSaveEnabled: false,
        maximumHistorySize: 7,
      });
      expect(result.current.applicationState.filingStatus).toBe(
        "head_of_household",
      );
      expect(result.current.applicationState.formInstances.fW2?.[0].label).toBe(
        "Loaded",
      );
      expect(result.current.uiState.connectionsGraphNodePositions).toEqual({
        fW2: { x: 1, y: 2 },
      });
      expect(result.current.loadErrors).toEqual([]);
    });

    it("surfaces a JSON parse failure as invalid_json", () => {
      localStorage.setItem(SAVED_STATE_KEY, "{ not json");

      const { result, rerender } = renderHook(() => useStore());
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
            filingStatus: "martian",
            formClasses: [],
            formInstances: {},
          },
          schemaVersion: CURRENT_SCHEMA_VERSION,
          taxYear: CURRENT_TAX_YEAR,
        }),
      );

      const { result, rerender } = renderHook(() => useStore());
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

  describe("autosave (browserSaveEnabled true)", () => {
    it("writes applicationState changes to SAVED_STATE_KEY after debounce", () => {
      localStorage.setItem(
        PREFERENCES_KEY,
        JSON.stringify({
          preferences: { browserSaveEnabled: true, maximumHistorySize: 50 },
          schemaVersion: CURRENT_SCHEMA_VERSION,
        }),
      );

      const { result } = renderHook(() => useStore());
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
    });

    it("writes preferences changes immediately to PREFERENCES_KEY", () => {
      const { result } = renderHook(() => useStore());
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
      localStorage.setItem(
        PREFERENCES_KEY,
        JSON.stringify({
          preferences: { browserSaveEnabled: false, maximumHistorySize: 50 },
          schemaVersion: CURRENT_SCHEMA_VERSION,
        }),
      );

      const { result } = renderHook(() => useStore());
      render(<Harness />);

      act(() => {
        result.current.addFormInstance("fW2");
      });
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(localStorage.getItem(SAVED_STATE_KEY)).toBeNull();
      expect(localStorage.getItem(UI_STATE_KEY)).toBeNull();
    });
  });

  describe("toggle-off reconciliation", () => {
    it("clears SAVED_STATE_KEY and UI_STATE_KEY when browserSaveEnabled flips true -> false", () => {
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
          },
          schemaVersion: CURRENT_SCHEMA_VERSION,
        }),
      );

      const { result } = renderHook(() => useStore());
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
    });
  });

  describe("unmount", () => {
    it("does not write store changes that happen after unmount", () => {
      const { result } = renderHook(() => useStore());
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
    });
  });

  describe("loadFromUploadedFile bridge", () => {
    function fileFromJson(value: unknown): File {
      return new File([JSON.stringify(value)], "upload.json", {
        type: "application/json",
      });
    }

    it("replaces applicationState while preserving uiState and userPreferences", async () => {
      const registry = makeTestRegistry();
      const { result: persistence } = renderHook(() =>
        usePersistence(registry),
      );
      const { result: store } = renderHook(() => useStore());

      act(() => {
        store.current.initialize(
          store.current.applicationState,
          { connectionsGraphNodePositions: { fW2: { x: 7, y: 8 } } },
          { browserSaveEnabled: false, maximumHistorySize: 12 },
          registry,
        );
      });

      const newApplicationState = {
        filingStatus: "head_of_household" as const,
        formClasses: ["fW2" as const],
        formInstances: {
          fW2: [
            {
              id: "abc",
              class: "fW2" as const,
              label: "Loaded",
              inputs: { box1: { type: "number" as const, value: 99 } },
            },
          ],
        },
      };

      await act(async () => {
        await persistence.current.loadFromUploadedFile(
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
      });
      expect(store.current.userPreferences).toEqual({
        browserSaveEnabled: false,
        maximumHistorySize: 12,
      });
      expect(store.current.loadErrors).toEqual([]);
    });

    it("leaves applicationState unchanged on structural failure but reports errors", async () => {
      const registry = makeTestRegistry();
      const { result: persistence } = renderHook(() =>
        usePersistence(registry),
      );
      const { result: store } = renderHook(() => useStore());

      const before = store.current.applicationState;

      await act(async () => {
        await persistence.current.loadFromUploadedFile(
          new File(["{ not json"], "bad.json"),
        );
      });

      expect(store.current.applicationState).toBe(before);
      expect(store.current.loadErrors).toEqual([{ type: "invalid_json" }]);
    });
  });
});
