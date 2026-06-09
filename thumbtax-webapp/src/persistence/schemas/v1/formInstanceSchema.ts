import { z } from "zod";

import { formClassSchema } from "#src/persistence/schemas/v1/formClassSchema";
import { userInputSchema } from "#src/persistence/schemas/v1/userInputSchema";

export const formInstanceSchema = z
  .object({
    id: z.string(),
    class: formClassSchema,
    label: z.string(),
    inputs: z.partialRecord(z.string(), userInputSchema),
  })
  .strict();
