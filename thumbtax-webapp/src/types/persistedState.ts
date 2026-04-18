import type { FilingStatus } from "#src/types/filingStatus";
import type {
  TaxFormBoxIdentifier,
  TaxFormClass,
} from "#src/types/taxFormSpecification";
import type { UserInputValue } from "#src/types/userInputValue";

export type PersistedState = {
  taxYear: number;
  filingStatus: FilingStatus;
  forms: Array<{
    class: TaxFormClass;
    id: string;
    userLabel?: string;
    userValues: Record<TaxFormBoxIdentifier, UserInputValue>;
  }>;
};
