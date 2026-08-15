import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { XIcon } from "lucide-react";
import { describe, expect, it } from "vitest";

import { IconButton } from "#src/ui/primitives/IconButton";

import type React from "react";

function renderComponent(
  props?: Partial<React.ComponentProps<typeof IconButton>>,
) {
  return render(<IconButton icon={XIcon} label="Icon button" {...props} />);
}

describe("IconButton", () => {
  it("renders icon and accessible label", async () => {
    const { container } = renderComponent();
    expect(container.querySelector("svg.lucide")).toBeInTheDocument();
    expect(await screen.findByLabelText("Icon button")).toBeInTheDocument();
  });

  it("renders tooltip on hover", async () => {
    renderComponent();
    const user = userEvent.setup();

    expect(screen.queryByText("Icon button")).not.toBeInTheDocument();

    await user.hover(document.body);
    await user.hover(
      await screen.findByRole("button", { name: "Icon button" }),
    );

    expect(await screen.findByText("Icon button")).toBeInTheDocument();
  });
});
