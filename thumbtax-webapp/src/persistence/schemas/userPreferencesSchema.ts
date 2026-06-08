import { z } from "zod";

export const userPreferencesSchema = z
  .object({
    browserSaveEnabled: z.boolean(),
    maximumHistorySize: z.number(),
  })
  .strict();
