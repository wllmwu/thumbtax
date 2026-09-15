import type { FormClass } from "@thumbtax/common";
import type { InputKeyOf, specifications } from "@thumbtax/forms";
import type { FormInstance } from "#src/common/types/formInstance";
import type { FormInstanceId } from "#src/common/types/formInstanceId";
import type { UserInput } from "#src/common/types/userInput";

export type FormInputs<Class extends FormClass> = Partial<
  Record<InputKeyOf<(typeof specifications)[Class]>, UserInput>
>;

export function makeFormInstance<Class extends FormClass>(
  formClass: Class,
  id: FormInstanceId,
  label: string,
  inputs: FormInputs<Class>,
): FormInstance {
  return { id, class: formClass, label, inputs };
}
