import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RadioGroup } from "#src/ui/primitives/RadioGroup";

import type { RadioOption } from "#src/ui/primitives/RadioGroup";
import type React from "react";

const defaultOptions: Array<RadioOption<string>> = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

function renderComponent(
  props?: Partial<React.ComponentProps<typeof RadioGroup<string>>>,
) {
  return render(
    <RadioGroup
      label="Test label"
      value="apple"
      onChange={vi.fn()}
      options={defaultOptions}
      {...props}
    />,
  );
}

describe("RadioGroup", () => {
  it("renders label", async () => {
    renderComponent({ label: "Fruit" });

    expect(
      await screen.findByRole("radiogroup", { name: "Fruit" }),
    ).toBeInTheDocument();
  });

  it("renders aria-label when label is not provided", async () => {
    renderComponent({ label: null, "aria-label": "Fruit" });

    expect(
      await screen.findByRole("radiogroup", { name: "Fruit" }),
    ).toBeInTheDocument();
  });

  it("renders each option as a radio button", async () => {
    renderComponent({ value: "apple" });

    expect(
      await screen.findByRole("radio", { name: "trueApple" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("radio", { name: "falseBanana" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("radio", { name: "falseCherry" }),
    ).toBeInTheDocument();
  });

  it("marks the option matching value as checked", async () => {
    renderComponent({ value: "banana" });

    expect(
      await screen.findByRole("radio", { name: "trueBanana" }),
    ).toBeChecked();
    expect(
      await screen.findByRole("radio", { name: "falseApple" }),
    ).not.toBeChecked();
    expect(
      await screen.findByRole("radio", { name: "falseCherry" }),
    ).not.toBeChecked();
  });

  it("renders option description when provided", async () => {
    renderComponent({
      options: [
        { value: "apple", label: "Apple", description: "A crisp fruit" },
        ...defaultOptions.slice(1),
      ],
    });

    expect(await screen.findByText("A crisp fruit")).toBeInTheDocument();
  });

  it("renders group description when provided", async () => {
    renderComponent({ description: "Choose a fruit" });

    expect(await screen.findByText("Choose a fruit")).toBeInTheDocument();
  });

  it("renders error message when provided", async () => {
    renderComponent({ errorMessage: "Selection required" });

    expect(await screen.findByText("Selection required")).toBeInTheDocument();
  });

  it("marks group as invalid when error message is provided", async () => {
    renderComponent({ label: "Fruit", errorMessage: "Selection required" });

    expect(
      await screen.findByRole("radiogroup", { name: "Fruit" }),
    ).toHaveAttribute("aria-invalid", "true");
  });

  it("disables all options when disabled", async () => {
    renderComponent({ disabled: true });

    expect(
      await screen.findByRole("radio", { name: "trueApple" }),
    ).toBeDisabled();
    expect(
      await screen.findByRole("radio", { name: "falseBanana" }),
    ).toBeDisabled();
    expect(
      await screen.findByRole("radio", { name: "falseCherry" }),
    ).toBeDisabled();
  });

  it("disables an individual option when option.disabled is true", async () => {
    renderComponent({
      options: [
        defaultOptions[0],
        { ...defaultOptions[1], disabled: true },
        defaultOptions[2],
      ],
    });

    expect(
      await screen.findByRole("radio", { name: "falseBanana" }),
    ).toBeDisabled();
    expect(
      await screen.findByRole("radio", { name: "trueApple" }),
    ).toBeEnabled();
    expect(
      await screen.findByRole("radio", { name: "falseCherry" }),
    ).toBeEnabled();
  });

  it("renders read-only state", async () => {
    renderComponent({ label: "Fruit", readOnly: true });

    expect(
      await screen.findByRole("radiogroup", { name: "Fruit" }),
    ).toHaveAttribute("aria-readonly", "true");
  });

  it("calls onChange when selecting a different option", async () => {
    const onChange = vi.fn();
    renderComponent({ value: "apple", onChange });
    const user = userEvent.setup();

    await user.click(await screen.findByRole("radio", { name: "falseBanana" }));

    expect(onChange).toHaveBeenCalledWith("banana");
  });

  it("does not call onChange when clicking the already-selected option", async () => {
    const onChange = vi.fn();
    renderComponent({ value: "apple", onChange });
    const user = userEvent.setup();

    await user.click(await screen.findByRole("radio", { name: "trueApple" }));

    expect(onChange).not.toHaveBeenCalled();
  });
});
