import type { FilingStatus } from "#src/common/types/filingStatus";
import type { FormClass } from "#src/common/types/formClass";
import type { FormInstance } from "#src/common/types/formInstance";

export type ApplicationState = {
  filingStatus: FilingStatus;
  formClasses: FormClass[];
  formInstances: Partial<Record<FormClass, FormInstance[]>>;
};
