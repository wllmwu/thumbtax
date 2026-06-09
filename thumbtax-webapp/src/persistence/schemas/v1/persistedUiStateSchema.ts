import { z } from "zod";

import { uiStateSchema } from "#src/persistence/schemas/v1/uiStateSchema";

export const persistedUiStateSchema = z.strictObject({
  uiState: uiStateSchema,
  schemaVersion: z.number(),
});
