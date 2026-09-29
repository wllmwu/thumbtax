import type { ApplicationState } from "#src/state/types/applicationState";

// Same as ApplicationState, except that the tax year can be any number, so that
// saves from unsupported tax years still parse.
export type PersistedApplicationState = {
  [Key in keyof ApplicationState]: Key extends "taxYear"
    ? number
    : ApplicationState[Key];
};

export type PersistedState = {
  applicationState: PersistedApplicationState;
  schemaVersion: number;
};
