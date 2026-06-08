import { z } from "zod";

import { filingStatusSchema } from "#src/persistence/schemas/filingStatusSchema";
import { formClassSchema } from "#src/persistence/schemas/formClassSchema";
import { formInstanceSchema } from "#src/persistence/schemas/formInstanceSchema";

export const applicationStateSchema = z
  .object({
    filingStatus: filingStatusSchema,
    formClasses: z.array(formClassSchema),
    formInstances: z.partialRecord(
      formClassSchema,
      z.array(formInstanceSchema),
    ),
  })
  .strict();
