import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SearchField } from "#src/ui/primitives/SearchField";

import type React from "react";

function renderComponent(
  props?: Partial<React.ComponentProps<typeof SearchField>>,
) {
  return render(<SearchField value="" onChange={vi.fn()} {...props} />);
}

describe("SearchField", () => {
  it("renders input field with provided value", async () => {
    renderComponent({ label: "Search", value: "hello" });

    expect(await screen.findByRole("searchbox")).toHaveValue("hello");
  });

  it("renders label when provided", async () => {
    renderComponent({ label: "Search", value: "hello" });

    expect(await screen.findByLabelText("Search")).toHaveValue("hello");
  });

  it("renders aria-label when provided", async () => {
    renderComponent({ "aria-label": "Search", value: "hello" });

    expect(await screen.findByLabelText("Search")).toHaveValue("hello");
  });

  it("renders placeholder when provided", async () => {
    renderComponent({
      label: "Search",
      placeholder: "Type here",
      value: "hello",
    });

    expect(await screen.findByPlaceholderText("Type here")).toHaveValue(
      "hello",
    );
  });

  it("renders description when provided", async () => {
    renderComponent({ label: "Search", description: "Search for items" });

    expect(await screen.findByText("Search for items")).toBeInTheDocument();
  });

  it("renders error message when provided", async () => {
    renderComponent({
      label: "Search",
      errorMessage: "Search query is required",
    });

    expect(
      await screen.findByText("Search query is required"),
    ).toBeInTheDocument();
  });

  it("calls onChange when value changes", async () => {
    const onChange = vi.fn();
    renderComponent({ label: "Search", value: "test", onChange });
    const user = userEvent.setup();

    await user.type(await screen.findByLabelText("Search"), "1");

    expect(onChange).toHaveBeenCalledWith("test1");
  });

  it("is focused on render when autoFocus is true", async () => {
    renderComponent({ label: "Search", autoFocus: true });

    expect(await screen.findByRole("searchbox")).toHaveFocus();
  });
});
