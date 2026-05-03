# Common Types Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Define the cross-module types that the specifications, engine, state, persistence, and UI layers all depend on.

**Architecture:** Each type lives in its own file under `src/common/types/`. There is no barrel `index.ts`; importers name exactly one type each. These types are pure data — no functions, no React, no DOM. They are imported by every other layer, so getting them right unblocks everything that follows.

**Tech Stack:** TypeScript only.

---

## File Structure

- `thumbtax-webapp/src/common/types/filingStatus.ts` — `FilingStatus` string-literal union.
- `thumbtax-webapp/src/common/types/formClass.ts` — `FormClass` string-literal union of supported tax forms.
- `thumbtax-webapp/src/common/types/boxIdentifier.ts` — `BoxIdentifier` opaque-ish string alias.
- `thumbtax-webapp/src/common/types/formInstanceId.ts` — `FormInstanceId` UUID alias.
- `thumbtax-webapp/src/common/types/boxAddress.ts` — `BoxAddress` triple `{ form, instance, box }`.
- `thumbtax-webapp/src/common/types/boxInput.ts` — `BoxInput` discriminated union for stored user inputs.

These files contain types only. Type-level files do not get test files (nothing to execute).

---

### Task 1: `FilingStatus`

**Files:**
- Create: `thumbtax-webapp/src/common/types/filingStatus.ts`

- [ ] **Step 1: Write the type**

```typescript
export type FilingStatus =
  | "single"
  | "married_filing_jointly"
  | "married_filing_separately"
  | "head_of_household"
  | "qualifying_surviving_spouse";
```

- [ ] **Step 2: Typecheck**

```bash
cd thumbtax-webapp && npm run typecheck
```

Expected: PASS.

---

### Task 2: `FormClass`

**Files:**
- Create: `thumbtax-webapp/src/common/types/formClass.ts`

- [ ] **Step 1: Write the type**

The initial v1 form set covers Form 1040, Form W-2, Form 1099-INT, Form 1099-DIV, Schedule B (interest/dividend reconciliation), and Schedule D (capital gains) plus Form 8949. Keep the union extensible — adding a form is a one-line addition.

```typescript
export type FormClass =
  | "f1040"
  | "fW2"
  | "f1099Int"
  | "f1099Div"
  | "schB"
  | "schD"
  | "f8949";
```

- [ ] **Step 2: Typecheck**

```bash
cd thumbtax-webapp && npm run typecheck
```

---

### Task 3: `BoxIdentifier` and `FormInstanceId`

**Files:**
- Create: `thumbtax-webapp/src/common/types/boxIdentifier.ts`
- Create: `thumbtax-webapp/src/common/types/formInstanceId.ts`

- [ ] **Step 1: Write `BoxIdentifier`**

```typescript
// Unique within a form class. Not globally unique across classes.
export type BoxIdentifier = string;
```

- [ ] **Step 2: Write `FormInstanceId`**

```typescript
// UUID minted when a form instance is added.
export type FormInstanceId = string;
```

---

### Task 4: `BoxAddress`

**Files:**
- Create: `thumbtax-webapp/src/common/types/boxAddress.ts`

- [ ] **Step 1: Write the type**

```typescript
import type { BoxIdentifier } from "#src/common/types/boxIdentifier";
import type { FormClass } from "#src/common/types/formClass";
import type { FormInstanceId } from "#src/common/types/formInstanceId";

export type BoxAddress = {
  form: FormClass;
  instance: FormInstanceId;
  box: BoxIdentifier;
};
```

---

### Task 5: `BoxInput`

**Files:**
- Create: `thumbtax-webapp/src/common/types/boxInput.ts`

- [ ] **Step 1: Write the type**

```typescript
export type BoxInput =
  | { type: "number"; value: number }
  | {
      type: "amount_list";
      value: Array<{ label: string; amount: number }>;
    }
  | { type: "selection"; selectedIndex: number };
```

---

### Task 6: Final commit

- [ ] **Step 1: Typecheck and lint**

```bash
cd thumbtax-webapp && npm run typecheck && npm run lint
```

- [ ] **Step 2: Commit**

```bash
git add thumbtax-webapp/src/common
git commit -m "Add common/types: FilingStatus, FormClass, BoxIdentifier, FormInstanceId, BoxAddress, BoxInput"
```
