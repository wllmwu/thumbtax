import { describe, expectTypeOf, it } from "vitest";

import type { ValueProvider } from "./valueProvider";
import type { ValueProviderType } from "@thumbtax/forms";

describe("ValueProvider", () => {
  it("has expected variants", () => {
    expectTypeOf<ValueProvider["type"]>().toEqualTypeOf<ValueProviderType>();
  });
});
