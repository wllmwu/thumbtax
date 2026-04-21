import type { FilingStatus } from "#src/types/filingStatus";
import type {
  TaxFormBoxIdentifier,
  TaxFormClass,
} from "#src/types/taxFormSpecification";
import type { UserInputValue } from "#src/types/userInputValue";

export type FormInstance = {
  class: TaxFormClass;
  id: string;
  userLabel?: string;
  userValues: Record<TaxFormBoxIdentifier, UserInputValue>;
};

export type ServiceState = {
  taxYear: number;
  filingStatus: FilingStatus;
  forms: Array<FormInstance>;
};
