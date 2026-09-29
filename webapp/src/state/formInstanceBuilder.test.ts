import { describe, expect, it } from "vitest";

import { FormInstanceBuilder } from "#src/state/formInstanceBuilder";

describe("FormInstanceBuilder", () => {
  it("builds a form instance with the given class and label", () => {
    const instance = new FormInstanceBuilder(
      2025,
      "f1040",
      "Test Label",
    ).build();

    expect(instance).toEqual({
      id: expect.any(String),
      class: "f1040",
      label: "Test Label",
      inputs: {},
    });
  });

  it("builds a form instance with a unique id each time", () => {
    const first = new FormInstanceBuilder(2025, "f1040", "").build();
    const second = new FormInstanceBuilder(2026, "f1040", "").build();

    expect(first.id).not.toEqual(second.id);
  });

  it("sets an amount list input", () => {
    const instance = new FormInstanceBuilder(2025, "fW2", "Test Label")
      .setAmountListInput("other_amount", [
        { label: "Test amount", amount: 312.5 },
      ])
      .build();

    expect(instance.inputs).toEqual({
      other_amount: {
        type: "amount_list",
        value: [{ label: "Test amount", amount: 312.5 }],
      },
    });
  });

  it("sets an instance box selections input", () => {
    const instance = new FormInstanceBuilder(2025, "f1040", "Test Label")
      .setInstanceBoxSelectionsInput("ira_distributions", [
        { instance: "form-instance-1", box: "1" },
      ])
      .build();

    expect(instance.inputs).toEqual({
      ira_distributions: {
        type: "instance_box_selections",
        selected: [{ instance: "form-instance-1", box: "1" }],
      },
    });
  });

  it("sets a number input", () => {
    const instance = new FormInstanceBuilder(2025, "fW2", "Test Label")
      .setNumberInput("compensation", 50000)
      .build();

    expect(instance.inputs).toEqual({
      compensation: { type: "number", value: 50000 },
    });
  });

  it("sets an override input", () => {
    const instance = new FormInstanceBuilder(2025, "f1099INT", "Test Label")
      .setOverrideInput("interest_income", 125.75)
      .build();

    expect(instance.inputs).toEqual({
      interest_income: { type: "override", override: 125.75 },
    });
  });

  it("clears an override input with null", () => {
    const instance = new FormInstanceBuilder(2025, "f1099INT", "Test Label")
      .setOverrideInput("interest_income", null)
      .build();

    expect(instance.inputs).toEqual({
      interest_income: { type: "override", override: null },
    });
  });

  it("sets a selection input", () => {
    const instance = new FormInstanceBuilder(2026, "f1099INT", "Test Label")
      .setSelectionInput("interest_income", "treasury_bonds")
      .build();

    expect(instance.inputs).toEqual({
      interest_income: { type: "selection", selectedKey: "treasury_bonds" },
    });
  });

  it("chains multiple input setters together", () => {
    const instance = new FormInstanceBuilder(2026, "fW2", "Test Label")
      .setNumberInput("compensation", 50000)
      .setAmountListInput("other_amount", [
        { label: "Test amount", amount: 312.5 },
      ])
      .build();

    expect(instance.inputs).toEqual({
      compensation: { type: "number", value: 50000 },
      other_amount: {
        type: "amount_list",
        value: [{ label: "Test amount", amount: 312.5 }],
      },
    });
  });

  it("overwrites a previously set input for the same key", () => {
    const instance = new FormInstanceBuilder(2025, "fW2", "Test Label")
      .setNumberInput("compensation", 50000)
      .setNumberInput("compensation", 60000)
      .build();

    expect(instance.inputs).toEqual({
      compensation: { type: "number", value: 60000 },
    });
  });
});
