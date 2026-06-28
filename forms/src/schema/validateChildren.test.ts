import { Node } from "@markdoc/markdoc";
import { describe, expect, it } from "vitest";

import { validateChildren } from "./validateChildren";

const tag = (tagName: string, attributes: Record<string, unknown> = {}) =>
  new Node("tag", attributes, [], tagName);

const text = (content = "text") => new Node("text", { content });

describe("validateChildren", () => {
  it("accepts children that match nodeType", () => {
    const nodes = [text(), tag("test-tag", { attr1: "foo" })];
    const errors = validateChildren(nodes, [
      { options: [{ nodeType: "text" }] },
      { options: [{ nodeType: "tag" }] },
    ]);
    expect(errors).toEqual([]);
  });

  it("accepts children that match nodeType and attributes", () => {
    const nodes = [
      text("foo"),
      tag("test-tag", { attr1: "bar", attr2: 2 }),
      tag("test-tag", { attr3: "abc", attr4: 4 }),
    ];
    const errors = validateChildren(nodes, [
      { options: [{ nodeType: "text", attributes: { content: "foo" } }] },
      {
        options: [{ nodeType: "tag", attributes: { attr1: "bar" } }],
      },
      {
        options: [{ nodeType: "tag", attributes: { attr3: "abc", attr4: 4 } }],
      },
    ]);
    expect(errors).toEqual([]);
  });

  it("accepts children that match nodeType and tag", () => {
    const nodes = [tag("test-tag1"), tag("test-tag2", { attr1: "foo" })];
    const errors = validateChildren(nodes, [
      { options: [{ nodeType: "tag", tag: "test-tag1" }] },
      { options: [{ nodeType: "tag", tag: "test-tag2" }] },
    ]);
    expect(errors).toEqual([]);
  });

  it("accepts children that match nodeType and tag and attributes", () => {
    const nodes = [
      tag("test-tag1", { attr1: "foo", attr2: 2 }),
      tag("test-tag2", { attr3: "abc", attr4: 4 }),
    ];
    const errors = validateChildren(nodes, [
      {
        options: [
          { nodeType: "tag", tag: "test-tag1", attributes: { attr2: 2 } },
        ],
      },
      {
        options: [
          {
            nodeType: "tag",
            tag: "test-tag2",
            attributes: { attr4: 4, attr3: "abc" },
          },
        ],
      },
    ]);
    expect(errors).toEqual([]);
  });

  it("accepts when any of multiple options is matched", () => {
    const nodes = [
      text("foo"),
      text("bar"),
      tag("test-tag1"),
      tag("test-tag2", { x: "y" }),
    ];
    const errors = validateChildren(nodes, [
      { options: [{ nodeType: "text" }, { nodeType: "heading" }] },
      {
        options: [
          { nodeType: "paragraph" },
          { nodeType: "text", attributes: { x: "y" } },
          { nodeType: "text" },
        ],
      },
      {
        options: [
          { nodeType: "tag", tag: "test-tag3" },
          { nodeType: "tag", tag: "test-tag1" },
          { nodeType: "tag" },
        ],
      },
      {
        options: [
          { nodeType: "text", attributes: { x: "y" } },
          { nodeType: "tag" },
        ],
      },
    ]);
    expect(errors).toEqual([]);
  });

  it("rejects children that don't match nodeType", () => {
    const nodes1 = [text()];
    const errors1 = validateChildren(nodes1, [
      { options: [{ nodeType: "heading" }] },
    ]);
    expect(errors1).toEqual([
      {
        id: "child-type",
        level: "error",
        message: "Child number 1 should have type heading",
      },
    ]);

    const nodes2 = [tag("heading")];
    const errors2 = validateChildren(nodes2, [
      { options: [{ nodeType: "heading" }] },
    ]);
    expect(errors2).toEqual([
      {
        id: "child-type",
        level: "error",
        message: "Child number 1 should have type heading",
      },
    ]);

    const nodes3 = [text()];
    const errors3 = validateChildren(nodes3, [
      { options: [{ nodeType: "tag" }] },
    ]);
    expect(errors3).toEqual([
      {
        id: "child-type",
        level: "error",
        message: "Child number 1 should have type tag",
      },
    ]);
  });

  it("rejects children that match nodeType but not tag", () => {
    const nodes = [tag("foo")];
    const errors = validateChildren(nodes, [
      { options: [{ nodeType: "tag", tag: "bar" }] },
    ]);
    expect(errors).toEqual([
      {
        id: "child-type",
        level: "error",
        message: "Child number 1 should have type tag(bar)",
      },
    ]);
  });

  it("rejects children that match nodeType but not attributes", () => {
    const nodes1 = [text("foo")];
    const errors1 = validateChildren(nodes1, [
      {
        options: [{ nodeType: "text", attributes: { content: "bar" } }],
      },
    ]);
    expect(errors1).toEqual([
      {
        id: "child-attributes",
        level: "error",
        message: 'Child number 1 should contain attributes {"content":"bar"}',
      },
    ]);

    const nodes2 = [tag("test-tag", { attr2: "y" })];
    const errors2 = validateChildren(nodes2, [
      {
        options: [
          {
            nodeType: "tag",
            attributes: { attr2: "y", attr3: "z" },
          },
        ],
      },
    ]);
    expect(errors2).toEqual([
      {
        id: "child-attributes",
        level: "error",
        message:
          'Child number 1 should contain attributes {"attr2":"y","attr3":"z"}',
      },
    ]);
  });

  it("rejects children that match nodeType and tag but not attributes", () => {
    const nodes1 = [tag("test-tag", { attr1: "a" })];
    const errors1 = validateChildren(nodes1, [
      {
        options: [
          { nodeType: "tag", tag: "test-tag", attributes: { attr1: "x" } },
        ],
      },
    ]);
    expect(errors1).toEqual([
      {
        id: "child-attributes",
        level: "error",
        message: 'Child number 1 should contain attributes {"attr1":"x"}',
      },
    ]);

    const nodes2 = [tag("test-tag", { attr2: "y" })];
    const errors2 = validateChildren(nodes2, [
      {
        options: [
          {
            nodeType: "tag",
            tag: "test-tag",
            attributes: { attr2: "y", attr3: "z" },
          },
        ],
      },
    ]);
    expect(errors2).toEqual([
      {
        id: "child-attributes",
        level: "error",
        message:
          'Child number 1 should contain attributes {"attr2":"y","attr3":"z"}',
      },
    ]);
  });

  it("rejects when none of multiple options are matched", () => {
    const nodes = [text("foo")];
    const errors = validateChildren(nodes, [
      {
        options: [
          { nodeType: "blockquote" },
          { nodeType: "tag", attributes: { content: "foo" } },
          { nodeType: "text", attributes: { content: "bar" } },
        ],
      },
    ]);
    expect(errors).toEqual([
      {
        id: "child-attributes",
        level: "error",
        message: 'Child number 1 should contain attributes {"content":"bar"}',
      },
    ]);
  });

  it("rejects when node has extra children", () => {
    const nodes = [text(), text(), text()];
    const errors = validateChildren(nodes, [
      { options: [{ nodeType: "text" }] },
    ]);
    expect(errors).toEqual([
      {
        id: "extra-child",
        level: "error",
        message: "Node has unexpected children starting with child number 2",
      },
    ]);
  });

  it("rejects when node doesn't have enough children", () => {
    const nodes = [text()];
    const errors = validateChildren(nodes, [
      { options: [{ nodeType: "text" }] },
      { options: [{ nodeType: "text" }] },
    ]);
    expect(errors).toEqual([
      {
        id: "missing-required-child",
        level: "error",
        message: "Missing at least one required child",
      },
    ]);
  });

  describe("default spec", () => {
    it("accepts when next child matches", () => {
      const nodes = [text()];
      const errors = validateChildren(nodes, [
        { options: [{ nodeType: "text" }] },
      ]);
      expect(errors).toEqual([]);
    });

    it("consumes matched child", () => {
      const nodes = [
        text("foo"),
        tag("test-tag", { attr1: "x", attr2: "y" }),
        text("bar"),
      ];
      const errors = validateChildren(nodes, [
        { options: [{ nodeType: "text" }] },
        {
          options: [
            { nodeType: "tag", tag: "test-tag", attributes: { attr1: "x" } },
          ],
        },
        { options: [{ nodeType: "text", attributes: { content: "bar" } }] },
      ]);
      expect(errors).toEqual([]);
    });

    it("doesn't consume more than 1 child", () => {
      const nodes = [text("foo"), text("bar")];
      const errors = validateChildren(nodes, [
        { options: [{ nodeType: "text" }] },
      ]);
      expect(errors).toEqual([
        expect.objectContaining({
          id: "extra-child",
          message: "Node has unexpected children starting with child number 2",
        }),
      ]);
    });

    it("rejects when next child doesn't match", () => {
      const nodes = [text("foo")];
      const errors = validateChildren(nodes, [
        { options: [{ nodeType: "text", attributes: { content: "bar" } }] },
      ]);
      expect(errors).toEqual([
        expect.objectContaining({ id: "child-attributes" }),
      ]);
    });
  });

  describe("optional spec", () => {
    it("accepts when next child matches", () => {
      const nodes = [text(), tag("test-tag", { x: "y" })];
      const errors = validateChildren(nodes, [
        { optional: true, options: [{ nodeType: "text" }] },
        {
          optional: true,
          options: [
            { nodeType: "tag", tag: "test-tag", attributes: { x: "y" } },
          ],
        },
      ]);
      expect(errors).toEqual([]);
    });

    it("accepts when next child doesn't exist", () => {
      const errors = validateChildren(
        [],
        [
          { optional: true, options: [{ nodeType: "text" }] },
          {
            optional: true,
            options: [
              { nodeType: "tag", tag: "test-tag", attributes: { x: "y" } },
            ],
          },
        ],
      );
      expect(errors).toEqual([]);
    });

    it("consumes matched child", () => {
      const nodes = [
        text("foo"),
        tag("test-tag", { attr1: "x", attr2: "y" }),
        text("bar"),
      ];
      const errors = validateChildren(nodes, [
        { optional: true, options: [{ nodeType: "text" }] },
        {
          optional: true,
          options: [
            { nodeType: "tag", tag: "test-tag", attributes: { attr1: "x" } },
          ],
        },
        {
          optional: true,
          options: [{ nodeType: "text", attributes: { content: "bar" } }],
        },
      ]);
      expect(errors).toEqual([]);
    });

    it("doesn't consume non-matching child", () => {
      const nodes = [text("bar")];
      const errors = validateChildren(nodes, [
        {
          optional: true,
          options: [{ nodeType: "text", attributes: { content: "foo" } }],
        },
        {
          optional: true,
          options: [
            { nodeType: "tag", tag: "test-tag", attributes: { attr1: "x" } },
          ],
        },
        { options: [{ nodeType: "text", attributes: { content: "bar" } }] },
      ]);
      expect(errors).toEqual([]);
    });

    it("doesn't consume more than 1 child", () => {
      const nodes = [text("foo"), text("bar")];
      const errors = validateChildren(nodes, [
        { optional: true, options: [{ nodeType: "text" }] },
      ]);
      expect(errors).toEqual([
        expect.objectContaining({
          id: "extra-child",
          message: "Node has unexpected children starting with child number 2",
        }),
      ]);
    });
  });

  describe("greedy spec", () => {
    it("accepts when next 1 child matches and consumes it", () => {
      const nodes = [text(), tag("test-tag", { x: "y" })];
      const errors = validateChildren(nodes, [
        { greedy: true, options: [{ nodeType: "text" }] },
        {
          greedy: true,
          options: [
            { nodeType: "tag", tag: "test-tag", attributes: { x: "y" } },
          ],
        },
      ]);
      expect(errors).toEqual([]);
    });

    it("accepts when next >1 children match and consumes all matched children", () => {
      const nodes = [
        text("foo"),
        text("bar"),
        text("baz"),
        tag("test-tag1", { x: "y" }),
        tag("test-tag2", { x: "y" }),
      ];
      const errors = validateChildren(nodes, [
        { greedy: true, options: [{ nodeType: "text" }] },
        {
          greedy: true,
          options: [{ nodeType: "tag", attributes: { x: "y" } }],
        },
      ]);
      expect(errors).toEqual([]);
    });

    it("doesn't consume first non-matching child", () => {
      const nodes = [text("foo"), text("foo"), text("bar")];
      const errors = validateChildren(nodes, [
        {
          greedy: true,
          options: [{ nodeType: "text", attributes: { content: "foo" } }],
        },
      ]);
      expect(errors).toEqual([
        expect.objectContaining({
          id: "extra-child",
          message: "Node has unexpected children starting with child number 3",
        }),
      ]);
    });

    it("rejects when next child doesn't match", () => {
      const nodes = [text("foo")];
      const errors = validateChildren(nodes, [
        {
          greedy: true,
          options: [{ nodeType: "text", attributes: { content: "bar" } }],
        },
      ]);
      expect(errors).toEqual([
        expect.objectContaining({ id: "child-attributes" }),
      ]);
    });
  });

  describe("optional and greedy spec", () => {
    it("accepts when next 1 child matches and consumes it", () => {
      const nodes = [text(), tag("test-tag", { x: "y" })];
      const errors = validateChildren(nodes, [
        { optional: true, greedy: true, options: [{ nodeType: "text" }] },
        {
          optional: true,
          greedy: true,
          options: [
            { nodeType: "tag", tag: "test-tag", attributes: { x: "y" } },
          ],
        },
      ]);
      expect(errors).toEqual([]);
    });

    it("accepts when next >1 children match and consumes all matched children", () => {
      const nodes = [
        text("foo"),
        text("bar"),
        text("baz"),
        tag("test-tag1", { x: "y" }),
        tag("test-tag2", { x: "y" }),
      ];
      const errors = validateChildren(nodes, [
        { optional: true, greedy: true, options: [{ nodeType: "text" }] },
        {
          optional: true,
          greedy: true,
          options: [{ nodeType: "tag", attributes: { x: "y" } }],
        },
      ]);
      expect(errors).toEqual([]);
    });

    it("accepts when next child doesn't exist", () => {
      const errors = validateChildren(
        [],
        [
          { optional: true, greedy: true, options: [{ nodeType: "text" }] },
          {
            optional: true,
            greedy: true,
            options: [
              { nodeType: "tag", tag: "test-tag", attributes: { x: "y" } },
            ],
          },
        ],
      );
      expect(errors).toEqual([]);
    });

    it("doesn't consume next child when it doesn't match", () => {
      const nodes = [text("bar")];
      const errors = validateChildren(nodes, [
        {
          optional: true,
          greedy: true,
          options: [{ nodeType: "text", attributes: { content: "foo" } }],
        },
        {
          optional: true,
          greedy: true,
          options: [
            { nodeType: "tag", tag: "test-tag", attributes: { attr1: "x" } },
          ],
        },
        { options: [{ nodeType: "text", attributes: { content: "bar" } }] },
      ]);
      expect(errors).toEqual([]);
    });

    it("doesn't consume first non-matching child", () => {
      const nodes = [text("foo"), text("foo"), text("bar")];
      const errors = validateChildren(nodes, [
        {
          optional: true,
          greedy: true,
          options: [{ nodeType: "text", attributes: { content: "foo" } }],
        },
      ]);
      expect(errors).toEqual([
        expect.objectContaining({
          id: "extra-child",
          message: "Node has unexpected children starting with child number 3",
        }),
      ]);
    });
  });
});
