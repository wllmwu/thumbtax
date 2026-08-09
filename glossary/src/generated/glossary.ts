import type { RenderableTreeNode } from "@markdoc/markdoc";

export const glossary: RenderableTreeNode = {
  $$mdtype: "Tag",
  name: "article",
  attributes: {},
  children: [
    { $$mdtype: "Tag", name: "h1", attributes: {}, children: ["Glossary"] },
    {
      $$mdtype: "Tag",
      name: "dl",
      attributes: {},
      children: [
        {
          $$mdtype: "Tag",
          name: "div",
          attributes: { id: "test1" },
          children: [
            {
              $$mdtype: "Tag",
              name: "p",
              attributes: {},
              children: [
                {
                  $$mdtype: "Tag",
                  name: "dt",
                  attributes: {},
                  children: ["Test 1"],
                },
              ],
            },
            {
              $$mdtype: "Tag",
              name: "dd",
              attributes: {},
              children: [
                {
                  $$mdtype: "Tag",
                  name: "p",
                  attributes: {},
                  children: ["Test 1 definition"],
                },
              ],
            },
          ],
        },
        {
          $$mdtype: "Tag",
          name: "div",
          attributes: { id: "test2" },
          children: [
            {
              $$mdtype: "Tag",
              name: "p",
              attributes: {},
              children: [
                {
                  $$mdtype: "Tag",
                  name: "dt",
                  attributes: {},
                  children: ["Test 2"],
                },
              ],
            },
            {
              $$mdtype: "Tag",
              name: "dd",
              attributes: {},
              children: [
                {
                  $$mdtype: "Tag",
                  name: "p",
                  attributes: {},
                  children: ["Test 2 definition"],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
