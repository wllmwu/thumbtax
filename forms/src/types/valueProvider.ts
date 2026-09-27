import type { DateRangeUnit } from "./dateRangeUnit";
import type { NumberSign } from "./numberSign";
import type { RoundingDirection } from "./roundingDirection";
import type { BoxIdentifier, FilingStatus, FormClass } from "@thumbtax/common";

type ArithmeticValueProvider =
  | {
      /** Absolute value of `value` */
      type: "absolute_value";
      value: ComputedValueProvider;
    }
  | {
      /** Arithmetic subtraction: `minuend` minus `subtrahend` */
      type: "difference";
      minuend: ComputedValueProvider;
      subtrahend: ComputedValueProvider;
    }
  | {
      /** Max of `values` */
      type: "maximum";
      values: Array<ComputedValueProvider>;
    }
  | {
      /** Min of `values` */
      type: "minimum";
      values: Array<ComputedValueProvider>;
    }
  | {
      /** Clamps `value` to be at least 0 */
      type: "non_negative_clamp";
      value: ComputedValueProvider;
    }
  | {
      /** Clamps `value` to be at most 0 */
      type: "non_positive_clamp";
      value: ComputedValueProvider;
    }
  | {
      /** Negates `value` as a number */
      type: "numerical_negation";
      value: ComputedValueProvider;
    }
  | {
      /** Product of all `values` */
      type: "product";
      values: Array<ComputedValueProvider>;
    }
  | {
      /** Arithmetic division: `dividend` divided by `divisor` */
      type: "quotient";
      dividend: ComputedValueProvider;
      divisor: ComputedValueProvider;
    }
  | {
      /** Rounds `value` in given direction */
      type: "rounding";
      direction: RoundingDirection;
      value: ComputedValueProvider;
    }
  | {
      /** Sum of all `values` */
      type: "sum";
      values: Array<ComputedValueProvider>;
    };

type BooleanValueProvider =
  | {
      /** Evaluates to 1 if `value` is in the range defined by `minimum`, `maximum`, and `strict`; 0 otherwise */
      type: "comparison";
      value: ComputedValueProvider;
      minimum?: ComputedValueProvider;
      maximum?: ComputedValueProvider;
      strict?: boolean;
    }
  | {
      /** Logical AND, treating 0 as false and any nonzero number as true; evaluates to 0 if false and 1 if true */
      type: "conjunction";
      values: Array<ComputedValueProvider>;
    }
  | {
      /** Logical OR, treating 0 as false and any nonzero number as true; evaluates to 0 if false and 1 if true */
      type: "disjunction";
      values: Array<ComputedValueProvider>;
    }
  | {
      /** Logical NOT, treating 0 as false and any nonzero number as true; evaluates to 0 if false and 1 if true */
      type: "logical_negation";
      value: ComputedValueProvider;
    };

type ConstantValueProvider = {
  /** Static number */
  type: "number_constant";
  value: number;
};

type ControlFlowValueProvider =
  | {
      /** Evaluates to `trueValue` if `condition` is nonzero, otherwise `falseValue` */
      type: "conditional";
      condition: ComputedValueProvider;
      trueValue: ComputedValueProvider;
      falseValue: ComputedValueProvider;
    }
  | {
      /** Maps current filing status to a value, or `default` if the status isn't present in the map */
      type: "filing_status_map";
      values: Partial<Record<FilingStatus, ComputedValueProvider>>;
      default?: ComputedValueProvider;
    }
  | {
      /** Maps `input` to a piecewise output; pieces must be defined in ascending order */
      type: "piecewise_function";
      input: ComputedValueProvider;
      pieces: Array<{
        inputUpperBound: ComputedValueProvider;
        output: ComputedValueProvider;
      }>;
      lastOutput: ComputedValueProvider;
    };

type DateValueProvider = {
  /** Counts the number of `unit` that occur between `rangeStart` (inclusive) and `rangeEnd` (exclusive), treating the range bound values as the number of days since 1970-01-01 */
  type: "date_range_length";
  rangeEnd: ComputedValueProvider;
  rangeStart: ComputedValueProvider;
  unit: DateRangeUnit;
};

type ReferenceValueProvider =
  | {
      /** If `form` is not provided, evaluates to the box on the same form instance; otherwise, evaluates to the sum of the box across all instances of the form */
      type: "box_reference";
      form?: FormClass;
      box: BoxIdentifier;
      required?: boolean;
    }
  | {
      /** Counts number of instances of `form` */
      type: "form_instance_count";
      form: FormClass;
    };

type UnusedValueProvider =
  | {
      /** Box is not used for any calculations */
      type: "unused";
    }
  | {
      /** Box is relevant but it currently cannot be represented as a value provider or we have chosen to block it */
      type: "unsupported";
    };

export type ComputedValueProvider =
  | ArithmeticValueProvider
  | BooleanValueProvider
  | ConstantValueProvider
  | ControlFlowValueProvider
  | DateValueProvider
  | ReferenceValueProvider
  | UnusedValueProvider;

type UserInputValueProvider<InputKey extends string> =
  | {
      /** Checkbox; evaluates to 0 if not checked and 1 if checked */
      type: "checkbox_input";
      inputKey: InputKey;
    }
  | {
      /** Date input box; evaluates to the number of days since 1970-01-01 on the input date */
      type: "date_input";
      inputKey: InputKey;
    }
  | {
      /** List of labeled amounts; evaluates to the sum of the amounts */
      type: "list_amounts_input";
      inputKey: InputKey;
    }
  | {
      /** Number input box */
      type: "number_input";
      inputKey: InputKey;
      coerceSign?: NumberSign;
      skipCondition?: ComputedValueProvider;
    }
  | {
      /** Computed value with an override checkbox; if checked, evaluates to the user's input number instead */
      type: "override_number_input";
      inputKey: InputKey;
      computedValue: ComputedValueProvider;
      coerceSign?: NumberSign;
    }
  | {
      /** Multi-selector with specified boxes from individual form instances; evaluates to sum of the selected boxes */
      type: "select_instance_boxes_input";
      inputKey: InputKey;
      options: Array<{ form: FormClass; box: BoxIdentifier }>;
    }
  | {
      /** Single-selector with specified values */
      type: "select_value_input";
      inputKey: InputKey;
      options: Array<{
        key: string;
        label: string;
        value: ComputedValueProvider;
      }>;
    };

export type ValueProvider<InputKey extends string = string> =
  | ComputedValueProvider
  | UserInputValueProvider<InputKey>;
