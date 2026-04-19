import type { FilingStatus } from "#src/types/filingStatus";

export type TaxFormClass = "f1040" | "fW2";

export type TaxFormBoxIdentifier = string;

export type TaxFormSpecification = {
  class: TaxFormClass;
  title: string;
  subtitle?: string;
  irsPageUrl: string;
  cardinality: "single" | "multiple";
  sections: Array<TaxFormSection>;
};

export type TaxFormSection = {
  heading?: string;
  columns?: Array<{
    index: string;
    description?: string;
  }>;
  lines: Array<TaxFormLine>;
};

export type TaxFormLine = {
  index: string;
  description?: string;
  boxes: Array<TaxFormBox>;
};

export type TaxFormBox = {
  identifier: TaxFormBoxIdentifier;
  columnIndex?: string;
  value: ValueProvider;
  predictedValue?: ValueProvider;
  format?: "checkbox" | "financial" | "percentage" | "plain";
};

export type ValueProvider =
  | number
  | TaxFormBoxIdentifier
  | { type: "unused" }
  | { type: "unsupported" }
  | { type: "number_input" }
  | { type: "list_amounts_input" }
  | { type: "checkbox_input" }
  | {
      type: "box_selection_input";
      options: Array<{
        form: TaxFormClass;
        box: TaxFormBoxIdentifier;
      }>;
    }
  | {
      type: "form_reference";
      form: TaxFormClass;
      box: TaxFormBoxIdentifier;
    }
  | { type: "sum"; values: Array<ValueProvider> }
  | {
      type: "sum_range";
      form?: TaxFormClass;
      fromLine: string;
      toLine: string;
      column?: string;
    }
  | { type: "difference"; minuend: ValueProvider; subtrahend: ValueProvider }
  | { type: "product"; values: Array<ValueProvider> }
  | { type: "quotient"; dividend: ValueProvider; divisor: ValueProvider }
  | { type: "minimum"; values: Array<ValueProvider> }
  | { type: "maximum"; values: Array<ValueProvider> }
  | { type: "absolute_value"; value: ValueProvider }
  | { type: "numerical_negation"; value: ValueProvider }
  | { type: "form_presence"; form: TaxFormClass }
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
      values: Record<FilingStatus, ValueProvider>;
      default?: ValueProvider;
    };
