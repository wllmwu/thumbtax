import type { FormClass } from "#src/common/types/formClass";
import type { FormSpecification } from "#src/specifications/types/formSpecification";

export type SpecificationRegistry = Record<FormClass, FormSpecification>;
