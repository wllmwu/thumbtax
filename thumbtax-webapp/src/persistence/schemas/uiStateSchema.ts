import { z } from "zod";

import { formClassSchema } from "#src/persistence/schemas/formClassSchema";

export const uiStateSchema = z
  .object({
    connectionsGraphNodePositions: z.partialRecord(
      formClassSchema,
      z.object({ x: z.number(), y: z.number() }).strict(),
    ),
  })
  .strict();
