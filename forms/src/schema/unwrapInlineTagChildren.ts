import type { Node } from "@markdoc/markdoc";

export function unwrapInlineTags(nodes: Node[]): Node[] {
  return nodes.map((node) => {
    if (
      node.type === "paragraph" &&
      node.children.length === 1 &&
      node.children[0].type === "inline" &&
      node.children[0].children.length === 1 &&
      node.children[0].children[0].type === "tag"
    ) {
      return node.children[0].children[0];
    }
    return node;
  });
}
