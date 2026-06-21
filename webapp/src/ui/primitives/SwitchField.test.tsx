import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SwitchField } from "#src/ui/primitives/SwitchField";

import type React from "react";

function renderComponent(
  props?: Partial<React.ComponentProps<typeof SwitchField>>,
) {
  return render(
    <SwitchField
      label="Test label"
      value={false}
      onChange={vi.fn()}
      {...props}
    />,
  );
}

describe("SwitchField", () => {
  it("renders unchecked state with label", async () => {
    renderComponent({ label: "Test", value: false });

    expect(await screen.findByRole("switch")).toHaveAccessibleName("falseTest");
    expect(await screen.findByRole("switch")).not.toBeChecked();
  });

  it("renders unchecked state with aria-label", async () => {
    renderComponent({ label: null, "aria-label": "Test", value: false });

    expect(await screen.findByRole("switch")).toHaveAccessibleName("Test");
    expect(await screen.findByRole("switch")).not.toBeChecked();
  });

  it("renders checked state with label", async () => {
    renderComponent({ label: "Test", value: true });

    expect(await screen.findByRole("switch")).toHaveAccessibleName("trueTest");
    expect(await screen.findByRole("switch")).toBeChecked();
  });

  it("renders checked state with aria-label", async () => {
    renderComponent({ label: null, "aria-label": "Test", value: true });

    expect(await screen.findByRole("switch")).toHaveAccessibleName("Test");
    expect(await screen.findByRole("switch")).toBeChecked();
  });

  it("renders description when provided", async () => {
    renderComponent({ description: "Test description" });

    expect(await screen.findByText("Test description")).toBeInTheDocument();
  });

  it("renders error message when provided", async () => {
    renderComponent({ errorMessage: "Test error message" });

    expect(await screen.findByText("Test error message")).toBeInTheDocument();
  });

  it("renders disabled state", async () => {
    renderComponent({ disabled: true });

    expect(await screen.findByRole("switch")).toBeDisabled();
  });

  it("renders read-only state", async () => {
    renderComponent({ readOnly: true });

    expect(await screen.findByRole("switch")).toHaveAttribute(
      "aria-readonly",
      "true",
    );
  });

  it("calls onChange when changing from unchecked to checked", async () => {
    const onChange = vi.fn();
    renderComponent({ value: false, onChange });
    const user = userEvent.setup();

    await user.click(await screen.findByRole("switch"));

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("calls onChange when changing from checked to unchecked", async () => {
    const onChange = vi.fn();
    renderComponent({ value: true, onChange });
    const user = userEvent.setup();

    await user.click(await screen.findByRole("switch"));

    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("uses aria-labelledby for the accessible name", async () => {
    render(
      <>
        <span id="ext-label">External label</span>
        <SwitchField
          aria-labelledby="ext-label"
          value={false}
          onChange={vi.fn()}
        />
      </>,
    );

    expect(await screen.findByRole("switch")).toHaveAccessibleName(
      "External label",
    );
  });

  it("uses aria-describedby for the accessible description", async () => {
    render(
      <>
        <span id="ext-desc">External description</span>
        <SwitchField
          aria-label="Field"
          aria-describedby="ext-desc"
          value={false}
          onChange={vi.fn()}
        />
      </>,
    );

    expect(await screen.findByRole("switch")).toHaveAccessibleDescription(
      "External description",
    );
  });

  it("merges aria-describedby with the error message", async () => {
    render(
      <>
        <span id="ext-desc">External description</span>
        <SwitchField
          aria-label="Field"
          aria-describedby="ext-desc"
          errorMessage="Bad value"
          value={false}
          onChange={vi.fn()}
        />
      </>,
    );

    const switchControl = await screen.findByRole("switch");
    expect(switchControl).toHaveAccessibleDescription(/External description/);
    expect(switchControl).toHaveAccessibleDescription(/Bad value/);
  });
});
