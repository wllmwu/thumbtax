import type { LoadError } from "#src/persistence/types/loadError";
import type { ZodError } from "zod";

export function validationFailed(
  error: ZodError,
): Extract<LoadError, { type: "validation_failed" }> {
  return {
    type: "validation_failed",
    issues: error.issues.map((issue) => ({
      path: issue.path.map(String).join("."),
      message: issue.message,
    })),
  };
}
