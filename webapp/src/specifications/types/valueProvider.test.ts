import { describe, expectTypeOf, it } from "vitest";

import type { ValueProviderType } from "@thumbtax/forms";
import type { ValueProvider } from "#src/specifications/types/valueProvider";

describe("ValueProvider", () => {
  it("has expected variants", () => {
    expectTypeOf<ValueProvider["type"]>().toEqualTypeOf<ValueProviderType>();
  });
});
