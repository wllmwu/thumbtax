import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  SelectField,
  SelectFieldItem,
  SelectFieldSection,
} from "#src/ui/primitives/SelectField";

import type React from "react";

function renderComponent({
  children,
  ...props
}: Partial<React.ComponentProps<typeof SelectField>> = {}) {
  return render(
    <SelectField value="apple" onChange={vi.fn()} {...props}>
      {children ?? (
        <>
          <SelectFieldItem id="apple">Apple</SelectFieldItem>
          <SelectFieldItem id="banana">Banana</SelectFieldItem>
          <SelectFieldItem id="cherry">Cherry</SelectFieldItem>
        </>
      )}
    </SelectField>,
  );
}

describe("SelectField", () => {
  it("renders button with selected value", async () => {
    renderComponent({ label: "Fruit", value: "apple" });

    expect(await screen.findByRole("button")).toHaveTextContent("Apple");
  });

  it("renders label when provided", async () => {
    renderComponent({ label: "Fruit", value: "apple" });

    expect(await screen.findByLabelText("Fruit")).toBeInTheDocument();
  });

  it("renders aria-label when provided", async () => {
    renderComponent({ "aria-label": "Fruit", value: "apple" });

    expect(await screen.findByLabelText("Fruit")).toBeInTheDocument();
  });

  it("renders description when provided", async () => {
    renderComponent({ label: "Fruit", description: "Choose a fruit" });

    expect(await screen.findByText("Choose a fruit")).toBeInTheDocument();
  });

  it("renders error message when provided", async () => {
    renderComponent({ label: "Fruit", errorMessage: "Selection required" });

    expect(await screen.findByText("Selection required")).toBeInTheDocument();
  });

  it("renders disabled state", async () => {
    renderComponent({
      label: "Fruit",
      disabled: true,
    });

    expect(await screen.findByLabelText("Fruit")).toBeDisabled();
  });

  it("opens popover with provided options when button is pressed", async () => {
    renderComponent({ label: "Fruit", value: "apple" });
    const user = userEvent.setup();

    await user.click(await screen.findByLabelText("Fruit"));

    expect(
      await screen.findByRole("option", { name: "Apple" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("option", { name: "Banana" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("option", { name: "Cherry" }),
    ).toBeInTheDocument();
  });

  it("renders sections of options when provided", async () => {
    renderComponent({
      label: "Fruit",
      value: "apple",
      children: (
        <>
          <SelectFieldSection>
            <SelectFieldItem id="apple">Apple</SelectFieldItem>
            <SelectFieldItem id="banana">Banana</SelectFieldItem>
          </SelectFieldSection>
          <SelectFieldSection>
            <SelectFieldItem id="cherry">Cherry</SelectFieldItem>
          </SelectFieldSection>
        </>
      ),
    });
    const user = userEvent.setup();

    await user.click(await screen.findByLabelText("Fruit"));

    expect(await screen.findAllByRole("group")).toHaveLength(2);
    expect(
      await screen.findByRole("option", { name: "Apple" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("option", { name: "Cherry" }),
    ).toBeInTheDocument();
  });

  it("closes popover and calls onChange when option is chosen", async () => {
    const onChange = vi.fn();
    renderComponent({ label: "Fruit", value: "apple", onChange });
    const user = userEvent.setup();

    await user.click(await screen.findByLabelText("Fruit"));
    await user.click(await screen.findByRole("option", { name: "Banana" }));

    expect(onChange).toHaveBeenCalledWith("banana");
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
  });

  it("closes popover without calling onChange when user clicks outside", async () => {
    const onChange = vi.fn();
    renderComponent({ label: "Fruit", value: "apple", onChange });
    const user = userEvent.setup();

    await user.click(await screen.findByLabelText("Fruit"));
    expect(
      await screen.findByRole("option", { name: "Apple" }),
    ).toBeInTheDocument();

    await user.click(document.body);

    expect(screen.queryByRole("option")).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders default text in button when value doesn't match any options", async () => {
    renderComponent({ label: "Fruit", value: "nonexistent" });

    expect(await screen.findByRole("button")).toHaveTextContent(
      "Select an item",
    );
  });
});
