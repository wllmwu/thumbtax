# `state` module

This module contains the central state manager, which uses the Zustand library.

- `webapp/src/state/`
  - `types/`
    - `applicationState.ts`: Main app state including all user inputs. This represents all data needed to compute the actual tax results.
    - `uiState.ts`: Visual states that don't affect the real outputs but can be remembered by the browser for quality of life
    - `userPreferences.ts`: Preferences/settings that likewise don't affect the real outputs but do affect other application behavior
  - `defaults.ts`: Constant default/initial state
  - `useStore.tsx`: React hook that exposes the Zustand store to the rest of the application
