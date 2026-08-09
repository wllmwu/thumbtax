import { f1040 } from "./generated/f1040";
import { f1040_QDCGTWS } from "./generated/f1040_QDCGTWS";
import { f1040s1 } from "./generated/f1040s1";
import { f1040s1A } from "./generated/f1040s1A";
import { f1040s2 } from "./generated/f1040s2";
import { f1040s3 } from "./generated/f1040s3";
import { f1040sA } from "./generated/f1040sA";
import { f1040sC } from "./generated/f1040sC";
import { f1040sD } from "./generated/f1040sD";
import { f1040sD_SDTWS } from "./generated/f1040sD_SDTWS";
import { f1099B } from "./generated/f1099B";
import { f1099DIV } from "./generated/f1099DIV";
import { f1099INT } from "./generated/f1099INT";
import { f1099NEC } from "./generated/f1099NEC";
import { f1099R } from "./generated/f1099R";
import { f6251 } from "./generated/f6251";
import { f8889 } from "./generated/f8889";
import { f8959 } from "./generated/f8959";
import { f8960 } from "./generated/f8960";
import { f8995 } from "./generated/f8995";
import { fW2 } from "./generated/fW2";
import { fW2_12_codes } from "./generated/fW2_12_codes";

import type { SpecificationRegistry } from "./types/specificationRegistry";

export * from "./types/formSpecification";
export * from "./types/glossaryTerm";
export * from "./types/specificationRegistry";
export * from "./types/valueProvider";
export * from "./types/valueProviderType";

export { glossary } from "./glossary/glossary";

export const specifications: SpecificationRegistry = {
  f1040,
  f1040_QDCGTWS,
  f1040s1,
  f1040s1A,
  f1040s2,
  f1040s3,
  f1040sA,
  f1040sC,
  f1040sD,
  f1040sD_SDTWS,
  f1099B,
  f1099DIV,
  f1099INT,
  f1099NEC,
  f1099R,
  f6251,
  f8889,
  f8959,
  f8960,
  f8995,
  fW2,
  fW2_12_codes,
};
