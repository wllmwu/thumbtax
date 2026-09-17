import type { Node, ValidationError } from "@markdoc/markdoc";

/**
 * Validates that no two `value` tags in the given node's subtree share the same `inputKey`.
 */
export function validateUniqueInputKeys(node: Node): ValidationError[] {
  const errors: ValidationError[] = [];
  const nodesByInputKey = new Map<string, Node>();

  for (const descendant of node.walk()) {
    if (descendant.type !== "tag" || descendant.tag !== "value") {
      continue;
    }
    const { inputKey } = descendant.attributes;
    if (typeof inputKey !== "string") {
      continue;
    }

    if (nodesByInputKey.has(inputKey)) {
      errors.push({
        id: "duplicate-input-key",
        level: "error",
        message: `inputKey "${inputKey}" is already used by another box in this form`,
        location: descendant.location,
      });
    } else {
      nodesByInputKey.set(inputKey, descendant);
    }
  }

  return errors;
}
