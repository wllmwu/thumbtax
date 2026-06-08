import { describe, expect, it } from "vitest";
import { z } from "zod";

import { validationFailed } from "#src/persistence/zodIssuesToLoadError";

describe("validationFailed", () => {
  it("maps a ZodError into a validation_failed LoadError with dotted paths", () => {
    const schema = z
      .object({ a: z.object({ b: z.number() }).strict() })
      .strict();
    const parsed = schema.safeParse({ a: { b: "nope" } });
    expect(parsed.success).toBe(false);
    if (parsed.success) throw new Error("expected failure");

    const error = validationFailed(parsed.error);
    expect(error.type).toBe("validation_failed");
    expect(error.issues).toContainEqual(
      expect.objectContaining({ path: "a.b" }),
    );
    expect(error.issues[0].message).toEqual(expect.any(String));
  });
});
