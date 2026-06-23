export const VALUE_SLOTS = [
  "comparison.maximum",
  "comparison.minimum",
  "conditional.condition",
  "conditional.falseValue",
  "conditional.trueValue",
  "difference.minuend",
  "difference.subtrahend",
  "filing_status_map.default",
  "number_input.skipCondition",
  "override_number_input.computedValue",
  "piecewise_function.input",
  "piecewise_function.lastOutput",
  "piecewise_function.pieces.inputUpperBound",
  "piecewise_function.pieces.output",
  "quotient.dividend",
  "quotient.divisor",
  "select_value_input.options",
] as const;

export type ValueSlot = (typeof VALUE_SLOTS)[number];
