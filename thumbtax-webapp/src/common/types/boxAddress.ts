import type { BoxIdentifier } from "#src/common/types/boxIdentifier";
import type { FormInstanceId } from "#src/common/types/formInstanceId";

export type BoxAddress = {
  instance: FormInstanceId;
  box: BoxIdentifier;
};
