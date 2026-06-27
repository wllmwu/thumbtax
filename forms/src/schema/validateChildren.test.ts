import { Node } from "@markdoc/markdoc";
import { describe, expect, it } from "vitest";

import { validateChildren } from "./validateChildren";

const tag = (tagName: string, attributes: Record<string, unknown> = {}) =>
  new Node("tag", attributes, [], tagName);

const text = (content = "text") => new Node("text", { content });

const parent = (children: Node[]) => new Node("tag", {}, children, "container");

describe("validateChildren", () => {
  it("accepts children that match nodeType", () => {
    const node = parent([text(), tag("test-tag", { attr1: "foo" })]);
    const errors = validateChildren(node, [
      { options: [{ nodeType: "text" }] },
      { options: [{ nodeType: "tag" }] },
    ]);
    expect(errors).toEqual([]);
  });

  it("accepts children that match nodeType and attributes", () => {
    const node = parent([
      text("foo"),
      tag("test-tag", { attr1: "bar", attr2: 2 }),
      tag("test-tag", { attr3: "abc", attr4: 4 }),
    ]);
    const errors = validateChildren(node, [
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
    const node = parent([tag("test-tag1"), tag("test-tag2", { attr1: "foo" })]);
    const errors = validateChildren(node, [
      { options: [{ nodeType: "tag", tag: "test-tag1" }] },
      { options: [{ nodeType: "tag", tag: "test-tag2" }] },
    ]);
    expect(errors).toEqual([]);
  });

  it("accepts children that match nodeType and tag and attributes", () => {
    const node = parent([
      tag("test-tag1", { attr1: "foo", attr2: 2 }),
      tag("test-tag2", { attr3: "abc", attr4: 4 }),
    ]);
    const errors = validateChildren(node, [
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
    const node = parent([
      text("foo"),
      text("bar"),
      tag("test-tag1"),
      tag("test-tag2", { x: "y" }),
    ]);
    const errors = validateChildren(node, [
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
    const node1 = parent([text()]);
    const errors1 = validateChildren(node1, [
      { options: [{ nodeType: "heading" }] },
    ]);
    expect(errors1).toEqual([
      {
        id: "child-type",
        level: "error",
        message: "Child number 1 should have type heading",
      },
    ]);

    const node2 = parent([tag("heading")]);
    const errors2 = validateChildren(node2, [
      { options: [{ nodeType: "heading" }] },
    ]);
    expect(errors2).toEqual([
      {
        id: "child-type",
        level: "error",
        message: "Child number 1 should have type heading",
      },
    ]);

    const node3 = parent([text()]);
    const errors3 = validateChildren(node3, [
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
    const node = parent([tag("foo")]);
    const errors = validateChildren(node, [
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
    const node1 = parent([text("foo")]);
    const errors1 = validateChildren(node1, [
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

    const node2 = parent([tag("test-tag", { attr2: "y" })]);
    const errors2 = validateChildren(node2, [
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
    const node1 = parent([tag("test-tag", { attr1: "a" })]);
    const errors1 = validateChildren(node1, [
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

    const node2 = parent([tag("test-tag", { attr2: "y" })]);
    const errors2 = validateChildren(node2, [
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
    const node = parent([text("foo")]);
    const errors = validateChildren(node, [
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
    const node = parent([text(), text(), text()]);
    const errors = validateChildren(node, [
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
    const node = parent([text()]);
    const errors = validateChildren(node, [
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
      const node = parent([text()]);
      const errors = validateChildren(node, [
        { options: [{ nodeType: "text" }] },
      ]);
      expect(errors).toEqual([]);
    });

    it("consumes matched child", () => {
      const node = parent([
        text("foo"),
        tag("test-tag", { attr1: "x", attr2: "y" }),
        text("bar"),
      ]);
      const errors = validateChildren(node, [
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
      const node = parent([text("foo"), text("bar")]);
      const errors = validateChildren(node, [
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
      const node = parent([text("foo")]);
      const errors = validateChildren(node, [
        { options: [{ nodeType: "text", attributes: { content: "bar" } }] },
      ]);
      expect(errors).toEqual([
        expect.objectContaining({ id: "child-attributes" }),
      ]);
    });
  });

  describe("optional spec", () => {
    it("accepts when next child matches", () => {
      const node = parent([text(), tag("test-tag", { x: "y" })]);
      const errors = validateChildren(node, [
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
      const node = parent([]);
      const errors = validateChildren(node, [
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

    it("consumes matched child", () => {
      const node = parent([
        text("foo"),
        tag("test-tag", { attr1: "x", attr2: "y" }),
        text("bar"),
      ]);
      const errors = validateChildren(node, [
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
      const node = parent([text("bar")]);
      const errors = validateChildren(node, [
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
      const node = parent([text("foo"), text("bar")]);
      const errors = validateChildren(node, [
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
      const node = parent([text(), tag("test-tag", { x: "y" })]);
      const errors = validateChildren(node, [
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
      const node = parent([
        text("foo"),
        text("bar"),
        text("baz"),
        tag("test-tag1", { x: "y" }),
        tag("test-tag2", { x: "y" }),
      ]);
      const errors = validateChildren(node, [
        { greedy: true, options: [{ nodeType: "text" }] },
        {
          greedy: true,
          options: [{ nodeType: "tag", attributes: { x: "y" } }],
        },
      ]);
      expect(errors).toEqual([]);
    });

    it("doesn't consume first non-matching child", () => {
      const node = parent([text("foo"), text("foo"), text("bar")]);
      const errors = validateChildren(node, [
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
      const node = parent([text("foo")]);
      const errors = validateChildren(node, [
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
      const node = parent([text(), tag("test-tag", { x: "y" })]);
      const errors = validateChildren(node, [
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
      const node = parent([
        text("foo"),
        text("bar"),
        text("baz"),
        tag("test-tag1", { x: "y" }),
        tag("test-tag2", { x: "y" }),
      ]);
      const errors = validateChildren(node, [
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
      const node = parent([]);
      const errors = validateChildren(node, [
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

    it("doesn't consume next child when it doesn't match", () => {
      const node = parent([text("bar")]);
      const errors = validateChildren(node, [
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
      const node = parent([text("foo"), text("foo"), text("bar")]);
      const errors = validateChildren(node, [
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
