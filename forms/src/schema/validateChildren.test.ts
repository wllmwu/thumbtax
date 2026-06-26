import { Node } from "@markdoc/markdoc";
import { describe, expect, it } from "vitest";

import { validateChildren } from "./validateChildren";

const tag = (tagName: string, attributes: Record<string, unknown> = {}) =>
  new Node("tag", attributes, [], tagName);

const text = (content = "text") => new Node("text", { content });

const parent = (children: Node[]) => new Node("tag", {}, children, "container");

describe("validateChildren", () => {
  describe("exactly 1 (optional=false, greedy=false)", () => {
    it("matches a single child with the right type and tag", () => {
      const node = parent([tag("value")]);
      const errors = validateChildren(node, [
        { options: [{ nodeType: "tag", tag: "value" }] },
      ]);
      expect(errors).toEqual([]);
    });

    it("errors when the child has the wrong node type", () => {
      const node = parent([text()]);
      const errors = validateChildren(node, [
        { options: [{ nodeType: "tag", tag: "value" }] },
      ]);
      expect(errors).toEqual([
        {
          id: "child-type",
          level: "error",
          message: "Child number 1 should have type tag(value)",
        },
      ]);
    });

    it("errors when the child has the same node type but the wrong tag", () => {
      const node = parent([tag("piece")]);
      const errors = validateChildren(node, [
        { options: [{ nodeType: "tag", tag: "value" }] },
      ]);
      expect(errors).toEqual([
        {
          id: "child-type",
          level: "error",
          message: "Child number 1 should have type tag(value)",
        },
      ]);
    });

    it("errors when a required attribute is missing", () => {
      const node = parent([tag("value")]);
      const errors = validateChildren(node, [
        {
          options: [
            { nodeType: "tag", tag: "value", attributes: { slot: "x" } },
          ],
        },
      ]);
      expect(errors).toHaveLength(1);
      expect(errors[0].id).toBe("child-attributes");
      expect(errors[0].level).toBe("error");
      expect(errors[0].message).toContain(
        "Child number 1 should have attributes",
      );
    });

    it("errors when an attribute value doesn't match", () => {
      const node = parent([tag("value", { slot: "y" })]);
      const errors = validateChildren(node, [
        {
          options: [
            { nodeType: "tag", tag: "value", attributes: { slot: "x" } },
          ],
        },
      ]);
      expect(errors).toHaveLength(1);
      expect(errors[0].id).toBe("child-attributes");
    });

    it("matches when the child has extra attributes beyond what the spec requires", () => {
      const node = parent([tag("value", { slot: "x", label: "Foo" })]);
      const errors = validateChildren(node, [
        {
          options: [
            { nodeType: "tag", tag: "value", attributes: { slot: "x" } },
          ],
        },
      ]);
      expect(errors).toEqual([]);
    });

    it("errors when a required child is missing entirely", () => {
      const node = parent([]);
      const errors = validateChildren(node, [
        { options: [{ nodeType: "tag", tag: "value" }] },
      ]);
      expect(errors).toEqual([
        {
          id: "missing-required-child",
          level: "error",
          message: "Missing at least one required child",
        },
      ]);
    });
  });

  describe("0 or 1 (optional=true, greedy=false)", () => {
    it("matches when the optional child is present", () => {
      const node = parent([tag("value")]);
      const errors = validateChildren(node, [
        { optional: true, options: [{ nodeType: "tag", tag: "value" }] },
      ]);
      expect(errors).toEqual([]);
    });

    it("skips a non-matching child and lets the next spec match it", () => {
      const node = parent([tag("b")]);
      const errors = validateChildren(node, [
        { optional: true, options: [{ nodeType: "tag", tag: "a" }] },
        { options: [{ nodeType: "tag", tag: "b" }] },
      ]);
      expect(errors).toEqual([]);
    });

    it("is satisfied when there are no children at all", () => {
      const node = parent([]);
      const errors = validateChildren(node, [
        { optional: true, options: [{ nodeType: "tag", tag: "a" }] },
        { optional: true, options: [{ nodeType: "tag", tag: "b" }] },
      ]);
      expect(errors).toEqual([]);
    });
  });

  describe("1 or more (optional=false, greedy=true)", () => {
    it("matches a single child", () => {
      const node = parent([tag("value")]);
      const errors = validateChildren(node, [
        { greedy: true, options: [{ nodeType: "tag", tag: "value" }] },
      ]);
      expect(errors).toEqual([]);
    });

    it("matches several consecutive matching children", () => {
      const node = parent([tag("value"), tag("value"), tag("value")]);
      const errors = validateChildren(node, [
        { greedy: true, options: [{ nodeType: "tag", tag: "value" }] },
      ]);
      expect(errors).toEqual([]);
    });

    it("errors when there are zero matching children", () => {
      const node = parent([tag("piece")]);
      const errors = validateChildren(node, [
        { greedy: true, options: [{ nodeType: "tag", tag: "value" }] },
      ]);
      expect(errors).toEqual([
        {
          id: "child-type",
          level: "error",
          message: "Child number 1 should have type tag(value)",
        },
      ]);
    });

    it("stops consuming at the first non-matching child and hands it to the next spec", () => {
      const node = parent([tag("value"), tag("value"), tag("piece")]);
      const errors = validateChildren(node, [
        { greedy: true, options: [{ nodeType: "tag", tag: "value" }] },
        { options: [{ nodeType: "tag", tag: "piece" }] },
      ]);
      expect(errors).toEqual([]);
    });
  });

  describe("0 or more (optional=true, greedy=true)", () => {
    it("is satisfied with zero children", () => {
      const node = parent([]);
      const errors = validateChildren(node, [
        {
          optional: true,
          greedy: true,
          options: [{ nodeType: "tag", tag: "value" }],
        },
      ]);
      expect(errors).toEqual([]);
    });

    it("matches many children", () => {
      const node = parent([tag("value"), tag("value")]);
      const errors = validateChildren(node, [
        {
          optional: true,
          greedy: true,
          options: [{ nodeType: "tag", tag: "value" }],
        },
      ]);
      expect(errors).toEqual([]);
    });
  });

  describe("multiple options in one spec", () => {
    it("matches the first option", () => {
      const node = parent([tag("value")]);
      const errors = validateChildren(node, [
        {
          options: [
            { nodeType: "tag", tag: "value" },
            { nodeType: "tag", tag: "piece" },
          ],
        },
      ]);
      expect(errors).toEqual([]);
    });

    it("matches the second option", () => {
      const node = parent([tag("piece")]);
      const errors = validateChildren(node, [
        {
          options: [
            { nodeType: "tag", tag: "value" },
            { nodeType: "tag", tag: "piece" },
          ],
        },
      ]);
      expect(errors).toEqual([]);
    });

    it("errors listing every option when none match", () => {
      const node = parent([text()]);
      const errors = validateChildren(node, [
        {
          options: [
            { nodeType: "tag", tag: "value" },
            { nodeType: "tag", tag: "piece" },
          ],
        },
      ]);
      expect(errors).toEqual([
        {
          id: "child-type",
          level: "error",
          message: "Child number 1 should have type tag(value) | tag(piece)",
        },
      ]);
    });
  });

  describe("multi-spec ordered sequences", () => {
    it("matches a 3-step ordered sequence (ordered slots)", () => {
      const node = parent([
        tag("value", { slot: "condition" }),
        tag("value", { slot: "trueValue" }),
        tag("value", { slot: "falseValue" }),
      ]);
      const errors = validateChildren(node, [
        {
          options: [
            {
              nodeType: "tag",
              tag: "value",
              attributes: { slot: "condition" },
            },
          ],
        },
        {
          options: [
            {
              nodeType: "tag",
              tag: "value",
              attributes: { slot: "trueValue" },
            },
          ],
        },
        {
          options: [
            {
              nodeType: "tag",
              tag: "value",
              attributes: { slot: "falseValue" },
            },
          ],
        },
      ]);
      expect(errors).toEqual([]);
    });

    it("fails fast on the first mismatched child in the sequence", () => {
      const node = parent([
        tag("value", { slot: "condition" }),
        tag("piece"),
        tag("value", { slot: "falseValue" }),
      ]);
      const errors = validateChildren(node, [
        {
          options: [
            {
              nodeType: "tag",
              tag: "value",
              attributes: { slot: "condition" },
            },
          ],
        },
        {
          options: [
            {
              nodeType: "tag",
              tag: "value",
              attributes: { slot: "trueValue" },
            },
          ],
        },
        {
          options: [
            {
              nodeType: "tag",
              tag: "value",
              attributes: { slot: "falseValue" },
            },
          ],
        },
      ]);
      expect(errors).toEqual([
        {
          id: "child-type",
          level: "error",
          message: "Child number 2 should have type tag(value)",
        },
      ]);
    });

    it("matches required + trailing optional specs when only the required one is present", () => {
      const node = parent([tag("value")]);
      const errors = validateChildren(node, [
        { options: [{ nodeType: "tag", tag: "value" }] },
        { optional: true, options: [{ nodeType: "tag", tag: "piece" }] },
        { optional: true, options: [{ nodeType: "tag", tag: "option" }] },
      ]);
      expect(errors).toEqual([]);
    });

    it("matches required + trailing optional specs skipping an absent middle optional", () => {
      const node = parent([tag("value"), tag("option")]);
      const errors = validateChildren(node, [
        { options: [{ nodeType: "tag", tag: "value" }] },
        { optional: true, options: [{ nodeType: "tag", tag: "piece" }] },
        { optional: true, options: [{ nodeType: "tag", tag: "option" }] },
      ]);
      expect(errors).toEqual([]);
    });

    it("errors when the required greedy middle spec has zero matches", () => {
      const node = parent([
        tag("value", { slot: "input" }),
        tag("value", { slot: "lastOutput" }),
      ]);
      const errors = validateChildren(node, [
        {
          options: [
            { nodeType: "tag", tag: "value", attributes: { slot: "input" } },
          ],
        },
        { greedy: true, options: [{ nodeType: "tag", tag: "piece" }] },
        {
          options: [
            {
              nodeType: "tag",
              tag: "value",
              attributes: { slot: "lastOutput" },
            },
          ],
        },
      ]);
      expect(errors).toEqual([
        {
          id: "child-type",
          level: "error",
          message: "Child number 2 should have type tag(piece)",
        },
      ]);
    });

    it("matches required, greedy middle, required tail with several middle matches", () => {
      const node = parent([
        tag("value", { slot: "input" }),
        tag("piece"),
        tag("piece"),
        tag("value", { slot: "lastOutput" }),
      ]);
      const errors = validateChildren(node, [
        {
          options: [
            { nodeType: "tag", tag: "value", attributes: { slot: "input" } },
          ],
        },
        { greedy: true, options: [{ nodeType: "tag", tag: "piece" }] },
        {
          options: [
            {
              nodeType: "tag",
              tag: "value",
              attributes: { slot: "lastOutput" },
            },
          ],
        },
      ]);
      expect(errors).toEqual([]);
    });
  });

  describe("extra children", () => {
    it("errors when specs are empty but the node has children", () => {
      const node = parent([tag("value")]);
      const errors = validateChildren(node, []);
      expect(errors).toEqual([
        {
          id: "extra-child",
          level: "error",
          message: "Node has unexpected children starting with child number 1",
        },
      ]);
    });

    it("errors at the correct index when children remain after specs are satisfied", () => {
      const node = parent([
        tag("value"),
        tag("piece"),
        tag("piece"),
        tag("option"),
      ]);
      const errors = validateChildren(node, [
        { options: [{ nodeType: "tag", tag: "value" }] },
        { greedy: true, options: [{ nodeType: "tag", tag: "piece" }] },
      ]);
      expect(errors).toEqual([
        {
          id: "extra-child",
          level: "error",
          message: "Node has unexpected children starting with child number 4",
        },
      ]);
    });
  });

  describe("degenerate case", () => {
    it("returns no errors for empty specs and empty children", () => {
      const node = parent([]);
      const errors = validateChildren(node, []);
      expect(errors).toEqual([]);
    });
  });
});
