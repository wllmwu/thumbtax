import { describe, expect, it } from "vitest";

import {
  CURRENT_SCHEMA_VERSION,
  CURRENT_TAX_YEAR,
} from "#src/persistence/config";
import { serialize } from "#src/persistence/serialize";

import type { ApplicationState } from "#src/state/types/applicationState";

describe("serialize", () => {
  it("wraps the application state with the current schema version and tax year", () => {
    const applicationState: ApplicationState = {
      filingStatus: "single",
      formClasses: [],
      formInstances: {},
    };
    expect(serialize(applicationState)).toEqual({
      applicationState,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      taxYear: CURRENT_TAX_YEAR,
    });
  });
});
