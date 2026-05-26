import { v4 as uuidv4 } from "uuid";

import { FILING_STATUSES } from "#src/common/types/filingStatus";
import { FORM_CLASSES } from "#src/common/types/formClass";
import {
  CURRENT_SCHEMA_VERSION,
  CURRENT_TAX_YEAR,
} from "#src/persistence/config";
import { DEFAULT_PERSISTED_STATE } from "#src/persistence/defaults";
import { applyMigrations } from "#src/persistence/migrations";
import { DEFAULT_APPLICATION_STATE } from "#src/state/defaults";

import type { BoxIdentifier } from "#src/common/types/boxIdentifier";
import type { FilingStatus } from "#src/common/types/filingStatus";
import type { FormClass } from "#src/common/types/formClass";
import type { FormInstance } from "#src/common/types/formInstance";
import type { UserInput } from "#src/common/types/userInput";
import type { LoadError } from "#src/persistence/types/loadError";
import type { ApplicationState } from "#src/state/types/applicationState";

const KNOWN_FORM_CLASSES = new Set<string>(FORM_CLASSES);

const KNOWN_TOP_LEVEL_FIELDS = new Set(Object.keys(DEFAULT_PERSISTED_STATE));

const KNOWN_APPLICATION_STATE_FIELDS = new Set(
  Object.keys(DEFAULT_APPLICATION_STATE),
);

const KNOWN_INSTANCE_FIELDS = new Set(
  Object.keys({
    id: "",
    class: FORM_CLASSES[0],
    label: "",
    inputs: {},
  } satisfies FormInstance),
);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isKnownFormClass(value: string): value is FormClass {
  return KNOWN_FORM_CLASSES.has(value);
}

function isFilingStatus(value: string): value is FilingStatus {
  return (FILING_STATUSES as readonly string[]).includes(value);
}

function parseUserInput(
  raw: unknown,
  path: string,
  errors: LoadError[],
): UserInput | undefined {
  if (!isPlainObject(raw) || typeof raw.type !== "string") {
    errors.push({
      type: "invalid_value",
      path,
      reason: "expected user input object",
    });
    return undefined;
  }
  switch (raw.type) {
    case "number": {
      if (typeof raw.value !== "number") {
        errors.push({
          type: "invalid_value",
          path,
          reason: "expected number value",
        });
        return undefined;
      }
      return { type: "number", value: raw.value };
    }
    case "amount_list": {
      if (!Array.isArray(raw.value)) {
        errors.push({
          type: "invalid_value",
          path,
          reason: "expected array value",
        });
        return undefined;
      }
      const items: Array<{ label: string; amount: number }> = [];
      raw.value.forEach((item, index) => {
        if (
          !isPlainObject(item) ||
          typeof item.label !== "string" ||
          typeof item.amount !== "number"
        ) {
          errors.push({
            type: "invalid_value",
            path: `${path}.value[${index}]`,
            reason: "expected { label: string, amount: number }",
          });
          return;
        }
        items.push({ label: item.label, amount: item.amount });
      });
      return { type: "amount_list", value: items };
    }
    case "selection": {
      if (
        typeof raw.selectedIndex !== "number" ||
        !Number.isInteger(raw.selectedIndex) ||
        raw.selectedIndex < 0
      ) {
        errors.push({
          type: "invalid_value",
          path,
          reason: "expected non-negative integer selectedIndex",
        });
        return undefined;
      }
      return { type: "selection", selectedIndex: raw.selectedIndex };
    }
    default: {
      errors.push({
        type: "invalid_value",
        path,
        reason: "unknown input type",
      });
      return undefined;
    }
  }
}

function parseInstance(
  raw: unknown,
  parentClass: FormClass,
  path: string,
  errors: LoadError[],
): FormInstance | undefined {
  if (!isPlainObject(raw)) {
    errors.push({
      type: "invalid_value",
      path,
      reason: "expected object",
    });
    return undefined;
  }

  let id: string;
  if (typeof raw.id === "string") {
    id = raw.id;
  } else {
    id = uuidv4();
    errors.push({
      type: "invalid_value",
      path: `${path}.id`,
      reason: "expected string",
    });
  }

  const instanceClass: FormClass = parentClass;
  if (typeof raw.class === "string" && raw.class !== parentClass) {
    errors.push({
      type: "invalid_value",
      path: `${path}.class`,
      reason: "class does not match parent key",
    });
  } else if (raw.class !== undefined && typeof raw.class !== "string") {
    errors.push({
      type: "invalid_value",
      path: `${path}.class`,
      reason: "expected string",
    });
  }

  let label: string;
  if (typeof raw.label === "string") {
    label = raw.label;
  } else {
    label = "Untitled form";
    errors.push({
      type: "invalid_value",
      path: `${path}.label`,
      reason: "expected string",
    });
  }

  const inputs: Partial<Record<BoxIdentifier, UserInput>> = {};
  if (raw.inputs !== undefined) {
    if (!isPlainObject(raw.inputs)) {
      errors.push({
        type: "invalid_value",
        path: `${path}.inputs`,
        reason: "expected object",
      });
    } else {
      for (const [boxId, rawInput] of Object.entries(raw.inputs)) {
        const parsed = parseUserInput(
          rawInput,
          `${path}.inputs.${boxId}`,
          errors,
        );
        if (parsed !== undefined) {
          inputs[boxId] = parsed;
        }
      }
    }
  }

  for (const key of Object.keys(raw)) {
    if (!KNOWN_INSTANCE_FIELDS.has(key)) {
      errors.push({ type: "unknown_field", path: `${path}.${key}` });
    }
  }

  return { id, class: instanceClass, label, inputs };
}

function parseApplicationState(
  raw: unknown,
  errors: LoadError[],
): ApplicationState {
  if (!isPlainObject(raw)) {
    errors.push({
      type: "invalid_value",
      path: "applicationState",
      reason: "expected object",
    });
    return DEFAULT_APPLICATION_STATE;
  }

  let filingStatus: FilingStatus = DEFAULT_APPLICATION_STATE.filingStatus;
  if (raw.filingStatus !== undefined) {
    if (
      typeof raw.filingStatus === "string" &&
      isFilingStatus(raw.filingStatus)
    ) {
      filingStatus = raw.filingStatus;
    } else {
      errors.push({
        type: "invalid_value",
        path: "applicationState.filingStatus",
        reason: "unknown filing status",
      });
    }
  }

  const formInstances: ApplicationState["formInstances"] = {};
  if (raw.formInstances !== undefined) {
    if (!isPlainObject(raw.formInstances)) {
      errors.push({
        type: "invalid_value",
        path: "applicationState.formInstances",
        reason: "expected object",
      });
    } else {
      for (const [key, value] of Object.entries(raw.formInstances)) {
        if (!isKnownFormClass(key)) {
          errors.push({
            type: "invalid_value",
            path: `applicationState.formInstances.${key}`,
            reason: "unknown form class",
          });
          continue;
        }
        if (!Array.isArray(value)) {
          errors.push({
            type: "invalid_value",
            path: `applicationState.formInstances.${key}`,
            reason: "expected array",
          });
          continue;
        }
        const instances: FormInstance[] = [];
        value.forEach((rawInstance, index) => {
          const parsed = parseInstance(
            rawInstance,
            key,
            `applicationState.formInstances.${key}[${index}]`,
            errors,
          );
          if (parsed !== undefined) {
            instances.push(parsed);
          }
        });
        if (instances.length > 0) {
          formInstances[key] = instances;
        }
      }
    }
  }

  // Reconcile formClasses with formInstances.
  const rawFormClasses: FormClass[] = [];
  let needsReconciliation = false;
  if (raw.formClasses !== undefined) {
    if (!Array.isArray(raw.formClasses)) {
      errors.push({
        type: "invalid_value",
        path: "applicationState.formClasses",
        reason: "expected array",
      });
      needsReconciliation = true;
    } else {
      for (const item of raw.formClasses) {
        if (typeof item === "string" && isKnownFormClass(item)) {
          rawFormClasses.push(item);
        } else {
          needsReconciliation = true;
        }
      }
    }
  }

  const presentClasses = Object.keys(formInstances).filter(isKnownFormClass);
  const reconciled: FormClass[] = [];
  for (const cls of rawFormClasses) {
    if (presentClasses.includes(cls) && !reconciled.includes(cls)) {
      reconciled.push(cls);
    }
  }
  for (const cls of presentClasses) {
    if (!reconciled.includes(cls)) {
      reconciled.push(cls);
    }
  }

  if (
    needsReconciliation ||
    reconciled.length !== rawFormClasses.length ||
    reconciled.some((cls, index) => rawFormClasses[index] !== cls)
  ) {
    errors.push({
      type: "invalid_value",
      path: "applicationState.formClasses",
      reason: "reconciled from formInstances",
    });
  }

  for (const key of Object.keys(raw)) {
    if (!KNOWN_APPLICATION_STATE_FIELDS.has(key)) {
      errors.push({
        type: "unknown_field",
        path: `applicationState.${key}`,
      });
    }
  }

  return { filingStatus, formClasses: reconciled, formInstances };
}

export function deserializePersistedState(raw: unknown): {
  applicationState: ApplicationState;
  errors: LoadError[];
} {
  const errors: LoadError[] = [];

  if (!isPlainObject(raw)) {
    errors.push({
      type: "invalid_value",
      path: "",
      reason: "expected object",
    });
    return { applicationState: DEFAULT_APPLICATION_STATE, errors };
  }

  const savedSchemaVersion =
    typeof raw.schemaVersion === "number" ? raw.schemaVersion : 0;
  if (savedSchemaVersion > CURRENT_SCHEMA_VERSION) {
    errors.push({
      type: "schema_version_newer",
      saved: savedSchemaVersion,
      current: CURRENT_SCHEMA_VERSION,
    });
  }

  const migrated = applyMigrations(raw, savedSchemaVersion);
  if (!isPlainObject(migrated)) {
    errors.push({
      type: "invalid_value",
      path: "",
      reason: "migration produced non-object",
    });
    return { applicationState: DEFAULT_APPLICATION_STATE, errors };
  }

  if (
    typeof migrated.taxYear !== "number" ||
    migrated.taxYear !== CURRENT_TAX_YEAR
  ) {
    errors.push({
      type: "tax_year_mismatch",
      saved: typeof migrated.taxYear === "number" ? migrated.taxYear : 0,
      current: CURRENT_TAX_YEAR,
    });
  }

  const applicationState = parseApplicationState(
    migrated.applicationState,
    errors,
  );

  for (const key of Object.keys(migrated)) {
    if (!KNOWN_TOP_LEVEL_FIELDS.has(key)) {
      errors.push({ type: "unknown_field", path: key });
    }
  }

  return { applicationState, errors };
}
