# `persistence` module

This module handles serializing/deserializing state to/from various external formats.
It uses the Zod library for deserialization.
It was mostly written by Claude Code.

- `webapp/src/persistence/`
  - `schemas/`:
    - `v1/`: Zod schemas for each part of state. Any part that undergoes a backwards-incompatible change should have the new schema encoded in `v2/`, `v3/`, and so on.
    - `(persistedState|uiState|userPreferences)Schemas.ts`: Registries for different schema versions and the latest of each
    - `schemaConformance.test.ts`: Validates the Zod schemas match the actual state types
  - `types/`
    - `deserializeResult.ts`: Discriminated success-or-error type
    - `loadError.ts`: Possible deserialization errors
    - `persisted(State|UiState|UserPreferences).ts`: Own representations of the state types that get persisted
  - `config.ts`: Some constants
  - `deserializePersisted(State|UiState|UserPreferences).ts`: Functions that attempt to parse raw input into the corresponding schema types
  - `deserializeVersioned.ts`: Helper that attempts to parse raw input and then run migrations on it to get to the latest schema shape
  - `downloadSaveFile.ts`: Serializes and imperatively downloads a save file
  - `localStorageKeys.ts`: Constant keys used in browser localStorage
  - `migrations.ts`: Functions to migrate from vN to v(N+1). None currently exist because there is only v1.
  - `parseUploadedFile.ts`: Runs `deserializePersistedState` against an uploaded File object
  - `serialize.ts`: Mappers from internal state types to persisted state types
  - `usePersistence.tsx`: React hook that handles browser autosave and loading from a save file
  - `zodIssuesToLoadError.ts`: Maps from Zod error to a LoadError
