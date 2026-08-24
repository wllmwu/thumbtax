import { describe, expect, it } from "vitest";

import { makeProse } from "./makeProse";

describe("makeProse", () => {
  it("builds single line", () => {
    const result = makeProse("hello world");
    expect(result).toEqual(
      expect.objectContaining({
        children: ["hello world"],
        name: "p",
      }),
    );
  });

  it("builds multiple lines", () => {
    const result = makeProse("foo\nbar\nbaz\n");
    expect(result).toEqual(
      expect.objectContaining({
        children: ["foo", " ", "bar", " ", "baz"],
        name: "p",
      }),
    );
  });

  it("builds multiple paragraphs", () => {
    const result = makeProse(`
Line 1
Line 2

Line 3

Line 4`);
    expect(result).toEqual([
      expect.objectContaining({
        children: ["Line 1", " ", "Line 2"],
        name: "p",
      }),
      expect.objectContaining({
        children: ["Line 3"],
        name: "p",
      }),
      expect.objectContaining({
        children: ["Line 4"],
        name: "p",
      }),
    ]);
  });

  it("builds form link", () => {
    const result = makeProse(
      'hello {% formLink formClass="fW2" %}link{% /formLink %} world',
    );
    expect(result).toEqual(
      expect.objectContaining({
        children: [
          "hello ",
          expect.objectContaining({
            attributes: { formClass: "fW2" },
            children: ["link"],
            name: "FormLink",
          }),
          " world",
        ],
        name: "p",
      }),
    );
  });

  it("builds glossary link", () => {
    const result = makeProse(
      'hello {% glossaryLink term="withholding" %}link{% /glossaryLink %} world',
    );
    expect(result).toEqual(
      expect.objectContaining({
        children: [
          "hello ",
          expect.objectContaining({
            attributes: { term: "withholding" },
            children: ["link"],
            name: "GlossaryLink",
          }),
          " world",
        ],
        name: "p",
      }),
    );
  });

  it("throws error for invalid formLink", () => {
    expect(() => makeProse("{% formLink %}link{% /formLink %}")).toThrow();
    expect(() =>
      makeProse('{% formLink formClass="foo" %}link{% /formLink %}'),
    ).toThrow();
  });

  it("throws error for invalid glossaryLink", () => {
    expect(() =>
      makeProse("{% glossaryLink %}link{% /glossaryLink %}"),
    ).toThrow();
    expect(() =>
      makeProse('{% glossaryLink term="foo" %}link{% /glossaryLink %}'),
    ).toThrow();
  });
});
