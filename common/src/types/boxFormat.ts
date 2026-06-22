export const BOX_FORMATS = [
  "checkbox",
  "financial",
  "percentage",
  "plain",
  "yes_no",
] as const;

export type BoxFormat = (typeof BOX_FORMATS)[number];
