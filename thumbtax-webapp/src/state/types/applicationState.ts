import type { FilingStatus } from "#src/common/types/filingStatus";
import type { FormClass } from "#src/common/types/formClass";
import type { InstanceRegistry } from "#src/common/types/formInstance";

export type ApplicationState = {
  filingStatus: FilingStatus;
  formClasses: FormClass[];
  formInstances: InstanceRegistry;
};
