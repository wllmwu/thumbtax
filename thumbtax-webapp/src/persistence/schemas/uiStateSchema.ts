import { z } from "zod";

import { FORM_CLASSES } from "#src/common/types/formClass";

export const uiStateSchema = z
  .object({
    connectionsGraphNodePositions: z.partialRecord(
      z.enum(FORM_CLASSES),
      z.object({ x: z.number(), y: z.number() }).strict(),
    ),
  })
  .strict();
