import { describe, expect, it } from "vitest";

import {
  CURRENT_SCHEMA_VERSION,
  CURRENT_TAX_YEAR,
} from "#src/persistence/config";
import { deserializePersistedState } from "#src/persistence/deserializePersistedState";
import { serialize } from "#src/persistence/serialize";
import { DEFAULT_APPLICATION_STATE } from "#src/state/defaults";

import type { ApplicationState } from "#src/state/types/applicationState";

describe("deserializePersistedState", () => {
  describe("top-level shape", () => {
    it("returns defaults plus invalid_value when given a non-object", () => {
      const { applicationState, errors } = deserializePersistedState(42);
      expect(applicationState).toEqual(DEFAULT_APPLICATION_STATE);
      expect(errors).toContainEqual({
        type: "invalid_value",
        path: "",
        reason: "expected object",
      });
    });

    it("returns defaults plus invalid_value when given null", () => {
      const { applicationState, errors } = deserializePersistedState(null);
      expect(applicationState).toEqual(DEFAULT_APPLICATION_STATE);
      expect(errors).toContainEqual({
        type: "invalid_value",
        path: "",
        reason: "expected object",
      });
    });

    it("round-trips serialize -> deserialize with no errors", () => {
      const original: ApplicationState = {
        filingStatus: "married_filing_jointly",
        formClasses: ["fW2"],
        formInstances: {
          fW2: [
            {
              id: "abc",
              class: "fW2",
              label: "Acme Corp",
              inputs: {
                box1: { type: "number", value: 5000 },
              },
            },
          ],
        },
      };
      const persisted = serialize(original);
      const { applicationState, errors } = deserializePersistedState(persisted);
      expect(applicationState).toEqual(original);
      expect(errors).toEqual([]);
    });
  });

  describe("schemaVersion", () => {
    it("emits schema_version_newer when saved version is greater than current", () => {
      const { errors } = deserializePersistedState({
        applicationState: DEFAULT_APPLICATION_STATE,
        schemaVersion: CURRENT_SCHEMA_VERSION + 1,
        taxYear: CURRENT_TAX_YEAR,
      });
      expect(errors).toContainEqual({
        type: "schema_version_newer",
        saved: CURRENT_SCHEMA_VERSION + 1,
        current: CURRENT_SCHEMA_VERSION,
      });
    });

    it("silently treats a missing schemaVersion as version 0", () => {
      const { errors } = deserializePersistedState({
        applicationState: DEFAULT_APPLICATION_STATE,
        taxYear: CURRENT_TAX_YEAR,
      });
      expect(errors).not.toContainEqual(
        expect.objectContaining({ type: "schema_version_newer" }),
      );
      expect(errors).not.toContainEqual(
        expect.objectContaining({ path: "schemaVersion" }),
      );
    });
  });

  describe("taxYear", () => {
    it("emits tax_year_mismatch when saved tax year differs", () => {
      const { errors } = deserializePersistedState({
        applicationState: DEFAULT_APPLICATION_STATE,
        schemaVersion: CURRENT_SCHEMA_VERSION,
        taxYear: CURRENT_TAX_YEAR - 1,
      });
      expect(errors).toContainEqual({
        type: "tax_year_mismatch",
        saved: CURRENT_TAX_YEAR - 1,
        current: CURRENT_TAX_YEAR,
      });
    });

    it("emits tax_year_mismatch when taxYear is absent", () => {
      const { errors } = deserializePersistedState({
        applicationState: DEFAULT_APPLICATION_STATE,
        schemaVersion: CURRENT_SCHEMA_VERSION,
      });
      expect(errors).toContainEqual(
        expect.objectContaining({ type: "tax_year_mismatch" }),
      );
    });
  });

  describe("filingStatus", () => {
    it("defaults to single with invalid_value when filingStatus is unknown", () => {
      const { applicationState, errors } = deserializePersistedState({
        applicationState: {
          filingStatus: "nonsense",
          formClasses: [],
          formInstances: {},
        },
        schemaVersion: CURRENT_SCHEMA_VERSION,
        taxYear: CURRENT_TAX_YEAR,
      });
      expect(applicationState.filingStatus).toBe("single");
      expect(errors).toContainEqual({
        type: "invalid_value",
        path: "applicationState.filingStatus",
        reason: "unknown filing status",
      });
    });
  });

  describe("formInstances", () => {
    it("drops form instances whose key is an unknown FormClass", () => {
      const { applicationState, errors } = deserializePersistedState({
        applicationState: {
          filingStatus: "single",
          formClasses: [],
          formInstances: {
            mysteryForm: [
              { id: "x", class: "mysteryForm", label: "?", inputs: {} },
            ],
          },
        },
        schemaVersion: CURRENT_SCHEMA_VERSION,
        taxYear: CURRENT_TAX_YEAR,
      });
      expect(applicationState.formInstances).toEqual({});
      expect(errors).toContainEqual({
        type: "invalid_value",
        path: "applicationState.formInstances.mysteryForm",
        reason: "unknown form class",
      });
    });

    it("defaults label to 'Untitled form' when missing, with invalid_value", () => {
      const { applicationState, errors } = deserializePersistedState({
        applicationState: {
          filingStatus: "single",
          formClasses: ["fW2"],
          formInstances: {
            fW2: [{ id: "x", class: "fW2", inputs: {} }],
          },
        },
        schemaVersion: CURRENT_SCHEMA_VERSION,
        taxYear: CURRENT_TAX_YEAR,
      });
      expect(applicationState.formInstances.fW2?.[0].label).toBe(
        "Untitled form",
      );
      expect(errors).toContainEqual({
        type: "invalid_value",
        path: "applicationState.formInstances.fW2[0].label",
        reason: "expected string",
      });
    });

    it("mints a new id when id is missing, with invalid_value", () => {
      const { applicationState, errors } = deserializePersistedState({
        applicationState: {
          filingStatus: "single",
          formClasses: ["fW2"],
          formInstances: {
            fW2: [{ class: "fW2", label: "L", inputs: {} }],
          },
        },
        schemaVersion: CURRENT_SCHEMA_VERSION,
        taxYear: CURRENT_TAX_YEAR,
      });
      const instance = applicationState.formInstances.fW2?.[0];
      expect(typeof instance?.id).toBe("string");
      expect(instance?.id.length).toBeGreaterThan(0);
      expect(errors).toContainEqual({
        type: "invalid_value",
        path: "applicationState.formInstances.fW2[0].id",
        reason: "expected string",
      });
    });

    it("coerces a wrong instance.class field to the parent key with invalid_value", () => {
      const { applicationState, errors } = deserializePersistedState({
        applicationState: {
          filingStatus: "single",
          formClasses: ["fW2"],
          formInstances: {
            fW2: [{ id: "x", class: "f1040", label: "L", inputs: {} }],
          },
        },
        schemaVersion: CURRENT_SCHEMA_VERSION,
        taxYear: CURRENT_TAX_YEAR,
      });
      expect(applicationState.formInstances.fW2?.[0].class).toBe("fW2");
      expect(errors).toContainEqual({
        type: "invalid_value",
        path: "applicationState.formInstances.fW2[0].class",
        reason: "class does not match parent key",
      });
    });

    it("drops malformed UserInput entries with invalid_value", () => {
      const { applicationState, errors } = deserializePersistedState({
        applicationState: {
          filingStatus: "single",
          formClasses: ["fW2"],
          formInstances: {
            fW2: [
              {
                id: "x",
                class: "fW2",
                label: "L",
                inputs: {
                  good: { type: "number", value: 42 },
                  badType: { type: "garbage" },
                  badValue: { type: "number", value: "not a number" },
                },
              },
            ],
          },
        },
        schemaVersion: CURRENT_SCHEMA_VERSION,
        taxYear: CURRENT_TAX_YEAR,
      });
      const inputs = applicationState.formInstances.fW2?.[0].inputs;
      expect(inputs).toEqual({ good: { type: "number", value: 42 } });
      expect(errors).toContainEqual({
        type: "invalid_value",
        path: "applicationState.formInstances.fW2[0].inputs.badType",
        reason: "unknown input type",
      });
      expect(errors).toContainEqual({
        type: "invalid_value",
        path: "applicationState.formInstances.fW2[0].inputs.badValue",
        reason: "expected number value",
      });
    });

    it("accepts amount_list inputs and drops malformed entries within", () => {
      const { applicationState, errors } = deserializePersistedState({
        applicationState: {
          filingStatus: "single",
          formClasses: ["fW2"],
          formInstances: {
            fW2: [
              {
                id: "x",
                class: "fW2",
                label: "L",
                inputs: {
                  list: {
                    type: "amount_list",
                    value: [
                      { label: "A", amount: 1 },
                      { label: "B", amount: "bad" },
                    ],
                  },
                },
              },
            ],
          },
        },
        schemaVersion: CURRENT_SCHEMA_VERSION,
        taxYear: CURRENT_TAX_YEAR,
      });
      const inputs = applicationState.formInstances.fW2?.[0].inputs;
      expect(inputs?.list).toEqual({
        type: "amount_list",
        value: [{ label: "A", amount: 1 }],
      });
      expect(errors).toContainEqual({
        type: "invalid_value",
        path: "applicationState.formInstances.fW2[0].inputs.list.value[1]",
        reason: "expected { label: string, amount: number }",
      });
    });

    it("accepts selection inputs", () => {
      const { applicationState, errors } = deserializePersistedState({
        applicationState: {
          filingStatus: "single",
          formClasses: ["fW2"],
          formInstances: {
            fW2: [
              {
                id: "x",
                class: "fW2",
                label: "L",
                inputs: {
                  sel: { type: "selection", selectedIndex: 2 },
                },
              },
            ],
          },
        },
        schemaVersion: CURRENT_SCHEMA_VERSION,
        taxYear: CURRENT_TAX_YEAR,
      });
      expect(applicationState.formInstances.fW2?.[0].inputs.sel).toEqual({
        type: "selection",
        selectedIndex: 2,
      });
      expect(errors).toEqual([]);
    });

    it("accepts override inputs with a number or null override", () => {
      const { applicationState, errors } = deserializePersistedState({
        applicationState: {
          filingStatus: "single",
          formClasses: ["fW2"],
          formInstances: {
            fW2: [
              {
                id: "x",
                class: "fW2",
                label: "L",
                inputs: {
                  set: { type: "override", override: 100 },
                  unset: { type: "override", override: null },
                },
              },
            ],
          },
        },
        schemaVersion: CURRENT_SCHEMA_VERSION,
        taxYear: CURRENT_TAX_YEAR,
      });
      const inputs = applicationState.formInstances.fW2?.[0].inputs;
      expect(inputs).toEqual({
        set: { type: "override", override: 100 },
        unset: { type: "override", override: null },
      });
      expect(errors).toEqual([]);
    });

    it("drops override inputs whose override is neither a number nor null", () => {
      const { applicationState, errors } = deserializePersistedState({
        applicationState: {
          filingStatus: "single",
          formClasses: ["fW2"],
          formInstances: {
            fW2: [
              {
                id: "x",
                class: "fW2",
                label: "L",
                inputs: {
                  bad: { type: "override", override: "not a number" },
                },
              },
            ],
          },
        },
        schemaVersion: CURRENT_SCHEMA_VERSION,
        taxYear: CURRENT_TAX_YEAR,
      });
      const inputs = applicationState.formInstances.fW2?.[0].inputs;
      expect(inputs).toEqual({});
      expect(errors).toContainEqual({
        type: "invalid_value",
        path: "applicationState.formInstances.fW2[0].inputs.bad",
        reason: "expected number or null override",
      });
    });

    it("accepts instance_box_selections inputs and drops malformed entries within", () => {
      const { applicationState, errors } = deserializePersistedState({
        applicationState: {
          filingStatus: "single",
          formClasses: ["fW2"],
          formInstances: {
            fW2: [
              {
                id: "x",
                class: "fW2",
                label: "L",
                inputs: {
                  picks: {
                    type: "instance_box_selections",
                    selected: [
                      { instance: "abc", box: "box1" },
                      { instance: "abc", box: 5 },
                    ],
                  },
                },
              },
            ],
          },
        },
        schemaVersion: CURRENT_SCHEMA_VERSION,
        taxYear: CURRENT_TAX_YEAR,
      });
      const inputs = applicationState.formInstances.fW2?.[0].inputs;
      expect(inputs?.picks).toEqual({
        type: "instance_box_selections",
        selected: [{ instance: "abc", box: "box1" }],
      });
      expect(errors).toContainEqual({
        type: "invalid_value",
        path: "applicationState.formInstances.fW2[0].inputs.picks.selected[1]",
        reason: "expected { instance: string, box: string }",
      });
    });
  });

  describe("formClasses reconciliation", () => {
    it("rebuilds formClasses from formInstances when they don't match, emitting invalid_value", () => {
      const { applicationState, errors } = deserializePersistedState({
        applicationState: {
          filingStatus: "single",
          formClasses: ["f1040"], // present but instances are under fW2 instead
          formInstances: {
            fW2: [{ id: "x", class: "fW2", label: "L", inputs: {} }],
          },
        },
        schemaVersion: CURRENT_SCHEMA_VERSION,
        taxYear: CURRENT_TAX_YEAR,
      });
      expect(applicationState.formClasses).toEqual(["fW2"]);
      expect(errors).toContainEqual({
        type: "invalid_value",
        path: "applicationState.formClasses",
        reason: "reconciled from formInstances",
      });
    });

    it("preserves the raw formClasses order where it matches present instances", () => {
      const { applicationState } = deserializePersistedState({
        applicationState: {
          filingStatus: "single",
          formClasses: ["f1040", "fW2"],
          formInstances: {
            f1040: [{ id: "a", class: "f1040", label: "L", inputs: {} }],
            fW2: [{ id: "b", class: "fW2", label: "L", inputs: {} }],
          },
        },
        schemaVersion: CURRENT_SCHEMA_VERSION,
        taxYear: CURRENT_TAX_YEAR,
      });
      expect(applicationState.formClasses).toEqual(["f1040", "fW2"]);
    });

    it("appends classes that exist in formInstances but are missing from formClasses", () => {
      const { applicationState } = deserializePersistedState({
        applicationState: {
          filingStatus: "single",
          formClasses: ["f1040"],
          formInstances: {
            f1040: [{ id: "a", class: "f1040", label: "L", inputs: {} }],
            fW2: [{ id: "b", class: "fW2", label: "L", inputs: {} }],
          },
        },
        schemaVersion: CURRENT_SCHEMA_VERSION,
        taxYear: CURRENT_TAX_YEAR,
      });
      expect(applicationState.formClasses).toEqual(["f1040", "fW2"]);
    });
  });

  describe("unknown_field warnings", () => {
    it("emits unknown_field for extra top-level keys", () => {
      const { errors } = deserializePersistedState({
        applicationState: DEFAULT_APPLICATION_STATE,
        schemaVersion: CURRENT_SCHEMA_VERSION,
        taxYear: CURRENT_TAX_YEAR,
        somethingNew: 1,
      });
      expect(errors).toContainEqual({
        type: "unknown_field",
        path: "somethingNew",
      });
    });

    it("emits unknown_field for extra applicationState keys", () => {
      const { errors } = deserializePersistedState({
        applicationState: { ...DEFAULT_APPLICATION_STATE, extra: 1 },
        schemaVersion: CURRENT_SCHEMA_VERSION,
        taxYear: CURRENT_TAX_YEAR,
      });
      expect(errors).toContainEqual({
        type: "unknown_field",
        path: "applicationState.extra",
      });
    });
  });
});
