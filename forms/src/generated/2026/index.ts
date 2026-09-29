import { f1040 } from "./f1040";
import { f1040_QDCGTWS } from "./f1040_QDCGTWS";
import { f1040s1 } from "./f1040s1";
import { f1040s1A } from "./f1040s1A";
import { f1040s2 } from "./f1040s2";
import { f1040s3 } from "./f1040s3";
import { f1040sA } from "./f1040sA";
import { f1040sC } from "./f1040sC";
import { f1040sD } from "./f1040sD";
import { f1040sD_SDTWS } from "./f1040sD_SDTWS";
import { f1099B } from "./f1099B";
import { f1099DIV } from "./f1099DIV";
import { f1099INT } from "./f1099INT";
import { f1099NEC } from "./f1099NEC";
import { f1099R } from "./f1099R";
import { f6251 } from "./f6251";
import { f8889 } from "./f8889";
import { f8959 } from "./f8959";
import { f8960 } from "./f8960";
import { f8995 } from "./f8995";
import { fW2 } from "./fW2";
import { fW2_12_codes } from "./fW2_12_codes";
import { helper_income } from "./helper_income";
import { helper_withholding_additionalmedicare } from "./helper_withholding_additionalmedicare";
import { helper_withholding_federal_additional } from "./helper_withholding_federal_additional";
import { helper_withholding_federal_backup } from "./helper_withholding_federal_backup";
import { helper_withholding_federal_custom } from "./helper_withholding_federal_custom";
import { helper_withholding_federal_regular } from "./helper_withholding_federal_regular";
import { helper_withholding_federal_supplemental } from "./helper_withholding_federal_supplemental";
import { helper_withholding_medicare } from "./helper_withholding_medicare";
import { helper_withholding_socialsecurity } from "./helper_withholding_socialsecurity";

import type { SpecificationRegistry } from "../../types/specificationRegistry";

export const specifications = {
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
  helper_income,
  helper_withholding_additionalmedicare,
  helper_withholding_federal_additional,
  helper_withholding_federal_backup,
  helper_withholding_federal_custom,
  helper_withholding_federal_regular,
  helper_withholding_federal_supplemental,
  helper_withholding_medicare,
  helper_withholding_socialsecurity,
} satisfies SpecificationRegistry;
