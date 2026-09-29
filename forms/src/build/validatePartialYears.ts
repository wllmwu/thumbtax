import type { Node, ValidationError } from "@markdoc/markdoc";
import type { TaxYear } from "@thumbtax/common";

/**
 * Validates that every partial referenced in the given node's subtree belongs to the given tax year.
 * Partial keys are prefixed with their year, such as `2025/taxComputation`.
 */
export function validatePartialYears(
  node: Node,
  taxYear: TaxYear,
): ValidationError[] {
  const errors: ValidationError[] = [];
  const expectedPrefix = `${taxYear}/`;

  for (const descendant of node.walk()) {
    if (descendant.type !== "tag" || descendant.tag !== "partial") {
      continue;
    }
    const { file } = descendant.attributes;
    if (typeof file === "string" && file.startsWith(expectedPrefix)) {
      continue;
    }

    errors.push({
      id: "partial-wrong-year",
      level: "error",
      message: `Partial "${String(file)}" is not from tax year ${taxYear}`,
      location: descendant.location,
    });
  }

  return errors;
}
