import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Temporal } from "temporal-polyfill";
import { describe, expect, it, vi } from "vitest";

import { DatePicker } from "#src/ui/primitives/DatePicker";

import type React from "react";

function renderComponent(
  props?: Partial<React.ComponentProps<typeof DatePicker>>,
) {
  return render(
    <DatePicker
      label="Test label"
      value={null}
      onChange={vi.fn()}
      {...props}
    />,
  );
}

describe("DatePicker", () => {
  it("renders with null value", async () => {
    renderComponent({ label: "Test", value: null });

    const group = await screen.findByRole("group");
    expect(group).toHaveAccessibleName("Test");
    expect(group).toHaveTextContent("mm/dd/yyyy");
    const spinButtons = await within(group).findAllByRole("spinbutton");
    expect(spinButtons).toHaveLength(3);
    expect(spinButtons[0]).toHaveTextContent("mm");
    expect(spinButtons[1]).toHaveTextContent("dd");
    expect(spinButtons[2]).toHaveTextContent("yyyy");

    expect(
      await screen.findByRole("button", { name: "Calendar Test" }),
    ).toBeInTheDocument();
  });

  it("renders with date value", async () => {
    renderComponent({
      label: "Test",
      value: new Temporal.PlainDate(2026, 8, 31),
    });

    const group = await screen.findByRole("group");
    expect(group).toHaveAccessibleName("Test");
    expect(group).toHaveTextContent("08/31/2026");
    const spinButtons = await within(group).findAllByRole("spinbutton");
    expect(spinButtons).toHaveLength(3);
    expect(spinButtons[0]).toHaveTextContent("08");
    expect(spinButtons[1]).toHaveTextContent("31");
    expect(spinButtons[2]).toHaveTextContent("2026");

    expect(
      await screen.findByRole("button", { name: "Calendar Test" }),
    ).toBeInTheDocument();
  });

  it("renders with aria-label when provided", async () => {
    renderComponent({ label: null, "aria-label": "Test", value: null });

    expect(await screen.findByRole("group")).toHaveAccessibleName("Test");
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

    // toBeDisabled() doesn't work for divs/spans
    expect(await screen.findByRole("group")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(
      await screen.findByRole("button", { name: "Calendar Test label" }),
    ).toBeDisabled();
  });

  it("renders read-only state", async () => {
    renderComponent({ readOnly: true });

    expect(await screen.findByRole("presentation")).toHaveAttribute(
      "data-readonly",
      "true",
    );
    expect(
      await screen.findByRole("button", { name: "Calendar Test label" }),
    ).toBeDisabled();
  });

  it("uses aria-labelledby for the accessible name", async () => {
    render(
      <>
        <span id="ext-label">External label</span>
        <DatePicker
          aria-labelledby="ext-label"
          value={null}
          onChange={vi.fn()}
        />
      </>,
    );

    expect(await screen.findByRole("group")).toHaveAccessibleName(
      "External label",
    );
  });

  it("uses aria-describedby for the accessible description", async () => {
    render(
      <>
        <span id="ext-desc">External description</span>
        <DatePicker
          aria-label="Field"
          aria-describedby="ext-desc"
          value={null}
          onChange={vi.fn()}
        />
      </>,
    );

    expect(await screen.findByRole("group")).toHaveAccessibleDescription(
      "External description",
    );
  });

  it("merges aria-describedby with the error message", async () => {
    render(
      <>
        <span id="ext-desc">External description</span>
        <DatePicker
          aria-label="Field"
          aria-describedby="ext-desc"
          errorMessage="Bad value"
          value={null}
          onChange={vi.fn()}
        />
      </>,
    );

    const group = await screen.findByRole("group");
    expect(group).toHaveAccessibleDescription(/External description/);
    expect(group).toHaveAccessibleDescription(/Bad value/);
  });

  it("opens calendar popover when calendar button is pressed", async () => {
    renderComponent({
      label: "Test",
      value: new Temporal.PlainDate(2024, 2, 24),
    });
    const user = userEvent.setup();
    expect(screen.queryByRole("application")).not.toBeInTheDocument();

    await user.click(
      await screen.findByRole("button", { name: "Calendar Test" }),
    );

    expect(
      await screen.findByRole("application", { name: "February 2024" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: "Previous month" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: "Next month" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("grid", { name: "February 2024" }),
    ).toBeInTheDocument();
    // toBeDisabled() doesn't work for divs/spans
    expect(
      await screen.findByRole("button", { name: "Sunday, January 28, 2024" }),
    ).toHaveAttribute("aria-disabled", "true");
    expect(
      await screen.findByRole("button", {
        name: "Wednesday, January 31, 2024",
      }),
    ).toHaveAttribute("aria-disabled", "true");
    expect(
      await screen.findByRole("button", { name: "Thursday, February 1, 2024" }),
    ).toBeEnabled();
    expect(
      await screen.findByRole("button", {
        name: "Thursday, February 29, 2024",
      }),
    ).toBeEnabled();
    expect(
      await screen.findByRole("button", { name: "Friday, March 1, 2024" }),
    ).toHaveAttribute("aria-disabled", "true");
    expect(
      await screen.findByRole("button", { name: "Saturday, March 2, 2024" }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("navigates to previous and next month in calendar", async () => {
    renderComponent({
      label: "Test",
      value: new Temporal.PlainDate(2024, 2, 24),
    });
    const user = userEvent.setup();

    await user.click(
      await screen.findByRole("button", { name: "Calendar Test" }),
    );
    expect(
      await screen.findByRole("application", { name: "February 2024" }),
    ).toBeInTheDocument();

    await user.click(
      await screen.findByRole("button", { name: "Previous month" }),
    );
    expect(
      await screen.findByRole("application", { name: "January 2024" }),
    ).toBeInTheDocument();

    await user.click(await screen.findByRole("button", { name: "Next month" }));
    await user.click(await screen.findByRole("button", { name: "Next month" }));
    expect(
      await screen.findByRole("application", { name: "March 2024" }),
    ).toBeInTheDocument();
  });

  it("calls onChange when typing new date in", async () => {
    const onChange = vi.fn();
    renderComponent({ value: null, onChange });
    const user = userEvent.setup();
    expect(onChange).not.toHaveBeenCalled();

    const spinButtons = await screen.findAllByRole("spinbutton");

    await user.type(spinButtons[0], "08");
    expect(onChange).not.toHaveBeenCalled();

    await user.type(spinButtons[1], "31");
    expect(onChange).not.toHaveBeenCalled();

    await user.type(spinButtons[2], "2");
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ day: 31, month: 8, year: 2 }),
    );
  });

  it("calls onChange when typing to change existing date", async () => {
    const onChange = vi.fn();
    renderComponent({ value: new Temporal.PlainDate(2026, 8, 31), onChange });
    const user = userEvent.setup();
    expect(onChange).not.toHaveBeenCalled();

    const spinButtons = await screen.findAllByRole("spinbutton");

    await user.type(spinButtons[0], "7");
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ day: 31, month: 7, year: 2026 }),
    );
  });

  it("calls onChange when a date is pressed in the calendar", async () => {
    const onChange = vi.fn();
    renderComponent({
      label: "Test",
      value: new Temporal.PlainDate(2024, 2, 24),
      onChange,
    });
    const user = userEvent.setup();
    expect(onChange).not.toHaveBeenCalled();

    await user.click(
      await screen.findByRole("button", { name: "Calendar Test" }),
    );
    await user.click(await screen.findByRole("button", { name: "Next month" }));
    await user.click(
      await screen.findByRole("button", { name: "Sunday, March 31, 2024" }),
    );

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ day: 31, month: 3, year: 2024 }),
    );
  });
});
