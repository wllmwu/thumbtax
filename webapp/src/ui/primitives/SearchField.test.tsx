import React from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SearchField } from "#src/ui/primitives/SearchField";

function renderComponent(
  props?: Partial<React.ComponentProps<typeof SearchField>>,
) {
  return render(
    <SearchField label="Test label" value="" onChange={vi.fn()} {...props} />,
  );
}

describe("SearchField", () => {
  it("renders input field with provided value", async () => {
    renderComponent({ value: "hello" });

    expect(await screen.findByRole("searchbox")).toHaveValue("hello");
  });

  it("renders label when provided", async () => {
    renderComponent({ label: "Search", value: "hello" });

    expect(await screen.findByLabelText("Search")).toHaveValue("hello");
  });

  it("renders aria-label when provided", async () => {
    renderComponent({ label: null, "aria-label": "Search", value: "hello" });

    expect(await screen.findByLabelText("Search")).toHaveValue("hello");
  });

  it("renders placeholder when provided", async () => {
    renderComponent({ placeholder: "Type here", value: "hello" });

    expect(await screen.findByPlaceholderText("Type here")).toHaveValue(
      "hello",
    );
  });

  it("renders description when provided", async () => {
    renderComponent({ description: "Search for items" });

    expect(await screen.findByText("Search for items")).toBeInTheDocument();
  });

  it("renders error message when provided", async () => {
    renderComponent({ errorMessage: "Search query is required" });

    expect(
      await screen.findByText("Search query is required"),
    ).toBeInTheDocument();
  });

  it("renders disabled state", async () => {
    renderComponent({ disabled: true });

    expect(await screen.findByRole("searchbox")).toBeDisabled();
  });

  it("renders read-only state", async () => {
    renderComponent({ readOnly: true });

    expect(await screen.findByRole("searchbox")).toHaveAttribute("readonly");
  });

  it("renders name attribute when provided", async () => {
    renderComponent({ name: "testName" });

    expect(await screen.findByRole("searchbox")).toHaveAttribute(
      "name",
      "testName",
    );
  });

  it("calls onChange when value changes", async () => {
    const onChange = vi.fn();
    renderComponent({ value: "test", onChange });
    const user = userEvent.setup();

    await user.type(await screen.findByRole("searchbox"), "1");

    expect(onChange).toHaveBeenCalledWith("test1");
  });

  it("is focused on render when autoFocus is true", async () => {
    renderComponent({ autoFocus: true });

    expect(await screen.findByRole("searchbox")).toHaveFocus();
  });

  it("uses aria-labelledby for the accessible name", async () => {
    render(
      <>
        <span id="ext-label">Search label</span>
        <SearchField
          aria-labelledby="ext-label"
          value="text"
          onChange={vi.fn()}
        />
      </>,
    );

    expect(await screen.findByRole("searchbox")).toHaveAccessibleName(
      "Search label",
    );
  });

  it("uses aria-describedby for the accessible description", async () => {
    render(
      <>
        <span id="ext-desc">External description</span>
        <SearchField
          aria-label="Field"
          aria-describedby="ext-desc"
          value="text"
          onChange={vi.fn()}
        />
      </>,
    );

    expect(await screen.findByRole("searchbox")).toHaveAccessibleDescription(
      "External description",
    );
  });

  it("merges aria-describedby with the error message", async () => {
    render(
      <>
        <span id="ext-desc">External description</span>
        <SearchField
          aria-label="Field"
          aria-describedby="ext-desc"
          errorMessage="Bad value"
          value="text"
          onChange={vi.fn()}
        />
      </>,
    );

    const input = await screen.findByRole("searchbox");
    expect(input).toHaveAccessibleDescription(/External description/);
    expect(input).toHaveAccessibleDescription(/Bad value/);
  });

  it("forwards ref to the field element", async () => {
    const ref = React.createRef<React.ComponentRef<typeof SearchField>>();
    render(
      <SearchField ref={ref} label="Test label" value="" onChange={vi.fn()} />,
    );

    const input = await screen.findByRole("searchbox");
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toContainElement(input);
  });
});
