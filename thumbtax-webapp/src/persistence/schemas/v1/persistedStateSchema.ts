import { z } from "zod";

import { applicationStateSchema } from "#src/persistence/schemas/v1/applicationStateSchema";

export const persistedStateSchema = z.strictObject({
  applicationState: applicationStateSchema,
  schemaVersion: z.number(),
  taxYear: z.number(),
});
