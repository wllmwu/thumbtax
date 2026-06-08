import { describe, expect, expectTypeOf, it } from "vitest";
import { z } from "zod";

import { applicationStateSchema } from "#src/persistence/schemas/applicationStateSchema";
import { boxAddressSchema } from "#src/persistence/schemas/boxAddressSchema";
import { filingStatusSchema } from "#src/persistence/schemas/filingStatusSchema";
import { formClassSchema } from "#src/persistence/schemas/formClassSchema";
import { formInstanceSchema } from "#src/persistence/schemas/formInstanceSchema";
import { currentPersistedStateSchema } from "#src/persistence/schemas/persistedStateSchemas";
import { uiStateSchema } from "#src/persistence/schemas/uiStateSchema";
import { userInputSchema } from "#src/persistence/schemas/userInputSchema";
import { userPreferencesSchema } from "#src/persistence/schemas/userPreferencesSchema";

import type { BoxAddress } from "#src/common/types/boxAddress";
import type { FilingStatus } from "#src/common/types/filingStatus";
import type { FormClass } from "#src/common/types/formClass";
import type { FormInstance } from "#src/common/types/formInstance";
import type { UserInput } from "#src/common/types/userInput";
import type { PersistedState } from "#src/persistence/types/persistedState";
import type { ApplicationState } from "#src/state/types/applicationState";
import type { UiState } from "#src/state/types/uiState";
import type { UserPreferences } from "#src/state/types/userPreferences";

describe("schema/type conformance", () => {
  it("infers types that exactly match the hand-written persistence types", () => {
    expectTypeOf<
      z.infer<typeof filingStatusSchema>
    >().toEqualTypeOf<FilingStatus>();
    expectTypeOf<z.infer<typeof formClassSchema>>().toEqualTypeOf<FormClass>();
    expectTypeOf<
      z.infer<typeof boxAddressSchema>
    >().toEqualTypeOf<BoxAddress>();
    expectTypeOf<z.infer<typeof userInputSchema>>().toEqualTypeOf<UserInput>();
    expectTypeOf<
      z.infer<typeof formInstanceSchema>
    >().toEqualTypeOf<FormInstance>();
    expectTypeOf<
      z.infer<typeof applicationStateSchema>
    >().toEqualTypeOf<ApplicationState>();
    expectTypeOf<z.infer<typeof uiStateSchema>>().toEqualTypeOf<UiState>();
    expectTypeOf<
      z.infer<typeof userPreferencesSchema>
    >().toEqualTypeOf<UserPreferences>();
    expectTypeOf<
      z.infer<typeof currentPersistedStateSchema>
    >().toEqualTypeOf<PersistedState>();
  });

  it("parses a representative valid persisted state", () => {
    const result = currentPersistedStateSchema.safeParse({
      applicationState: {
        filingStatus: "single",
        formClasses: ["fW2"],
        formInstances: {
          fW2: [
            {
              id: "abc",
              class: "fW2",
              label: "My W-2",
              inputs: { box1: { type: "number", value: 100 } },
            },
          ],
        },
      },
      schemaVersion: 1,
      taxYear: 2025,
    });
    expect(result.success).toBe(true);
  });
});
