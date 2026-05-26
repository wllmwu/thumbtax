import { Form1040 } from "#src/specifications/data/form1040";
import { Form1040S1 } from "#src/specifications/data/form1040s1";
import { Form1040S1A } from "#src/specifications/data/form1040s1A";
import { Form1040S2 } from "#src/specifications/data/form1040s2";
import { Form1040S3 } from "#src/specifications/data/form1040s3";
import { Form1040SA } from "#src/specifications/data/form1040sA";
import { Form1040SC } from "#src/specifications/data/form1040sC";
import { Form1040SD } from "#src/specifications/data/form1040sD";
import { Form1040SSE } from "#src/specifications/data/form1040sSE";
import { Form1099B } from "#src/specifications/data/form1099B";
import { Form1099DIV } from "#src/specifications/data/form1099DIV";
import { Form1099INT } from "#src/specifications/data/form1099INT";
import { Form1099NEC } from "#src/specifications/data/form1099NEC";
import { Form2555 } from "#src/specifications/data/form2555";
import { Form6251 } from "#src/specifications/data/form6251";
import { Form8889 } from "#src/specifications/data/form8889";
import { Form8949 } from "#src/specifications/data/form8949";
import { Form8959 } from "#src/specifications/data/form8959";
import { Form8960 } from "#src/specifications/data/form8960";
import { Form8995 } from "#src/specifications/data/form8995";
import { Form8995A } from "#src/specifications/data/form8995A";
import { FormW2 } from "#src/specifications/data/formW2";

import type { FormClass } from "#src/common/types/formClass";
import type { FormSpecification } from "#src/specifications/types/formSpecification";
import type { SpecificationRegistry } from "#src/specifications/types/specificationRegistry";

const allSpecifications: SpecificationRegistry = {
  f1040: Form1040,
  f1040s1: Form1040S1,
  f1040s1A: Form1040S1A,
  f1040s2: Form1040S2,
  f1040s3: Form1040S3,
  f1040sA: Form1040SA,
  f1040sC: Form1040SC,
  f1040sD: Form1040SD,
  f1040sSE: Form1040SSE,
  f1099B: Form1099B,
  f1099DIV: Form1099DIV,
  f1099INT: Form1099INT,
  f1099NEC: Form1099NEC,
  f2555: Form2555,
  f6251: Form6251,
  f8889: Form8889,
  f8949: Form8949,
  f8959: Form8959,
  f8960: Form8960,
  f8995: Form8995,
  f8995A: Form8995A,
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
