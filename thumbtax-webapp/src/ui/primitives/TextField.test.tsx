import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TextField } from "#src/ui/primitives/TextField";

import type React from "react";

function renderComponent(
  props?: Partial<React.ComponentProps<typeof TextField>>,
) {
  return render(<TextField value="" onChange={vi.fn()} {...props} />);
}

describe("TextField", () => {
  it("renders input field by itself with provided value", async () => {
    renderComponent({ value: "hello" });

    expect(await screen.findByRole("textbox")).toHaveValue("hello");
  });

  it("renders label when provided", async () => {
    renderComponent({ label: "Name", value: "hello" });

    expect(await screen.findByLabelText("Name")).toHaveValue("hello");
  });

  it("renders aria-label when provided", async () => {
    renderComponent({ "aria-label": "Name", value: "hello" });

    expect(await screen.findByLabelText("Name")).toHaveValue("hello");
  });

  it("renders description when provided", async () => {
    renderComponent({ label: "Name", description: "Enter your name" });

    expect(await screen.findByText("Enter your name")).toBeInTheDocument();
  });

  it("renders error message when provided", async () => {
    renderComponent({ label: "Name", errorMessage: "Name is required" });

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
  });

  it("calls onChange when value changes", async () => {
    const onChange = vi.fn();
    renderComponent({ label: "Name", value: "test", onChange });
    const user = userEvent.setup();

    await user.type(await screen.findByLabelText("Name"), "1");

    expect(onChange).toHaveBeenCalledWith("test1");
  });
});
