import type { TaxFormInstanceId } from "#src/types/taxFormInstanceId";
import type {
  TaxFormBoxIdentifier,
  TaxFormSpecification,
} from "#src/types/taxFormSpecification";
import type { UserInputValue } from "#src/types/userInputValue";

export type TaxFormRenderView = {
  specification: TaxFormSpecification;
  instances: Array<{
    id: TaxFormInstanceId;
    userLabel: string | null;
    boxValues: Record<TaxFormBoxIdentifier, UserInputValue>;
  }>;
};
