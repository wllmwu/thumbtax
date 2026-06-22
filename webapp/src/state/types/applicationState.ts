import type { FilingStatus, FormClass } from "@thumbtax/common";
import type { InstanceRegistry } from "#src/common/types/formInstance";

export type ApplicationState = {
  filingStatus: FilingStatus;
  formClasses: FormClass[];
  formInstances: InstanceRegistry;
};
