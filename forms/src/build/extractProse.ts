import type { RenderableTreeNodes, Tag } from "@markdoc/markdoc";

export function extractProse(node: Tag): RenderableTreeNodes {
  if (node.children.length === 1) {
    return node.children[0];
  }
  return node.children;
}
