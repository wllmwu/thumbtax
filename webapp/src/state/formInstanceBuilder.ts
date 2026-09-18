import { v4 as uuidv4 } from "uuid";

import { EPOCH_DATE } from "#src/common/epochDate";

import type { FormClass } from "@thumbtax/common";
import type { InputKeyOf, specifications } from "@thumbtax/forms";
import type { FormInstance } from "#src/common/types/formInstance";
import type { UserInput } from "#src/common/types/userInput";
import type { Temporal } from "temporal-polyfill";

export class FormInstanceBuilder<Class extends FormClass> {
  private form: FormInstance;

  constructor(formClass: Class, label: string) {
    this.form = { class: formClass, id: uuidv4(), inputs: {}, label };
  }

  public build(): FormInstance {
    return this.form;
  }

  public setAmountListInput(
    key: InputKeyOf<(typeof specifications)[Class]>,
    value: Extract<UserInput, { type: "amount_list" }>["value"],
  ): FormInstanceBuilder<Class> {
    this.form.inputs[key] = { type: "amount_list", value };
    return this;
  }

  public setInstanceBoxSelectionsInput(
    key: InputKeyOf<(typeof specifications)[Class]>,
    selected: Extract<
      UserInput,
      { type: "instance_box_selections" }
    >["selected"],
  ): FormInstanceBuilder<Class> {
    this.form.inputs[key] = { type: "instance_box_selections", selected };
    return this;
  }

  public setNumberInput(
    key: InputKeyOf<(typeof specifications)[Class]>,
    value: Extract<UserInput, { type: "number" }>["value"],
  ): FormInstanceBuilder<Class> {
    this.form.inputs[key] = { type: "number", value };
    return this;
  }

  public setNumberInputFromDate(
    key: InputKeyOf<(typeof specifications)[Class]>,
    date: Temporal.PlainDate,
  ): FormInstanceBuilder<Class> {
    return this.setNumberInput(key, date.since(EPOCH_DATE).days);
  }

  public setOverrideInput(
    key: InputKeyOf<(typeof specifications)[Class]>,
    override: Extract<UserInput, { type: "override" }>["override"],
  ): FormInstanceBuilder<Class> {
    this.form.inputs[key] = { type: "override", override };
    return this;
  }

  public setSelectionInput(
    key: InputKeyOf<(typeof specifications)[Class]>,
    selectedKey: Extract<UserInput, { type: "selection" }>["selectedKey"],
  ): FormInstanceBuilder<Class> {
    this.form.inputs[key] = { type: "selection", selectedKey };
    return this;
  }
}
