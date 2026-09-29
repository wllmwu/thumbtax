import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CURRENT_SCHEMA_VERSION } from "#src/persistence/config";
import { downloadSaveFile } from "#src/persistence/downloadSaveFile";
import { makeRegistryFixture } from "#src/test/specificationFixtures";

import type { ApplicationState } from "#src/state/types/applicationState";

const TEST_STATE: ApplicationState = {
  taxYear: 2025,
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
    vi.useRealTimers();
  });

  function captureDownloadAttribute(): () => string | undefined {
    let downloadAttribute: string | undefined;
    clickSpy.mockImplementation(function (this: HTMLAnchorElement) {
      downloadAttribute = this.getAttribute("download") ?? undefined;
    });
    return () => downloadAttribute;
  }

  it("creates a Blob containing the serialized PersistedState and triggers a download", async () => {
    downloadSaveFile(TEST_STATE, makeRegistryFixture());

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
    });
  });

  it("excludes inputs that the given specifications don't recognize", async () => {
    downloadSaveFile(
      {
        ...TEST_STATE,
        formClasses: ["fW2"],
        formInstances: {
          fW2: [
            {
              id: "w2-1",
              class: "fW2",
              label: "Employer",
              inputs: { wages: { type: "number", value: 51000 } },
            },
          ],
        },
      },
      makeRegistryFixture(),
    );

    if (!lastBlob) throw new Error("no blob");
    const parsed = JSON.parse(await lastBlob.text());
    expect(parsed.applicationState.formInstances.fW2[0].inputs).toEqual({});
  });

  it("uses the provided filename on the anchor when given", () => {
    const getDownloadAttribute = captureDownloadAttribute();

    downloadSaveFile(TEST_STATE, makeRegistryFixture(), "my-taxes.json");
    expect(getDownloadAttribute()).toBe("my-taxes.json");
  });

  it("defaults the filename to include the tax year and the current time", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 8, 27, 14, 30, 59));
    const getDownloadAttribute = captureDownloadAttribute();

    downloadSaveFile(TEST_STATE, makeRegistryFixture());
    expect(getDownloadAttribute()).toBe(
      "thumbtax-ty2025_2026-09-27-143059.json",
    );
  });

  it("pads single-digit parts of the default filename", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2027, 0, 5, 9, 4, 3));
    const getDownloadAttribute = captureDownloadAttribute();

    downloadSaveFile({ ...TEST_STATE, taxYear: 2026 }, makeRegistryFixture());
    expect(getDownloadAttribute()).toBe(
      "thumbtax-ty2026_2027-01-05-090403.json",
    );
  });
});
