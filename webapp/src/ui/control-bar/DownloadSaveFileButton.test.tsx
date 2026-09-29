import { render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CURRENT_SCHEMA_VERSION } from "#src/persistence/config";
import {
  DEFAULT_APPLICATION_STATE,
  DEFAULT_UI_STATE,
  DEFAULT_USER_PREFERENCES,
} from "#src/state/defaults";
import { useStore } from "#src/state/useStore";
import {
  makeBoxFixture,
  makeLineFixture,
  makeRegistryFixture,
  makeSectionFixture,
  makeSpecificationFixture,
  makeSpecificationsByYearFixture,
} from "#src/test/specificationFixtures";
import { DownloadSaveFileButton } from "#src/ui/control-bar/DownloadSaveFileButton";

import type { ApplicationState } from "#src/state/types/applicationState";

function initializeStore(
  applicationState: ApplicationState = DEFAULT_APPLICATION_STATE,
) {
  const { result } = renderHook(() => useStore((state) => state));
  result.current.initialize(
    applicationState,
    DEFAULT_UI_STATE,
    DEFAULT_USER_PREFERENCES,
    // Only 2025 recognizes the W-2 wages input.
    makeSpecificationsByYearFixture(makeRegistryFixture(), {
      2025: makeRegistryFixture({
        fW2: makeSpecificationFixture({
          class: "fW2",
          sections: [
            makeSectionFixture({
              lines: [
                makeLineFixture({
                  box: makeBoxFixture({
                    identifier: "1",
                    value: { type: "number_input", inputKey: "wages" },
                  }),
                }),
              ],
            }),
          ],
        }),
      }),
    }),
  );
}

const STATE_WITH_WAGES: ApplicationState = {
  taxYear: 2026,
  filingStatus: "single",
  formClasses: ["fW2"],
  formInstances: {
    fW2: [
      {
        id: "w2-1",
        class: "fW2",
        label: "Employer",
        inputs: { wages: { type: "number", value: 68000 } },
      },
    ],
  },
};

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

  async function downloadAndParse(): Promise<{
    fileName: string | null;
    contents: unknown;
  }> {
    let fileName: string | null = null;
    clickSpy.mockImplementation(function (this: HTMLAnchorElement) {
      fileName = this.getAttribute("download");
    });
    const user = userEvent.setup();
    await user.click(
      screen.getByRole("button", { name: "Download save file" }),
    );
    if (!lastBlob) throw new Error("no blob");
    return { fileName, contents: JSON.parse(await lastBlob.text()) };
  }

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
    });
  });

  it("excludes inputs that the current tax year doesn't recognize", async () => {
    initializeStore(STATE_WITH_WAGES);
    render(<DownloadSaveFileButton />);

    const { contents } = await downloadAndParse();

    expect(contents).toEqual({
      applicationState: {
        ...STATE_WITH_WAGES,
        formInstances: {
          fW2: [{ id: "w2-1", class: "fW2", label: "Employer", inputs: {} }],
        },
      },
      schemaVersion: CURRENT_SCHEMA_VERSION,
    });
  });

  it("includes inputs that the current tax year recognizes and names the file after the year", async () => {
    initializeStore({ ...STATE_WITH_WAGES, taxYear: 2025 });
    render(<DownloadSaveFileButton />);

    const { fileName, contents } = await downloadAndParse();

    expect(contents).toEqual({
      applicationState: { ...STATE_WITH_WAGES, taxYear: 2025 },
      schemaVersion: CURRENT_SCHEMA_VERSION,
    });
    expect(fileName).toMatch(/^thumbtax-ty2025_/);
  });
});
