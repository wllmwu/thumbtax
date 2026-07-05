import { Tag } from "@markdoc/markdoc";

import type { RenderableTreeNode } from "@markdoc/markdoc";

export function isTagNamed(
  node: RenderableTreeNode | undefined,
  tagName: string,
): node is Tag {
  return Tag.isTag(node) && node.name === tagName;
}
