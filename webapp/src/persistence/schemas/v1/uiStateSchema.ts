import { z } from "zod";

import { formClassSchema } from "#src/persistence/schemas/v1/formClassSchema";

export const uiStateSchema = z.strictObject({
  connectionsGraphNodePositions: z.partialRecord(
    formClassSchema,
    z.strictObject({ x: z.number(), y: z.number() }),
  ),
  formClassExpansion: z.partialRecord(formClassSchema, z.boolean()),
  tableOfContentsExpanded: z.boolean(),
});
