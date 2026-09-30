import { v4 as uuidv4 } from "uuid";

import { EPOCH_DATE } from "#src/common/epochDate";

import type { FormClass, TaxYear } from "@thumbtax/common";
import type { InputKeyOf, specificationsByYear } from "@thumbtax/forms";
import type { FormInstance } from "#src/common/types/formInstance";
import type { UserInput } from "#src/common/types/userInput";
import type { Temporal } from "temporal-polyfill";

type InputKey<Year extends TaxYear, Class extends FormClass> = InputKeyOf<
  (typeof specificationsByYear)[Year][Class]
>;

export class FormInstanceBuilder<
  Year extends TaxYear,
  Class extends FormClass,
> {
  private form: FormInstance;

  constructor(_taxYear: Year, formClass: Class, label: string) {
    this.form = { class: formClass, id: uuidv4(), inputs: {}, label };
  }

  public build(): FormInstance {
    return this.form;
  }

  public setAmountListInput(
    key: InputKey<Year, Class>,
    value: Extract<UserInput, { type: "amount_list" }>["value"],
  ): FormInstanceBuilder<Year, Class> {
    this.form.inputs[key] = { type: "amount_list", value };
    return this;
  }

  public setInstanceBoxSelectionsInput(
    key: InputKey<Year, Class>,
    selected: Extract<
      UserInput,
      { type: "instance_box_selections" }
    >["selected"],
  ): FormInstanceBuilder<Year, Class> {
    this.form.inputs[key] = { type: "instance_box_selections", selected };
    return this;
  }

  public setNumberInput(
    key: InputKey<Year, Class>,
    value: Extract<UserInput, { type: "number" }>["value"],
  ): FormInstanceBuilder<Year, Class> {
    this.form.inputs[key] = { type: "number", value };
    return this;
  }

  public setNumberInputFromDate(
    key: InputKey<Year, Class>,
    date: Temporal.PlainDate,
  ): FormInstanceBuilder<Year, Class> {
    return this.setNumberInput(key, date.since(EPOCH_DATE).days);
  }

  public setOverrideInput(
    key: InputKey<Year, Class>,
    override: Extract<UserInput, { type: "override" }>["override"],
  ): FormInstanceBuilder<Year, Class> {
    this.form.inputs[key] = { type: "override", override };
    return this;
  }

  public setSelectionInput(
    key: InputKey<Year, Class>,
    selectedKey: Extract<UserInput, { type: "selection" }>["selectedKey"],
  ): FormInstanceBuilder<Year, Class> {
    this.form.inputs[key] = { type: "selection", selectedKey };
    return this;
  }
}
