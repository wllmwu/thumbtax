import { z } from "zod";

export const boxAddressSchema = z.strictObject({
  instance: z.string(),
  box: z.string(),
});
