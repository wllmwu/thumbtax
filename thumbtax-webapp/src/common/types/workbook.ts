import type { BoxAddress } from "#src/common/types/boxAddress";
import type { BoxIdentifier } from "#src/common/types/boxIdentifier";
import type { FormClass } from "#src/common/types/formClass";
import type { FormInstanceId } from "#src/common/types/formInstanceId";

export type Workbook = Record<
  FormInstanceId,
  Record<BoxIdentifier, ResolvedBox>
>;

export type ResolvedBox = {
  value: number;
  errors: BoxError[];
};

export type BoxError =
  | { type: "required_form_missing"; form: FormClass }
  | { type: "divide_by_zero" }
  | { type: "upstream"; sourceAddress: BoxAddress };
