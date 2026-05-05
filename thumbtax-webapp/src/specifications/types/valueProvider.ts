import type { BoxIdentifier } from "#src/common/types/boxIdentifier";
import type { FilingStatus } from "#src/common/types/filingStatus";
import type { FormClass } from "#src/common/types/formClass";

type ConstantValueProvider = { type: "number_constant"; value: number };

type UserInputValueProvider =
  | { type: "number_input" }
  | { type: "list_amounts_input" }
  | { type: "checkbox_input" }
  | {
      type: "selection_input";
      options: Array<{ label: string; value: ValueProvider }>;
    };

type ReferenceValueProvider =
  | { type: "box_reference"; form?: FormClass; box: BoxIdentifier }
  | { type: "form_instance_count"; form: FormClass };

type ArithmeticValueProvider =
  | { type: "sum"; values: Array<ValueProvider> }
  | { type: "difference"; minuend: ValueProvider; subtrahend: ValueProvider }
  | { type: "product"; values: Array<ValueProvider> }
  | { type: "quotient"; dividend: ValueProvider; divisor: ValueProvider }
  | { type: "minimum"; values: Array<ValueProvider> }
  | { type: "maximum"; values: Array<ValueProvider> }
  | { type: "absolute_value"; value: ValueProvider }
  | { type: "non_negative"; value: ValueProvider }
  | { type: "numerical_negation"; value: ValueProvider };

type ControlFlowValueProvider =
  | {
      type: "conditional";
      condition: ValueProvider;
      trueValue: ValueProvider;
      falseValue: ValueProvider;
    }
  | {
      type: "comparison";
      value: ValueProvider;
      minimum?: ValueProvider;
      maximum?: ValueProvider;
      strict?: boolean;
    }
  | { type: "logical_negation"; value: ValueProvider }
  | {
      type: "filing_status_map";
      values: Partial<Record<FilingStatus, ValueProvider>>;
      default?: ValueProvider;
    };

type SkippedValueProvider = { type: "unused" } | { type: "unsupported" };

export type ValueProvider =
  | ConstantValueProvider
  | UserInputValueProvider
  | ReferenceValueProvider
  | ArithmeticValueProvider
  | ControlFlowValueProvider
  | SkippedValueProvider;
