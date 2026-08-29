export const VALUE_SLOTS = [
  "computedValue",
  "condition",
  "default",
  "dividend",
  "divisor",
  "falseValue",
  "input",
  "inputUpperBound",
  "lastOutput",
  "maximum",
  "minimum",
  "minuend",
  "output",
  "rangeEnd",
  "rangeStart",
  "skipCondition",
  "subtrahend",
  "trueValue",
] as const;

export type ValueSlot = (typeof VALUE_SLOTS)[number];
