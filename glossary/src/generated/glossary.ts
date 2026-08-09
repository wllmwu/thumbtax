import type { RenderableTreeNode } from "@markdoc/markdoc";

export const glossary: RenderableTreeNode = {
  $$mdtype: "Tag",
  name: "article",
  attributes: {},
  children: [
    { $$mdtype: "Tag", name: "h1", attributes: {}, children: ["Glossary"] },
    {
      $$mdtype: "Tag",
      name: "GlossaryDefinition",
      attributes: { term: "test1" },
      children: [],
    },
    {
      $$mdtype: "Tag",
      name: "GlossaryDefinition",
      attributes: { term: "test2" },
      children: [],
    },
  ],
};
