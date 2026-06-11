import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import {
  makeBoxFixture,
  makeLineFixture,
  makeRegistryFixture,
  makeSectionFixture,
  makeSpecificationFixture,
} from "#src/specifications/test/fixtures";
import { subscribeToStore, useStore } from "#src/state/useStore";

import type { FormClass } from "#src/common/types/formClass";
import type { UserInput } from "#src/common/types/userInput";
import type { LoadError } from "#src/persistence/types/loadError";
import type { SpecificationRegistry } from "#src/specifications/types/specificationRegistry";
import type { ApplicationState } from "#src/state/types/applicationState";
import type { UiState } from "#src/state/types/uiState";
import type { UserPreferences } from "#src/state/types/userPreferences";

const TEST_CLASS: FormClass = "fW2";
const OTHER_CLASS: FormClass = "f1040";
const NUMBER_INPUT_BOX = "number-input-box";
const AMOUNT_LIST_BOX = "amount-list-box";
const SELECTION_BOX = "selection-box";
const FILING_STATUS_BOX = "filing-status-box";

function makeTestRegistry(): SpecificationRegistry {
  return makeRegistryFixture({
    [TEST_CLASS]: makeSpecificationFixture({
      class: TEST_CLASS,
      sections: [
        makeSectionFixture({
          lines: [
            makeLineFixture({
              index: "1",
              box: makeBoxFixture({
                identifier: NUMBER_INPUT_BOX,
                value: { type: "number_input" },
              }),
            }),
            makeLineFixture({
              index: "2",
              box: makeBoxFixture({
                identifier: AMOUNT_LIST_BOX,
                value: { type: "list_amounts_input" },
              }),
            }),
            makeLineFixture({
              index: "3",
              box: makeBoxFixture({
                identifier: SELECTION_BOX,
                value: {
                  type: "select_value_input",
                  options: [
                    {
                      label: "A",
                      value: { type: "number_constant", value: 10 },
                    },
                    {
                      label: "B",
                      value: { type: "number_constant", value: 20 },
                    },
                  ],
                },
              }),
            }),
            makeLineFixture({
              index: "4",
              box: makeBoxFixture({
                identifier: FILING_STATUS_BOX,
                value: {
                  type: "filing_status_map",
                  values: {
                    single: { type: "number_constant", value: 100 },
                    married_filing_jointly: {
                      type: "number_constant",
                      value: 200,
                    },
                  },
                  default: { type: "number_constant", value: 0 },
                },
              }),
            }),
          ],
        }),
      ],
    }),
  });
}

const DEFAULT_APPLICATION_STATE: ApplicationState = {
  filingStatus: "single",
  formClasses: [],
  formInstances: {},
};
const DEFAULT_UI_STATE: UiState = {
  connectionsGraphNodePositions: {},
};
const DEFAULT_PREFERENCES: UserPreferences = {
  browserSaveEnabled: true,
  maximumHistorySize: 50,
};

function renderUseStore() {
  return renderHook(() => useStore((state) => state));
}

beforeEach(() => {
  const { result } = renderUseStore();
  result.current.initialize(
    DEFAULT_APPLICATION_STATE,
    DEFAULT_UI_STATE,
    DEFAULT_PREFERENCES,
    makeTestRegistry(),
  );
});

describe("useStore", () => {
  describe("initialize", () => {
    it("populates applicationState, uiState, userPreferences, and specifications from arguments", () => {
      const { result, rerender } = renderUseStore();

      const applicationState: ApplicationState = {
        filingStatus: "head_of_household",
        formClasses: [TEST_CLASS],
        formInstances: {
          [TEST_CLASS]: [
            { id: "x", class: TEST_CLASS, label: "Hello", inputs: {} },
          ],
        },
      };
      const uiState: UiState = {
        connectionsGraphNodePositions: { [TEST_CLASS]: { x: 1, y: 2 } },
      };
      const preferences: UserPreferences = {
        browserSaveEnabled: false,
        maximumHistorySize: 5,
      };

      result.current.initialize(
        applicationState,
        uiState,
        preferences,
        makeTestRegistry(),
      );

      rerender();
      const state = result.current;
      expect(state.applicationState).toEqual(applicationState);
      expect(state.uiState).toEqual(uiState);
      expect(state.userPreferences).toEqual(preferences);
    });

    it("resets history when called on a store that already has history", () => {
      const { result, rerender } = renderUseStore();

      result.current.setFilingStatus("married_filing_jointly");
      result.current.setFilingStatus("head_of_household");
      result.current.undo();

      rerender();
      expect(result.current.history.past.length).toBeGreaterThan(0);
      expect(result.current.history.future.length).toBeGreaterThan(0);

      result.current.initialize(
        DEFAULT_APPLICATION_STATE,
        DEFAULT_UI_STATE,
        DEFAULT_PREFERENCES,
        makeTestRegistry(),
      );

      rerender();
      expect(result.current.history).toEqual({ past: [], future: [] });
    });

    it("computes the workbook from the provided applicationState", () => {
      const { result, rerender } = renderUseStore();

      const applicationState: ApplicationState = {
        filingStatus: "single",
        formClasses: [TEST_CLASS],
        formInstances: {
          [TEST_CLASS]: [
            {
              id: "x",
              class: TEST_CLASS,
              label: "",
              inputs: { [NUMBER_INPUT_BOX]: { type: "number", value: 42 } },
            },
          ],
        },
      };

      result.current.initialize(
        applicationState,
        DEFAULT_UI_STATE,
        DEFAULT_PREFERENCES,
        makeTestRegistry(),
      );

      rerender();
      expect(result.current.workbook["x"][NUMBER_INPUT_BOX]).toEqual({
        value: 42,
        errors: [],
      });
    });

    it("replaces previously loaded state when called twice (no merging)", () => {
      const { result, rerender } = renderUseStore();

      const firstApplicationState: ApplicationState = {
        filingStatus: "single",
        formClasses: [TEST_CLASS],
        formInstances: {
          [TEST_CLASS]: [
            { id: "first", class: TEST_CLASS, label: "First", inputs: {} },
          ],
        },
      };

      result.current.initialize(
        firstApplicationState,
        DEFAULT_UI_STATE,
        DEFAULT_PREFERENCES,
        makeTestRegistry(),
      );

      const secondApplicationState: ApplicationState = {
        filingStatus: "married_filing_jointly",
        formClasses: [],
        formInstances: {},
      };

      result.current.initialize(
        secondApplicationState,
        DEFAULT_UI_STATE,
        DEFAULT_PREFERENCES,
        makeTestRegistry(),
      );

      rerender();
      const state = result.current;
      expect(state.applicationState).toEqual(secondApplicationState);
      expect(state.workbook).toEqual({});
    });
  });

  describe("setFilingStatus", () => {
    it("updates applicationState.filingStatus", () => {
      const { result, rerender } = renderUseStore();

      result.current.setFilingStatus("married_filing_jointly");

      rerender();
      expect(result.current.applicationState.filingStatus).toEqual(
        "married_filing_jointly",
      );
    });

    it("pushes the prior applicationState onto history.past and clears history.future", () => {
      const { result, rerender } = renderUseStore();
      const before = result.current.applicationState;

      result.current.setFilingStatus("married_filing_jointly");
      result.current.undo();

      rerender();
      expect(result.current.history.future.length).toEqual(1);

      result.current.setFilingStatus("head_of_household");

      rerender();
      expect(result.current.history.past).toEqual([before]);
      expect(result.current.history.future).toEqual([]);
    });

    it("recomputes the workbook to reflect the new filing status", () => {
      const { result, rerender } = renderUseStore();
      const id = result.current.addFormInstance(TEST_CLASS);

      rerender();
      expect(result.current.workbook[id][FILING_STATUS_BOX].value).toEqual(100);

      result.current.setFilingStatus("married_filing_jointly");

      rerender();
      expect(result.current.workbook[id][FILING_STATUS_BOX].value).toEqual(200);
    });
  });

  describe("addFormInstance", () => {
    it("returns a non-empty string id", () => {
      const { result } = renderUseStore();

      const id = result.current.addFormInstance(TEST_CLASS);

      expect(id).toEqual(expect.any(String));
      expect(id.length).toBeGreaterThan(0);
    });

    it("returns a distinct id on each call", () => {
      const { result } = renderUseStore();

      const id1 = result.current.addFormInstance(TEST_CLASS);
      const id2 = result.current.addFormInstance(TEST_CLASS);

      expect(id1).not.toEqual(id2);
    });

    it("appends an instance with empty inputs, default label, and matching class/id", () => {
      const { result, rerender } = renderUseStore();

      const id = result.current.addFormInstance(TEST_CLASS);

      rerender();
      expect(result.current.applicationState.formInstances[TEST_CLASS]).toEqual(
        [{ id, class: TEST_CLASS, label: "Untitled form", inputs: {} }],
      );
    });

    it("appends formClass to formClasses when first added", () => {
      const { result, rerender } = renderUseStore();

      expect(result.current.applicationState.formClasses).toEqual([]);

      result.current.addFormInstance(TEST_CLASS);

      rerender();
      expect(result.current.applicationState.formClasses).toEqual([TEST_CLASS]);
    });

    it("does not duplicate the formClass entry when another instance of the same class exists", () => {
      const { result, rerender } = renderUseStore();

      result.current.addFormInstance(TEST_CLASS);
      result.current.addFormInstance(TEST_CLASS);

      rerender();
      expect(result.current.applicationState.formClasses).toEqual([TEST_CLASS]);
    });

    it("preserves the order of existing instances", () => {
      const { result, rerender } = renderUseStore();

      const id1 = result.current.addFormInstance(TEST_CLASS);
      const id2 = result.current.addFormInstance(TEST_CLASS);
      const id3 = result.current.addFormInstance(TEST_CLASS);

      rerender();
      expect(
        result.current.applicationState.formInstances[TEST_CLASS]?.map(
          ({ id }) => id,
        ),
      ).toEqual([id1, id2, id3]);
    });

    it("pushes the prior applicationState onto history.past and clears history.future", () => {
      const { result, rerender } = renderUseStore();
      const before = result.current.applicationState;

      result.current.addFormInstance(TEST_CLASS);
      result.current.undo();

      rerender();
      expect(result.current.history.future.length).toEqual(1);

      result.current.addFormInstance(TEST_CLASS);

      rerender();
      expect(result.current.history.past).toEqual([before]);
      expect(result.current.history.future).toEqual([]);
    });

    it("workbook contains entries for the new instance", () => {
      const { result, rerender } = renderUseStore();

      const id = result.current.addFormInstance(TEST_CLASS);

      rerender();
      expect(result.current.workbook[id]).toBeDefined();
      expect(result.current.workbook[id][NUMBER_INPUT_BOX]).toEqual({
        value: 0,
        errors: [],
      });
    });
  });

  describe("removeFormInstance", () => {
    it("removes the specified instance while preserving other instances of the same class", () => {
      const { result, rerender } = renderUseStore();

      const id1 = result.current.addFormInstance(TEST_CLASS);
      const id2 = result.current.addFormInstance(TEST_CLASS);
      const id3 = result.current.addFormInstance(TEST_CLASS);

      result.current.removeFormInstance(TEST_CLASS, id2);

      rerender();
      expect(
        result.current.applicationState.formInstances[TEST_CLASS]?.map(
          ({ id }) => id,
        ),
      ).toEqual([id1, id3]);
    });

    it("deletes the class key from formInstances and removes the class from formClasses when removing the last instance", () => {
      const { result, rerender } = renderUseStore();

      const id = result.current.addFormInstance(TEST_CLASS);
      result.current.addFormInstance(OTHER_CLASS);

      result.current.removeFormInstance(TEST_CLASS, id);

      rerender();
      expect(
        result.current.applicationState.formInstances[TEST_CLASS],
      ).toBeUndefined();
      expect(result.current.applicationState.formClasses).toEqual([
        OTHER_CLASS,
      ]);
    });

    it("keeps formClasses unchanged when other instances of the class remain", () => {
      const { result, rerender } = renderUseStore();

      const id1 = result.current.addFormInstance(TEST_CLASS);
      result.current.addFormInstance(TEST_CLASS);

      rerender();
      const before = result.current.applicationState.formClasses;

      result.current.removeFormInstance(TEST_CLASS, id1);

      rerender();
      expect(result.current.applicationState.formClasses).toEqual(before);
    });

    it("pushes the prior applicationState onto history.past and clears history.future on a successful removal", () => {
      const { result, rerender } = renderUseStore();

      const id = result.current.addFormInstance(TEST_CLASS);

      rerender();
      const before = result.current.applicationState;

      result.current.setFilingStatus("married_filing_jointly");
      result.current.undo();

      rerender();
      expect(result.current.history.future.length).toEqual(1);

      result.current.removeFormInstance(TEST_CLASS, id);

      rerender();
      const past = result.current.history.past;
      expect(past[past.length - 1]).toEqual(before);
      expect(result.current.history.future).toEqual([]);
    });

    it("does nothing (state and history unchanged) when the class is not present or the instance id is not found", () => {
      const { result, rerender } = renderUseStore();

      const id = result.current.addFormInstance(TEST_CLASS);

      rerender();
      const stateBefore = result.current;

      result.current.removeFormInstance(OTHER_CLASS, "any-id");

      rerender();
      expect(result.current.applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(result.current.history).toBe(stateBefore.history);

      result.current.removeFormInstance(TEST_CLASS, "no-such-id");

      rerender();
      expect(result.current.applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(result.current.history).toBe(stateBefore.history);

      // sanity check: the existing instance is untouched
      expect(
        result.current.applicationState.formInstances[TEST_CLASS]?.map(
          ({ id: i }) => i,
        ),
      ).toEqual([id]);
    });

    it("removes the workbook entries for the removed instance", () => {
      const { result, rerender } = renderUseStore();

      const id = result.current.addFormInstance(TEST_CLASS);

      rerender();
      expect(result.current.workbook[id]).toBeDefined();

      result.current.removeFormInstance(TEST_CLASS, id);

      rerender();
      expect(result.current.workbook[id]).toBeUndefined();
    });
  });

  describe("setFormInstanceLabel", () => {
    it("updates the instance's label while preserving its inputs", () => {
      const { result, rerender } = renderUseStore();

      const id = result.current.addFormInstance(TEST_CLASS);
      result.current.setBoxInput(TEST_CLASS, id, NUMBER_INPUT_BOX, {
        type: "number",
        value: 7,
      });

      result.current.setFormInstanceLabel(TEST_CLASS, id, "Updated");

      rerender();
      const instance =
        result.current.applicationState.formInstances[TEST_CLASS]?.[0];
      expect(instance?.label).toEqual("Updated");
      expect(instance?.inputs[NUMBER_INPUT_BOX]).toEqual({
        type: "number",
        value: 7,
      });
    });

    it("preserves the labels of other instances in the same and other classes", () => {
      const { result, rerender } = renderUseStore();

      const id1 = result.current.addFormInstance(TEST_CLASS);
      const id2 = result.current.addFormInstance(TEST_CLASS);
      const id3 = result.current.addFormInstance(OTHER_CLASS);
      result.current.setFormInstanceLabel(TEST_CLASS, id1, "L1");
      result.current.setFormInstanceLabel(TEST_CLASS, id2, "L2");
      result.current.setFormInstanceLabel(OTHER_CLASS, id3, "L3");

      result.current.setFormInstanceLabel(TEST_CLASS, id1, "L1-updated");

      rerender();
      const sameClass =
        result.current.applicationState.formInstances[TEST_CLASS];
      const otherClass =
        result.current.applicationState.formInstances[OTHER_CLASS];
      expect(sameClass?.find(({ id }) => id === id2)?.label).toEqual("L2");
      expect(otherClass?.find(({ id }) => id === id3)?.label).toEqual("L3");
    });

    it("pushes the prior applicationState onto history.past and clears history.future", () => {
      const { result, rerender } = renderUseStore();

      const id = result.current.addFormInstance(TEST_CLASS);

      rerender();
      const before = result.current.applicationState;

      result.current.setFilingStatus("married_filing_jointly");
      result.current.undo();

      rerender();
      expect(result.current.history.future.length).toEqual(1);

      result.current.setFormInstanceLabel(TEST_CLASS, id, "Label");

      rerender();
      const past = result.current.history.past;
      expect(past[past.length - 1]).toEqual(before);
      expect(result.current.history.future).toEqual([]);
    });

    it("does nothing (state and history unchanged) when the class is not present or the instance id is not found", () => {
      const { result, rerender } = renderUseStore();

      result.current.addFormInstance(TEST_CLASS);

      rerender();
      const stateBefore = result.current;

      result.current.setFormInstanceLabel(OTHER_CLASS, "any-id", "L");

      rerender();
      expect(result.current.applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(result.current.history).toBe(stateBefore.history);

      result.current.setFormInstanceLabel(TEST_CLASS, "no-such-id", "L");

      rerender();
      expect(result.current.applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(result.current.history).toBe(stateBefore.history);
    });
  });

  describe("moveFormInstance", () => {
    it("swaps with the next instance when direction is 1 and pushes history", () => {
      const { result, rerender } = renderUseStore();

      const id1 = result.current.addFormInstance(TEST_CLASS);
      const id2 = result.current.addFormInstance(TEST_CLASS);
      const id3 = result.current.addFormInstance(TEST_CLASS);

      rerender();
      const before = result.current.applicationState;

      result.current.moveFormInstance(TEST_CLASS, id1, 1);

      rerender();
      expect(
        result.current.applicationState.formInstances[TEST_CLASS]?.map(
          ({ id }) => id,
        ),
      ).toEqual([id2, id1, id3]);
      const past = result.current.history.past;
      expect(past[past.length - 1]).toEqual(before);
    });

    it("swaps with the previous instance when direction is -1 and pushes history", () => {
      const { result, rerender } = renderUseStore();

      const id1 = result.current.addFormInstance(TEST_CLASS);
      const id2 = result.current.addFormInstance(TEST_CLASS);
      const id3 = result.current.addFormInstance(TEST_CLASS);

      rerender();
      const before = result.current.applicationState;

      result.current.moveFormInstance(TEST_CLASS, id3, -1);

      rerender();
      expect(
        result.current.applicationState.formInstances[TEST_CLASS]?.map(
          ({ id }) => id,
        ),
      ).toEqual([id1, id3, id2]);
      const past = result.current.history.past;
      expect(past[past.length - 1]).toEqual(before);
    });

    it("does nothing at the start boundary (first instance, direction=-1) and at the end boundary (last instance, direction=1)", () => {
      const { result, rerender } = renderUseStore();

      const id1 = result.current.addFormInstance(TEST_CLASS);
      const id2 = result.current.addFormInstance(TEST_CLASS);

      rerender();
      const stateBefore = result.current;

      result.current.moveFormInstance(TEST_CLASS, id1, -1);

      rerender();
      expect(result.current.applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(result.current.history).toBe(stateBefore.history);

      result.current.moveFormInstance(TEST_CLASS, id2, 1);

      rerender();
      expect(result.current.applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(result.current.history).toBe(stateBefore.history);
    });

    it("does nothing (state and history unchanged) when the class is not present or the instance id is not found", () => {
      const { result, rerender } = renderUseStore();

      result.current.addFormInstance(TEST_CLASS);

      rerender();
      const stateBefore = result.current;

      result.current.moveFormInstance(OTHER_CLASS, "any-id", 1);

      rerender();
      expect(result.current.applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(result.current.history).toBe(stateBefore.history);

      result.current.moveFormInstance(TEST_CLASS, "no-such-id", 1);

      rerender();
      expect(result.current.applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(result.current.history).toBe(stateBefore.history);
    });
  });

  describe("moveFormClass", () => {
    it("swaps with the next class when direction is 1 and pushes history", () => {
      const { result, rerender } = renderUseStore();

      result.current.addFormInstance(TEST_CLASS);
      result.current.addFormInstance(OTHER_CLASS);

      rerender();
      const before = result.current.applicationState;

      result.current.moveFormClass(TEST_CLASS, 1);

      rerender();
      expect(result.current.applicationState.formClasses).toEqual([
        OTHER_CLASS,
        TEST_CLASS,
      ]);
      const past = result.current.history.past;
      expect(past[past.length - 1]).toEqual(before);
    });

    it("swaps with the previous class when direction is -1 and pushes history", () => {
      const { result, rerender } = renderUseStore();

      result.current.addFormInstance(TEST_CLASS);
      result.current.addFormInstance(OTHER_CLASS);

      rerender();
      const before = result.current.applicationState;

      result.current.moveFormClass(OTHER_CLASS, -1);

      rerender();
      expect(result.current.applicationState.formClasses).toEqual([
        OTHER_CLASS,
        TEST_CLASS,
      ]);
      const past = result.current.history.past;
      expect(past[past.length - 1]).toEqual(before);
    });

    it("does nothing at the start boundary (first class, direction=-1) and at the end boundary (last class, direction=1)", () => {
      const { result, rerender } = renderUseStore();

      result.current.addFormInstance(TEST_CLASS);
      result.current.addFormInstance(OTHER_CLASS);

      rerender();
      const stateBefore = result.current;

      result.current.moveFormClass(TEST_CLASS, -1);

      rerender();
      expect(result.current.applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(result.current.history).toBe(stateBefore.history);

      result.current.moveFormClass(OTHER_CLASS, 1);

      rerender();
      expect(result.current.applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(result.current.history).toBe(stateBefore.history);
    });

    it("does nothing (state and history unchanged) when the class is not present", () => {
      const { result, rerender } = renderUseStore();

      result.current.addFormInstance(TEST_CLASS);

      rerender();
      const stateBefore = result.current;

      result.current.moveFormClass(OTHER_CLASS, 1);

      rerender();
      expect(result.current.applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(result.current.history).toBe(stateBefore.history);
    });
  });

  describe("setBoxInput", () => {
    it("stores a number input on the specified box", () => {
      const { result, rerender } = renderUseStore();

      const id = result.current.addFormInstance(TEST_CLASS);
      const value: UserInput = { type: "number", value: 42 };

      result.current.setBoxInput(TEST_CLASS, id, NUMBER_INPUT_BOX, value);

      rerender();
      const instance =
        result.current.applicationState.formInstances[TEST_CLASS]?.[0];
      expect(instance?.inputs[NUMBER_INPUT_BOX]).toEqual(value);
    });

    it("stores an amount_list input on the specified box", () => {
      const { result, rerender } = renderUseStore();

      const id = result.current.addFormInstance(TEST_CLASS);
      const value: UserInput = {
        type: "amount_list",
        value: [
          { label: "rent", amount: 1200 },
          { label: "utilities", amount: 80 },
        ],
      };

      result.current.setBoxInput(TEST_CLASS, id, AMOUNT_LIST_BOX, value);

      rerender();
      const instance =
        result.current.applicationState.formInstances[TEST_CLASS]?.[0];
      expect(instance?.inputs[AMOUNT_LIST_BOX]).toEqual(value);
    });

    it("stores a selection input on the specified box", () => {
      const { result, rerender } = renderUseStore();

      const id = result.current.addFormInstance(TEST_CLASS);
      const value: UserInput = { type: "selection", selectedIndex: 1 };

      result.current.setBoxInput(TEST_CLASS, id, SELECTION_BOX, value);

      rerender();
      const instance =
        result.current.applicationState.formInstances[TEST_CLASS]?.[0];
      expect(instance?.inputs[SELECTION_BOX]).toEqual(value);
    });

    it("overwrites a prior input on the same box", () => {
      const { result, rerender } = renderUseStore();

      const id = result.current.addFormInstance(TEST_CLASS);
      result.current.setBoxInput(TEST_CLASS, id, NUMBER_INPUT_BOX, {
        type: "number",
        value: 1,
      });

      result.current.setBoxInput(TEST_CLASS, id, NUMBER_INPUT_BOX, {
        type: "number",
        value: 999,
      });

      rerender();
      const instance =
        result.current.applicationState.formInstances[TEST_CLASS]?.[0];
      expect(instance?.inputs[NUMBER_INPUT_BOX]).toEqual({
        type: "number",
        value: 999,
      });
    });

    it("preserves other inputs on the same instance", () => {
      const { result, rerender } = renderUseStore();

      const id = result.current.addFormInstance(TEST_CLASS);
      result.current.setBoxInput(TEST_CLASS, id, NUMBER_INPUT_BOX, {
        type: "number",
        value: 5,
      });

      result.current.setBoxInput(TEST_CLASS, id, SELECTION_BOX, {
        type: "selection",
        selectedIndex: 0,
      });

      rerender();
      const instance =
        result.current.applicationState.formInstances[TEST_CLASS]?.[0];
      expect(instance?.inputs[NUMBER_INPUT_BOX]).toEqual({
        type: "number",
        value: 5,
      });
    });

    it("preserves inputs on other instances", () => {
      const { result, rerender } = renderUseStore();

      const id1 = result.current.addFormInstance(TEST_CLASS);
      const id2 = result.current.addFormInstance(TEST_CLASS);
      result.current.setBoxInput(TEST_CLASS, id1, NUMBER_INPUT_BOX, {
        type: "number",
        value: 11,
      });

      result.current.setBoxInput(TEST_CLASS, id2, NUMBER_INPUT_BOX, {
        type: "number",
        value: 22,
      });

      rerender();
      const instances =
        result.current.applicationState.formInstances[TEST_CLASS];
      expect(
        instances?.find(({ id }) => id === id1)?.inputs[NUMBER_INPUT_BOX],
      ).toEqual({ type: "number", value: 11 });
    });

    it("recomputes the workbook to reflect the new input value", () => {
      const { result, rerender } = renderUseStore();

      const id = result.current.addFormInstance(TEST_CLASS);

      rerender();
      expect(result.current.workbook[id][NUMBER_INPUT_BOX].value).toEqual(0);

      result.current.setBoxInput(TEST_CLASS, id, NUMBER_INPUT_BOX, {
        type: "number",
        value: 42,
      });

      rerender();
      expect(result.current.workbook[id][NUMBER_INPUT_BOX].value).toEqual(42);
    });

    it("pushes the prior applicationState onto history.past and clears history.future", () => {
      const { result, rerender } = renderUseStore();

      const id = result.current.addFormInstance(TEST_CLASS);

      rerender();
      const before = result.current.applicationState;

      result.current.setFilingStatus("married_filing_jointly");
      result.current.undo();

      rerender();
      expect(result.current.history.future.length).toEqual(1);

      result.current.setBoxInput(TEST_CLASS, id, NUMBER_INPUT_BOX, {
        type: "number",
        value: 1,
      });

      rerender();
      const past = result.current.history.past;
      expect(past[past.length - 1]).toEqual(before);
      expect(result.current.history.future).toEqual([]);
    });

    it("does nothing (state and history unchanged) when the class is not present or the instance id is not found", () => {
      const { result, rerender } = renderUseStore();

      result.current.addFormInstance(TEST_CLASS);

      rerender();
      const stateBefore = result.current;
      const value: UserInput = { type: "number", value: 1 };

      result.current.setBoxInput(
        OTHER_CLASS,
        "any-id",
        NUMBER_INPUT_BOX,
        value,
      );

      rerender();
      expect(result.current.applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(result.current.history).toBe(stateBefore.history);

      result.current.setBoxInput(
        TEST_CLASS,
        "no-such-id",
        NUMBER_INPUT_BOX,
        value,
      );

      rerender();
      expect(result.current.applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(result.current.history).toBe(stateBefore.history);
    });
  });

  describe("updatePreferences", () => {
    it("updates a single field, preserving others", () => {
      const { result, rerender } = renderUseStore();

      result.current.updatePreferences({ browserSaveEnabled: false });

      rerender();
      expect(result.current.userPreferences).toEqual({
        browserSaveEnabled: false,
        maximumHistorySize: DEFAULT_PREFERENCES.maximumHistorySize,
      });
    });

    it("updates multiple fields at once", () => {
      const { result, rerender } = renderUseStore();

      result.current.updatePreferences({
        browserSaveEnabled: false,
        maximumHistorySize: 7,
      });

      rerender();
      expect(result.current.userPreferences).toEqual({
        browserSaveEnabled: false,
        maximumHistorySize: 7,
      });
    });

    it("does not change history.past or history.future", () => {
      const { result, rerender } = renderUseStore();

      result.current.setFilingStatus("married_filing_jointly");
      result.current.undo();

      rerender();
      const historyBefore = result.current.history;

      result.current.updatePreferences({ browserSaveEnabled: false });

      rerender();
      expect(result.current.history).toEqual(historyBefore);
    });

    it("does not change applicationState or workbook", () => {
      const { result, rerender } = renderUseStore();

      result.current.addFormInstance(TEST_CLASS);

      rerender();
      const applicationStateBefore = result.current.applicationState;
      const workbookBefore = result.current.workbook;

      result.current.updatePreferences({ maximumHistorySize: 7 });

      rerender();
      expect(result.current.applicationState).toBe(applicationStateBefore);
      expect(result.current.workbook).toBe(workbookBefore);
    });
  });

  describe("undo", () => {
    it("restores the prior applicationState", () => {
      const { result, rerender } = renderUseStore();
      const before = result.current.applicationState;

      result.current.setFilingStatus("married_filing_jointly");
      result.current.undo();

      rerender();
      expect(result.current.applicationState).toEqual(before);
    });

    it("moves the current applicationState onto history.future", () => {
      const { result, rerender } = renderUseStore();

      result.current.setFilingStatus("married_filing_jointly");

      rerender();
      const beforeUndo = result.current.applicationState;

      result.current.undo();

      rerender();
      expect(result.current.history.future).toEqual([beforeUndo]);
    });

    it("recomputes the workbook to match the restored state", () => {
      const { result, rerender } = renderUseStore();

      const id = result.current.addFormInstance(TEST_CLASS);
      result.current.setFilingStatus("married_filing_jointly");

      rerender();
      expect(result.current.workbook[id][FILING_STATUS_BOX].value).toEqual(200);

      result.current.undo();

      rerender();
      expect(result.current.workbook[id][FILING_STATUS_BOX].value).toEqual(100);
    });

    it("does nothing when history.past is empty", () => {
      const { result, rerender } = renderUseStore();
      const stateBefore = result.current;

      result.current.undo();

      rerender();
      expect(result.current.applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(result.current.history).toBe(stateBefore.history);
      expect(result.current.workbook).toBe(stateBefore.workbook);
    });

    it("walks back through multiple history entries on sequential calls", () => {
      const { result, rerender } = renderUseStore();
      const initial = result.current.applicationState;

      result.current.setFilingStatus("married_filing_jointly");

      rerender();
      const afterFirst = result.current.applicationState;

      result.current.setFilingStatus("head_of_household");

      result.current.undo();

      rerender();
      expect(result.current.applicationState).toEqual(afterFirst);

      result.current.undo();

      rerender();
      expect(result.current.applicationState).toEqual(initial);
    });
  });

  describe("redo", () => {
    it("restores the next applicationState from history.future", () => {
      const { result, rerender } = renderUseStore();

      result.current.setFilingStatus("married_filing_jointly");

      rerender();
      const afterFirst = result.current.applicationState;

      result.current.undo();
      result.current.redo();

      rerender();
      expect(result.current.applicationState).toEqual(afterFirst);
    });

    it("moves the current applicationState onto history.past", () => {
      const { result, rerender } = renderUseStore();

      result.current.setFilingStatus("married_filing_jointly");
      result.current.undo();

      rerender();
      const beforeRedo = result.current.applicationState;

      result.current.redo();

      rerender();
      const past = result.current.history.past;
      expect(past[past.length - 1]).toEqual(beforeRedo);
    });

    it("recomputes the workbook to match the restored state", () => {
      const { result, rerender } = renderUseStore();

      const id = result.current.addFormInstance(TEST_CLASS);
      result.current.setFilingStatus("married_filing_jointly");
      result.current.undo();

      rerender();
      expect(result.current.workbook[id][FILING_STATUS_BOX].value).toEqual(100);

      result.current.redo();

      rerender();
      expect(result.current.workbook[id][FILING_STATUS_BOX].value).toEqual(200);
    });

    it("does nothing when history.future is empty", () => {
      const { result, rerender } = renderUseStore();

      result.current.setFilingStatus("married_filing_jointly");

      rerender();
      const stateBefore = result.current;
      expect(stateBefore.history.future).toEqual([]);

      result.current.redo();

      rerender();
      expect(result.current.applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(result.current.history).toBe(stateBefore.history);
      expect(result.current.workbook).toBe(stateBefore.workbook);
    });
  });

  describe("history size", () => {
    it("truncates history.past from the front when maximumHistorySize is exceeded after an action", () => {
      const { result, rerender } = renderUseStore();

      result.current.initialize(
        DEFAULT_APPLICATION_STATE,
        DEFAULT_UI_STATE,
        { ...DEFAULT_PREFERENCES, maximumHistorySize: 2 },
        makeTestRegistry(),
      );

      result.current.setFilingStatus("married_filing_jointly");

      rerender();
      const afterFirst = result.current.applicationState;

      result.current.setFilingStatus("head_of_household");

      rerender();
      const afterSecond = result.current.applicationState;

      result.current.setFilingStatus("qualifying_surviving_spouse");

      rerender();
      const past = result.current.history.past;
      expect(past).toHaveLength(2);
      expect(past[0]).toEqual(afterFirst);
      expect(past[1]).toEqual(afterSecond);
    });
  });

  describe("selectors", () => {
    it("returns selector output when selector is provided", () => {
      const { result, rerender } = renderUseStore();
      const instanceId = result.current.addFormInstance(TEST_CLASS);
      rerender();

      const { result: filingStatusResult } = renderHook(() =>
        useStore((state) => state.applicationState.filingStatus),
      );
      expect(filingStatusResult.current).toEqual("single");

      const { result: boxResult } = renderHook(() =>
        useStore((state) => state.workbook[instanceId][NUMBER_INPUT_BOX]),
      );
      expect(boxResult.current).toEqual({ value: 0, errors: [] });

      result.current.setFilingStatus("head_of_household");
      result.current.setBoxInput(TEST_CLASS, instanceId, NUMBER_INPUT_BOX, {
        type: "number",
        value: 10,
      });
      rerender();

      expect(filingStatusResult.current).toEqual("head_of_household");
      expect(boxResult.current).toEqual({ value: 10, errors: [] });
    });

    it("returns entire state when no selector is provided", () => {
      const { result } = renderUseStore();
      expect(result.current).toEqual(
        expect.objectContaining({
          applicationState: expect.any(Object),
          uiState: expect.any(Object),
          userPreferences: expect.any(Object),
          workbook: expect.any(Object),
          history: expect.any(Object),
          specifications: expect.any(Object),
        }),
      );
    });
  });

  describe("loadErrors", () => {
    it("defaults to an empty array", () => {
      const { result } = renderUseStore();
      expect(result.current.loadErrors).toEqual([]);
    });

    it("setLoadErrors replaces the current array", () => {
      const { result, rerender } = renderUseStore();
      const errors: LoadError[] = [{ type: "not_an_object" }];
      result.current.setLoadErrors(errors);
      rerender();
      expect(result.current.loadErrors).toEqual(errors);
    });

    it("clearLoadErrors empties the array", () => {
      const { result, rerender } = renderUseStore();
      result.current.setLoadErrors([{ type: "not_an_object" }]);
      rerender();
      result.current.clearLoadErrors();
      rerender();
      expect(result.current.loadErrors).toEqual([]);
    });
  });

  describe("setApplicationState", () => {
    it("replaces applicationState while preserving uiState and userPreferences", () => {
      const { result, rerender } = renderUseStore();
      result.current.initialize(
        DEFAULT_APPLICATION_STATE,
        { connectionsGraphNodePositions: { [TEST_CLASS]: { x: 5, y: 6 } } },
        { browserSaveEnabled: false, maximumHistorySize: 12 },
        makeTestRegistry(),
      );
      rerender();

      const next: ApplicationState = {
        filingStatus: "head_of_household",
        formClasses: [TEST_CLASS],
        formInstances: {
          [TEST_CLASS]: [
            { id: "abc", class: TEST_CLASS, label: "Loaded", inputs: {} },
          ],
        },
      };
      result.current.setApplicationState(next);
      rerender();

      expect(result.current.applicationState).toEqual(next);
      expect(result.current.uiState).toEqual({
        connectionsGraphNodePositions: { [TEST_CLASS]: { x: 5, y: 6 } },
      });
      expect(result.current.userPreferences).toEqual({
        browserSaveEnabled: false,
        maximumHistorySize: 12,
      });
    });

    it("clears undo and redo history", () => {
      const { result, rerender } = renderUseStore();
      result.current.initialize(
        DEFAULT_APPLICATION_STATE,
        DEFAULT_UI_STATE,
        DEFAULT_PREFERENCES,
        makeTestRegistry(),
      );
      rerender();
      result.current.setFilingStatus("married_filing_jointly");
      rerender();
      expect(result.current.history.past.length).toBe(1);

      result.current.setApplicationState({
        filingStatus: "single",
        formClasses: [],
        formInstances: {},
      });
      rerender();

      expect(result.current.history).toEqual({ past: [], future: [] });
    });

    it("recomputes the workbook", () => {
      const { result, rerender } = renderUseStore();
      result.current.initialize(
        DEFAULT_APPLICATION_STATE,
        DEFAULT_UI_STATE,
        DEFAULT_PREFERENCES,
        makeTestRegistry(),
      );
      rerender();

      const next: ApplicationState = {
        filingStatus: "single",
        formClasses: [TEST_CLASS],
        formInstances: {
          [TEST_CLASS]: [
            {
              id: "abc",
              class: TEST_CLASS,
              label: "L",
              inputs: { [NUMBER_INPUT_BOX]: { type: "number", value: 42 } },
            },
          ],
        },
      };
      result.current.setApplicationState(next);
      rerender();

      expect(result.current.workbook).toEqual(
        expect.objectContaining({
          abc: expect.objectContaining({
            [NUMBER_INPUT_BOX]: expect.objectContaining({ value: 42 }),
          }),
        }),
      );
    });
  });

  describe("subscribeToStore", () => {
    it("invokes the listener with new and previous slice values on change", () => {
      const { result } = renderUseStore();
      const observed: Array<{ current: string; previous: string }> = [];
      const unsubscribe = subscribeToStore(
        (state) => state.applicationState.filingStatus,
        (current, previous) => {
          observed.push({ current, previous });
        },
      );

      result.current.setFilingStatus("married_filing_jointly");
      result.current.setFilingStatus("head_of_household");

      unsubscribe();

      result.current.setFilingStatus("single");

      expect(observed).toEqual([
        { current: "married_filing_jointly", previous: "single" },
        { current: "head_of_household", previous: "married_filing_jointly" },
      ]);
    });
  });
});
