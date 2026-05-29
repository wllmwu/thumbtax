import type { BoxIdentifier } from "#src/common/types/boxIdentifier";
import type { FilingStatus } from "#src/common/types/filingStatus";
import type { FormClass } from "#src/common/types/formClass";

type ConstantValueProvider = { type: "number_constant"; value: number };

type ReferenceValueProvider =
  | { type: "box_reference"; form?: FormClass; box: BoxIdentifier }
  | { type: "form_instance_count"; form: FormClass };

type ArithmeticValueProvider =
  | { type: "sum"; values: Array<ComputedValueProvider> }
  | {
      type: "difference";
      minuend: ComputedValueProvider;
      subtrahend: ComputedValueProvider;
    }
  | { type: "product"; values: Array<ComputedValueProvider> }
  | {
      type: "quotient";
      dividend: ComputedValueProvider;
      divisor: ComputedValueProvider;
      round?: "down" | "up";
    }
  | { type: "minimum"; values: Array<ComputedValueProvider> }
  | { type: "maximum"; values: Array<ComputedValueProvider> }
  | { type: "absolute_value"; value: ComputedValueProvider }
  | { type: "non_negative_clamp"; value: ComputedValueProvider }
  | { type: "numerical_negation"; value: ComputedValueProvider };

type ControlFlowValueProvider =
  | {
      type: "conditional";
      condition: ComputedValueProvider;
      trueValue: ComputedValueProvider;
      falseValue: ComputedValueProvider;
    }
  | {
      type: "comparison";
      value: ComputedValueProvider;
      minimum?: ComputedValueProvider;
      maximum?: ComputedValueProvider;
      strict?: boolean;
    }
  | {
      type: "piecewise_function";
      input: ComputedValueProvider;
      pieces: Array<{
        inputUpperBound: ComputedValueProvider;
        output: ComputedValueProvider;
      }>;
      lastOutput: ComputedValueProvider;
    }
  | { type: "logical_negation"; value: ComputedValueProvider }
  | {
      type: "filing_status_map";
      values: Partial<Record<FilingStatus, ComputedValueProvider>>;
      default?: ComputedValueProvider;
    };

type SkippedValueProvider = { type: "unused" } | { type: "unsupported" };

export type ComputedValueProvider =
  | ConstantValueProvider
  | ReferenceValueProvider
  | ArithmeticValueProvider
  | ControlFlowValueProvider
  | SkippedValueProvider;

type UserInputValueProvider =
  | { type: "checkbox_input" }
  | { type: "list_amounts_input" }
  | { type: "number_input"; coerceSign?: "negative" | "positive" }
  | { type: "override_number_input"; computedValue: ComputedValueProvider }
  | {
      type: "select_value_input";
      options: Array<{ label: string; value: ComputedValueProvider }>;
    };

export type ValueProvider = ComputedValueProvider | UserInputValueProvider;
