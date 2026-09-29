import type { FilingStatus, FormClass, TaxYear } from "@thumbtax/common";
import type { InstanceRegistry } from "#src/common/types/formInstance";

export type ApplicationState = {
  taxYear: TaxYear;
  filingStatus: FilingStatus;
  formClasses: FormClass[];
  formInstances: InstanceRegistry;
};
