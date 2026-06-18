import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { NumberField } from "#src/ui/primitives/NumberField";

import type React from "react";

function renderComponent(
  props?: Partial<React.ComponentProps<typeof NumberField>>,
) {
  return render(
    <NumberField
      label="Test label"
      format="plain"
      value={0}
      onChange={vi.fn()}
      {...props}
    />,
  );
}

describe("NumberField", () => {
  it("renders input field with provided value", async () => {
    renderComponent({ value: 42 });

    expect(await screen.findByRole("textbox")).toHaveValue("42");
  });

  it("renders label when provided", async () => {
    renderComponent({ label: "Amount", value: 42 });

    expect(await screen.findByLabelText("Amount")).toHaveValue("42");
  });

  it("renders aria-label when provided", async () => {
    renderComponent({ label: null, "aria-label": "Amount", value: 42 });

    expect(await screen.findByLabelText("Amount")).toHaveValue("42");
  });

  it("renders placeholder when provided", async () => {
    renderComponent({ placeholder: "Amount", value: 42 });

    expect(await screen.findByPlaceholderText("Amount")).toHaveValue("42");
  });

  it("renders description when provided", async () => {
    renderComponent({ description: "Enter an amount" });

    expect(await screen.findByText("Enter an amount")).toBeInTheDocument();
  });

  it("renders error message when provided", async () => {
    renderComponent({ errorMessage: "Invalid amount" });

    expect(await screen.findByText("Invalid amount")).toBeInTheDocument();
  });

  it("renders disabled state", async () => {
    renderComponent({ disabled: true });

    expect(await screen.findByRole("textbox")).toBeDisabled();
  });

  it("renders read-only state", async () => {
    renderComponent({ readOnly: true });

    expect(await screen.findByRole("textbox")).toHaveAttribute("readonly");
  });

  it("calls onChange only when input blurs", async () => {
    const onChange = vi.fn();
    renderComponent({ value: 0, onChange });
    const user = userEvent.setup();

    const input = await screen.findByRole("textbox");
    await user.clear(input);
    await user.type(input, "50");

    expect(onChange).not.toHaveBeenCalled();

    await user.tab();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(50);
  });

  it("formats value as financial", async () => {
    renderComponent({ format: "financial", value: -1234.5 });

    expect(await screen.findByRole("textbox")).toHaveValue("(1,234.50)");
  });

  it("formats value as percentage", async () => {
    renderComponent({ format: "percentage", value: 0.125 });

    expect(await screen.findByRole("textbox")).toHaveValue("12.5%");
  });

  it("formats value as plain", async () => {
    renderComponent({ format: "plain", value: -1234.5 });

    expect(await screen.findByRole("textbox")).toHaveValue("-1,234.5");
  });

  it("removes formatting when focused", async () => {
    renderComponent({ format: "financial", value: -1234.5 });
    const user = userEvent.setup();

    const input = await screen.findByRole("textbox");
    await user.click(input);

    expect(input).toHaveValue("-1234.5");
  });

  it("does not allow non-numeric inputs", async () => {
    renderComponent({ format: "financial", value: -1234.5 });
    const user = userEvent.setup();

    const input = await screen.findByRole("textbox");
    await user.click(input);
    await user.type(input, "a");
    await user.type(input, "e");

    expect(input).toHaveValue("-1234.5");
  });

  it("formats value again when blurred", async () => {
    renderComponent({ format: "financial", value: -1234.5 });
    const user = userEvent.setup();

    const input = await screen.findByRole("textbox");
    await user.click(input);
    await user.type(input, "6");
    await user.tab();

    expect(input).toHaveValue("(1,234.56)");
  });

  it("uses aria-labelledby for the accessible name", async () => {
    render(
      <>
        <span id="ext-label">Number label</span>
        <NumberField
          aria-labelledby="ext-label"
          format="financial"
          value={0}
          onChange={vi.fn()}
        />
      </>,
    );

    expect(await screen.findByRole("textbox")).toHaveAccessibleName(
      "Number label",
    );
  });

  it("uses aria-describedby for the accessible description", async () => {
    render(
      <>
        <span id="ext-desc">External description</span>
        <NumberField
          aria-label="Field"
          aria-describedby="ext-desc"
          format="financial"
          value={0}
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
        <NumberField
          aria-label="Field"
          aria-describedby="ext-desc"
          errorMessage="Bad value"
          format="financial"
          value={0}
          onChange={vi.fn()}
        />
      </>,
    );

    const input = await screen.findByRole("textbox");
    expect(input).toHaveAccessibleDescription(/External description/);
    expect(input).toHaveAccessibleDescription(/Bad value/);
  });
});
