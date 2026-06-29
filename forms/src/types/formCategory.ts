export const FORM_CATEGORIES = ["income", "taxes"] as const;

export type FormCategory = (typeof FORM_CATEGORIES)[number];
