import { describe, expect, expectTypeOf, it } from "vitest";

import { makeFormInstance } from "#src/state/makeFormInstance";

import type { FormInputs } from "#src/state/makeFormInstance";

describe("makeFormInstance", () => {
  it("returns a form instance with the given fields", () => {
    const instance = makeFormInstance("fW2", "Test Label", {
      "1": { type: "number", value: 50000 },
      "14a": {
        type: "amount_list",
        value: [{ label: "Test amount", amount: 312.5 }],
      },
    });

    expect(instance).toEqual({
      id: expect.any(String),
      class: "fW2",
      label: "Test Label",
      inputs: {
        "1": { type: "number", value: 50000 },
        "14a": {
          type: "amount_list",
          value: [{ label: "Test amount", amount: 312.5 }],
        },
      },
    });
  });

  it("returns a form instance without inputs", () => {
    expect(makeFormInstance("f1040", "", {})).toEqual({
      id: expect.any(String),
      class: "f1040",
      label: "",
      inputs: {},
    });
  });

  it("returns a form instance with a unique id each time", () => {
    const first = makeFormInstance("f1040", "", {});
    const second = makeFormInstance("f1040", "", {});
    expect(first.id).not.toEqual(second.id);
  });

  it("takes inputs typed for the chosen form class", () => {
    expectTypeOf(makeFormInstance<"f1099INT">)
      .parameter(2)
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
