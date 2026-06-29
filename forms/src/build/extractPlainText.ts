import { requireString } from "./attributes";

import type { Node } from "@markdoc/markdoc";

/**
 * Extracts the text content of a node that was validated by `validatePlainTextContent`,
 * which allows the content to optionally be nested in `paragraph` and `inline` wrappers.
 */
export function extractPlainText(node: Node): string {
  const [child] = node.children;
  if (node.children.length !== 1 || child === undefined) {
    throw new Error("Expected exactly one child for plain text content");
  }
  if (child.type === "text") {
    return requireString(child.attributes.content);
  }
  if (child.type === "paragraph" || child.type === "inline") {
    return extractPlainText(child);
  }
  throw new Error(
    `Unexpected node type "${child.type}" for plain text content`,
  );
}
