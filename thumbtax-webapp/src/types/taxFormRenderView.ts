import type {
  TaxFormBoxIdentifier,
  TaxFormSpecification,
} from "#src/types/taxFormSpecification";
import type { UserInputValue } from "#src/types/userInputValue";

export type TaxFormRenderView = {
  specification: TaxFormSpecification;
  instances: Array<{
    id: string;
    userLabel?: string;
    boxValues: Record<TaxFormBoxIdentifier, UserInputValue>;
  }>;
};
