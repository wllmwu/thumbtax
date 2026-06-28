import type { Node, NodeType, ValidationError } from "@markdoc/markdoc";

function hasSingleChild(node: Node, childType: NodeType): boolean {
  return node.children.length === 1 && node.children[0].type === childType;
}

export function validatePlainTextContent(node: Node): ValidationError[] {
  if (
    hasSingleChild(node, "text") ||
    (hasSingleChild(node, "inline") &&
      hasSingleChild(node.children[0], "text")) ||
    (hasSingleChild(node, "paragraph") &&
      hasSingleChild(node.children[0], "inline") &&
      hasSingleChild(node.children[0].children[0], "text"))
  ) {
    return [];
  }
  return [
    {
      id: "plain-text-content",
      level: "error",
      message: "Must have plain text content",
    },
  ];
}
