import type { TaxYear } from "@thumbtax/common";

export type LoadError =
  | { type: "not_an_object" }
  | { type: "missing_schema_version" }
  | { type: "unsupported_schema_version"; saved: number }
  | {
      type: "validation_failed";
      issues: Array<{ path: string; message: string }>;
    }
  | { type: "migration_failed"; reason: string }
  | { type: "invalid_json" }
  | { type: "unsupported_tax_year"; saved: number; loadedAs: TaxYear };
