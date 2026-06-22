import type { FormClass } from "@thumbtax/common";
import type { FormSpecification } from "#src/specifications/types/formSpecification";

export type SpecificationRegistry = Record<FormClass, FormSpecification>;
