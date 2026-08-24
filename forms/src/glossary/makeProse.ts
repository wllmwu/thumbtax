import { parse, Tag, transform, validate } from "@markdoc/markdoc";

import { formLinkTag, glossaryLinkTag } from "../schema/contentTags";

import type { Config, RenderableTreeNodes } from "@markdoc/markdoc";

const config: Config = {
  tags: {
    formLink: formLinkTag,
    glossaryLink: glossaryLinkTag,
  },
};

const MAX_ERROR_SOURCE_LENGTH = 100;

export function makeProse(markdoc: string): RenderableTreeNodes {
  const parsed = parse(markdoc);
  const errors = validate(parsed, config);
  if (errors.length > 0) {
    const truncatedMarkdoc =
      markdoc.length > MAX_ERROR_SOURCE_LENGTH
        ? `${markdoc.slice(0, MAX_ERROR_SOURCE_LENGTH)}...`
        : markdoc;
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
