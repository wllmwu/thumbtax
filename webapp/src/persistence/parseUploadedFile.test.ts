import { describe, expect, it } from "vitest";

import {
  CURRENT_SCHEMA_VERSION,
  CURRENT_TAX_YEAR,
} from "#src/persistence/config";
import { parseUploadedFile } from "#src/persistence/parseUploadedFile";

import type { ApplicationState } from "#src/state/types/applicationState";

function fileFromJson(value: unknown): File {
  return new File([JSON.stringify(value)], "upload.json", {
    type: "application/json",
  });
}

describe("parseUploadedFile", () => {
  it("returns kind:'ok' with the parsed application state for a well-formed file", async () => {
    const applicationState: ApplicationState = {
      filingStatus: "head_of_household",
      formClasses: ["fW2"],
      formInstances: {
        fW2: [
          {
            id: "abc",
            class: "fW2",
            label: "Loaded",
            inputs: { box1: { type: "number", value: 99 } },
          },
        ],
      },
    };
    const file = fileFromJson({
      applicationState,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      taxYear: CURRENT_TAX_YEAR,
    });

    const result = await parseUploadedFile(file);

    expect(result.kind).toBe("ok");
    if (result.kind !== "ok") throw new Error("expected ok");
    expect(result.applicationState).toEqual(applicationState);
    expect(result.errors).toEqual([]);
  });

  it("returns kind:'ok' with a non-fatal tax-year notice", async () => {
    const file = fileFromJson({
      applicationState: {
        filingStatus: "single",
        formClasses: [],
        formInstances: {},
      },
      schemaVersion: CURRENT_SCHEMA_VERSION,
      taxYear: CURRENT_TAX_YEAR - 1,
    });

    const result = await parseUploadedFile(file);

    expect(result.kind).toBe("ok");
    if (result.kind !== "ok") throw new Error("expected ok");
    expect(result.errors).toContainEqual({
      type: "tax_year_mismatch",
      saved: CURRENT_TAX_YEAR - 1,
      current: CURRENT_TAX_YEAR,
    });
  });

  it("returns kind:'structural_failure' for invalid JSON", async () => {
    const file = new File(["{ not json"], "bad.json");

    const result = await parseUploadedFile(file);

    expect(result.kind).toBe("structural_failure");
    expect(result.errors).toEqual([{ type: "invalid_json" }]);
  });

  it("returns kind:'structural_failure' for a non-object JSON payload", async () => {
    const file = fileFromJson(42);

    const result = await parseUploadedFile(file);

    expect(result.kind).toBe("structural_failure");
    expect(result.errors).toEqual([{ type: "not_an_object" }]);
  });

  it("returns kind:'structural_failure' for a structurally invalid file", async () => {
    const file = fileFromJson({
      applicationState: {
        filingStatus: "martian",
        formClasses: [],
        formInstances: {},
      },
      schemaVersion: CURRENT_SCHEMA_VERSION,
      taxYear: CURRENT_TAX_YEAR,
    });

    const result = await parseUploadedFile(file);

    expect(result.kind).toBe("structural_failure");
    if (result.kind !== "structural_failure")
      throw new Error("expected failure");
    expect(result.errors[0].type).toBe("validation_failed");
  });
});
