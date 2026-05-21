import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AmountListInput } from "#src/ui/forms/AmountListInput";

import type React from "react";

function renderComponent(
  props?: Partial<React.ComponentProps<typeof AmountListInput>>,
) {
  return render(
    <AmountListInput
      formTitle="W-2"
      instanceLabel="Employer 1"
      boxIdentifier="12a"
      list={[]}
      onChange={vi.fn()}
      {...props}
    />,
  );
}

describe("AmountListInput", () => {
  it("renders current list entries with accessible input labels", async () => {
    renderComponent({
      list: [
        { label: "Code A", amount: 100 },
        { label: "Code B", amount: 200 },
      ],
    });

    expect(
      await screen.findByLabelText("W-2 (Employer 1) box 12a list of amounts"),
    ).toBeInTheDocument();
    expect(await screen.findByLabelText("Entry 1 label")).toHaveValue("Code A");
    expect(await screen.findByLabelText("Entry 1 amount")).toHaveValue("100");
    expect(await screen.findByLabelText("Entry 2 label")).toHaveValue("Code B");
    expect(await screen.findByLabelText("Entry 2 amount")).toHaveValue("200");
  });

  it("calls onChange when changing an entry's label", async () => {
    const onChange = vi.fn();
    renderComponent({
      list: [
        { label: "test1", amount: 100 },
        { label: "test2", amount: 200 },
      ],
      onChange,
    });
    const user = userEvent.setup();

    await user.type(await screen.findByLabelText("Entry 2 label"), "3");

    expect(onChange).toHaveBeenCalledWith([
      { label: "test1", amount: 100 },
      { label: "test23", amount: 200 },
    ]);
  });

  it("calls onChange when changing an entry's amount", async () => {
    const onChange = vi.fn();
    renderComponent({
      list: [
        { label: "test1", amount: 100 },
        { label: "test2", amount: 200 },
      ],
      onChange,
    });
    const user = userEvent.setup();

    const amountInput = await screen.findByLabelText("Entry 2 amount");
    await user.clear(amountInput);
    await user.type(amountInput, "345");
    await user.tab();

    expect(onChange).toHaveBeenCalledWith([
      { label: "test1", amount: 100 },
      { label: "test2", amount: 345 },
    ]);
  });

  it("calls onChange when adding an entry", async () => {
    const onChange = vi.fn();
    renderComponent({ list: [{ label: "first", amount: 100 }], onChange });
    const user = userEvent.setup();

    await user.click(await screen.findByRole("button", { name: "Add" }));

    expect(onChange).toHaveBeenCalledWith([
      { label: "first", amount: 100 },
      { label: "", amount: 0 },
    ]);
  });

  it("calls onChange when removing an entry", async () => {
    const onChange = vi.fn();
    renderComponent({
      list: [
        { label: "first", amount: 100 },
        { label: "second", amount: 200 },
      ],
      onChange,
    });
    const user = userEvent.setup();

    const removeButtons = await screen.findAllByRole("button", {
      name: "Remove",
    });
    await user.click(removeButtons[0]);

    expect(onChange).toHaveBeenCalledWith([{ label: "second", amount: 200 }]);
  });
});
