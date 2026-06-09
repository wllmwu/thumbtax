import { z } from "zod";

import { FORM_CLASSES } from "#src/common/types/formClass";

export const uiStateSchema = z.strictObject({
  connectionsGraphNodePositions: z.partialRecord(
    z.enum(FORM_CLASSES),
    z.strictObject({ x: z.number(), y: z.number() }),
  ),
});
