import { parse, Tag, transform, validate } from "@markdoc/markdoc";

import { formLinkTag, glossaryLinkTag } from "../schema/contentTags";

import type { Config, RenderableTreeNodes } from "@markdoc/markdoc";

const config: Config = {
  tags: {
    formlink: formLinkTag,
    glossarylink: glossaryLinkTag,
  },
};

export function makeProse(markdoc: string): RenderableTreeNodes {
  const parsed = parse(markdoc);
  const errors = validate(parsed, config);
  if (errors.length > 0) {
    const truncatedMarkdoc =
      markdoc.length > 20 ? `${markdoc.slice(0, 20)}...` : markdoc;
    throw new Error(
      `Invalid Markdoc: ${errors[0].error.message} ("${truncatedMarkdoc}")`,
    );
  }
  const transformed = transform(parsed, config);
  if (Tag.isTag(transformed) && transformed.name === "article") {
    const children = transformed.children;
    if (children.length === 1) {
      return children[0];
    }
    return children;
  }
  return transformed;
}
