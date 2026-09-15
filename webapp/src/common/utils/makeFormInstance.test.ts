import { describe, expect, expectTypeOf, it } from "vitest";

import {
  type FormInputs,
  makeFormInstance,
} from "#src/common/utils/makeFormInstance";

describe("makeFormInstance", () => {
  it("returns a form instance with the given fields", () => {
    const instance = makeFormInstance("fW2", "w2-1", "Acme Corp", {
      "1": { type: "number", value: 50000 },
      "14a": {
        type: "amount_list",
        value: [{ label: "State disability insurance", amount: 312.5 }],
      },
    });

    expect(instance).toEqual({
      id: "w2-1",
      class: "fW2",
      label: "Acme Corp",
      inputs: {
        "1": { type: "number", value: 50000 },
        "14a": {
          type: "amount_list",
          value: [{ label: "State disability insurance", amount: 312.5 }],
        },
      },
    });
  });

  it("returns a form instance without inputs", () => {
    expect(makeFormInstance("f1040", "f-1", "", {})).toEqual({
      id: "f-1",
      class: "f1040",
      label: "",
      inputs: {},
    });
  });

  it("takes inputs typed for the chosen form class", () => {
    expectTypeOf(makeFormInstance<"f1099INT">)
      .parameter(3)
      .toEqualTypeOf<FormInputs<"f1099INT">>();
  });
});

describe("FormInputs", () => {
  it("accepts input keys of the form class", () => {
    expectTypeOf<"1">().toExtend<keyof FormInputs<"fW2">>();
    expectTypeOf<"14a">().toExtend<keyof FormInputs<"fW2">>();
    expectTypeOf<"1b">().toExtend<keyof FormInputs<"f1040">>();
  });

  it("rejects unknown keys", () => {
    expectTypeOf<"999">().not.toExtend<keyof FormInputs<"fW2">>();
    expectTypeOf<string>().not.toExtend<keyof FormInputs<"fW2">>();
  });

  it("rejects keys of computed boxes", () => {
    expectTypeOf<"9">().not.toExtend<keyof FormInputs<"f1040">>();
    expectTypeOf<"11b">().not.toExtend<keyof FormInputs<"f1040">>();
  });

  it("rejects input keys that only exist on another form class", () => {
    expectTypeOf<"14a">().not.toExtend<keyof FormInputs<"f1040">>();
  });

  it("makes every input optional", () => {
    expectTypeOf({}).toExtend<FormInputs<"fW2">>();
  });
});
