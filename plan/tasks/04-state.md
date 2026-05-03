# State Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Zustand store that owns primary state (filing status, form instances, inputs, user preferences) plus the derived workbook, and exposes the action API the UI dispatches into.

**Architecture:** A single Zustand store holds `PrimaryState ∪ { workbook, history }`. Every action that mutates primary state pushes the previous primary state onto `history.past`, clears `history.future`, applies the mutation, and recomputes the workbook by calling the engine. Undo and redo swap snapshots. `loadState` and `resetState` clear history. Selectors live alongside the store. Depends on `01-common-types`, `02-specifications`, and `03-engine`.

**Tech Stack:** Zustand 5, `uuid`. (`uuid` is already installed.)

> **Order note:** The engine plan imports `PrimaryState` from this module. Run **Task 1 (PrimaryState type)** of this plan before starting `03-engine.md`, then come back here for the rest.

---

## File Structure

- `thumbtax-webapp/src/state/types/userPreferences.ts` — `UserPreferences`.
- `thumbtax-webapp/src/state/types/formInstance.ts` — `FormInstance`.
- `thumbtax-webapp/src/state/types/primaryState.ts` — `PrimaryState`.
- `thumbtax-webapp/src/state/types/storeState.ts` — `StoreState` (= primary + workbook + history).
- `thumbtax-webapp/src/state/defaults.ts` — `defaultPrimaryState()`.
- `thumbtax-webapp/src/state/history.ts` — pure snapshot stack helpers.
- `thumbtax-webapp/src/state/history.test.ts`
- `thumbtax-webapp/src/state/store.ts` — `useStore`, `createStore`, plus selector hooks.
- `thumbtax-webapp/src/state/store.test.ts`
- `thumbtax-webapp/src/state/actions.ts` — pure reducer functions (one per action) used by the store.
- `thumbtax-webapp/src/state/actions.test.ts`

The action implementations are pure reducers (`(state, payload) => newPrimaryState`); the store's wrappers around each action handle history bookkeeping and workbook recomputation. This keeps action behavior unit-testable without instantiating the store.

---

### Task 1: Type files

**Files:**
- Create: `thumbtax-webapp/src/state/types/userPreferences.ts`
- Create: `thumbtax-webapp/src/state/types/formInstance.ts`
- Create: `thumbtax-webapp/src/state/types/primaryState.ts`
- Create: `thumbtax-webapp/src/state/types/storeState.ts`

- [ ] **Step 1: `UserPreferences`**

```typescript
export type UserPreferences = {
  browserSaveEnabled: boolean;
};
```

- [ ] **Step 2: `FormInstance`**

```typescript
import type { BoxIdentifier } from "#src/common/types/boxIdentifier";
import type { BoxInput } from "#src/common/types/boxInput";
import type { FormInstanceId } from "#src/common/types/formInstanceId";

export type FormInstance = {
  instanceId: FormInstanceId;
  label?: string;
  inputs: Partial<Record<BoxIdentifier, BoxInput>>;
};
```

- [ ] **Step 3: `PrimaryState`**

```typescript
import type { FilingStatus } from "#src/common/types/filingStatus";
import type { FormClass } from "#src/common/types/formClass";
import type { FormInstance } from "#src/state/types/formInstance";
import type { UserPreferences } from "#src/state/types/userPreferences";

export type PrimaryState = {
  filingStatus: FilingStatus;
  formClassOrder: FormClass[];
  formInstancesByClass: Partial<Record<FormClass, FormInstance[]>>;
  preferences: UserPreferences;
};
```

- [ ] **Step 4: `StoreState`**

```typescript
import type { Workbook } from "#src/engine/types/workbook";
import type { PrimaryState } from "#src/state/types/primaryState";

export type StoreState = PrimaryState & {
  workbook: Workbook;
  history: { past: PrimaryState[]; future: PrimaryState[] };
};
```

- [ ] **Step 5: Typecheck and commit**

```bash
cd thumbtax-webapp && npm run typecheck
git add thumbtax-webapp/src/state/types
git commit -m "Add state types"
```

(After this commit, the engine plan is unblocked. Resume engine plan and complete it before continuing here.)

---

### Task 2: Defaults

**Files:**
- Create: `thumbtax-webapp/src/state/defaults.ts`

- [ ] **Step 1: Implement**

```typescript
import { v4 as uuidv4 } from "uuid";

import type { FormInstance } from "#src/state/types/formInstance";
import type { PrimaryState } from "#src/state/types/primaryState";

function newInstance(): FormInstance {
  return { instanceId: uuidv4(), inputs: {} };
}

export function defaultPrimaryState(): PrimaryState {
  return {
    filingStatus: "single",
    formClassOrder: ["fW2", "f1040"],
    formInstancesByClass: {
      fW2: [newInstance()],
      f1040: [newInstance()],
    },
    preferences: { browserSaveEnabled: true },
  };
}
```

- [ ] **Step 2: Typecheck and commit**

```bash
cd thumbtax-webapp && npm run typecheck
git add thumbtax-webapp/src/state/defaults.ts
git commit -m "Add default primary state"
```

---

### Task 3: History helpers (TDD)

**Files:**
- Create: `thumbtax-webapp/src/state/history.test.ts`
- Create: `thumbtax-webapp/src/state/history.ts`

- [ ] **Step 1: Write tests**

```typescript
import { describe, expect, it } from "vitest";

import { applyMutation, undo, redo } from "#src/state/history";
import type { PrimaryState } from "#src/state/types/primaryState";

const s1: PrimaryState = {
  filingStatus: "single",
  formClassOrder: [],
  formInstancesByClass: {},
  preferences: { browserSaveEnabled: false },
};
const s2: PrimaryState = { ...s1, filingStatus: "head_of_household" };
const s3: PrimaryState = { ...s1, filingStatus: "married_filing_jointly" };

describe("history", () => {
  it("applyMutation pushes previous state and clears future", () => {
    const result = applyMutation(
      { current: s1, history: { past: [], future: [s3] } },
      s2,
    );
    expect(result.current).toBe(s2);
    expect(result.history.past).toEqual([s1]);
    expect(result.history.future).toEqual([]);
  });

  it("undo pops past, pushes current onto future", () => {
    const result = undo({ current: s2, history: { past: [s1], future: [] } });
    expect(result?.current).toBe(s1);
    expect(result?.history.past).toEqual([]);
    expect(result?.history.future).toEqual([s2]);
  });

  it("undo returns null when past is empty", () => {
    expect(undo({ current: s1, history: { past: [], future: [] } })).toBe(null);
  });

  it("redo pops future, pushes current onto past", () => {
    const result = redo({ current: s1, history: { past: [], future: [s2] } });
    expect(result?.current).toBe(s2);
    expect(result?.history.past).toEqual([s1]);
    expect(result?.history.future).toEqual([]);
  });

  it("redo returns null when future is empty", () => {
    expect(redo({ current: s1, history: { past: [], future: [] } })).toBe(null);
  });
});
```

- [ ] **Step 2: Run, verify FAIL**

```bash
cd thumbtax-webapp && npm test -- history
```

- [ ] **Step 3: Implement**

```typescript
import type { PrimaryState } from "#src/state/types/primaryState";

export type HistorySnapshot = {
  current: PrimaryState;
  history: { past: PrimaryState[]; future: PrimaryState[] };
};

export function applyMutation(
  snapshot: HistorySnapshot,
  next: PrimaryState,
): HistorySnapshot {
  return {
    current: next,
    history: { past: [...snapshot.history.past, snapshot.current], future: [] },
  };
}

export function undo(snapshot: HistorySnapshot): HistorySnapshot | null {
  const past = snapshot.history.past;
  if (past.length === 0) return null;
  const previous = past[past.length - 1];
  return {
    current: previous,
    history: {
      past: past.slice(0, -1),
      future: [...snapshot.history.future, snapshot.current],
    },
  };
}

export function redo(snapshot: HistorySnapshot): HistorySnapshot | null {
  const future = snapshot.history.future;
  if (future.length === 0) return null;
  const next = future[future.length - 1];
  return {
    current: next,
    history: {
      past: [...snapshot.history.past, snapshot.current],
      future: future.slice(0, -1),
    },
  };
}
```

- [ ] **Step 4: Run, verify PASS, commit**

```bash
cd thumbtax-webapp && npm test -- history
git add thumbtax-webapp/src/state/history.ts thumbtax-webapp/src/state/history.test.ts
git commit -m "Add history snapshot helpers"
```

---

### Task 4: Reducer-style actions (TDD)

**Files:**
- Create: `thumbtax-webapp/src/state/actions.test.ts`
- Create: `thumbtax-webapp/src/state/actions.ts`

The action functions take and return `PrimaryState`. Per-call history bookkeeping happens in the store wrapper (Task 5).

- [ ] **Step 1: Write tests**

```typescript
import { describe, expect, it } from "vitest";

import {
  addFormInstance,
  moveFormClass,
  moveInstance,
  removeFormInstance,
  setBoxInput,
  setBrowserSaveEnabled,
  setFilingStatus,
  setInstanceLabel,
} from "#src/state/actions";
import { defaultPrimaryState } from "#src/state/defaults";

describe("actions", () => {
  it("setFilingStatus updates only filingStatus", () => {
    const before = defaultPrimaryState();
    const after = setFilingStatus(before, "married_filing_jointly");
    expect(after.filingStatus).toBe("married_filing_jointly");
    expect(after.formClassOrder).toEqual(before.formClassOrder);
  });

  it("addFormInstance appends new instance and returns its id", () => {
    const before = defaultPrimaryState();
    const { state, instanceId } = addFormInstance(before, "f1099Int");
    expect(state.formClassOrder).toContain("f1099Int");
    expect(state.formInstancesByClass.f1099Int?.[0].instanceId).toBe(instanceId);
  });

  it("addFormInstance does not duplicate the class in formClassOrder", () => {
    const before = defaultPrimaryState();
    const r1 = addFormInstance(before, "fW2");
    const r2 = addFormInstance(r1.state, "fW2");
    const occurrences = r2.state.formClassOrder.filter((c) => c === "fW2").length;
    expect(occurrences).toBe(1);
    expect(r2.state.formInstancesByClass.fW2?.length).toBe(2);
  });

  it("removeFormInstance removes class when last instance gone", () => {
    const before = defaultPrimaryState();
    const id = before.formInstancesByClass.fW2![0].instanceId;
    const after = removeFormInstance(before, "fW2", id);
    expect(after.formClassOrder).not.toContain("fW2");
    expect(after.formInstancesByClass.fW2).toBeUndefined();
  });

  it("setInstanceLabel sets label on the targeted instance", () => {
    const before = defaultPrimaryState();
    const id = before.formInstancesByClass.fW2![0].instanceId;
    const after = setInstanceLabel(before, "fW2", id, "Acme Corp");
    expect(after.formInstancesByClass.fW2?.[0].label).toBe("Acme Corp");
  });

  it("moveInstance shifts within class", () => {
    const before = addFormInstance(defaultPrimaryState(), "fW2").state;
    const firstId = before.formInstancesByClass.fW2![0].instanceId;
    const after = moveInstance(before, "fW2", firstId, "right");
    expect(after.formInstancesByClass.fW2?.[1].instanceId).toBe(firstId);
  });

  it("moveFormClass shifts in formClassOrder", () => {
    const before = defaultPrimaryState();
    const after = moveFormClass(before, "f1040", "up");
    expect(after.formClassOrder[0]).toBe("f1040");
  });

  it("setBoxInput updates inputs map immutably", () => {
    const before = defaultPrimaryState();
    const id = before.formInstancesByClass.fW2![0].instanceId;
    const after = setBoxInput(before, "fW2", id, "wages", {
      type: "number",
      value: 1234,
    });
    expect(after.formInstancesByClass.fW2?.[0].inputs.wages).toEqual({
      type: "number",
      value: 1234,
    });
    expect(before.formInstancesByClass.fW2?.[0].inputs.wages).toBeUndefined();
  });

  it("setBrowserSaveEnabled updates preferences", () => {
    const before = defaultPrimaryState();
    const after = setBrowserSaveEnabled(before, false);
    expect(after.preferences.browserSaveEnabled).toBe(false);
  });
});
```

- [ ] **Step 2: Run, verify FAIL**

```bash
cd thumbtax-webapp && npm test -- actions
```

- [ ] **Step 3: Implement**

```typescript
import { v4 as uuidv4 } from "uuid";

import type { BoxIdentifier } from "#src/common/types/boxIdentifier";
import type { BoxInput } from "#src/common/types/boxInput";
import type { FilingStatus } from "#src/common/types/filingStatus";
import type { FormClass } from "#src/common/types/formClass";
import type { FormInstanceId } from "#src/common/types/formInstanceId";
import type { FormInstance } from "#src/state/types/formInstance";
import type { PrimaryState } from "#src/state/types/primaryState";

export function setFilingStatus(
  state: PrimaryState,
  filingStatus: FilingStatus,
): PrimaryState {
  return { ...state, filingStatus };
}

export function addFormInstance(
  state: PrimaryState,
  formClass: FormClass,
): { state: PrimaryState; instanceId: FormInstanceId } {
  const instance: FormInstance = { instanceId: uuidv4(), inputs: {} };
  const existing = state.formInstancesByClass[formClass] ?? [];
  const wasPresent = existing.length > 0;
  return {
    state: {
      ...state,
      formClassOrder: wasPresent
        ? state.formClassOrder
        : [...state.formClassOrder, formClass],
      formInstancesByClass: {
        ...state.formInstancesByClass,
        [formClass]: [...existing, instance],
      },
    },
    instanceId: instance.instanceId,
  };
}

export function removeFormInstance(
  state: PrimaryState,
  formClass: FormClass,
  instanceId: FormInstanceId,
): PrimaryState {
  const existing = state.formInstancesByClass[formClass] ?? [];
  const remaining = existing.filter((i) => i.instanceId !== instanceId);
  const next: PrimaryState = {
    ...state,
    formInstancesByClass: { ...state.formInstancesByClass },
  };
  if (remaining.length === 0) {
    delete next.formInstancesByClass[formClass];
    next.formClassOrder = state.formClassOrder.filter((c) => c !== formClass);
  } else {
    next.formInstancesByClass[formClass] = remaining;
  }
  return next;
}

export function setInstanceLabel(
  state: PrimaryState,
  formClass: FormClass,
  instanceId: FormInstanceId,
  label: string,
): PrimaryState {
  const existing = state.formInstancesByClass[formClass] ?? [];
  const updated = existing.map((i) =>
    i.instanceId === instanceId ? { ...i, label } : i,
  );
  return {
    ...state,
    formInstancesByClass: {
      ...state.formInstancesByClass,
      [formClass]: updated,
    },
  };
}

export function moveInstance(
  state: PrimaryState,
  formClass: FormClass,
  instanceId: FormInstanceId,
  direction: "left" | "right",
): PrimaryState {
  const existing = state.formInstancesByClass[formClass] ?? [];
  const idx = existing.findIndex((i) => i.instanceId === instanceId);
  if (idx < 0) return state;
  const swapWith = direction === "left" ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= existing.length) return state;
  const next = existing.slice();
  [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
  return {
    ...state,
    formInstancesByClass: {
      ...state.formInstancesByClass,
      [formClass]: next,
    },
  };
}

export function moveFormClass(
  state: PrimaryState,
  formClass: FormClass,
  direction: "up" | "down",
): PrimaryState {
  const idx = state.formClassOrder.indexOf(formClass);
  if (idx < 0) return state;
  const swapWith = direction === "up" ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= state.formClassOrder.length) return state;
  const order = state.formClassOrder.slice();
  [order[idx], order[swapWith]] = [order[swapWith], order[idx]];
  return { ...state, formClassOrder: order };
}

export function setBoxInput(
  state: PrimaryState,
  formClass: FormClass,
  instanceId: FormInstanceId,
  boxId: BoxIdentifier,
  value: BoxInput,
): PrimaryState {
  const existing = state.formInstancesByClass[formClass] ?? [];
  const updated = existing.map((i) =>
    i.instanceId === instanceId
      ? { ...i, inputs: { ...i.inputs, [boxId]: value } }
      : i,
  );
  return {
    ...state,
    formInstancesByClass: {
      ...state.formInstancesByClass,
      [formClass]: updated,
    },
  };
}

export function setBrowserSaveEnabled(
  state: PrimaryState,
  enabled: boolean,
): PrimaryState {
  return {
    ...state,
    preferences: { ...state.preferences, browserSaveEnabled: enabled },
  };
}
```

- [ ] **Step 4: Run, verify PASS, commit**

```bash
cd thumbtax-webapp && npm test -- actions
git add thumbtax-webapp/src/state/actions.ts thumbtax-webapp/src/state/actions.test.ts
git commit -m "Add primary-state action reducers"
```

---

### Task 5: Zustand store (TDD)

**Files:**
- Create: `thumbtax-webapp/src/state/store.test.ts`
- Create: `thumbtax-webapp/src/state/store.ts`

- [ ] **Step 1: Write tests**

```typescript
import { describe, expect, it } from "vitest";

import { createStore } from "#src/state/store";

describe("store", () => {
  it("recomputes workbook on setBoxInput", () => {
    const store = createStore();
    const w2Id = store.getState().formInstancesByClass.fW2![0].instanceId;
    store.getState().setBoxInput("fW2", w2Id, "wages", {
      type: "number",
      value: 50000,
    });
    const f1040Id = store.getState().formInstancesByClass.f1040![0].instanceId;
    expect(store.getState().workbook[f1040Id]["totalWages"].value).toBe(50000);
  });

  it("undo and redo round-trip a change", () => {
    const store = createStore();
    const w2Id = store.getState().formInstancesByClass.fW2![0].instanceId;
    store.getState().setBoxInput("fW2", w2Id, "wages", {
      type: "number",
      value: 100,
    });
    store.getState().undo();
    const f1040Id = store.getState().formInstancesByClass.f1040![0].instanceId;
    expect(store.getState().workbook[f1040Id]["totalWages"].value).toBe(0);
    store.getState().redo();
    expect(store.getState().workbook[f1040Id]["totalWages"].value).toBe(100);
  });

  it("loadState replaces primary state and clears history", () => {
    const store = createStore();
    const w2Id = store.getState().formInstancesByClass.fW2![0].instanceId;
    store.getState().setBoxInput("fW2", w2Id, "wages", {
      type: "number",
      value: 1,
    });
    store.getState().loadState({
      filingStatus: "head_of_household",
      formClassOrder: [],
      formInstancesByClass: {},
      preferences: { browserSaveEnabled: false },
    });
    expect(store.getState().filingStatus).toBe("head_of_household");
    expect(store.getState().history.past.length).toBe(0);
  });

  it("addFormInstance returns new id", () => {
    const store = createStore();
    const id = store.getState().addFormInstance("f1099Int");
    expect(store.getState().formInstancesByClass.f1099Int?.[0].instanceId).toBe(
      id,
    );
  });
});
```

- [ ] **Step 2: Run, verify FAIL**

```bash
cd thumbtax-webapp && npm test -- store
```

- [ ] **Step 3: Implement**

```typescript
import { create, type StoreApi } from "zustand";

import type { BoxIdentifier } from "#src/common/types/boxIdentifier";
import type { BoxInput } from "#src/common/types/boxInput";
import type { FilingStatus } from "#src/common/types/filingStatus";
import type { FormClass } from "#src/common/types/formClass";
import type { FormInstanceId } from "#src/common/types/formInstanceId";
import { computeWorkbook } from "#src/engine/computeWorkbook";
import {
  allFormClasses,
  getFormSpecification,
} from "#src/specifications/service";
import * as actions from "#src/state/actions";
import { defaultPrimaryState } from "#src/state/defaults";
import { applyMutation, redo as historyRedo, undo as historyUndo } from "#src/state/history";
import type { PrimaryState } from "#src/state/types/primaryState";
import type { StoreState } from "#src/state/types/storeState";

const SPECS = new Map(
  allFormClasses().map((c) => [c, getFormSpecification(c)]),
);

type Actions = {
  setFilingStatus: (status: FilingStatus) => void;
  addFormInstance: (formClass: FormClass) => FormInstanceId;
  removeFormInstance: (formClass: FormClass, instanceId: FormInstanceId) => void;
  setInstanceLabel: (
    formClass: FormClass,
    instanceId: FormInstanceId,
    label: string,
  ) => void;
  moveInstance: (
    formClass: FormClass,
    instanceId: FormInstanceId,
    direction: "left" | "right",
  ) => void;
  moveFormClass: (formClass: FormClass, direction: "up" | "down") => void;
  setBoxInput: (
    formClass: FormClass,
    instanceId: FormInstanceId,
    boxId: BoxIdentifier,
    value: BoxInput,
  ) => void;
  setBrowserSaveEnabled: (enabled: boolean) => void;
  loadState: (state: PrimaryState) => void;
  resetState: () => void;
  undo: () => void;
  redo: () => void;
};

export type FullStoreState = StoreState & Actions;

function primaryFrom(state: StoreState): PrimaryState {
  return {
    filingStatus: state.filingStatus,
    formClassOrder: state.formClassOrder,
    formInstancesByClass: state.formInstancesByClass,
    preferences: state.preferences,
  };
}

function withWorkbook(
  next: PrimaryState,
  prev: StoreState | null,
): StoreState {
  return {
    ...next,
    workbook: computeWorkbook({
      specifications: SPECS,
      state: next,
      previousWorkbook: prev?.workbook,
    }),
    history: prev?.history ?? { past: [], future: [] },
  };
}

export function createStore(): StoreApi<FullStoreState> {
  const initialPrimary = defaultPrimaryState();
  const initial: StoreState = withWorkbook(initialPrimary, null);

  return create<FullStoreState>()((set, get) => {
    function applyMutating(next: PrimaryState) {
      const current = get();
      const prevPrimary = primaryFrom(current);
      const snapshot = applyMutation(
        { current: prevPrimary, history: current.history },
        next,
      );
      set({
        ...withWorkbook(snapshot.current, current),
        history: snapshot.history,
      });
    }

    return {
      ...initial,
      setFilingStatus: (status) =>
        applyMutating(actions.setFilingStatus(primaryFrom(get()), status)),
      addFormInstance: (formClass) => {
        const result = actions.addFormInstance(primaryFrom(get()), formClass);
        applyMutating(result.state);
        return result.instanceId;
      },
      removeFormInstance: (formClass, instanceId) =>
        applyMutating(
          actions.removeFormInstance(primaryFrom(get()), formClass, instanceId),
        ),
      setInstanceLabel: (formClass, instanceId, label) =>
        applyMutating(
          actions.setInstanceLabel(
            primaryFrom(get()),
            formClass,
            instanceId,
            label,
          ),
        ),
      moveInstance: (formClass, instanceId, direction) =>
        applyMutating(
          actions.moveInstance(
            primaryFrom(get()),
            formClass,
            instanceId,
            direction,
          ),
        ),
      moveFormClass: (formClass, direction) =>
        applyMutating(
          actions.moveFormClass(primaryFrom(get()), formClass, direction),
        ),
      setBoxInput: (formClass, instanceId, boxId, value) =>
        applyMutating(
          actions.setBoxInput(
            primaryFrom(get()),
            formClass,
            instanceId,
            boxId,
            value,
          ),
        ),
      setBrowserSaveEnabled: (enabled) =>
        applyMutating(
          actions.setBrowserSaveEnabled(primaryFrom(get()), enabled),
        ),
      loadState: (state) => {
        set({
          ...withWorkbook(state, null),
          history: { past: [], future: [] },
        });
      },
      resetState: () => {
        set({
          ...withWorkbook(defaultPrimaryState(), null),
          history: { past: [], future: [] },
        });
      },
      undo: () => {
        const current = get();
        const result = historyUndo({
          current: primaryFrom(current),
          history: current.history,
        });
        if (!result) return;
        set({
          ...withWorkbook(result.current, current),
          history: result.history,
        });
      },
      redo: () => {
        const current = get();
        const result = historyRedo({
          current: primaryFrom(current),
          history: current.history,
        });
        if (!result) return;
        set({
          ...withWorkbook(result.current, current),
          history: result.history,
        });
      },
    };
  });
}

export const useStore = createStore();
```

- [ ] **Step 4: Run, verify PASS**

```bash
cd thumbtax-webapp && npm test
```

- [ ] **Step 5: Commit**

```bash
git add thumbtax-webapp/src/state
git commit -m "Add Zustand store with actions, history, and workbook recomputation"
```

---

### Task 6: Selector hooks

**Files:**
- Modify: `thumbtax-webapp/src/state/store.ts`

Add convenience hooks for the most common selections.

- [ ] **Step 1: Append to `store.ts`**

```typescript
import { useStore as useZustandStore } from "zustand";

export function useResolvedBox(
  formClass: FormClass,
  instanceId: FormInstanceId,
  boxId: BoxIdentifier,
) {
  return useZustandStore(useStore, (s) => {
    const box = s.workbook[instanceId]?.[boxId];
    const instance = s.formInstancesByClass[formClass]?.find(
      (i) => i.instanceId === instanceId,
    );
    return {
      input: instance?.inputs[boxId],
      value: box?.value ?? 0,
      warnings: box?.warnings ?? [],
    };
  });
}

export function useFilingStatus() {
  return useZustandStore(useStore, (s) => s.filingStatus);
}

export function useFormInstancesByClass() {
  return useZustandStore(useStore, (s) => s.formInstancesByClass);
}

export function useFormClassOrder() {
  return useZustandStore(useStore, (s) => s.formClassOrder);
}
```

(Note: this re-imports `useStore` from the `zustand` package by alias because `useStore` here is also a top-level identifier. Adjust the alias as needed; the canonical pattern is `import { useStore } from "zustand"` renamed.)

- [ ] **Step 2: Typecheck and commit**

```bash
cd thumbtax-webapp && npm run typecheck
git add thumbtax-webapp/src/state/store.ts
git commit -m "Add selector hooks"
```
