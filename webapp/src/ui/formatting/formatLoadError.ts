import { absurd } from "@thumbtax/common";

import type { LoadError } from "#src/persistence/types/loadError";

export type FormattedLoadError = {
  message: string;
  details?: string[];
};

export function formatLoadError(error: LoadError): FormattedLoadError {
  switch (error.type) {
    case "not_an_object":
      return {
        message: "Your saved data isn't in a format Thumbtax recognizes.",
      };
    case "missing_schema_version":
      return {
        message: "Your saved data is missing required version information.",
      };
    case "unsupported_schema_version":
      return {
        message: `Your saved data uses an unsupported format version (${error.saved}).`,
      };
    case "validation_failed":
      return {
        message: "Your saved data failed validation.",
        details: error.issues.map((issue) => `${issue.path}: ${issue.message}`),
      };
    case "migration_failed":
      return {
        message: `Your saved data couldn't be upgraded to the current format: ${error.reason}`,
      };
    case "invalid_json":
      return { message: "Your saved data isn't valid JSON." };
    case "tax_year_mismatch":
      return {
        message: `Your saved data is for tax year ${error.saved}, but this is tax year ${error.current}.`,
      };
    default:
      return absurd(error);
  }
}
