import { render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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
import { DownloadSaveFileButton } from "#src/ui/control-bar/DownloadSaveFileButton";

function initializeStore() {
  const { result } = renderHook(() => useStore((state) => state));
  result.current.initialize(
    DEFAULT_APPLICATION_STATE,
    DEFAULT_UI_STATE,
    DEFAULT_USER_PREFERENCES,
    makeRegistryFixture(),
  );
}

describe("DownloadSaveFileButton", () => {
  let createObjectUrl: ReturnType<typeof vi.fn>;
  let revokeObjectUrl: ReturnType<typeof vi.fn>;
  let lastBlob: Blob | undefined;
  let clickSpy: ReturnType<typeof vi.spyOn>;
  let originalCreateObjectURL: typeof URL.createObjectURL;
  let originalRevokeObjectURL: typeof URL.revokeObjectURL;

  beforeEach(() => {
    initializeStore();

    lastBlob = undefined;
    createObjectUrl = vi.fn((blob: Blob) => {
      lastBlob = blob;
      return "blob:mock-url";
    });
    revokeObjectUrl = vi.fn();
    originalCreateObjectURL = URL.createObjectURL;
    originalRevokeObjectURL = URL.revokeObjectURL;
    URL.createObjectURL =
      createObjectUrl as unknown as typeof URL.createObjectURL;
    URL.revokeObjectURL =
      revokeObjectUrl as unknown as typeof URL.revokeObjectURL;
    clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    clickSpy.mockRestore();
  });

  it("renders a button for downloading the save file", () => {
    render(<DownloadSaveFileButton />);

    expect(
      screen.getByRole("button", { name: "Download save file" }),
    ).toBeInTheDocument();
  });

  it("downloads a save file containing the current application state when clicked", async () => {
    const user = userEvent.setup();
    render(<DownloadSaveFileButton />);

    await user.click(
      screen.getByRole("button", { name: "Download save file" }),
    );

    expect(createObjectUrl).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectUrl).toHaveBeenCalledWith("blob:mock-url");
    expect(lastBlob).toBeDefined();
    expect(lastBlob?.type).toBe("application/json");

    if (!lastBlob) throw new Error("no blob");
    const text = await lastBlob.text();
    const parsed = JSON.parse(text);
    expect(parsed).toEqual({
      applicationState: DEFAULT_APPLICATION_STATE,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      taxYear: CURRENT_TAX_YEAR,
    });
  });
});
