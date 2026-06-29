export const COMPUTED_VALUE_PROVIDER_TYPES = [
  "absolute_value",
  "box_reference",
  "comparison",
  "conditional",
  "conjunction",
  "difference",
  "disjunction",
  "filing_status_map",
  "form_instance_count",
  "logical_negation",
  "maximum",
  "minimum",
  "non_negative_clamp",
  "non_positive_clamp",
  "number_constant",
  "numerical_negation",
  "piecewise_function",
  "product",
  "quotient",
  "sum",
  "unsupported",
  "unused",
] as const;

export const USER_INPUT_VALUE_PROVIDER_TYPES = [
  "checkbox_input",
  "list_amounts_input",
  "number_input",
  "override_number_input",
  "select_instance_boxes_input",
  "select_value_input",
] as const;

export const VALUE_PROVIDER_TYPES = [
  ...COMPUTED_VALUE_PROVIDER_TYPES,
  ...USER_INPUT_VALUE_PROVIDER_TYPES,
];

export type ValueProviderType = (typeof VALUE_PROVIDER_TYPES)[number];

export function isValueProviderType(s: string): s is ValueProviderType {
  return VALUE_PROVIDER_TYPES.findIndex((t) => t === s) !== -1;
}
