import { act, render } from "@testing-library/react";
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
  localStorage.clear();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("usePersistence", () => {
  describe("load on mount", () => {
    it("initializes the store with defaults when localStorage is empty", () => {
      render(<Harness />);
      const state = useStore.getState();
      expect(state.applicationState.filingStatus).toBe("single");
      expect(state.uiState.connectionsGraphNodePositions).toEqual({});
      expect(state.userPreferences.browserSaveEnabled).toBe(true);
      expect(state.loadErrors).toEqual([]);
      expect(state.specifications).toBeDefined();
    });

    it("initializes the store from values present in localStorage", () => {
      localStorage.setItem(
        PREFERENCES_KEY,
        JSON.stringify({ browserSaveEnabled: false, maximumHistorySize: 7 }),
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
          connectionsGraphNodePositions: { fW2: { x: 1, y: 2 } },
        }),
      );

      render(<Harness />);

      const state = useStore.getState();
      expect(state.userPreferences).toEqual({
        browserSaveEnabled: false,
        maximumHistorySize: 7,
      });
      expect(state.applicationState.filingStatus).toBe("head_of_household");
      expect(state.applicationState.formInstances.fW2?.[0].label).toBe(
        "Loaded",
      );
      expect(state.uiState.connectionsGraphNodePositions).toEqual({
        fW2: { x: 1, y: 2 },
      });
      expect(state.loadErrors).toEqual([]);
    });

    it("surfaces a JSON parse failure as an invalid_value at the key root path", () => {
      localStorage.setItem(SAVED_STATE_KEY, "{ not json");
      render(<Harness />);
      const state = useStore.getState();
      expect(state.loadErrors).toContainEqual({
        type: "invalid_value",
        path: SAVED_STATE_KEY,
        reason: "invalid JSON",
      });
    });
  });

  describe("autosave (browserSaveEnabled true)", () => {
    it("writes applicationState changes to SAVED_STATE_KEY after debounce", () => {
      render(<Harness />);
      // Ensure the toggle is on (default).
      act(() => {
        useStore.getState().addFormInstance("fW2");
      });
      // Before debounce expires: nothing yet.
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
      render(<Harness />);
      act(() => {
        useStore.getState().updatePreferences({ maximumHistorySize: 99 });
      });
      const saved = localStorage.getItem(PREFERENCES_KEY);
      expect(saved).not.toBeNull();
      if (saved === null) throw new Error("expected saved preferences");
      const parsed = JSON.parse(saved);
      expect(parsed.maximumHistorySize).toBe(99);
    });
  });

  describe("autosave (browserSaveEnabled false)", () => {
    it("does not write applicationState or uiState while disabled", () => {
      localStorage.setItem(
        PREFERENCES_KEY,
        JSON.stringify({ browserSaveEnabled: false, maximumHistorySize: 50 }),
      );
      render(<Harness />);
      act(() => {
        useStore.getState().addFormInstance("fW2");
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
      // Start with the toggle on; trigger an autosave; then flip off.
      render(<Harness />);
      act(() => {
        useStore.getState().addFormInstance("fW2");
      });
      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(localStorage.getItem(SAVED_STATE_KEY)).not.toBeNull();

      // Seed UI state explicitly (no action yet exists for it; use setState).
      act(() => {
        useStore.setState((state) => ({
          ...state,
          uiState: { connectionsGraphNodePositions: { fW2: { x: 1, y: 1 } } },
        }));
      });
      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(localStorage.getItem(UI_STATE_KEY)).not.toBeNull();

      // Flip off.
      act(() => {
        useStore.getState().updatePreferences({ browserSaveEnabled: false });
      });

      expect(localStorage.getItem(SAVED_STATE_KEY)).toBeNull();
      expect(localStorage.getItem(UI_STATE_KEY)).toBeNull();
      // Preferences itself is still written.
      expect(localStorage.getItem(PREFERENCES_KEY)).not.toBeNull();
    });
  });

  describe("unmount", () => {
    it("does not write after unmount", () => {
      const { unmount } = render(<Harness />);
      unmount();
      act(() => {
        // After unmount, store mutations should not produce writes for this hook
        // instance. (The subscriptions should be torn down.)
        useStore.getState().addFormInstance("fW2");
        vi.advanceTimersByTime(1000);
      });
      // Note: the hook may have flushed an in-flight debounced write during cleanup.
      // We assert that no NEW write happens for mutations issued post-unmount by
      // checking that the saved state does not reflect the post-unmount change.
      const saved = localStorage.getItem(SAVED_STATE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        expect(parsed.applicationState.formClasses).not.toContain("fW2");
      }
    });
  });
});
