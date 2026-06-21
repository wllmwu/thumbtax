import type { ApplicationState } from "#src/state/types/applicationState";

export type PersistedState = {
  applicationState: ApplicationState;
  schemaVersion: number;
  taxYear: number;
};
