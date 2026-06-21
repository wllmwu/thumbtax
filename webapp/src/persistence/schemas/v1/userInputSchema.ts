import { z } from "zod";

import { boxAddressSchema } from "#src/persistence/schemas/v1/boxAddressSchema";

export const userInputSchema = z.discriminatedUnion("type", [
  z.strictObject({
    type: z.literal("amount_list"),
    value: z.array(z.strictObject({ label: z.string(), amount: z.number() })),
  }),
  z.strictObject({
    type: z.literal("instance_box_selections"),
    selected: z.array(boxAddressSchema),
  }),
  z.strictObject({ type: z.literal("number"), value: z.number() }),
  z.strictObject({
    type: z.literal("override"),
    override: z.number().nullable(),
  }),
  z.strictObject({ type: z.literal("selection"), selectedIndex: z.number() }),
]);
