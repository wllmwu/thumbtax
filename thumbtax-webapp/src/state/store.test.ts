import { beforeEach, describe, expect, it } from "vitest";

import {
  makeBoxFixture,
  makeLineFixture,
  makeRegistryFixture,
  makeSectionFixture,
  makeSpecificationFixture,
} from "#src/specifications/test/fixtures";
import { useStore } from "#src/state/store";

import type { FormClass } from "#src/common/types/formClass";
import type { UserInput } from "#src/common/types/userInput";
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
                  type: "selection_input",
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

beforeEach(() => {
  useStore
    .getState()
    .initialize(
      DEFAULT_APPLICATION_STATE,
      DEFAULT_UI_STATE,
      DEFAULT_PREFERENCES,
      makeTestRegistry(),
    );
});

describe("useStore", () => {
  describe("initialize", () => {
    it("populates applicationState, uiState, userPreferences, and specifications from arguments", () => {
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

      useStore
        .getState()
        .initialize(applicationState, uiState, preferences, makeTestRegistry());

      const state = useStore.getState();
      expect(state.applicationState).toEqual(applicationState);
      expect(state.uiState).toEqual(uiState);
      expect(state.userPreferences).toEqual(preferences);
    });

    it("resets history when called on a store that already has history", () => {
      useStore.getState().setFilingStatus("married_filing_jointly");
      useStore.getState().setFilingStatus("head_of_household");
      useStore.getState().undo();
      expect(useStore.getState().history.past.length).toBeGreaterThan(0);
      expect(useStore.getState().history.future.length).toBeGreaterThan(0);

      useStore
        .getState()
        .initialize(
          DEFAULT_APPLICATION_STATE,
          DEFAULT_UI_STATE,
          DEFAULT_PREFERENCES,
          makeTestRegistry(),
        );

      expect(useStore.getState().history).toEqual({ past: [], future: [] });
    });

    it("computes the workbook from the provided applicationState", () => {
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

      useStore
        .getState()
        .initialize(
          applicationState,
          DEFAULT_UI_STATE,
          DEFAULT_PREFERENCES,
          makeTestRegistry(),
        );

      expect(useStore.getState().workbook["x"][NUMBER_INPUT_BOX]).toEqual({
        value: 42,
        errors: [],
      });
    });

    it("replaces previously loaded state when called twice (no merging)", () => {
      const firstApplicationState: ApplicationState = {
        filingStatus: "single",
        formClasses: [TEST_CLASS],
        formInstances: {
          [TEST_CLASS]: [
            { id: "first", class: TEST_CLASS, label: "First", inputs: {} },
          ],
        },
      };
      useStore
        .getState()
        .initialize(
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
      useStore
        .getState()
        .initialize(
          secondApplicationState,
          DEFAULT_UI_STATE,
          DEFAULT_PREFERENCES,
          makeTestRegistry(),
        );

      expect(useStore.getState().applicationState).toEqual(
        secondApplicationState,
      );
      expect(useStore.getState().workbook).toEqual({});
    });
  });

  describe("setFilingStatus", () => {
    it("updates applicationState.filingStatus", () => {
      useStore.getState().setFilingStatus("married_filing_jointly");
      expect(useStore.getState().applicationState.filingStatus).toEqual(
        "married_filing_jointly",
      );
    });

    it("pushes the prior applicationState onto history.past and clears history.future", () => {
      const before = useStore.getState().applicationState;
      useStore.getState().setFilingStatus("married_filing_jointly");
      useStore.getState().undo();
      expect(useStore.getState().history.future.length).toEqual(1);

      useStore.getState().setFilingStatus("head_of_household");

      expect(useStore.getState().history.past).toEqual([before]);
      expect(useStore.getState().history.future).toEqual([]);
    });

    it("recomputes the workbook to reflect the new filing status", () => {
      const id = useStore.getState().addFormInstance(TEST_CLASS);
      expect(useStore.getState().workbook[id][FILING_STATUS_BOX].value).toEqual(
        100,
      );

      useStore.getState().setFilingStatus("married_filing_jointly");

      expect(useStore.getState().workbook[id][FILING_STATUS_BOX].value).toEqual(
        200,
      );
    });
  });

  describe("addFormInstance", () => {
    it("returns a non-empty string id", () => {
      const id = useStore.getState().addFormInstance(TEST_CLASS);
      expect(id).toEqual(expect.any(String));
      expect(id.length).toBeGreaterThan(0);
    });

    it("returns a distinct id on each call", () => {
      const id1 = useStore.getState().addFormInstance(TEST_CLASS);
      const id2 = useStore.getState().addFormInstance(TEST_CLASS);
      expect(id1).not.toEqual(id2);
    });

    it("appends an instance with empty inputs, empty label, and matching class/id", () => {
      const id = useStore.getState().addFormInstance(TEST_CLASS);
      expect(
        useStore.getState().applicationState.formInstances[TEST_CLASS],
      ).toEqual([{ id, class: TEST_CLASS, label: "", inputs: {} }]);
    });

    it("appends formClass to formClasses when first added", () => {
      expect(useStore.getState().applicationState.formClasses).toEqual([]);
      useStore.getState().addFormInstance(TEST_CLASS);
      expect(useStore.getState().applicationState.formClasses).toEqual([
        TEST_CLASS,
      ]);
    });

    it("does not duplicate the formClass entry when another instance of the same class exists", () => {
      useStore.getState().addFormInstance(TEST_CLASS);
      useStore.getState().addFormInstance(TEST_CLASS);
      expect(useStore.getState().applicationState.formClasses).toEqual([
        TEST_CLASS,
      ]);
    });

    it("preserves the order of existing instances", () => {
      const id1 = useStore.getState().addFormInstance(TEST_CLASS);
      const id2 = useStore.getState().addFormInstance(TEST_CLASS);
      const id3 = useStore.getState().addFormInstance(TEST_CLASS);
      expect(
        useStore
          .getState()
          .applicationState.formInstances[TEST_CLASS]?.map(({ id }) => id),
      ).toEqual([id1, id2, id3]);
    });

    it("pushes the prior applicationState onto history.past and clears history.future", () => {
      const before = useStore.getState().applicationState;
      useStore.getState().addFormInstance(TEST_CLASS);
      useStore.getState().undo();
      expect(useStore.getState().history.future.length).toEqual(1);

      useStore.getState().addFormInstance(TEST_CLASS);

      expect(useStore.getState().history.past).toEqual([before]);
      expect(useStore.getState().history.future).toEqual([]);
    });

    it("workbook contains entries for the new instance", () => {
      const id = useStore.getState().addFormInstance(TEST_CLASS);
      expect(useStore.getState().workbook[id]).toBeDefined();
      expect(useStore.getState().workbook[id][NUMBER_INPUT_BOX]).toEqual({
        value: 0,
        errors: [],
      });
    });
  });

  describe("removeFormInstance", () => {
    it("removes the specified instance while preserving other instances of the same class", () => {
      const id1 = useStore.getState().addFormInstance(TEST_CLASS);
      const id2 = useStore.getState().addFormInstance(TEST_CLASS);
      const id3 = useStore.getState().addFormInstance(TEST_CLASS);

      useStore.getState().removeFormInstance(TEST_CLASS, id2);

      expect(
        useStore
          .getState()
          .applicationState.formInstances[TEST_CLASS]?.map(({ id }) => id),
      ).toEqual([id1, id3]);
    });

    it("deletes the class key from formInstances and removes the class from formClasses when removing the last instance", () => {
      const id = useStore.getState().addFormInstance(TEST_CLASS);
      useStore.getState().addFormInstance(OTHER_CLASS);

      useStore.getState().removeFormInstance(TEST_CLASS, id);

      const state = useStore.getState();
      expect(state.applicationState.formInstances[TEST_CLASS]).toBeUndefined();
      expect(state.applicationState.formClasses).toEqual([OTHER_CLASS]);
    });

    it("keeps formClasses unchanged when other instances of the class remain", () => {
      const id1 = useStore.getState().addFormInstance(TEST_CLASS);
      useStore.getState().addFormInstance(TEST_CLASS);
      const before = useStore.getState().applicationState.formClasses;

      useStore.getState().removeFormInstance(TEST_CLASS, id1);

      expect(useStore.getState().applicationState.formClasses).toEqual(before);
    });

    it("pushes the prior applicationState onto history.past and clears history.future on a successful removal", () => {
      const id = useStore.getState().addFormInstance(TEST_CLASS);
      const before = useStore.getState().applicationState;
      useStore.getState().setFilingStatus("married_filing_jointly");
      useStore.getState().undo();
      expect(useStore.getState().history.future.length).toEqual(1);

      useStore.getState().removeFormInstance(TEST_CLASS, id);

      const past = useStore.getState().history.past;
      expect(past[past.length - 1]).toEqual(before);
      expect(useStore.getState().history.future).toEqual([]);
    });

    it("is a no-op (state and history unchanged) when the class is not present or the instance id is not found", () => {
      const id = useStore.getState().addFormInstance(TEST_CLASS);
      const stateBefore = useStore.getState();

      useStore.getState().removeFormInstance(OTHER_CLASS, "any-id");

      expect(useStore.getState().applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(useStore.getState().history).toBe(stateBefore.history);

      useStore.getState().removeFormInstance(TEST_CLASS, "no-such-id");

      expect(useStore.getState().applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(useStore.getState().history).toBe(stateBefore.history);

      // sanity check: the existing instance is untouched
      expect(
        useStore
          .getState()
          .applicationState.formInstances[TEST_CLASS]?.map(({ id: i }) => i),
      ).toEqual([id]);
    });

    it("removes the workbook entries for the removed instance", () => {
      const id = useStore.getState().addFormInstance(TEST_CLASS);
      expect(useStore.getState().workbook[id]).toBeDefined();

      useStore.getState().removeFormInstance(TEST_CLASS, id);

      expect(useStore.getState().workbook[id]).toBeUndefined();
    });
  });

  describe("setFormInstanceLabel", () => {
    it("updates the instance's label while preserving its inputs", () => {
      const id = useStore.getState().addFormInstance(TEST_CLASS);
      useStore.getState().setBoxInput(TEST_CLASS, id, NUMBER_INPUT_BOX, {
        type: "number",
        value: 7,
      });

      useStore.getState().setFormInstanceLabel(TEST_CLASS, id, "Updated");

      const instance =
        useStore.getState().applicationState.formInstances[TEST_CLASS]?.[0];
      expect(instance?.label).toEqual("Updated");
      expect(instance?.inputs[NUMBER_INPUT_BOX]).toEqual({
        type: "number",
        value: 7,
      });
    });

    it("preserves the labels of other instances in the same and other classes", () => {
      const id1 = useStore.getState().addFormInstance(TEST_CLASS);
      const id2 = useStore.getState().addFormInstance(TEST_CLASS);
      const id3 = useStore.getState().addFormInstance(OTHER_CLASS);
      useStore.getState().setFormInstanceLabel(TEST_CLASS, id1, "L1");
      useStore.getState().setFormInstanceLabel(TEST_CLASS, id2, "L2");
      useStore.getState().setFormInstanceLabel(OTHER_CLASS, id3, "L3");

      useStore.getState().setFormInstanceLabel(TEST_CLASS, id1, "L1-updated");

      const state = useStore.getState();
      const sameClass = state.applicationState.formInstances[TEST_CLASS];
      const otherClass = state.applicationState.formInstances[OTHER_CLASS];
      expect(sameClass?.find(({ id }) => id === id2)?.label).toEqual("L2");
      expect(otherClass?.find(({ id }) => id === id3)?.label).toEqual("L3");
    });

    it("pushes the prior applicationState onto history.past and clears history.future", () => {
      const id = useStore.getState().addFormInstance(TEST_CLASS);
      const before = useStore.getState().applicationState;
      useStore.getState().setFilingStatus("married_filing_jointly");
      useStore.getState().undo();
      expect(useStore.getState().history.future.length).toEqual(1);

      useStore.getState().setFormInstanceLabel(TEST_CLASS, id, "Label");

      const past = useStore.getState().history.past;
      expect(past[past.length - 1]).toEqual(before);
      expect(useStore.getState().history.future).toEqual([]);
    });

    it("is a no-op (state and history unchanged) when the class is not present or the instance id is not found", () => {
      useStore.getState().addFormInstance(TEST_CLASS);
      const stateBefore = useStore.getState();

      useStore.getState().setFormInstanceLabel(OTHER_CLASS, "any-id", "L");

      expect(useStore.getState().applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(useStore.getState().history).toBe(stateBefore.history);

      useStore.getState().setFormInstanceLabel(TEST_CLASS, "no-such-id", "L");

      expect(useStore.getState().applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(useStore.getState().history).toBe(stateBefore.history);
    });
  });

  describe("moveFormInstance", () => {
    it("swaps with the next instance when direction is 1 and pushes history", () => {
      const id1 = useStore.getState().addFormInstance(TEST_CLASS);
      const id2 = useStore.getState().addFormInstance(TEST_CLASS);
      const id3 = useStore.getState().addFormInstance(TEST_CLASS);
      const before = useStore.getState().applicationState;

      useStore.getState().moveFormInstance(TEST_CLASS, id1, 1);

      expect(
        useStore
          .getState()
          .applicationState.formInstances[TEST_CLASS]?.map(({ id }) => id),
      ).toEqual([id2, id1, id3]);
      const past = useStore.getState().history.past;
      expect(past[past.length - 1]).toEqual(before);
    });

    it("swaps with the previous instance when direction is -1 and pushes history", () => {
      const id1 = useStore.getState().addFormInstance(TEST_CLASS);
      const id2 = useStore.getState().addFormInstance(TEST_CLASS);
      const id3 = useStore.getState().addFormInstance(TEST_CLASS);
      const before = useStore.getState().applicationState;

      useStore.getState().moveFormInstance(TEST_CLASS, id3, -1);

      expect(
        useStore
          .getState()
          .applicationState.formInstances[TEST_CLASS]?.map(({ id }) => id),
      ).toEqual([id1, id3, id2]);
      const past = useStore.getState().history.past;
      expect(past[past.length - 1]).toEqual(before);
    });

    it("is a no-op at the start boundary (first instance, direction=-1) and at the end boundary (last instance, direction=1)", () => {
      const id1 = useStore.getState().addFormInstance(TEST_CLASS);
      const id2 = useStore.getState().addFormInstance(TEST_CLASS);
      const stateBefore = useStore.getState();

      useStore.getState().moveFormInstance(TEST_CLASS, id1, -1);

      expect(useStore.getState().applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(useStore.getState().history).toBe(stateBefore.history);

      useStore.getState().moveFormInstance(TEST_CLASS, id2, 1);

      expect(useStore.getState().applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(useStore.getState().history).toBe(stateBefore.history);
    });

    it("is a no-op (state and history unchanged) when the class is not present or the instance id is not found", () => {
      useStore.getState().addFormInstance(TEST_CLASS);
      const stateBefore = useStore.getState();

      useStore.getState().moveFormInstance(OTHER_CLASS, "any-id", 1);

      expect(useStore.getState().applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(useStore.getState().history).toBe(stateBefore.history);

      useStore.getState().moveFormInstance(TEST_CLASS, "no-such-id", 1);

      expect(useStore.getState().applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(useStore.getState().history).toBe(stateBefore.history);
    });
  });

  describe("moveFormClass", () => {
    it("swaps with the next class when direction is 1 and pushes history", () => {
      useStore.getState().addFormInstance(TEST_CLASS);
      useStore.getState().addFormInstance(OTHER_CLASS);
      const before = useStore.getState().applicationState;

      useStore.getState().moveFormClass(TEST_CLASS, 1);

      expect(useStore.getState().applicationState.formClasses).toEqual([
        OTHER_CLASS,
        TEST_CLASS,
      ]);
      const past = useStore.getState().history.past;
      expect(past[past.length - 1]).toEqual(before);
    });

    it("swaps with the previous class when direction is -1 and pushes history", () => {
      useStore.getState().addFormInstance(TEST_CLASS);
      useStore.getState().addFormInstance(OTHER_CLASS);
      const before = useStore.getState().applicationState;

      useStore.getState().moveFormClass(OTHER_CLASS, -1);

      expect(useStore.getState().applicationState.formClasses).toEqual([
        OTHER_CLASS,
        TEST_CLASS,
      ]);
      const past = useStore.getState().history.past;
      expect(past[past.length - 1]).toEqual(before);
    });

    it("is a no-op at the start boundary (first class, direction=-1) and at the end boundary (last class, direction=1)", () => {
      useStore.getState().addFormInstance(TEST_CLASS);
      useStore.getState().addFormInstance(OTHER_CLASS);
      const stateBefore = useStore.getState();

      useStore.getState().moveFormClass(TEST_CLASS, -1);

      expect(useStore.getState().applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(useStore.getState().history).toBe(stateBefore.history);

      useStore.getState().moveFormClass(OTHER_CLASS, 1);

      expect(useStore.getState().applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(useStore.getState().history).toBe(stateBefore.history);
    });

    it("is a no-op (state and history unchanged) when the class is not present", () => {
      useStore.getState().addFormInstance(TEST_CLASS);
      const stateBefore = useStore.getState();

      useStore.getState().moveFormClass(OTHER_CLASS, 1);

      expect(useStore.getState().applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(useStore.getState().history).toBe(stateBefore.history);
    });
  });

  describe("setBoxInput", () => {
    it("stores a number input on the specified box", () => {
      const id = useStore.getState().addFormInstance(TEST_CLASS);
      const value: UserInput = { type: "number", value: 42 };

      useStore.getState().setBoxInput(TEST_CLASS, id, NUMBER_INPUT_BOX, value);

      const instance =
        useStore.getState().applicationState.formInstances[TEST_CLASS]?.[0];
      expect(instance?.inputs[NUMBER_INPUT_BOX]).toEqual(value);
    });

    it("stores an amount_list input on the specified box", () => {
      const id = useStore.getState().addFormInstance(TEST_CLASS);
      const value: UserInput = {
        type: "amount_list",
        value: [
          { label: "rent", amount: 1200 },
          { label: "utilities", amount: 80 },
        ],
      };

      useStore.getState().setBoxInput(TEST_CLASS, id, AMOUNT_LIST_BOX, value);

      const instance =
        useStore.getState().applicationState.formInstances[TEST_CLASS]?.[0];
      expect(instance?.inputs[AMOUNT_LIST_BOX]).toEqual(value);
    });

    it("stores a selection input on the specified box", () => {
      const id = useStore.getState().addFormInstance(TEST_CLASS);
      const value: UserInput = { type: "selection", selectedIndex: 1 };

      useStore.getState().setBoxInput(TEST_CLASS, id, SELECTION_BOX, value);

      const instance =
        useStore.getState().applicationState.formInstances[TEST_CLASS]?.[0];
      expect(instance?.inputs[SELECTION_BOX]).toEqual(value);
    });

    it("overwrites a prior input on the same box", () => {
      const id = useStore.getState().addFormInstance(TEST_CLASS);
      useStore.getState().setBoxInput(TEST_CLASS, id, NUMBER_INPUT_BOX, {
        type: "number",
        value: 1,
      });

      useStore.getState().setBoxInput(TEST_CLASS, id, NUMBER_INPUT_BOX, {
        type: "number",
        value: 999,
      });

      const instance =
        useStore.getState().applicationState.formInstances[TEST_CLASS]?.[0];
      expect(instance?.inputs[NUMBER_INPUT_BOX]).toEqual({
        type: "number",
        value: 999,
      });
    });

    it("preserves other inputs on the same instance", () => {
      const id = useStore.getState().addFormInstance(TEST_CLASS);
      useStore.getState().setBoxInput(TEST_CLASS, id, NUMBER_INPUT_BOX, {
        type: "number",
        value: 5,
      });

      useStore.getState().setBoxInput(TEST_CLASS, id, SELECTION_BOX, {
        type: "selection",
        selectedIndex: 0,
      });

      const instance =
        useStore.getState().applicationState.formInstances[TEST_CLASS]?.[0];
      expect(instance?.inputs[NUMBER_INPUT_BOX]).toEqual({
        type: "number",
        value: 5,
      });
    });

    it("preserves inputs on other instances", () => {
      const id1 = useStore.getState().addFormInstance(TEST_CLASS);
      const id2 = useStore.getState().addFormInstance(TEST_CLASS);
      useStore.getState().setBoxInput(TEST_CLASS, id1, NUMBER_INPUT_BOX, {
        type: "number",
        value: 11,
      });

      useStore.getState().setBoxInput(TEST_CLASS, id2, NUMBER_INPUT_BOX, {
        type: "number",
        value: 22,
      });

      const instances =
        useStore.getState().applicationState.formInstances[TEST_CLASS];
      expect(
        instances?.find(({ id }) => id === id1)?.inputs[NUMBER_INPUT_BOX],
      ).toEqual({ type: "number", value: 11 });
    });

    it("recomputes the workbook to reflect the new input value", () => {
      const id = useStore.getState().addFormInstance(TEST_CLASS);
      expect(useStore.getState().workbook[id][NUMBER_INPUT_BOX].value).toEqual(
        0,
      );

      useStore.getState().setBoxInput(TEST_CLASS, id, NUMBER_INPUT_BOX, {
        type: "number",
        value: 42,
      });

      expect(useStore.getState().workbook[id][NUMBER_INPUT_BOX].value).toEqual(
        42,
      );
    });

    it("pushes the prior applicationState onto history.past and clears history.future", () => {
      const id = useStore.getState().addFormInstance(TEST_CLASS);
      const before = useStore.getState().applicationState;
      useStore.getState().setFilingStatus("married_filing_jointly");
      useStore.getState().undo();
      expect(useStore.getState().history.future.length).toEqual(1);

      useStore.getState().setBoxInput(TEST_CLASS, id, NUMBER_INPUT_BOX, {
        type: "number",
        value: 1,
      });

      const past = useStore.getState().history.past;
      expect(past[past.length - 1]).toEqual(before);
      expect(useStore.getState().history.future).toEqual([]);
    });

    it("is a no-op (state and history unchanged) when the class is not present or the instance id is not found", () => {
      useStore.getState().addFormInstance(TEST_CLASS);
      const stateBefore = useStore.getState();
      const value: UserInput = { type: "number", value: 1 };

      useStore
        .getState()
        .setBoxInput(OTHER_CLASS, "any-id", NUMBER_INPUT_BOX, value);

      expect(useStore.getState().applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(useStore.getState().history).toBe(stateBefore.history);

      useStore
        .getState()
        .setBoxInput(TEST_CLASS, "no-such-id", NUMBER_INPUT_BOX, value);

      expect(useStore.getState().applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(useStore.getState().history).toBe(stateBefore.history);
    });
  });

  describe("updatePreferences", () => {
    it("updates a single field, preserving others", () => {
      useStore.getState().updatePreferences({ browserSaveEnabled: false });

      expect(useStore.getState().userPreferences).toEqual({
        browserSaveEnabled: false,
        maximumHistorySize: DEFAULT_PREFERENCES.maximumHistorySize,
      });
    });

    it("updates multiple fields at once", () => {
      useStore.getState().updatePreferences({
        browserSaveEnabled: false,
        maximumHistorySize: 7,
      });

      expect(useStore.getState().userPreferences).toEqual({
        browserSaveEnabled: false,
        maximumHistorySize: 7,
      });
    });

    it("does not change history.past or history.future", () => {
      useStore.getState().setFilingStatus("married_filing_jointly");
      useStore.getState().undo();
      const historyBefore = useStore.getState().history;

      useStore.getState().updatePreferences({ browserSaveEnabled: false });

      expect(useStore.getState().history).toEqual(historyBefore);
    });

    it("does not change applicationState or workbook", () => {
      useStore.getState().addFormInstance(TEST_CLASS);
      const applicationStateBefore = useStore.getState().applicationState;
      const workbookBefore = useStore.getState().workbook;

      useStore.getState().updatePreferences({ maximumHistorySize: 7 });

      expect(useStore.getState().applicationState).toBe(applicationStateBefore);
      expect(useStore.getState().workbook).toBe(workbookBefore);
    });
  });

  describe("undo", () => {
    it("restores the prior applicationState", () => {
      const before = useStore.getState().applicationState;
      useStore.getState().setFilingStatus("married_filing_jointly");

      useStore.getState().undo();

      expect(useStore.getState().applicationState).toEqual(before);
    });

    it("moves the current applicationState onto history.future", () => {
      useStore.getState().setFilingStatus("married_filing_jointly");
      const beforeUndo = useStore.getState().applicationState;

      useStore.getState().undo();

      expect(useStore.getState().history.future).toEqual([beforeUndo]);
    });

    it("recomputes the workbook to match the restored state", () => {
      const id = useStore.getState().addFormInstance(TEST_CLASS);
      useStore.getState().setFilingStatus("married_filing_jointly");
      expect(useStore.getState().workbook[id][FILING_STATUS_BOX].value).toEqual(
        200,
      );

      useStore.getState().undo();

      expect(useStore.getState().workbook[id][FILING_STATUS_BOX].value).toEqual(
        100,
      );
    });

    it("is a no-op when history.past is empty", () => {
      const stateBefore = useStore.getState();

      useStore.getState().undo();

      expect(useStore.getState().applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(useStore.getState().history).toBe(stateBefore.history);
      expect(useStore.getState().workbook).toBe(stateBefore.workbook);
    });

    it("walks back through multiple history entries on sequential calls", () => {
      const initial = useStore.getState().applicationState;
      useStore.getState().setFilingStatus("married_filing_jointly");
      const afterFirst = useStore.getState().applicationState;
      useStore.getState().setFilingStatus("head_of_household");

      useStore.getState().undo();
      expect(useStore.getState().applicationState).toEqual(afterFirst);

      useStore.getState().undo();
      expect(useStore.getState().applicationState).toEqual(initial);
    });
  });

  describe("redo", () => {
    it("restores the next applicationState from history.future", () => {
      useStore.getState().setFilingStatus("married_filing_jointly");
      const afterFirst = useStore.getState().applicationState;
      useStore.getState().undo();

      useStore.getState().redo();

      expect(useStore.getState().applicationState).toEqual(afterFirst);
    });

    it("moves the current applicationState onto history.past", () => {
      useStore.getState().setFilingStatus("married_filing_jointly");
      useStore.getState().undo();
      const beforeRedo = useStore.getState().applicationState;

      useStore.getState().redo();

      const past = useStore.getState().history.past;
      expect(past[past.length - 1]).toEqual(beforeRedo);
    });

    it("recomputes the workbook to match the restored state", () => {
      const id = useStore.getState().addFormInstance(TEST_CLASS);
      useStore.getState().setFilingStatus("married_filing_jointly");
      useStore.getState().undo();
      expect(useStore.getState().workbook[id][FILING_STATUS_BOX].value).toEqual(
        100,
      );

      useStore.getState().redo();

      expect(useStore.getState().workbook[id][FILING_STATUS_BOX].value).toEqual(
        200,
      );
    });

    it("is a no-op when history.future is empty", () => {
      useStore.getState().setFilingStatus("married_filing_jointly");
      const stateBefore = useStore.getState();
      expect(stateBefore.history.future).toEqual([]);

      useStore.getState().redo();

      expect(useStore.getState().applicationState).toBe(
        stateBefore.applicationState,
      );
      expect(useStore.getState().history).toBe(stateBefore.history);
      expect(useStore.getState().workbook).toBe(stateBefore.workbook);
    });
  });

  describe("history size", () => {
    it("truncates history.past from the front when maximumHistorySize is exceeded", () => {
      useStore
        .getState()
        .initialize(
          DEFAULT_APPLICATION_STATE,
          DEFAULT_UI_STATE,
          { ...DEFAULT_PREFERENCES, maximumHistorySize: 2 },
          makeTestRegistry(),
        );

      useStore.getState().setFilingStatus("married_filing_jointly");
      const afterFirst = useStore.getState().applicationState;
      useStore.getState().setFilingStatus("head_of_household");
      const afterSecond = useStore.getState().applicationState;
      useStore.getState().setFilingStatus("qualifying_surviving_spouse");

      const past = useStore.getState().history.past;
      expect(past).toHaveLength(2);
      expect(past[0]).toEqual(afterFirst);
      expect(past[1]).toEqual(afterSecond);
    });
  });
});
