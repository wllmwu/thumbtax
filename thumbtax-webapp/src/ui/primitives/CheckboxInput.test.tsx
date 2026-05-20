import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CheckboxInput } from "#src/ui/primitives/CheckboxInput";

import type React from "react";

function renderComponent(
  props?: Partial<React.ComponentProps<typeof CheckboxInput>>,
) {
  return render(<CheckboxInput value={false} onChange={vi.fn()} {...props} />);
}

describe("CheckboxInput", () => {
  it("renders unchecked state without label", async () => {
    renderComponent({ value: false, "data-testid": "test-checkbox-input" });

    expect(await screen.findByTestId("test-checkbox-input")).toHaveTextContent(
      "false",
    );
  });

  it("renders unchecked state with label", async () => {
    renderComponent({
      label: "Test",
      value: false,
      "data-testid": "test-checkbox-input",
    });

    expect(await screen.findByTestId("test-checkbox-input")).toHaveTextContent(
      "falseTest",
    );
  });

  it("renders checked state without label", async () => {
    renderComponent({ value: true, "data-testid": "test-checkbox-input" });

    expect(await screen.findByTestId("test-checkbox-input")).toHaveTextContent(
      "true",
    );
  });

  it("renders checked state with label", async () => {
    renderComponent({
      label: "Test",
      value: true,
      "data-testid": "test-checkbox-input",
    });

    expect(await screen.findByTestId("test-checkbox-input")).toHaveTextContent(
      "trueTest",
    );
  });

  it("calls onChange when changing from unchecked to checked", async () => {
    const onChange = vi.fn();
    renderComponent({
      value: false,
      onChange,
      "data-testid": "test-checkbox-input",
    });
    const user = userEvent.setup();

    await user.click(await screen.findByTestId("test-checkbox-input"));

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("calls onChange when changing from checked to unchecked", async () => {
    const onChange = vi.fn();
    renderComponent({
      value: true,
      onChange,
      "data-testid": "test-checkbox-input",
    });
    const user = userEvent.setup();

    await user.click(await screen.findByTestId("test-checkbox-input"));

    expect(onChange).toHaveBeenCalledWith(false);
  });
});
