import { render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button, DialogTrigger, Modal } from "react-aria-components";
import { beforeEach, describe, expect, it } from "vitest";

import { makeRegistryFixture } from "#src/specifications/test/fixtures";
import {
  DEFAULT_UI_STATE,
  DEFAULT_USER_PREFERENCES,
} from "#src/state/defaults";
import { useStore } from "#src/state/useStore";
import { FormLabelDialog } from "#src/ui/forms/FormLabelDialog";

import type { FormClass } from "#src/common/types/formClass";
import type { ApplicationState } from "#src/state/types/applicationState";

const TEST_CLASS: FormClass = "fW2";
const INSTANCE_ID = "instance-1";
const ORIGINAL_LABEL = "Original label";

function initializeStore() {
  const applicationState: ApplicationState = {
    filingStatus: "single",
    formClasses: [TEST_CLASS],
    formInstances: {
      [TEST_CLASS]: [
        {
          id: INSTANCE_ID,
          class: TEST_CLASS,
          label: ORIGINAL_LABEL,
          inputs: {},
        },
      ],
    },
  };
  const { result } = renderHook(() => useStore((state) => state));
  result.current.initialize(
    applicationState,
    DEFAULT_UI_STATE,
    DEFAULT_USER_PREFERENCES,
    makeRegistryFixture(),
  );
}

function renderComponent() {
  return render(
    <DialogTrigger>
      <Button>Open</Button>
      <Modal>
        <FormLabelDialog formClass={TEST_CLASS} instanceId={INSTANCE_ID} />
      </Modal>
    </DialogTrigger>,
  );
}

function renderInstanceLabel() {
  return renderHook(() =>
    useStore(
      (state) =>
        state.applicationState.formInstances[TEST_CLASS]?.find(
          (instance) => instance.id === INSTANCE_ID,
        )?.label,
    ),
  );
}

async function openDialog(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "Open" }));
  return screen.findByRole("textbox", { name: "New label" });
}

beforeEach(() => {
  initializeStore();
});

describe("FormLabelDialog", () => {
  it("renders dialog when triggered", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole("button", { name: "Open" }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", { name: "Set form label" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("textbox", { name: "New label" }),
    ).toHaveValue(ORIGINAL_LABEL);
  });

  it("sets form instance label and closes dialog when done is pressed", async () => {
    const user = userEvent.setup();
    const { result, rerender } = renderInstanceLabel();
    renderComponent();

    const input = await openDialog(user);
    await user.clear(input);
    await user.type(input, "Updated label");
    await user.click(screen.getByRole("button", { name: "Done" }));

    rerender();
    expect(result.current).toEqual("Updated label");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("closes dialog and does not update form instance label when cancel is pressed", async () => {
    const user = userEvent.setup();
    const { result, rerender } = renderInstanceLabel();
    renderComponent();

    const input = await openDialog(user);
    await user.clear(input);
    await user.type(input, "Discarded label");
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    rerender();
    expect(result.current).toEqual(ORIGINAL_LABEL);
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("shows error message and prevents submission when text field is empty", async () => {
    const user = userEvent.setup();
    const { result, rerender } = renderInstanceLabel();
    renderComponent();

    const input = await openDialog(user);
    await user.clear(input);

    expect(await screen.findByText("Label is required")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Done" }));

    rerender();
    expect(result.current).toEqual(ORIGINAL_LABEL);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("autofocuses text field on open", async () => {
    const user = userEvent.setup();
    renderComponent();

    const input = await openDialog(user);

    expect(input).toHaveFocus();
  });

  it("submits when enter key is pressed", async () => {
    const user = userEvent.setup();
    const { result, rerender } = renderInstanceLabel();
    renderComponent();

    const input = await openDialog(user);
    await user.clear(input);
    await user.type(input, "Submitted with enter{Enter}");

    rerender();
    expect(result.current).toEqual("Submitted with enter");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });
});
