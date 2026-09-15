import type { FormClass } from "@thumbtax/common";
import type { FormInstanceId } from "#src/common/types/formInstanceId";
import type { UserInput } from "#src/common/types/userInput";

export type FormInstance = {
  id: FormInstanceId;
  class: FormClass;
  label: string;
  inputs: Partial<Record<string, UserInput>>;
};

export type InstanceRegistry = Partial<Record<FormClass, FormInstance[]>>;
