import type { Node, NodeType, ValidationError } from "@markdoc/markdoc";

const PROSE_TYPES: NodeType[] = [
  "blockquote",
  "code",
  "em",
  "hardbreak",
  "inline",
  "item",
  "link",
  "list",
  "paragraph",
  "s",
  "softbreak",
  "strong",
  "text",
];

export function validateProseContent(node: Node): ValidationError[] {
  for (const descendant of node.walk()) {
    if (!PROSE_TYPES.includes(descendant.type)) {
      return [
        {
          id: "prose-content",
          level: "error",
          message: "Must have prose content",
        },
      ];
    }
  }
  return [];
}
