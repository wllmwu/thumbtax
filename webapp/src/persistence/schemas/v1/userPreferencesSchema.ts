import { z } from "zod";

export const userPreferencesSchema = z.strictObject({
  browserSaveEnabled: z.boolean(),
  maximumHistorySize: z.number(),
});
