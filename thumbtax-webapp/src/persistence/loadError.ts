export type LoadError =
  | { type: "tax_year_mismatch"; saved: number; current: number }
  | { type: "schema_version_newer"; saved: number; current: number }
  | { type: "unknown_field"; path: string }
  | { type: "invalid_value"; path: string };
