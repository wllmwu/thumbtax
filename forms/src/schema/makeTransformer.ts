import { Node, Tag, transform } from "@markdoc/markdoc";

import type { Config, RenderableTreeNode } from "@markdoc/markdoc";

export function makeTransformer(
  tag: string,
  childProcessor: (children: Node[]) => Node[] = (x) => x,
): (node: Node, config: Config) => RenderableTreeNode {
  return (node, config) =>
    new Tag(
      tag,
      node.attributes,
      transform(childProcessor(node.children), config),
    );
}
