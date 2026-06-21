import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  CURRENT_SCHEMA_VERSION,
  CURRENT_TAX_YEAR,
} from "#src/persistence/config";
import { downloadSaveFile } from "#src/persistence/downloadSaveFile";

import type { ApplicationState } from "#src/state/types/applicationState";

const TEST_STATE: ApplicationState = {
  filingStatus: "single",
  formClasses: [],
  formInstances: {},
};

describe("downloadSaveFile", () => {
  let createObjectUrl: ReturnType<typeof vi.fn>;
  let revokeObjectUrl: ReturnType<typeof vi.fn>;
  let lastBlob: Blob | undefined;
  let clickSpy: ReturnType<typeof vi.spyOn>;
  let originalCreateObjectURL: typeof URL.createObjectURL;
  let originalRevokeObjectURL: typeof URL.revokeObjectURL;

  beforeEach(() => {
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

  it("creates a Blob containing the serialized PersistedState and triggers a download", async () => {
    downloadSaveFile(TEST_STATE);

    expect(createObjectUrl).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectUrl).toHaveBeenCalledWith("blob:mock-url");
    expect(lastBlob).toBeDefined();
    expect(lastBlob?.type).toBe("application/json");

    if (!lastBlob) throw new Error("no blob");
    const text = await lastBlob.text();
    const parsed = JSON.parse(text);
    expect(parsed).toEqual({
      applicationState: TEST_STATE,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      taxYear: CURRENT_TAX_YEAR,
    });
  });

  it("uses the provided filename on the anchor when given", () => {
    let downloadAttribute: string | undefined;
    clickSpy.mockImplementation(function (this: HTMLAnchorElement) {
      downloadAttribute = this.getAttribute("download") ?? undefined;
    });

    downloadSaveFile(TEST_STATE, "my-taxes.json");
    expect(downloadAttribute).toBe("my-taxes.json");
  });

  it("defaults the filename to thumbtax-YYYY-MM-DD.json when not given", () => {
    let downloadAttribute: string | undefined;
    clickSpy.mockImplementation(function (this: HTMLAnchorElement) {
      downloadAttribute = this.getAttribute("download") ?? undefined;
    });

    downloadSaveFile(TEST_STATE);
    expect(downloadAttribute).toMatch(/^thumbtax-\d{4}-\d{2}-\d{2}\.json$/);
  });
});
