export const VALUE_SLOTS = [
  "maximum",
  "minimum",
  "condition",
  "falseValue",
  "trueValue",
  "minuend",
  "subtrahend",
  "default",
  "skipCondition",
  "computedValue",
  "input",
  "lastOutput",
  "inputUpperBound",
  "output",
  "dividend",
  "divisor",
] as const;

export type ValueSlot = (typeof VALUE_SLOTS)[number];
