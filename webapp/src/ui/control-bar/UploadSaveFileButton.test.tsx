import { render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  CURRENT_SCHEMA_VERSION,
  CURRENT_TAX_YEAR,
} from "#src/persistence/config";
import {
  DEFAULT_APPLICATION_STATE,
  DEFAULT_UI_STATE,
  DEFAULT_USER_PREFERENCES,
} from "#src/state/defaults";
import { useStore } from "#src/state/useStore";
import { makeRegistryFixture } from "#src/test/specificationFixtures";
import { UploadSaveFileButton } from "#src/ui/control-bar/UploadSaveFileButton";

function initializeStore() {
  const { result } = renderHook(() => useStore((state) => state));
  result.current.initialize(
    DEFAULT_APPLICATION_STATE,
    DEFAULT_UI_STATE,
    DEFAULT_USER_PREFERENCES,
    makeRegistryFixture(),
  );
}

function renderApplicationState() {
  return renderHook(() => useStore((state) => state.applicationState));
}

function renderLoadErrors() {
  return renderHook(() => useStore((state) => state.loadErrors));
}

function fileFromJson(value: unknown): File {
  return new File([JSON.stringify(value)], "upload.json", {
    type: "application/json",
  });
}

function getFileInput(container: HTMLElement): HTMLInputElement {
  const input = container.querySelector('input[type="file"]');
  if (!(input instanceof HTMLInputElement)) {
    throw new Error("expected a file input");
  }
  return input;
}

beforeEach(() => {
  initializeStore();
});

describe("UploadSaveFileButton", () => {
  it("renders a button for triggering the file picker", () => {
    render(<UploadSaveFileButton />);

    expect(
      screen.getByRole("button", { name: "Upload save file" }),
    ).toBeInTheDocument();
  });

  it("opens a confirmation dialog after a file is selected", async () => {
    const { container } = render(<UploadSaveFileButton />);

    await userEvent.upload(
      getFileInput(container),
      fileFromJson({
        applicationState: DEFAULT_APPLICATION_STATE,
        schemaVersion: CURRENT_SCHEMA_VERSION,
        taxYear: CURRENT_TAX_YEAR,
      }),
    );

    expect(
      await screen.findByRole("heading", { name: "Replace current data?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Uploading a save file will replace your current return. This can’t be undone.",
      ),
    ).toBeInTheDocument();
  });

  it("discards the file and leaves state unchanged when cancelled", async () => {
    const user = userEvent.setup();
    const { container } = render(<UploadSaveFileButton />);
    const { result: applicationState } = renderApplicationState();

    await userEvent.upload(
      getFileInput(container),
      fileFromJson({
        applicationState: {
          filingStatus: "married_filing_jointly" as const,
          formClasses: [],
          formInstances: {},
        },
        schemaVersion: CURRENT_SCHEMA_VERSION,
        taxYear: CURRENT_TAX_YEAR,
      }),
    );
    await screen.findByRole("dialog");

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(applicationState.current).toEqual(DEFAULT_APPLICATION_STATE);
  });

  it("replaces the application state and closes the dialog when upload is confirmed", async () => {
    const user = userEvent.setup();
    const { container } = render(<UploadSaveFileButton />);
    const { result: applicationState } = renderApplicationState();

    const newApplicationState = {
      filingStatus: "married_filing_jointly" as const,
      formClasses: [],
      formInstances: {},
    };

    await userEvent.upload(
      getFileInput(container),
      fileFromJson({
        applicationState: newApplicationState,
        schemaVersion: CURRENT_SCHEMA_VERSION,
        taxYear: CURRENT_TAX_YEAR,
      }),
    );
    await screen.findByRole("dialog");

    await user.click(screen.getByRole("button", { name: "Upload" }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(applicationState.current).toEqual(newApplicationState);
  });

  it("leaves application state unchanged and reports errors when the file is invalid", async () => {
    const user = userEvent.setup();
    const { container } = render(<UploadSaveFileButton />);
    const { result: applicationState } = renderApplicationState();
    const { result: loadErrors } = renderLoadErrors();

    await userEvent.upload(
      getFileInput(container),
      new File(["{ not json"], "bad.json", { type: "application/json" }),
    );
    await screen.findByRole("dialog");

    await user.click(screen.getByRole("button", { name: "Upload" }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(applicationState.current).toEqual(DEFAULT_APPLICATION_STATE);
    expect(loadErrors.current).toEqual([{ type: "invalid_json" }]);
  });

  it("disables the dialog's actions and blocks dismissal while the upload is pending", async () => {
    const user = userEvent.setup();
    const { container } = render(<UploadSaveFileButton />);

    let resolveText: (value: string) => void = () => {};
    const text = new Promise<string>((resolve) => {
      resolveText = resolve;
    });
    const file = new File(["placeholder"], "upload.json", {
      type: "application/json",
    });
    vi.spyOn(file, "text").mockReturnValue(text);

    await userEvent.upload(getFileInput(container), file);
    await screen.findByRole("dialog");

    const uploadButton = screen.getByRole("button", { name: "Upload" });
    const cancelButton = screen.getByRole("button", { name: "Cancel" });

    await user.click(uploadButton);

    expect(uploadButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();

    await user.keyboard("{Escape}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    resolveText(
      JSON.stringify({
        applicationState: DEFAULT_APPLICATION_STATE,
        schemaVersion: CURRENT_SCHEMA_VERSION,
        taxYear: CURRENT_TAX_YEAR,
      }),
    );

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });
});
