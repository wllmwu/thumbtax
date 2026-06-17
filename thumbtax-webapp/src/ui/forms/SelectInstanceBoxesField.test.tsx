import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  makeRegistryFixture,
  makeSpecificationFixture,
} from "#src/specifications/test/fixtures";
import { SelectInstanceBoxesField } from "#src/ui/forms/SelectInstanceBoxesField";

import type React from "react";

function renderComponent(
  props?: Partial<React.ComponentProps<typeof SelectInstanceBoxesField>>,
) {
  return render(
    <SelectInstanceBoxesField
      aria-label="Test field"
      specifications={makeRegistryFixture({
        fW2: makeSpecificationFixture({ class: "fW2", title: "W-2" }),
      })}
      instanceRegistry={{
        fW2: [
          { id: "w2-a", class: "fW2", label: "Employer A", inputs: {} },
          { id: "w2-b", class: "fW2", label: "Employer B", inputs: {} },
        ],
      }}
      boxAddress={{ instance: "f1040-1", box: "12a" }}
      valueProvider={{
        type: "select_instance_boxes_input",
        options: [{ form: "fW2", box: "1" }],
      }}
      selectedAddresses={[]}
      onChange={vi.fn()}
      {...props}
    />,
  );
}

describe("SelectInstanceBoxesField", () => {
  it("renders trigger button with no forms selected", async () => {
    renderComponent();

    expect(await screen.findByLabelText("Test field")).toHaveTextContent(
      "0 form(s) selected",
    );
  });

  it("renders trigger button with forms selected", async () => {
    renderComponent({
      selectedAddresses: [
        { instance: "w2-a", box: "1" },
        { instance: "w2-b", box: "1" },
      ],
    });

    expect(await screen.findByLabelText("Test field")).toHaveTextContent(
      "2 form(s) selected",
    );
  });

  it("renders error message when provided", async () => {
    renderComponent({ errorMessage: "Test error message" });

    expect(await screen.findByText("Test error message")).toBeInTheDocument();
  });

  it("opens popover and lists an option per instance when trigger is pressed", async () => {
    renderComponent();
    const user = userEvent.setup();

    await user.click(await screen.findByRole("button"));

    expect(await screen.findAllByRole("option")).toHaveLength(2);
    expect(
      await screen.findByRole("option", { name: "W-2 (Employer A) 1" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("option", { name: "W-2 (Employer B) 1" }),
    ).toBeInTheDocument();
  });

  it("lists options across multiple form classes", async () => {
    renderComponent({
      specifications: makeRegistryFixture({
        fW2: makeSpecificationFixture({ class: "fW2", title: "W-2" }),
        f1099INT: makeSpecificationFixture({
          class: "f1099INT",
          title: "1099-INT",
        }),
      }),
      instanceRegistry: {
        fW2: [{ id: "w2-a", class: "fW2", label: "Employer A", inputs: {} }],
        f1099INT: [
          { id: "int-x", class: "f1099INT", label: "Payer X", inputs: {} },
        ],
      },
      valueProvider: {
        type: "select_instance_boxes_input",
        options: [
          { form: "fW2", box: "1" },
          { form: "f1099INT", box: "1" },
        ],
      },
    });
    const user = userEvent.setup();

    await user.click(await screen.findByRole("button"));

    expect(await screen.findAllByRole("option")).toHaveLength(2);
    expect(
      await screen.findByRole("option", { name: "W-2 (Employer A) 1" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("option", { name: "1099-INT (Payer X) 1" }),
    ).toBeInTheDocument();
  });

  it("lists options for multiple boxes of same form class", async () => {
    renderComponent({
      instanceRegistry: {
        fW2: [
          { id: "w2-a", class: "fW2", label: "Employer A", inputs: {} },
          { id: "w2-b", class: "fW2", label: "Employer B", inputs: {} },
        ],
      },
      valueProvider: {
        type: "select_instance_boxes_input",
        options: [
          { form: "fW2", box: "1" },
          { form: "fW2", box: "2" },
        ],
      },
    });
    const user = userEvent.setup();

    await user.click(await screen.findByRole("button"));

    expect(await screen.findAllByRole("option")).toHaveLength(4);
    expect(
      await screen.findByRole("option", { name: "W-2 (Employer A) 1" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("option", { name: "W-2 (Employer A) 2" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("option", { name: "W-2 (Employer B) 1" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("option", { name: "W-2 (Employer B) 2" }),
    ).toBeInTheDocument();
  });

  it("omits options for forms with no instances", async () => {
    renderComponent({
      instanceRegistry: {
        fW2: [{ id: "w2-a", class: "fW2", label: "Employer A", inputs: {} }],
      },
      valueProvider: {
        type: "select_instance_boxes_input",
        options: [
          { form: "fW2", box: "1" },
          { form: "f1099INT", box: "1" },
        ],
      },
    });
    const user = userEvent.setup();

    await user.click(await screen.findByRole("button"));

    expect(await screen.findAllByRole("option")).toHaveLength(1);
    expect(
      await screen.findByRole("option", { name: "W-2 (Employer A) 1" }),
    ).toBeInTheDocument();
  });

  it("calls onChange when option is selected from empty selection", async () => {
    const onChange = vi.fn();
    renderComponent({ onChange });
    const user = userEvent.setup();

    await user.click(await screen.findByRole("button"));
    await user.click(
      await screen.findByRole("option", { name: "W-2 (Employer A) 1" }),
    );

    expect(onChange).toHaveBeenCalledWith([{ instance: "w2-a", box: "1" }]);
  });

  it("calls onChange adding to existing selection", async () => {
    const onChange = vi.fn();
    renderComponent({
      selectedAddresses: [{ instance: "w2-a", box: "1" }],
      onChange,
    });
    const user = userEvent.setup();

    await user.click(await screen.findByRole("button"));
    await user.click(
      await screen.findByRole("option", { name: "W-2 (Employer B) 1" }),
    );

    expect(onChange).toHaveBeenCalledWith([
      { instance: "w2-a", box: "1" },
      { instance: "w2-b", box: "1" },
    ]);
  });

  it("calls onChange when the only selected option is deselected", async () => {
    const onChange = vi.fn();
    renderComponent({
      selectedAddresses: [{ instance: "w2-a", box: "1" }],
      onChange,
    });
    const user = userEvent.setup();

    await user.click(await screen.findByRole("button"));
    await user.click(
      await screen.findByRole("option", { name: "W-2 (Employer A) 1" }),
    );

    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("calls onChange deselecting one of multiple selected options", async () => {
    const onChange = vi.fn();
    renderComponent({
      selectedAddresses: [
        { instance: "w2-a", box: "1" },
        { instance: "w2-b", box: "1" },
      ],
      onChange,
    });
    const user = userEvent.setup();

    await user.click(await screen.findByRole("button"));
    await user.click(
      await screen.findByRole("option", { name: "W-2 (Employer A) 1" }),
    );

    expect(onChange).toHaveBeenCalledWith([{ instance: "w2-b", box: "1" }]);
  });

  it("uses aria-labelledby for the accessible name", async () => {
    render(<span id="ext-label">External label</span>);
    renderComponent({
      "aria-label": undefined,
      "aria-labelledby": "ext-label",
    });

    expect(await screen.findByRole("button")).toHaveAccessibleName(
      /External label/,
    );
  });

  it("uses aria-describedby for the accessible description", async () => {
    render(<span id="ext-desc">External description</span>);
    renderComponent({ "aria-describedby": "ext-desc" });

    expect(await screen.findByRole("button")).toHaveAccessibleDescription(
      "External description",
    );
  });

  it("merges aria-describedby with the error message", async () => {
    render(<span id="ext-desc">External description</span>);
    renderComponent({
      "aria-describedby": "ext-desc",
      errorMessage: "Bad value",
    });

    const button = await screen.findByRole("button");
    expect(button).toHaveAccessibleDescription(/External description/);
    expect(button).toHaveAccessibleDescription(/Bad value/);
  });
});
