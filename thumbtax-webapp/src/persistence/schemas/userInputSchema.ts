import { z } from "zod";

import { boxAddressSchema } from "#src/persistence/schemas/boxAddressSchema";

export const userInputSchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("amount_list"),
      value: z.array(
        z.object({ label: z.string(), amount: z.number() }).strict(),
      ),
    })
    .strict(),
  z
    .object({
      type: z.literal("instance_box_selections"),
      selected: z.array(boxAddressSchema),
    })
    .strict(),
  z.object({ type: z.literal("number"), value: z.number() }).strict(),
  z
    .object({ type: z.literal("override"), override: z.number().nullable() })
    .strict(),
  z
    .object({ type: z.literal("selection"), selectedIndex: z.number() })
    .strict(),
]);
