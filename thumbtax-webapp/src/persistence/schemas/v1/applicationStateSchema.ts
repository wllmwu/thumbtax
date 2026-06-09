import { z } from "zod";

import { filingStatusSchema } from "#src/persistence/schemas/v1/filingStatusSchema";
import { formClassSchema } from "#src/persistence/schemas/v1/formClassSchema";
import { formInstanceSchema } from "#src/persistence/schemas/v1/formInstanceSchema";

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
