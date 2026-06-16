import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TextField } from "#src/ui/primitives/TextField";

import type React from "react";

function renderComponent(
  props?: Partial<React.ComponentProps<typeof TextField>>,
) {
  return render(
    <TextField label="Test label" value="" onChange={vi.fn()} {...props} />,
  );
}

describe("TextField", () => {
  it("renders input field with provided value", async () => {
    renderComponent({ value: "hello" });

    expect(await screen.findByRole("textbox")).toHaveValue("hello");
  });

  it("renders label when provided", async () => {
    renderComponent({ label: "Name", value: "hello" });

    expect(await screen.findByLabelText("Name")).toHaveValue("hello");
  });

  it("renders aria-label when provided", async () => {
    renderComponent({ label: null, "aria-label": "Name", value: "hello" });

    expect(await screen.findByLabelText("Name")).toHaveValue("hello");
  });

  it("renders placeholder when provided", async () => {
    renderComponent({ placeholder: "John", value: "hello" });

    expect(await screen.findByPlaceholderText("John")).toHaveValue("hello");
  });

  it("renders description when provided", async () => {
    renderComponent({ description: "Enter your name" });

    expect(await screen.findByText("Enter your name")).toBeInTheDocument();
  });

  it("renders error message when provided", async () => {
    renderComponent({ errorMessage: "Name is required" });

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
  });

  it("renders disabled state", async () => {
    renderComponent({ disabled: true });

    expect(await screen.findByRole("textbox")).toBeDisabled();
  });

  it("renders read-only state", async () => {
    renderComponent({ readOnly: true });

    expect(await screen.findByRole("textbox")).toHaveAttribute("readonly");
  });

  it("calls onChange when value changes", async () => {
    const onChange = vi.fn();
    renderComponent({ value: "test", onChange });
    const user = userEvent.setup();

    await user.type(await screen.findByRole("textbox"), "1");

    expect(onChange).toHaveBeenCalledWith("test1");
  });

  it("is focused on render when autoFocus is true", async () => {
    renderComponent({ autoFocus: true });

    expect(await screen.findByRole("textbox")).toHaveFocus();
  });

  it("calls onFocus when the field is focused", async () => {
    const onFocus = vi.fn();
    renderComponent({ onFocus });
    const user = userEvent.setup();

    await user.click(await screen.findByRole("textbox"));

    expect(onFocus).toHaveBeenCalled();
  });

  it("calls onBlur when the field loses focus", async () => {
    const onBlur = vi.fn();
    renderComponent({ onBlur });
    const user = userEvent.setup();

    await user.click(await screen.findByRole("textbox"));
    await user.tab();

    expect(onBlur).toHaveBeenCalled();
  });

  it("uses aria-labelledby for the accessible name", async () => {
    render(
      <>
        <span id="ext-label">External label</span>
        <TextField aria-labelledby="ext-label" value="" onChange={vi.fn()} />
      </>,
    );

    expect(await screen.findByRole("textbox")).toHaveAccessibleName(
      "External label",
    );
  });

  it("uses aria-describedby for the accessible description", async () => {
    render(
      <>
        <span id="ext-desc">External description</span>
        <TextField
          aria-label="Field"
          aria-describedby="ext-desc"
          value=""
          onChange={vi.fn()}
        />
      </>,
    );

    expect(await screen.findByRole("textbox")).toHaveAccessibleDescription(
      "External description",
    );
  });

  it("merges aria-describedby with the error message", async () => {
    render(
      <>
        <span id="ext-desc">External description</span>
        <TextField
          aria-label="Field"
          aria-describedby="ext-desc"
          errorMessage="Bad value"
          value=""
          onChange={vi.fn()}
        />
      </>,
    );

    const input = await screen.findByRole("textbox");
    expect(input).toHaveAccessibleDescription(/External description/);
    expect(input).toHaveAccessibleDescription(/Bad value/);
  });
});
