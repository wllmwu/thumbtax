import { FORM_CLASSES } from "#src/common/types/formClass";
import { DEFAULT_UI_STATE } from "#src/state/defaults";

import type { FormClass } from "#src/common/types/formClass";
import type { LoadError } from "#src/persistence/types/loadError";
import type { UiState } from "#src/state/types/uiState";

const KNOWN_FIELDS = new Set(Object.keys(DEFAULT_UI_STATE));

const KNOWN_FORM_CLASSES = new Set<string>(FORM_CLASSES);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isKnownFormClass(value: string): value is FormClass {
  return KNOWN_FORM_CLASSES.has(value);
}

export function deserializeUiState(raw: unknown): {
  uiState: UiState;
  errors: LoadError[];
} {
  const errors: LoadError[] = [];

  if (!isPlainObject(raw)) {
    errors.push({
      type: "invalid_value",
      path: "",
      reason: "expected object",
    });
    return { uiState: DEFAULT_UI_STATE, errors };
  }

  const positions: UiState["connectionsGraphNodePositions"] = {};

  if ("connectionsGraphNodePositions" in raw) {
    const rawPositions = raw.connectionsGraphNodePositions;
    if (!isPlainObject(rawPositions)) {
      errors.push({
        type: "invalid_value",
        path: "connectionsGraphNodePositions",
        reason: "expected object",
      });
    } else {
      for (const [key, value] of Object.entries(rawPositions)) {
        if (!isKnownFormClass(key)) {
          errors.push({
            type: "invalid_value",
            path: `connectionsGraphNodePositions.${key}`,
            reason: "unknown form class",
          });
          continue;
        }
        if (
          !isPlainObject(value) ||
          typeof value.x !== "number" ||
          typeof value.y !== "number"
        ) {
          errors.push({
            type: "invalid_value",
            path: `connectionsGraphNodePositions.${key}`,
            reason: "expected { x: number, y: number }",
          });
          continue;
        }
        positions[key] = { x: value.x, y: value.y };
      }
    }
  }

  for (const key of Object.keys(raw)) {
    if (!KNOWN_FIELDS.has(key)) {
      errors.push({ type: "unknown_field", path: key });
    }
  }

  return {
    uiState: { connectionsGraphNodePositions: positions },
    errors,
  };
}
