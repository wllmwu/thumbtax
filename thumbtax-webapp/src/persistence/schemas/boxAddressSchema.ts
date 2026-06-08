import { z } from "zod";

export const boxAddressSchema = z
  .object({ instance: z.string(), box: z.string() })
  .strict();
