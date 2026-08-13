import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { TableOfContents } from "#src/ui/table-of-contents/TableOfContents";

import type React from "react";

function renderComponent(
  headings: React.ComponentProps<typeof TableOfContents>["headings"],
) {
  return render(
    <MemoryRouter initialEntries={["/glossary"]}>
      <TableOfContents headings={headings} />
    </MemoryRouter>,
  );
}

describe("TableOfContents", () => {
  it("renders a link to each heading, in order", () => {
    renderComponent([
      { id: "fW2", label: "W-2" },
      { id: "f1040", label: "Form 1040" },
    ]);

    const links = within(
      screen.getByRole("navigation", { name: "Table of contents" }),
    ).getAllByRole("link");

    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent("W-2");
    expect(links[0]).toHaveAttribute("href", "/glossary#fW2");
    expect(links[1]).toHaveTextContent("Form 1040");
    expect(links[1]).toHaveAttribute("href", "/glossary#f1040");
  });

  it("renders no links when there are no headings", () => {
    renderComponent([]);

    const links = within(
      screen.getByRole("navigation", { name: "Table of contents" }),
    ).queryAllByRole("link");

    expect(links).toHaveLength(0);
  });
});
