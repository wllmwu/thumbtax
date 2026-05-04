import { Form1040 } from "#src/specifications/data/form1040";
import { FormW2 } from "#src/specifications/data/formW2";

import type { FormClass } from "#src/common/types/formClass";
import type { FormSpecification } from "#src/specifications/types/formSpecification";
import type { SpecificationRegistry } from "#src/specifications/types/specificationRegistry";

const allSpecifications: SpecificationRegistry = {
  f1040: Form1040,
  fW2: FormW2,
};

export class SpecificationClient {
  public getAllForms(): SpecificationRegistry {
    return allSpecifications;
  }

  public getForm(formClass: FormClass): FormSpecification {
    return allSpecifications[formClass];
  }
}
