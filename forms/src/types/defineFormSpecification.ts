import type { FormSpecification } from "./formSpecification";

export function defineFormSpecification<InputKey extends string = never>(
  specification: FormSpecification<InputKey>,
): FormSpecification<InputKey> {
  return specification;
}
