export const VALUE_PROVIDER_TYPES = [
  "absolute_value",
  "box_reference",
  "checkbox_input",
  "comparison",
  "conditional",
  "conjunction",
  "difference",
  "disjunction",
  "filing_status_map",
  "form_instance_count",
  "list_amounts_input",
  "logical_negation",
  "maximum",
  "minimum",
  "non_negative_clamp",
  "non_positive_clamp",
  "number_constant",
  "number_input",
  "numerical_negation",
  "override_number_input",
  "piecewise_function",
  "product",
  "quotient",
  "select_instance_boxes_input",
  "select_value_input",
  "sum",
  "unsupported",
  "unused",
] as const;

export type ValueProviderType = (typeof VALUE_PROVIDER_TYPES)[number];

export function isValueProviderType(s: string): s is ValueProviderType {
  return VALUE_PROVIDER_TYPES.findIndex((t) => t === s) !== -1;
}
