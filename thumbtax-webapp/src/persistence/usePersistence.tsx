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
import { serialize } from "#src/persistence/serialize";
import {
  DEFAULT_APPLICATION_STATE,
  DEFAULT_UI_STATE,
  DEFAULT_USER_PREFERENCES,
} from "#src/state/defaults";
import { subscribeToStore, useStore } from "#src/state/useStore";

import type { LoadError } from "#src/persistence/loadError";
import type { SpecificationRegistry } from "#src/specifications/types/specificationRegistry";

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
      errors: [{ type: "invalid_value", path: key, reason: "invalid JSON" }],
      present: false,
    };
  }
}

export function usePersistence(specifications: SpecificationRegistry): void {
  React.useEffect(() => {
    const allErrors: LoadError[] = [];

    // Preferences.
    const prefsRead = readLocalStorageJson(PREFERENCES_KEY);
    allErrors.push(...prefsRead.errors);
    let preferences = DEFAULT_USER_PREFERENCES;
    if (prefsRead.present) {
      const { preferences: parsed, errors } = deserializeUserPreferences(
        prefsRead.parsed,
      );
      preferences = parsed;
      allErrors.push(...errors);
    }

    // Application state.
    const savedRead = readLocalStorageJson(SAVED_STATE_KEY);
    allErrors.push(...savedRead.errors);
    let applicationState = DEFAULT_APPLICATION_STATE;
    if (savedRead.present) {
      const { applicationState: parsed, errors } = deserializePersistedState(
        savedRead.parsed,
      );
      applicationState = parsed;
      allErrors.push(...errors);
    }

    // UI state.
    const uiRead = readLocalStorageJson(UI_STATE_KEY);
    allErrors.push(...uiRead.errors);
    let uiState = DEFAULT_UI_STATE;
    if (uiRead.present) {
      const { uiState: parsed, errors } = deserializeUiState(uiRead.parsed);
      uiState = parsed;
      allErrors.push(...errors);
    }

    useStore
      .getState()
      .initialize(
        applicationState,
        uiState,
        preferences,
        specifications,
        allErrors,
      );

    // Set up subscriptions.
    const writeApplicationState = debounce(() => {
      if (!useStore.getState().userPreferences.browserSaveEnabled) return;
      const payload = serialize(useStore.getState().applicationState);
      localStorage.setItem(SAVED_STATE_KEY, JSON.stringify(payload));
    }, AUTOSAVE_DEBOUNCE_MS);

    const writeUiState = debounce(() => {
      if (!useStore.getState().userPreferences.browserSaveEnabled) return;
      localStorage.setItem(
        UI_STATE_KEY,
        JSON.stringify(useStore.getState().uiState),
      );
    }, AUTOSAVE_DEBOUNCE_MS);

    const unsubApp = subscribeToStore(
      (state) => state.applicationState,
      () => writeApplicationState(),
    );

    const unsubUi = subscribeToStore(
      (state) => state.uiState,
      () => writeUiState(),
    );

    const unsubPrefs = subscribeToStore(
      (state) => state.userPreferences,
      (current, previous) => {
        localStorage.setItem(PREFERENCES_KEY, JSON.stringify(current));
        if (
          previous.browserSaveEnabled === true &&
          current.browserSaveEnabled === false
        ) {
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
      JSON.stringify(useStore.getState().userPreferences),
    );

    return () => {
      unsubApp();
      unsubUi();
      unsubPrefs();
      writeApplicationState.flush();
      writeUiState.flush();
    };
  }, [specifications]);
}
