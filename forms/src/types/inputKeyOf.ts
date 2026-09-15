import type { FormSpecification } from "./formSpecification";

export type InputKeyOf<Specification> =
  Specification extends FormSpecification<infer InputKey> ? InputKey : never;
