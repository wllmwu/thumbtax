import { describe, expect, it } from "vitest";

import { FormInstanceBuilder } from "#src/state/formInstanceBuilder";

describe("FormInstanceBuilder", () => {
  it("builds a form instance with the given class and label", () => {
    const instance = new FormInstanceBuilder("f1040", "Test Label").build();

    expect(instance).toEqual({
      id: expect.any(String),
      class: "f1040",
      label: "Test Label",
      inputs: {},
    });
  });

  it("builds a form instance with a unique id each time", () => {
    const first = new FormInstanceBuilder("f1040", "").build();
    const second = new FormInstanceBuilder("f1040", "").build();

    expect(first.id).not.toEqual(second.id);
  });

  it("sets an amount list input", () => {
    const instance = new FormInstanceBuilder("fW2", "Test Label")
      .setAmountListInput("14a", [{ label: "Test amount", amount: 312.5 }])
      .build();

    expect(instance.inputs).toEqual({
      "14a": {
        type: "amount_list",
        value: [{ label: "Test amount", amount: 312.5 }],
      },
    });
  });

  it("sets an instance box selections input", () => {
    const instance = new FormInstanceBuilder("f1040", "Test Label")
      .setInstanceBoxSelectionsInput("4a", [
        { instance: "form-instance-1", box: "1" },
      ])
      .build();

    expect(instance.inputs).toEqual({
      "4a": {
        type: "instance_box_selections",
        selected: [{ instance: "form-instance-1", box: "1" }],
      },
    });
  });

  it("sets a number input", () => {
    const instance = new FormInstanceBuilder("fW2", "Test Label")
      .setNumberInput("1", 50000)
      .build();

    expect(instance.inputs).toEqual({
      "1": { type: "number", value: 50000 },
    });
  });

  it("sets an override input", () => {
    const instance = new FormInstanceBuilder("f1099INT", "Test Label")
      .setOverrideInput("1", 125.75)
      .build();

    expect(instance.inputs).toEqual({
      "1": { type: "override", override: 125.75 },
    });
  });

  it("clears an override input with null", () => {
    const instance = new FormInstanceBuilder("f1099INT", "Test Label")
      .setOverrideInput("1", null)
      .build();

    expect(instance.inputs).toEqual({
      "1": { type: "override", override: null },
    });
  });

  it("sets a selection input", () => {
    const instance = new FormInstanceBuilder("f1099INT", "Test Label")
      .setSelectionInput("3", "treasury_bonds")
      .build();

    expect(instance.inputs).toEqual({
      "3": { type: "selection", selectedKey: "treasury_bonds" },
    });
  });

  it("chains multiple input setters together", () => {
    const instance = new FormInstanceBuilder("fW2", "Test Label")
      .setNumberInput("1", 50000)
      .setAmountListInput("14a", [{ label: "Test amount", amount: 312.5 }])
      .build();

    expect(instance.inputs).toEqual({
      "1": { type: "number", value: 50000 },
      "14a": {
        type: "amount_list",
        value: [{ label: "Test amount", amount: 312.5 }],
      },
    });
  });

  it("overwrites a previously set input for the same key", () => {
    const instance = new FormInstanceBuilder("fW2", "Test Label")
      .setNumberInput("1", 50000)
      .setNumberInput("1", 60000)
      .build();

    expect(instance.inputs).toEqual({
      "1": { type: "number", value: 60000 },
    });
  });
});
