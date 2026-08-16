import React from "react";

import debounce from "lodash/debounce";

import { deserializePersistedState } from "#src/persistence/deserializePersistedState";
import { deserializeUiState } from "#src/persistence/deserializeUiState";
import { deserializeUserPreferences } from "#src/persistence/deserializeUserPreferences";
import {
  PREFERENCES_KEY,
  SAVED_STATE_KEY,
  UI_STATE_KEY,
} from "#src/persistence/localStorageKeys";
import {
  serializePersistedState,
  serializeUiState,
  serializeUserPreferences,
} from "#src/persistence/serialize";
import {
  DEFAULT_APPLICATION_STATE,
  DEFAULT_UI_STATE,
  DEFAULT_USER_PREFERENCES,
} from "#src/state/defaults";
import { subscribeToStore, useStore } from "#src/state/useStore";

import type { SpecificationRegistry } from "@thumbtax/forms";
import type { LoadError } from "#src/persistence/types/loadError";

const AUTOSAVE_DEBOUNCE_MS = 300;

function readLocalStorageJson(key: string): {
  parsed: unknown;
  errors: LoadError[];
  present: boolean;
} {
  const raw = localStorage.getItem(key);
  if (raw === null) {
    return { parsed: null, errors: [], present: false };
  }
  try {
    return { parsed: JSON.parse(raw), errors: [], present: true };
  } catch {
    return {
      parsed: null,
      errors: [{ type: "invalid_json" }],
      present: false,
    };
  }
}

export function useAutoSave(specifications: SpecificationRegistry): void {
  const initialize = useStore((state) => state.initialize);
  const setLoadErrors = useStore((state) => state.setLoadErrors);

  React.useEffect(() => {
    const allErrors: LoadError[] = [];

    // Preferences.
    const prefsRead = readLocalStorageJson(PREFERENCES_KEY);
    allErrors.push(...prefsRead.errors);
    let preferences = DEFAULT_USER_PREFERENCES;
    if (prefsRead.present) {
      const result = deserializeUserPreferences(prefsRead.parsed);
      if (result.ok) {
        preferences = result.value;
      }
      allErrors.push(...result.errors);
    }

    // Application state.
    const savedRead = readLocalStorageJson(SAVED_STATE_KEY);
    allErrors.push(...savedRead.errors);
    let applicationState = DEFAULT_APPLICATION_STATE;
    if (savedRead.present) {
      const result = deserializePersistedState(savedRead.parsed);
      if (result.ok) {
        applicationState = result.value;
      }
      allErrors.push(...result.errors);
    }

    // UI state.
    const uiRead = readLocalStorageJson(UI_STATE_KEY);
    allErrors.push(...uiRead.errors);
    let uiState = DEFAULT_UI_STATE;
    if (uiRead.present) {
      const result = deserializeUiState(uiRead.parsed);
      if (result.ok) {
        uiState = result.value;
      }
      allErrors.push(...result.errors);
    }

    initialize(applicationState, uiState, preferences, specifications);
    setLoadErrors(allErrors);

    // Latest slice values captured in closure so the debounced writers and the
    // toggle-off gate don't need to read the store directly.
    let latestApplicationState = applicationState;
    let latestUiState = uiState;
    let latestPreferences = preferences;

    const writeApplicationState = debounce(() => {
      if (!latestPreferences.browserSaveEnabled) return;
      localStorage.setItem(
        SAVED_STATE_KEY,
        JSON.stringify(serializePersistedState(latestApplicationState)),
      );
    }, AUTOSAVE_DEBOUNCE_MS);

    const writeUiState = debounce(() => {
      if (!latestPreferences.browserSaveEnabled) return;
      localStorage.setItem(
        UI_STATE_KEY,
        JSON.stringify(serializeUiState(latestUiState)),
      );
    }, AUTOSAVE_DEBOUNCE_MS);

    const unsubApp = subscribeToStore(
      (state) => state.applicationState,
      (current) => {
        latestApplicationState = current;
        writeApplicationState();
      },
    );

    const unsubUi = subscribeToStore(
      (state) => state.uiState,
      (current) => {
        latestUiState = current;
        writeUiState();
      },
    );

    const unsubPrefs = subscribeToStore(
      (state) => state.userPreferences,
      (current, previous) => {
        latestPreferences = current;
        localStorage.setItem(
          PREFERENCES_KEY,
          JSON.stringify(serializeUserPreferences(current)),
        );
        if (
          previous.browserSaveEnabled === true &&
          current.browserSaveEnabled === false
        ) {
          // Remove other keys from local storage when turning off browser save.
          writeApplicationState.cancel();
          writeUiState.cancel();
          localStorage.removeItem(SAVED_STATE_KEY);
          localStorage.removeItem(UI_STATE_KEY);
        }
      },
    );

    // Persist the initial preferences value so the key always exists.
    localStorage.setItem(
      PREFERENCES_KEY,
      JSON.stringify(serializeUserPreferences(preferences)),
    );

    return () => {
      unsubApp();
      unsubUi();
      unsubPrefs();
      writeApplicationState.flush();
      writeUiState.flush();
    };
  }, [initialize, setLoadErrors, specifications]);
}
