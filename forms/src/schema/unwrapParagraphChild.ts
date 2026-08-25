import { Node } from "@markdoc/markdoc";

export function unwrapParagraphChild(nodes: Node[]): Node[] {
  if (
    nodes.length !== 1 ||
    nodes[0].type !== "paragraph" ||
    nodes[0].children.length !== 1 ||
    nodes[0].children[0].type !== "inline"
  ) {
    return nodes;
  }
  return nodes[0].children[0].children;
}
