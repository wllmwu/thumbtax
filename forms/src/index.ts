import { fW2 } from "./generated/fW2";

import type { SpecificationRegistry } from "./types/specificationRegistry";

export * from "./types/formSpecification";
export * from "./types/specificationRegistry";
export * from "./types/valueProvider";
export * from "./types/valueProviderType";

export const specifications: SpecificationRegistry = {
  fW2,
};
