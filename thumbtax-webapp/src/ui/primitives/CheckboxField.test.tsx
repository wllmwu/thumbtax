import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CheckboxField } from "#src/ui/primitives/CheckboxField";

import type React from "react";

function renderComponent(
  props?: Partial<React.ComponentProps<typeof CheckboxField>>,
) {
  return render(<CheckboxField value={false} onChange={vi.fn()} {...props} />);
}

describe("CheckboxField", () => {
  it("renders unchecked state with label", async () => {
    renderComponent({
      label: "Test",
      value: false,
    });

    expect(await screen.findByRole("checkbox")).toHaveAccessibleName(
      "falseTest",
    );
    expect(await screen.findByRole("checkbox")).not.toBeChecked();
  });

  it("renders unchecked state with aria-label", async () => {
    renderComponent({
      "aria-label": "Test",
      value: false,
    });

    expect(await screen.findByRole("checkbox")).toHaveAccessibleName("Test");
    expect(await screen.findByRole("checkbox")).not.toBeChecked();
  });

  it("renders checked state with label", async () => {
    renderComponent({
      label: "Test",
      value: true,
    });

    expect(await screen.findByRole("checkbox")).toHaveAccessibleName(
      "trueTest",
    );
    expect(await screen.findByRole("checkbox")).toBeChecked();
  });

  it("renders checked state with aria-label", async () => {
    renderComponent({
      "aria-label": "Test",
      value: true,
    });

    expect(await screen.findByRole("checkbox")).toHaveAccessibleName("Test");
    expect(await screen.findByRole("checkbox")).toBeChecked();
  });

  it("renders description when provided", async () => {
    renderComponent({
      label: "Test label",
      description: "Test description",
    });

    expect(await screen.findByText("Test description")).toBeInTheDocument();
  });

  it("renders error message when provided", async () => {
    renderComponent({
      label: "Test label",
      errorMessage: "Test error message",
    });

    expect(await screen.findByText("Test error message")).toBeInTheDocument();
  });

  it("calls onChange when changing from unchecked to checked", async () => {
    const onChange = vi.fn();
    renderComponent({
      value: false,
      onChange,
    });
    const user = userEvent.setup();

    await user.click(await screen.findByRole("checkbox"));

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("calls onChange when changing from checked to unchecked", async () => {
    const onChange = vi.fn();
    renderComponent({
      value: true,
      onChange,
    });
    const user = userEvent.setup();

    await user.click(await screen.findByRole("checkbox"));

    expect(onChange).toHaveBeenCalledWith(false);
  });
});
