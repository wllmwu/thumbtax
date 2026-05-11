import type { BoxIdentifier } from "#src/common/types/boxIdentifier";
import type { FormClass } from "#src/common/types/formClass";
import type { FormInstanceId } from "#src/common/types/formInstanceId";
import type { UserInput } from "#src/common/types/userInput";

export type FormInstance = {
  id: FormInstanceId;
  class: FormClass;
  label: string;
  inputs: Partial<Record<BoxIdentifier, UserInput>>;
};

export type InstanceRegistry = Partial<Record<FormClass, FormInstance[]>>;
