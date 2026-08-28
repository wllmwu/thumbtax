import type { NumberSign } from "./numberSign";
import type { RoundingDirection } from "./roundingDirection";
import type { BoxIdentifier, FilingStatus, FormClass } from "@thumbtax/common";

type ArithmeticValueProvider =
  | { type: "absolute_value"; value: ComputedValueProvider }
  | {
      type: "difference";
      minuend: ComputedValueProvider;
      subtrahend: ComputedValueProvider;
    }
  | { type: "maximum"; values: Array<ComputedValueProvider> }
  | { type: "minimum"; values: Array<ComputedValueProvider> }
  | { type: "non_negative_clamp"; value: ComputedValueProvider }
  | { type: "non_positive_clamp"; value: ComputedValueProvider }
  | { type: "numerical_negation"; value: ComputedValueProvider }
  | { type: "product"; values: Array<ComputedValueProvider> }
  | {
      type: "quotient";
      dividend: ComputedValueProvider;
      divisor: ComputedValueProvider;
      round?: RoundingDirection;
    }
  | { type: "sum"; values: Array<ComputedValueProvider> };

type BooleanValueProvider =
  | {
      type: "comparison";
      value: ComputedValueProvider;
      minimum?: ComputedValueProvider;
      maximum?: ComputedValueProvider;
      strict?: boolean;
    }
  | { type: "conjunction"; values: Array<ComputedValueProvider> }
  | { type: "disjunction"; values: Array<ComputedValueProvider> }
  | { type: "logical_negation"; value: ComputedValueProvider };

type ConstantValueProvider = { type: "number_constant"; value: number };

type ControlFlowValueProvider =
  | {
      type: "conditional";
      condition: ComputedValueProvider;
      trueValue: ComputedValueProvider;
      falseValue: ComputedValueProvider;
    }
  | {
      type: "filing_status_map";
      values: Partial<Record<FilingStatus, ComputedValueProvider>>;
      default?: ComputedValueProvider;
    }
  | {
      type: "piecewise_function";
      input: ComputedValueProvider;
      pieces: Array<{
        inputUpperBound: ComputedValueProvider;
        output: ComputedValueProvider;
      }>;
      lastOutput: ComputedValueProvider;
    };

type ReferenceValueProvider =
  | {
      type: "box_reference";
      form?: FormClass;
      box: BoxIdentifier;
      required?: boolean;
    }
  | { type: "form_instance_count"; form: FormClass };

type UnusedValueProvider = { type: "unused" } | { type: "unsupported" };

export type ComputedValueProvider =
  | ArithmeticValueProvider
  | BooleanValueProvider
  | ConstantValueProvider
  | ControlFlowValueProvider
  | ReferenceValueProvider
  | UnusedValueProvider;

type UserInputValueProvider =
  | { type: "checkbox_input" }
  | { type: "list_amounts_input" }
  | {
      type: "number_input";
      coerceSign?: NumberSign;
      skipCondition?: ComputedValueProvider;
    }
  | {
      type: "override_number_input";
      computedValue: ComputedValueProvider;
      coerceSign?: NumberSign;
    }
  | {
      type: "select_instance_boxes_input";
      options: Array<{ form: FormClass; box: BoxIdentifier }>;
    }
  | {
      type: "select_value_input";
      options: Array<{
        key: string;
        label: string;
        value: ComputedValueProvider;
      }>;
    };

export type ValueProvider = ComputedValueProvider | UserInputValueProvider;
