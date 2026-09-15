import type { FormSpecification } from "./formSpecification";

// Defaults to `never` so that a specification without inputs has no input keys.
export function defineFormSpecification<InputKey extends string = never>(
  specification: FormSpecification<InputKey>,
): FormSpecification<InputKey> {
  return specification;
}
