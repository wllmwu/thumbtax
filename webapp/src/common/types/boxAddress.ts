import type { BoxIdentifier } from "@thumbtax/common";
import type { FormInstanceId } from "#src/common/types/formInstanceId";

export type BoxAddress = {
  instance: FormInstanceId;
  box: BoxIdentifier;
};
