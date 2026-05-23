import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { NumberField } from "#src/ui/primitives/NumberField";

import type React from "react";

function renderComponent(
  props?: Partial<React.ComponentProps<typeof NumberField>>,
) {
  return render(<NumberField value={0} onChange={vi.fn()} {...props} />);
}

describe("NumberField", () => {
  it("renders input field with provided value", async () => {
    renderComponent({ label: "Amount", value: 42 });

    expect(await screen.findByRole("textbox")).toHaveValue("42");
  });

  it("renders label when provided", async () => {
    renderComponent({ label: "Amount", value: 42 });

    expect(await screen.findByLabelText("Amount")).toHaveValue("42");
  });

  it("renders aria-label when provided", async () => {
    renderComponent({ "aria-label": "Amount", value: 42 });

    expect(await screen.findByLabelText("Amount")).toHaveValue("42");
  });

  it("renders placeholder when provided", async () => {
    renderComponent({ label: "Amount", placeholder: "Amount", value: 42 });

    expect(await screen.findByPlaceholderText("Amount")).toHaveValue("42");
  });

  it("renders description when provided", async () => {
    renderComponent({ label: "Amount", description: "Enter an amount" });

    expect(await screen.findByText("Enter an amount")).toBeInTheDocument();
  });

  it("renders error message when provided", async () => {
    renderComponent({ label: "Amount", errorMessage: "Invalid amount" });

    expect(await screen.findByText("Invalid amount")).toBeInTheDocument();
  });

  it("calls onChange when value changes and input blurs", async () => {
    const onChange = vi.fn();
    renderComponent({ label: "Amount", value: 0, onChange });
    const user = userEvent.setup();

    const input = await screen.findByLabelText("Amount");
    await user.clear(input);
    await user.type(input, "50");

    expect(onChange).not.toHaveBeenCalled();

    await user.tab();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(50);
  });
});
