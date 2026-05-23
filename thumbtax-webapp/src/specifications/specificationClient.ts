import { Form1040 } from "#src/specifications/data/form1040";
import { Form1099DIV } from "#src/specifications/data/form1099DIV";
import { Form1099INT } from "#src/specifications/data/form1099INT";
import { FormW2 } from "#src/specifications/data/formW2";

import type { FormClass } from "#src/common/types/formClass";
import type { FormSpecification } from "#src/specifications/types/formSpecification";
import type { SpecificationRegistry } from "#src/specifications/types/specificationRegistry";

const allSpecifications: SpecificationRegistry = {
  f1040: Form1040,
  f1099DIV: Form1099DIV,
  f1099INT: Form1099INT,
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
