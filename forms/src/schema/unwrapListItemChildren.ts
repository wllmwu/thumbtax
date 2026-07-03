import { Node } from "@markdoc/markdoc";

export function unwrapListItemChildren(nodes: Node[]): Node[] {
  if (nodes.length !== 1 || nodes[0].type !== "list") {
    return [];
  }
  return nodes[0].children.flatMap((itemNode) => {
    return itemNode.children.map((itemChild) => {
      if (
        itemChild.type === "inline" &&
        itemChild.children.length === 1 &&
        itemChild.children[0].type === "tag"
      ) {
        return itemChild.children[0];
      }
      return itemChild;
    });
  });
}
