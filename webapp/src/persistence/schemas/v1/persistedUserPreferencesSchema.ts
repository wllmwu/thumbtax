import { z } from "zod";

import { userPreferencesSchema } from "#src/persistence/schemas/v1/userPreferencesSchema";

export const persistedUserPreferencesSchema = z.strictObject({
  preferences: userPreferencesSchema,
  schemaVersion: z.number(),
});
