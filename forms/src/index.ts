import { specifications as specifications2025 } from "./generated/2025";
import { specifications as specifications2026 } from "./generated/2026";

import type { SpecificationRegistry } from "./types/specificationRegistry";
import type { TaxYear } from "@thumbtax/common";

export * from "./types/formSpecification";
export * from "./types/glossaryTerm";
export * from "./types/inputKeyOf";
export * from "./types/specificationRegistry";
export * from "./types/valueProvider";
export * from "./types/valueProviderType";

export { glossary } from "./generated/glossary";

export const specificationsByYear = {
  2025: specifications2025,
  2026: specifications2026,
} satisfies Record<TaxYear, SpecificationRegistry>;
