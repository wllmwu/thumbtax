# Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serialize and deserialize primary state, autosave to local storage when the user has opted in, and load from local storage on app start. Deserialization is forgiving — missing or unknown fields produce warnings, never throws.

**Architecture:** `serialize` produces a `SaveFile` (= `PrimaryState ∪ { schemaVersion, taxYear }`). `deserialize` is a hand-rolled validator that accepts `unknown` and returns `{ state, warnings }`, walking each level and emitting `LoadWarning` entries with dotted paths. Migrations from older `schemaVersion`s run before validation. Three local storage keys: `thumbtax.preferences` (always), `thumbtax.savedState` (when opted in), `thumbtax.uiState` (browser ephemera). Depends on `01-common-types`, `04-state`.

**Tech Stack:** TypeScript only — no Zod, no schema library.

---

## File Structure

- `thumbtax-webapp/src/persistence/types/saveFile.ts` — `SaveFile`.
- `thumbtax-webapp/src/persistence/types/loadWarning.ts` — `LoadWarning`.
- `thumbtax-webapp/src/persistence/config.ts` — `CURRENT_SCHEMA_VERSION`, `CURRENT_TAX_YEAR`, `LOCAL_STORAGE_KEYS`.
- `thumbtax-webapp/src/persistence/serialize.ts` — `serialize(state)`.
- `thumbtax-webapp/src/persistence/serialize.test.ts`
- `thumbtax-webapp/src/persistence/deserialize.ts` — `deserialize(raw)`.
- `thumbtax-webapp/src/persistence/deserialize.test.ts`
- `thumbtax-webapp/src/persistence/migrations.ts` — versioned transformers.
- `thumbtax-webapp/src/persistence/migrations.test.ts`
- `thumbtax-webapp/src/persistence/localStorage.ts` — `useAutosave()` hook, `loadFromLocalStorage()`, `clearSavedState()`.
- `thumbtax-webapp/src/persistence/localStorage.test.ts`

---

### Task 1: Config constants and types

**Files:**
- Create: `thumbtax-webapp/src/persistence/config.ts`
- Create: `thumbtax-webapp/src/persistence/types/saveFile.ts`
- Create: `thumbtax-webapp/src/persistence/types/loadWarning.ts`

- [ ] **Step 1: `config.ts`**

```typescript
export const CURRENT_SCHEMA_VERSION = 1;
export const CURRENT_TAX_YEAR = 2025;

export const LOCAL_STORAGE_KEYS = {
  preferences: "thumbtax.preferences",
  savedState: "thumbtax.savedState",
  uiState: "thumbtax.uiState",
} as const;
```

- [ ] **Step 2: `SaveFile`**

```typescript
import type { PrimaryState } from "#src/state/types/primaryState";

export type SaveFile = PrimaryState & {
  schemaVersion: number;
  taxYear: number;
};
```

- [ ] **Step 3: `LoadWarning`**

```typescript
export type LoadWarning =
  | { type: "tax_year_mismatch"; saved: number; current: number }
  | { type: "schema_version_newer"; saved: number; current: number }
  | { type: "unknown_field"; path: string }
  | { type: "invalid_value"; path: string; reason: string }
  | { type: "missing_required_field"; path: string };
```

- [ ] **Step 4: Typecheck and commit**

```bash
cd thumbtax-webapp && npm run typecheck
git add thumbtax-webapp/src/persistence
git commit -m "Add persistence config and types"
```

---

### Task 2: `serialize` (TDD)

**Files:**
- Create: `thumbtax-webapp/src/persistence/serialize.test.ts`
- Create: `thumbtax-webapp/src/persistence/serialize.ts`

- [ ] **Step 1: Write tests**

```typescript
import { describe, expect, it } from "vitest";

import { CURRENT_SCHEMA_VERSION, CURRENT_TAX_YEAR } from "#src/persistence/config";
import { serialize } from "#src/persistence/serialize";
import { defaultPrimaryState } from "#src/state/defaults";

describe("serialize", () => {
  it("includes the current schema version and tax year", () => {
    const file = serialize(defaultPrimaryState());
    expect(file.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(file.taxYear).toBe(CURRENT_TAX_YEAR);
  });

  it("preserves primary-state fields", () => {
    const state = defaultPrimaryState();
    const file = serialize(state);
    expect(file.filingStatus).toBe(state.filingStatus);
    expect(file.formClassOrder).toEqual(state.formClassOrder);
    expect(file.preferences).toEqual(state.preferences);
  });
});
```

- [ ] **Step 2: Run, verify FAIL**

```bash
cd thumbtax-webapp && npm test -- serialize
```

- [ ] **Step 3: Implement**

```typescript
import { CURRENT_SCHEMA_VERSION, CURRENT_TAX_YEAR } from "#src/persistence/config";
import type { SaveFile } from "#src/persistence/types/saveFile";
import type { PrimaryState } from "#src/state/types/primaryState";

export function serialize(state: PrimaryState): SaveFile {
  return {
    ...state,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    taxYear: CURRENT_TAX_YEAR,
  };
}
```

- [ ] **Step 4: Run, verify PASS, commit**

```bash
cd thumbtax-webapp && npm test
git add thumbtax-webapp/src/persistence/serialize.ts thumbtax-webapp/src/persistence/serialize.test.ts
git commit -m "Add serialize"
```

---

### Task 3: Migrations skeleton (TDD)

**Files:**
- Create: `thumbtax-webapp/src/persistence/migrations.test.ts`
- Create: `thumbtax-webapp/src/persistence/migrations.ts`

- [ ] **Step 1: Write tests**

```typescript
import { describe, expect, it } from "vitest";

import { migrate } from "#src/persistence/migrations";

describe("migrations", () => {
  it("returns input unchanged when version equals current", () => {
    const input = { schemaVersion: 1, foo: "bar" };
    expect(migrate(input, 1)).toBe(input);
  });

  it("returns input unchanged when version is greater (caller handles)", () => {
    const input = { schemaVersion: 999 };
    expect(migrate(input, 1)).toBe(input);
  });
});
```

- [ ] **Step 2: Run, verify FAIL**

```bash
cd thumbtax-webapp && npm test -- migrations
```

- [ ] **Step 3: Implement**

```typescript
export const migrations: Record<number, (savedFile: unknown) => unknown> = {
  // Each entry maps version N to a transformer that returns version N+1.
  // Empty for v1.
};

export function migrate(input: unknown, currentVersion: number): unknown {
  if (typeof input !== "object" || input === null) return input;
  let version = (input as { schemaVersion?: unknown }).schemaVersion;
  let value: unknown = input;
  while (typeof version === "number" && version < currentVersion) {
    const fn = migrations[version];
    if (!fn) break;
    value = fn(value);
    version =
      typeof value === "object" && value !== null
        ? (value as { schemaVersion?: unknown }).schemaVersion
        : undefined;
  }
  return value;
}
```

- [ ] **Step 4: Run, verify PASS, commit**

```bash
cd thumbtax-webapp && npm test
git add thumbtax-webapp/src/persistence/migrations.ts thumbtax-webapp/src/persistence/migrations.test.ts
git commit -m "Add migrations skeleton"
```

---

### Task 4: `deserialize` — happy path (TDD)

**Files:**
- Create: `thumbtax-webapp/src/persistence/deserialize.test.ts`
- Create: `thumbtax-webapp/src/persistence/deserialize.ts`

- [ ] **Step 1: Write the first test**

```typescript
import { describe, expect, it } from "vitest";

import {
  CURRENT_SCHEMA_VERSION,
  CURRENT_TAX_YEAR,
} from "#src/persistence/config";
import { deserialize } from "#src/persistence/deserialize";

describe("deserialize", () => {
  it("round-trips a valid save file with no warnings", () => {
    const raw = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      taxYear: CURRENT_TAX_YEAR,
      filingStatus: "single",
      formClassOrder: ["fW2"],
      formInstancesByClass: {
        fW2: [
          {
            instanceId: "abc-123",
            label: "Acme",
            inputs: { wages: { type: "number", value: 1234 } },
          },
        ],
      },
      preferences: { browserSaveEnabled: true },
    };

    const { state, warnings } = deserialize(raw);
    expect(warnings).toEqual([]);
    expect(state.filingStatus).toBe("single");
    expect(state.formInstancesByClass.fW2?.[0].inputs.wages).toEqual({
      type: "number",
      value: 1234,
    });
  });
});
```

- [ ] **Step 2: Run, verify FAIL**

```bash
cd thumbtax-webapp && npm test -- deserialize
```

- [ ] **Step 3: Implement**

`thumbtax-webapp/src/persistence/deserialize.ts`:

```typescript
import type { BoxInput } from "#src/common/types/boxInput";
import type { FilingStatus } from "#src/common/types/filingStatus";
import type { FormClass } from "#src/common/types/formClass";
import {
  CURRENT_SCHEMA_VERSION,
  CURRENT_TAX_YEAR,
} from "#src/persistence/config";
import { migrate } from "#src/persistence/migrations";
import type { LoadWarning } from "#src/persistence/types/loadWarning";
import { allFormClasses } from "#src/specifications/service";
import { defaultPrimaryState } from "#src/state/defaults";
import type { FormInstance } from "#src/state/types/formInstance";
import type { PrimaryState } from "#src/state/types/primaryState";

const FILING_STATUSES: ReadonlySet<FilingStatus> = new Set([
  "single",
  "married_filing_jointly",
  "married_filing_separately",
  "head_of_household",
  "qualifying_surviving_spouse",
]);

const KNOWN_TOP_LEVEL_FIELDS = new Set([
  "schemaVersion",
  "taxYear",
  "filingStatus",
  "formClassOrder",
  "formInstancesByClass",
  "preferences",
]);

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function parseBoxInput(
  raw: unknown,
  path: string,
  warnings: LoadWarning[],
): BoxInput | undefined {
  if (!isObject(raw)) {
    warnings.push({ type: "invalid_value", path, reason: "expected object" });
    return undefined;
  }
  const type = raw.type;
  if (type === "number" && typeof raw.value === "number") {
    return { type: "number", value: raw.value };
  }
  if (type === "amount_list" && Array.isArray(raw.value)) {
    const items: Array<{ label: string; amount: number }> = [];
    raw.value.forEach((item, i) => {
      if (
        isObject(item) &&
        typeof item.label === "string" &&
        typeof item.amount === "number"
      ) {
        items.push({ label: item.label, amount: item.amount });
      } else {
        warnings.push({
          type: "invalid_value",
          path: `${path}.value[${i}]`,
          reason: "invalid amount-list entry",
        });
      }
    });
    return { type: "amount_list", value: items };
  }
  if (type === "selection" && typeof raw.selectedIndex === "number") {
    return { type: "selection", selectedIndex: raw.selectedIndex };
  }
  warnings.push({
    type: "invalid_value",
    path,
    reason: `unrecognized BoxInput type: ${String(type)}`,
  });
  return undefined;
}

function parseFormInstance(
  raw: unknown,
  path: string,
  warnings: LoadWarning[],
): FormInstance | undefined {
  if (!isObject(raw)) {
    warnings.push({ type: "invalid_value", path, reason: "expected object" });
    return undefined;
  }
  if (typeof raw.instanceId !== "string") {
    warnings.push({
      type: "missing_required_field",
      path: `${path}.instanceId`,
    });
    return undefined;
  }
  const instance: FormInstance = {
    instanceId: raw.instanceId,
    inputs: {},
  };
  if (typeof raw.label === "string") instance.label = raw.label;
  if (isObject(raw.inputs)) {
    for (const [boxId, boxRaw] of Object.entries(raw.inputs)) {
      const parsed = parseBoxInput(
        boxRaw,
        `${path}.inputs.${boxId}`,
        warnings,
      );
      if (parsed) instance.inputs[boxId] = parsed;
    }
  }
  return instance;
}

export function deserialize(rawInput: unknown): {
  state: PrimaryState;
  warnings: LoadWarning[];
} {
  const warnings: LoadWarning[] = [];
  const migrated = migrate(rawInput, CURRENT_SCHEMA_VERSION);
  const fallback = defaultPrimaryState();

  if (!isObject(migrated)) {
    warnings.push({
      type: "invalid_value",
      path: "",
      reason: "expected object at root",
    });
    return { state: fallback, warnings };
  }

  if (typeof migrated.schemaVersion === "number") {
    if (migrated.schemaVersion > CURRENT_SCHEMA_VERSION) {
      warnings.push({
        type: "schema_version_newer",
        saved: migrated.schemaVersion,
        current: CURRENT_SCHEMA_VERSION,
      });
    }
  } else {
    warnings.push({
      type: "missing_required_field",
      path: "schemaVersion",
    });
  }

  if (typeof migrated.taxYear === "number") {
    if (migrated.taxYear !== CURRENT_TAX_YEAR) {
      warnings.push({
        type: "tax_year_mismatch",
        saved: migrated.taxYear,
        current: CURRENT_TAX_YEAR,
      });
    }
  } else {
    warnings.push({ type: "missing_required_field", path: "taxYear" });
  }

  for (const key of Object.keys(migrated)) {
    if (!KNOWN_TOP_LEVEL_FIELDS.has(key)) {
      warnings.push({ type: "unknown_field", path: key });
    }
  }

  let filingStatus: FilingStatus = fallback.filingStatus;
  if (typeof migrated.filingStatus === "string" &&
      FILING_STATUSES.has(migrated.filingStatus as FilingStatus)) {
    filingStatus = migrated.filingStatus as FilingStatus;
  } else if (migrated.filingStatus !== undefined) {
    warnings.push({
      type: "invalid_value",
      path: "filingStatus",
      reason: "unrecognized filing status",
    });
  } else {
    warnings.push({
      type: "missing_required_field",
      path: "filingStatus",
    });
  }

  const knownClasses = new Set<FormClass>(allFormClasses());
  let formClassOrder: FormClass[] = [];
  if (Array.isArray(migrated.formClassOrder)) {
    migrated.formClassOrder.forEach((c, i) => {
      if (typeof c === "string" && knownClasses.has(c as FormClass)) {
        formClassOrder.push(c as FormClass);
      } else {
        warnings.push({
          type: "invalid_value",
          path: `formClassOrder[${i}]`,
          reason: "unknown form class",
        });
      }
    });
  } else {
    warnings.push({
      type: "missing_required_field",
      path: "formClassOrder",
    });
  }

  const formInstancesByClass: PrimaryState["formInstancesByClass"] = {};
  if (isObject(migrated.formInstancesByClass)) {
    for (const [cls, instancesRaw] of Object.entries(migrated.formInstancesByClass)) {
      if (!knownClasses.has(cls as FormClass)) {
        warnings.push({
          type: "unknown_field",
          path: `formInstancesByClass.${cls}`,
        });
        continue;
      }
      if (!Array.isArray(instancesRaw)) {
        warnings.push({
          type: "invalid_value",
          path: `formInstancesByClass.${cls}`,
          reason: "expected array",
        });
        continue;
      }
      const parsed: FormInstance[] = [];
      instancesRaw.forEach((raw, i) => {
        const inst = parseFormInstance(
          raw,
          `formInstancesByClass.${cls}[${i}]`,
          warnings,
        );
        if (inst) parsed.push(inst);
      });
      if (parsed.length > 0) formInstancesByClass[cls as FormClass] = parsed;
    }
  } else {
    warnings.push({
      type: "missing_required_field",
      path: "formInstancesByClass",
    });
  }

  // Repair invariant: every class with instances must appear in formClassOrder.
  for (const cls of Object.keys(formInstancesByClass)) {
    if (!formClassOrder.includes(cls as FormClass)) {
      formClassOrder.push(cls as FormClass);
    }
  }
  // Drop classes from formClassOrder that have no instances.
  formClassOrder = formClassOrder.filter(
    (c) => (formInstancesByClass[c]?.length ?? 0) > 0,
  );

  const preferences = { ...fallback.preferences };
  if (isObject(migrated.preferences)) {
    if (typeof migrated.preferences.browserSaveEnabled === "boolean") {
      preferences.browserSaveEnabled = migrated.preferences.browserSaveEnabled;
    }
    for (const key of Object.keys(migrated.preferences)) {
      if (key !== "browserSaveEnabled") {
        warnings.push({
          type: "unknown_field",
          path: `preferences.${key}`,
        });
      }
    }
  }

  return {
    state: {
      filingStatus,
      formClassOrder,
      formInstancesByClass,
      preferences,
    },
    warnings,
  };
}
```

- [ ] **Step 4: Run, verify PASS**

```bash
cd thumbtax-webapp && npm test -- deserialize
```

---

### Task 5: `deserialize` — extended cases

**Files:**
- Modify: `thumbtax-webapp/src/persistence/deserialize.test.ts`

Add one `it(...)` per case below; assertions follow the pattern of the happy-path test.

- [ ] **Step 1: tax-year mismatch warning**

Pass a save file with `taxYear: 2024`. Expect a `tax_year_mismatch` warning.

- [ ] **Step 2: schema-version-newer warning**

Pass `schemaVersion: 999`. Expect a `schema_version_newer` warning. State still parses best-effort.

- [ ] **Step 3: unknown top-level field**

Pass an extra `nonsenseField: 42`. Expect an `unknown_field` warning at path `nonsenseField`.

- [ ] **Step 4: invalid filing status**

Pass `filingStatus: "alien"`. Expect an `invalid_value` warning and the state's filingStatus falls back to default.

- [ ] **Step 5: invalid box input**

Pass an instance whose `inputs.wages` is `{ type: "weird" }`. Expect an `invalid_value` warning.

- [ ] **Step 6: invariant repair (class with instances missing from `formClassOrder`)**

Pass a save with `formClassOrder: []` but `formInstancesByClass: { fW2: [<one>] }`. Expect deserialized state to have `formClassOrder: ["fW2"]`.

- [ ] **Step 7: invariant repair (class in `formClassOrder` has no instances)**

Pass `formClassOrder: ["fW2"]` and `formInstancesByClass: {}`. Expect the deserialized order to be empty.

- [ ] **Step 8: Run, verify PASS, commit**

```bash
cd thumbtax-webapp && npm test
git add thumbtax-webapp/src/persistence
git commit -m "Add deserialize and forgiving-validator tests"
```

---

### Task 6: Local storage hook (TDD)

**Files:**
- Create: `thumbtax-webapp/src/persistence/localStorage.test.ts`
- Create: `thumbtax-webapp/src/persistence/localStorage.ts`

- [ ] **Step 1: Write tests**

```typescript
import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LOCAL_STORAGE_KEYS } from "#src/persistence/config";
import {
  clearSavedState,
  loadFromLocalStorage,
  useAutosave,
} from "#src/persistence/localStorage";
import { useStore } from "#src/state/store";

describe("localStorage persistence", () => {
  beforeEach(() => {
    localStorage.clear();
    useStore.getState().resetState();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("loadFromLocalStorage returns null when nothing stored", () => {
    expect(loadFromLocalStorage()).toBe(null);
  });

  it("loadFromLocalStorage returns parsed state and warnings", () => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.savedState,
      JSON.stringify({
        schemaVersion: 1,
        taxYear: 2025,
        filingStatus: "single",
        formClassOrder: [],
        formInstancesByClass: {},
        preferences: { browserSaveEnabled: true },
      }),
    );
    const result = loadFromLocalStorage();
    expect(result?.state.filingStatus).toBe("single");
    expect(result?.warnings).toEqual([]);
  });

  it("clearSavedState removes the savedState key only", () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.savedState, "x");
    localStorage.setItem(LOCAL_STORAGE_KEYS.preferences, "y");
    clearSavedState();
    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.savedState)).toBe(null);
    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.preferences)).toBe("y");
  });

  it("useAutosave writes savedState only when browserSaveEnabled is true", () => {
    vi.useFakeTimers();
    useStore.setState({
      preferences: { browserSaveEnabled: true },
    });
    renderHook(() => useAutosave());
    vi.advanceTimersByTime(500);
    expect(
      localStorage.getItem(LOCAL_STORAGE_KEYS.savedState),
    ).not.toBe(null);
  });

  it("useAutosave clears savedState when toggle goes off", () => {
    vi.useFakeTimers();
    useStore.setState({ preferences: { browserSaveEnabled: true } });
    renderHook(() => useAutosave());
    vi.advanceTimersByTime(500);
    useStore.getState().setBrowserSaveEnabled(false);
    vi.advanceTimersByTime(500);
    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.savedState)).toBe(null);
  });
});
```

- [ ] **Step 2: Run, verify FAIL**

```bash
cd thumbtax-webapp && npm test -- localStorage
```

- [ ] **Step 3: Implement**

`thumbtax-webapp/src/persistence/localStorage.ts`:

```typescript
import { useEffect, useRef } from "react";
import { useStore as useZustandStore } from "zustand";

import { LOCAL_STORAGE_KEYS } from "#src/persistence/config";
import { deserialize } from "#src/persistence/deserialize";
import { serialize } from "#src/persistence/serialize";
import type { LoadWarning } from "#src/persistence/types/loadWarning";
import { useStore } from "#src/state/store";
import type { PrimaryState } from "#src/state/types/primaryState";

const AUTOSAVE_DEBOUNCE_MS = 300;

export function loadFromLocalStorage():
  | { state: PrimaryState; warnings: LoadWarning[] }
  | null {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.savedState);
  if (raw === null) return null;
  try {
    return deserialize(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function clearSavedState(): void {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.savedState);
}

export function useAutosave(): void {
  const browserSaveEnabled = useZustandStore(
    useStore,
    (s) => s.preferences.browserSaveEnabled,
  );
  const writeKey = useZustandStore(useStore, (s) => ({
    filingStatus: s.filingStatus,
    formClassOrder: s.formClassOrder,
    formInstancesByClass: s.formInstancesByClass,
    preferences: s.preferences,
  }));

  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    if (!browserSaveEnabled) {
      clearSavedState();
      return;
    }
    timer.current = window.setTimeout(() => {
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.savedState,
        JSON.stringify(serialize(writeKey)),
      );
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [browserSaveEnabled, writeKey]);
}
```

- [ ] **Step 4: Run, verify PASS, commit**

```bash
cd thumbtax-webapp && npm test
git add thumbtax-webapp/src/persistence/localStorage.ts thumbtax-webapp/src/persistence/localStorage.test.ts
git commit -m "Add localStorage autosave and load helpers"
```
