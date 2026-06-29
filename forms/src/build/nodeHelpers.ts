import type { Node } from "@markdoc/markdoc";

export function isTagNamed(
  node: Node | undefined,
  tagName: string,
): node is Node {
  return node !== undefined && node.type === "tag" && node.tag === tagName;
}
