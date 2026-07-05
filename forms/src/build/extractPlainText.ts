import { Tag } from "@markdoc/markdoc";

/**
 * Extracts the text content of a node that was validated by `validatePlainTextContent`,
 * which allows the content to optionally be nested in `paragraph` and `inline` wrappers.
 */
export function extractPlainText(node: Tag): string {
  const [child] = node.children;
  if (node.children.length !== 1 || child === undefined) {
    throw new Error("Expected exactly one child for plain text content");
  }
  if (!Tag.isTag(child)) {
    return child?.toString() || "";
  }
  if (child.name === "p") {
    return extractPlainText(child);
  }
  throw new Error(`Unexpected tag name "${child.name}" for plain text content`);
}
