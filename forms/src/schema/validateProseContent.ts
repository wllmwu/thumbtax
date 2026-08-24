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

const ALLOWED_TAGS: Array<string | undefined> = ["formLink", "glossaryLink"];

export function validateProseContent(node: Node): ValidationError[] {
  for (const descendant of node.walk()) {
    const isProseNode = PROSE_TYPES.includes(descendant.type);
    const isAllowedTag =
      descendant.type === "tag" && ALLOWED_TAGS.includes(descendant.tag);
    if (!isProseNode && !isAllowedTag) {
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
