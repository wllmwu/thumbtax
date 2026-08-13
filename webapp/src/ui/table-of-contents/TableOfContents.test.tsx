import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { TableOfContents } from "#src/ui/table-of-contents/TableOfContents";

import type React from "react";

function renderComponent(
  props?: Partial<React.ComponentProps<typeof TableOfContents>>,
) {
  return render(
    <MemoryRouter initialEntries={["/glossary"]}>
      <TableOfContents headings={[]} {...props} />
    </MemoryRouter>,
  );
}

describe("TableOfContents", () => {
  it("renders a link to each heading, in order", async () => {
    renderComponent({
      headings: [
        { id: "a", label: "Heading A" },
        { id: "b", label: "Heading B" },
      ],
    });

    const links = within(
      await screen.findByRole("navigation", { name: "Contents" }),
    ).getAllByRole("link");

    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent("Heading A");
    expect(links[0]).toHaveAttribute("href", "/glossary#a");
    expect(links[1]).toHaveTextContent("Heading B");
    expect(links[1]).toHaveAttribute("href", "/glossary#b");
  });

  it("renders no links when there are no headings", async () => {
    renderComponent({ headings: [] });

    const links = within(
      await screen.findByRole("navigation", { name: "Contents" }),
    ).queryAllByRole("link");

    expect(links).toHaveLength(0);
  });
});
