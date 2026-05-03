# System design

This document describes the system design for Thumbtax, a frontend-only single-page web application that estimates U.S. individual tax returns.
It assumes the product context established in [index.md](index.md) and only covers what the high-level outline leaves unspecified.

## Overview

The system is organized as four layers, each with a clean boundary:

1. **Form specifications** — static, declarative descriptions of every supported tax form, expressed as pure data.
2. **User state** — the user's filing status, the set of present form instances, and per-box input values, plus user-facing preferences.
3. **Workbook engine** — a pure function that takes specifications and user state and produces the _workbook_, which holds every box's resolved value and any warnings.
4. **Consumers** — UI components, data exporters, the Connections graph extractor, and the persistence layer, all of which read the workbook and (in the UI's case) dispatch actions back into the state layer.

```mermaid
graph TB
  Specs["Form specifications<br/>(static data)"]
  State["User state<br/>(Zustand store)"]
  Engine["Workbook engine<br/>(pure function)"]
  Workbook["Workbook<br/>(resolved values + warnings)"]
  UI["React UI"]
  Persist["Persistence<br/>(local storage, save file)"]
  Graph["Connections graph<br/>(extractor)"]
  Export["Exporters<br/>(CSV, Excel)"]

  Specs --> Engine
  State -- primary state --> Engine
  Engine --> Workbook
  Workbook --> UI
  Workbook --> Export
  Specs --> Graph
  State --> Graph
  Graph --> UI
  UI -- actions --> State
  State <--> Persist
```

The strict directionality — primary state plus specifications flow into a pure engine, the workbook flows out to consumers, and the UI's only writes go through state actions — is the load-bearing structural decision in the design.
It enables undo/redo, isolated unit testing, and incremental optimization without leaking concerns across module boundaries.

## Principles

These principles guide the design and trade-offs throughout this document. They are listed in no particular order.

- **Separation of concerns.** Each layer defines a small interface with the next; internals can be replaced without touching consumers. The engine, in particular, has no React or DOM dependencies and could be moved to a backend server.
- **Specifications as data, not code.** Every tax form is a static value of `TaxFormSpecification`. Adjusting a form for a new tax year is a data edit; the engine, UI, and persistence code do not change.
- **Single source of truth.** The user's filing status, instance metadata, preferences, and per-box input values are the only authentic state. The workbook, dependency graph, Connections graph data, and all rendered values are derived.
- **Strong, explicit types.** All discriminated unions are fully tagged. The codebase does not use `!` non-null assertions, type casts, or comments that disable the typechecker or linter.
- **Unit-testable units.** Each module exposes a small surface and is testable with little or no mocking. Tests are co-located with source files.
- **Forgiving boundaries, strict internals.** Persistence loads inputs charitably (drop unknowns, default missing, warn rather than throw) so users never lose data due to schema drift; everything beyond the boundary is strictly typed.

## Module organization

Source code lives under `thumbtax-webapp/src/`. The path alias `#src/` resolves to that directory.

The layout follows runtime dependency direction: a module owns the types it produces; only types used across multiple modules live in `common/`.

```
src/
├── main.tsx
├── App.tsx
├── App.test.tsx
├── index.css
│
├── common/
│   └── types/                       # truly cross-module types
│       ├── filingStatus.ts
│       ├── formClass.ts
│       ├── boxIdentifier.ts
│       ├── formInstanceId.ts
│       ├── boxInput.ts
│       └── boxAddress.ts
│
├── specifications/
│   ├── types/
│   │   ├── taxFormSpecification.ts
│   │   ├── taxFormSection.ts
│   │   ├── taxFormLine.ts
│   │   ├── taxFormBox.ts
│   │   ├── boxFormat.ts
│   │   └── valueProvider.ts
│   ├── service.ts                   # getFormSpecification, allFormClasses, allSpecifications
│   ├── service.test.ts
│   └── forms/
│       ├── form1040.ts
│       ├── formW2.ts
│       └── ...
│
├── engine/
│   ├── types/
│   │   ├── workbook.ts
│   │   ├── resolvedBox.ts
│   │   └── boxWarning.ts
│   ├── computeWorkbook.ts           # public entry point; resolveProvider is a private closure inside
│   ├── computeWorkbook.test.ts
│   ├── topologicalOrder.ts          # builds dependency graph internally; exports computeTopologicalOrder
│   ├── topologicalOrder.test.ts
│   ├── preserveReferences.ts        # ref-equality preservation across recomputes
│   └── preserveReferences.test.ts
│
├── state/
│   ├── types/
│   │   ├── primaryState.ts
│   │   ├── formInstance.ts
│   │   ├── storeState.ts
│   │   └── userPreferences.ts
│   ├── store.ts                     # createStore + selector hooks
│   ├── store.test.ts
│   ├── actions.ts
│   ├── actions.test.ts
│   ├── history.ts                   # snapshot stack for undo/redo
│   ├── history.test.ts
│   └── defaults.ts
│
├── persistence/
│   ├── types/
│   │   ├── saveFile.ts
│   │   └── loadWarning.ts
│   ├── serialize.ts
│   ├── serialize.test.ts
│   ├── deserialize.ts               # forgiving parser; emits LoadWarning[]
│   ├── deserialize.test.ts
│   ├── migrations.ts
│   ├── migrations.test.ts
│   ├── localStorage.ts              # autosave hook + load-on-mount
│   ├── localStorage.test.ts
│   └── config.ts                    # CURRENT_SCHEMA_VERSION, CURRENT_TAX_YEAR
│
├── connectionsGraph/
│   ├── types/
│   │   ├── connectionsGraph.ts
│   │   ├── connectionsNode.ts
│   │   ├── connectionsEdge.ts
│   │   └── edgeReference.ts
│   ├── extract.ts
│   ├── extract.test.ts
│   ├── visitProviderReferences.ts   # reusable provider visitor
│   └── visitProviderReferences.test.ts
│
├── exporters/
│   ├── exportToXlsx.ts
│   ├── exportToXlsx.test.ts
│   ├── exportToCsv.ts
│   └── exportToCsv.test.ts
│
└── ui/
    ├── routes/
    │   ├── MainPage.tsx
    │   ├── MainPage.test.tsx
    │   ├── AboutPage.tsx
    │   └── AboutPage.test.tsx
    ├── layout/
    │   ├── RootLayout.tsx
    │   ├── NavigationBar.tsx
    │   └── NavigationDrawer.tsx
    ├── controlBar/
    │   ├── ControlBar.tsx
    │   ├── TaxYearIndicator.tsx
    │   ├── FilingStatusSelector.tsx
    │   ├── UndoRedoButtons.tsx
    │   ├── AddFormButton.tsx
    │   ├── AddFormPicker.tsx
    │   ├── BrowserSaveToggle.tsx
    │   ├── DownloadButton.tsx
    │   ├── UploadButton.tsx
    │   ├── ExportMenu.tsx
    │   └── OverflowMenu.tsx
    ├── formList/
    │   ├── FormList.tsx
    │   ├── FormClassTable.tsx
    │   ├── FormClassHeader.tsx
    │   ├── FormSectionGroup.tsx
    │   ├── FormColumnHeader.tsx
    │   ├── FormLineRow.tsx
    │   ├── LineLabelCell.tsx
    │   ├── FormBoxCell.tsx
    │   └── focus/
    │       ├── types/
    │       │   ├── focusKey.ts
    │       │   └── focusRegistry.ts
    │       ├── FocusContext.tsx
    │       ├── computeNextFocusKey.ts
    │       └── computeNextFocusKey.test.ts
    ├── connectionsView/
    │   ├── ConnectionsGraph.tsx
    │   ├── ConnectionsBottomSheet.tsx
    │   ├── FormNode.tsx
    │   └── ReferenceEdge.tsx
    └── primitives/                  # thin wrappers around React Aria
```

Conventions:

- **Tests are co-located.** Every source file has a sibling `.test.ts(x)` per the plan rule.
- **Types are individually filed.** Each type lives in its own file under a `types/` subdirectory of its owning module. No barrel `index.ts` files; imports name exactly one type each so dependency relationships stay visible and refactors are safer.
- **`common/types/` is small by design.** A type only belongs here if it has multiple owning modules in practice (rule of thumb: used by ≥3 modules). Otherwise it stays in its primary owner.
- **CSS modules are co-located.** A component `Foo.tsx` may have a sibling `Foo.module.css`. Global styles live only in `index.css`.
- **Small one-off components live in their parent's file**, per the project rule. Components reused in more than one place earn their own file.
- **`primitives/` wraps React Aria components.** The wrappers apply project styles and defaults. Nowhere else imports React Aria components directly.

## Cross-cutting types

The `common/types/` directory holds types that span multiple modules.

```typescript
// common/types/filingStatus.ts
export type FilingStatus =
  | "single"
  | "married_filing_jointly"
  | "married_filing_separately"
  | "head_of_household"
  | "qualifying_surviving_spouse";

// common/types/formClass.ts
// String literal union of every supported form class. Adding a form means
// adding to this union and registering its specification in specifications/forms.
// Example variants:
export type FormClass = "f1040" | "fW2" | "f1099Int" | "f1099Div";

// common/types/boxIdentifier.ts
// Unique within a form class; no global uniqueness requirement across classes.
export type BoxIdentifier = string;

// common/types/formInstanceId.ts
// UUID minted when a form instance is added.
export type FormInstanceId = string;

// common/types/boxAddress.ts
// Used in BoxWarning (upstream variant) and the connections graph.
export type BoxAddress = {
  form: FormClass;
  instance: FormInstanceId;
  box: BoxIdentifier;
};

// common/types/boxInput.ts
// Stored in FormInstance.inputs for input-provider boxes only.
// Computed boxes have no entry in inputs.
export type BoxInput =
  | { type: "number"; value: number }
  | { type: "amount_list"; value: Array<{ label: string; amount: number }> }
  | { type: "selection"; selectedIndex: number };

// The workbook stores resolved values as plain numbers.
// Every provider resolves to a number; no separate ResolvedValue type is needed.
```

## Form specifications

Each supported tax form is a static `TaxFormSpecification` defined under `src/specifications/forms/` and registered in the lookup service.

### Structure

A form has three levels of nesting: **sections** (e.g., "Part I — Short-Term Capital Gains"), each containing **lines** (rows on the form), each containing one or more **boxes** (the actual cells). Sections optionally declare columns; boxes refer to a column by its `index`.

```typescript
// specifications/types/taxFormSpecification.ts
export type TaxFormSpecification = {
  class: FormClass;
  title: string; // "Form W-2"
  subtitle?: string; // "Wage and Tax Statement"
  description: string; // educational blurb shown in UI
  irsPageUrl: string; // deep link to IRS reference
  category: "income" | "taxes"; // which page area the form belongs in
  maxInstances: number | null; // null = unlimited
  defaultInstanceLabel?: string; // placeholder text for instance label
  sections: Array<TaxFormSection>;
};

// specifications/types/taxFormSection.ts
export type TaxFormSection = {
  heading?: string; // e.g. "Part I", "Filing Status"
  columns?: Array<{
    index: string; // "(a)", "(b)"
    description?: string;
  }>;
  lines: Array<TaxFormLine>;
};

// specifications/types/taxFormLine.ts
export type TaxFormLine = {
  index: string; // "1a", "7", "12b"
  description?: string;
  boxes: Array<TaxFormBox>;
};

// specifications/types/taxFormBox.ts
export type TaxFormBox = {
  identifier: BoxIdentifier; // unique within the enclosing form class
  columnIndex?: string; // refers to enclosing section's columns[].index
  value: ValueProvider;
  format: BoxFormat;
  helpText?: string; // educational tooltip
};

// specifications/types/boxFormat.ts
export type BoxFormat = "checkbox" | "financial" | "percentage" | "plain";
```

### Value providers

A `ValueProvider` declares how a box's value is derived. The union is fully tagged with no shorthand literals, prioritizing strong, explicit types over conciseness.

```typescript
// specifications/types/valueProvider.ts
export type ValueProvider =
  // ── Constants ──────────────────────────────
  | { type: "number_constant"; value: number }

  // ── Sentinels (no value computed) ──────────
  | { type: "unused" } // box exists in form layout but Thumbtax skips it
  | { type: "unsupported" } // out of scope; UI shows N/A

  // ── User inputs ────────────────────────────
  | { type: "number_input" }
  | { type: "list_amounts_input" } // user enters a list of amounts; resolves to their sum
  | { type: "checkbox_input" } // resolves to 0 if unchecked, 1 if checked
  | {
      type: "selection_input";
      options: Array<{ label: string; value: ValueProvider }>;
    }

  // ── References ─────────────────────────────
  // If form is not specified, refers to a box on the same form instance.
  // If form is present and that form has multiple instances, aggregates
  // across all present instances of that form.
  | { type: "box_reference"; form?: FormClass; box: BoxIdentifier }
  | {
      type: "line_range_sum";
      form?: FormClass;
      fromLine: string;
      toLine: string;
      column?: string;
    }
  | { type: "form_instance_count"; form: FormClass } // counts present instances

  // ── Arithmetic on already-resolved scalars ─
  | { type: "sum"; values: Array<ValueProvider> }
  | { type: "difference"; minuend: ValueProvider; subtrahend: ValueProvider }
  | { type: "product"; values: Array<ValueProvider> }
  | { type: "quotient"; dividend: ValueProvider; divisor: ValueProvider }
  | { type: "minimum"; values: Array<ValueProvider> }
  | { type: "maximum"; values: Array<ValueProvider> }
  | { type: "absolute_value"; value: ValueProvider }
  | { type: "non_negative"; value: ValueProvider } // max(value, 0)
  | { type: "numerical_negation"; value: ValueProvider } // value * -1

  // ── Logic / control flow ───────────────────
  | {
      type: "conditional";
      condition: ValueProvider; // 0 is considered false, anything else is true
      trueValue: ValueProvider;
      falseValue: ValueProvider;
    }
  | {
      type: "comparison";
      value: ValueProvider;
      minimum?: ValueProvider;
      maximum?: ValueProvider;
      strict?: boolean;
    }
  | { type: "logical_negation"; value: ValueProvider }
  | {
      type: "filing_status_map";
      values: Partial<Record<FilingStatus, ValueProvider>>;
      default?: ValueProvider;
    };
```

#### Reference semantics

`box_reference` and `line_range_sum` use the optional `form` field to express both same-instance and cross-instance references:

- **`form` absent** — refers to a box (or line range) on the same form instance as the box being resolved.
- **`form` present, `maxInstances === 1`** — refers to the singleton instance of the named form class.
- **`form` present, `maxInstances` null or >1** — aggregates (sums) across all present instances of the named form class.

`form_instance_count` returns the number of present instances of that form (0 if none are added). It subsumes both the "how many?" and "is any present?" queries; use a `conditional` or `comparison` on top when a boolean is needed.

#### Range sums

`line_range_sum` with no `form` walks lines `fromLine` through `toLine` within the same instance. With `form` set to a multi-instance form, it sums the line-range result across all present instances of that form.

#### Numbers as booleans

All providers resolve to a number. Where a true/false value is needed, 0 represents false and any other value represents true.

### Service

```typescript
// specifications/service.ts
export function getFormSpecification(
  formClass: FormClass,
): TaxFormSpecification;
export function allFormClasses(): FormClass[];
export function allSpecifications(): TaxFormSpecification[];
```

The service is the only path through which engine, UI, and connections code reach specification data. It encapsulates the registry lookup so we can later swap to a backend-loaded source without touching consumers.

## User state

The state layer owns the user's primary state and exposes a set of actions. Derived data (the workbook) lives in the same Zustand store so consumers can subscribe via standard selectors.

### Primary state

The _primary_ state is the only authentic state. Everything else is derived.

```typescript
// state/types/userPreferences.ts
export type UserPreferences = {
  browserSaveEnabled: boolean;
};

// state/types/primaryState.ts
export type PrimaryState = {
  filingStatus: FilingStatus;
  formClassOrder: FormClass[]; // explicit display order
  formInstancesByClass: Partial<Record<FormClass, FormInstance[]>>;
  preferences: UserPreferences;
};

// state/types/formInstance.ts
export type FormInstance = {
  instanceId: FormInstanceId; // uuid
  label?: string; // user-set; falls back to defaultInstanceLabel
  inputs: Partial<Record<BoxIdentifier, BoxInput>>;
};
```

Invariant: `class ∈ formClassOrder` if and only if `formInstancesByClass[class]` is a non-empty array.

The `formInstancesByClass` record makes per-class operations (add/remove/reorder instances within a class) trivial; the `formClassOrder` array gives explicit, stable cross-class display order independent of instance presence/order.

### Store state

```typescript
// state/types/storeState.ts
export type StoreState = PrimaryState & {
  workbook: Workbook; // derived; refreshed by every action
  history: { past: PrimaryState[]; future: PrimaryState[] };
};
```

Only the primary state participates in undo/redo history; the workbook is recomputed after each undo/redo just like any other action.

### Actions

All actions either mutate primary state, replace it wholesale (load/reset), or are history operations.

```text
setFilingStatus(status)
addFormInstance(formClass) -> FormInstanceId        // appends a new instance with default inputs
removeFormInstance(formClass, instanceId)
setInstanceLabel(formClass, instanceId, label)
moveInstance(formClass, instanceId, direction)  // "left" | "right" within the class
moveFormClass(formClass, direction)             // "up" | "down" within formClassOrder
setBoxInput(formClass, instanceId, boxId, value: BoxInput)
setBrowserSaveEnabled(enabled)
loadState(deserialized)                         // replaces primary state, clears history
resetState()                                    // back to defaults, clears history
undo()
redo()
```

Action behavior rules:

- Any action that mutates primary state pushes the _previous_ primary state onto `history.past`, clears `history.future`, applies the mutation, and recomputes the workbook.
- `loadState` and `resetState` clear undo history (rather than recording the prior state as undoable). This matches the user expectation that "undo" rolls back individual edits, not whole-document operations.
- `addFormInstance` appends to `formClassOrder` if the class is new; `removeFormInstance` removes the class from `formClassOrder` when its last instance is removed.
- `addFormInstance` returns the new `FormInstanceId` so the UI can scroll to or focus on it.

### Undo/redo

Snapshot-based, rolled in-house — the primary state is small enough that snapshot cost is negligible, and the implementation is small enough to not justify a dependency.

`history.past` holds prior primary states (newest at the end). On a mutating action, the current primary state is pushed onto `past`, `future` is cleared, and the new state is applied. `undo()` pops `past`, pushes the current state onto `future`, and restores the popped state. `redo()` is the mirror.

The workbook is _not_ part of history; it is recomputed after each restore via the same engine call any other action makes.

### Workbook recomputation

Every action that changes primary state runs the full engine and replaces `workbook`. The engine is pure, the state is small, and v1 does not need incremental recomputation.

To keep React re-renders tight, the engine preserves referential equality on `ResolvedBox` entries that haven't actually changed (see [Reference preservation](#reference-preservation)). UI components can use whatever selector style is most natural — primitive selectors for displayed scalars, joined `useResolvedBox(...)` hooks for cells that need both value and warnings — and unaffected cells will not re-render even though the workbook object as a whole was replaced.

## Workbook engine

The engine is a pure function. It has no React, DOM, or I/O dependencies.

### Public API

```typescript
// engine/computeWorkbook.ts
export function computeWorkbook(input: {
  specifications: Map<FormClass, TaxFormSpecification>;
  state: PrimaryState;
  previousWorkbook?: Workbook; // for reference preservation
}): Workbook;
```

### Workbook shape

The workbook is just a lookup index over resolved boxes. Walking by form/instance for display, export, or graph rendering is done by consumers using `(specifications, primaryState)` and joining with the workbook by `FormInstanceId` and `BoxIdentifier`.

```typescript
// engine/types/workbook.ts
export type Workbook = Record<
  FormInstanceId,
  Record<BoxIdentifier, ResolvedBox>
>;

// engine/types/resolvedBox.ts
export type ResolvedBox = {
  value: number;
  warnings: BoxWarning[];
};

// engine/types/boxWarning.ts
export type BoxWarning =
  | { type: "required_form_missing"; form: FormClass }
  | { type: "divide_by_zero" }
  | { type: "upstream"; sourceAddress: BoxAddress };
```

Identifiers, descriptions, line numbers, formats, and provider definitions are not duplicated in the workbook — UI components that need them join with the spec at render time. A small `useResolvedBox(class, instance, box)` hook returns `{ spec, input, value, warnings }` where `input` is the user's raw entry from `FormInstance.inputs` (present only for input-type boxes; used to render the input control) and `value` is the resolved number (used for display and downstream computation).

### Algorithm

1. Compute a topological ordering via `computeTopologicalOrder(specifications, state)`. Vertices are concrete `BoxAddress` triples — one per `(class, instance, box)` for every present instance. The dependency graph is built and consumed internally. A cycle is a developer error; the function throws with the cycle's box addresses.
2. In topological order, resolve each box by dispatching on its `ValueProvider` via a `resolveProvider` closure. The closure reads `state`, `specifications`, and the partially-built workbook, returning a `number` and any warnings.
3. Apply reference preservation against `previousWorkbook` before returning.

### Dependency graph and topological order

`engine/topologicalOrder.ts` builds the dependency graph internally and exports a single function:

```typescript
// engine/topologicalOrder.ts
export function computeTopologicalOrder(
  specifications: Map<FormClass, TaxFormSpecification>,
  state: PrimaryState,
): BoxAddress[];
```

Vertices are `BoxAddress` triples — one per `(class, instance, box)` for every present instance. The graph is an adjacency map over encoded addresses, private to this module.

The provider-to-edges mapping:

| Provider                                         | Edges added (from the resolving box's vertex)                                                                             |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `box_reference` (no `form`)                      | one edge to the same instance's named box                                                                                 |
| `box_reference` (with `form`, single-instance)   | one edge to the singleton instance's named box                                                                            |
| `box_reference` (with `form`, multi-instance)    | one edge per present instance of the target form, to the named box                                                        |
| `line_range_sum` (no `form`)                     | one edge per box in the named line range, same instance                                                                   |
| `line_range_sum` (with `form`, single-instance)  | one edge per box in the named line range on the singleton                                                                 |
| `line_range_sum` (with `form`, multi-instance)   | one edge per box in the named line range, across every present instance of the target form                                |
| `form_instance_count`                            | no edges; reads instance count directly from state at resolve time                                                        |
| `selection_input`                                | one edge per option's ValueProvider dependencies (any option could be selected, so all options' dependencies are tracked) |
| Composite providers (`sum`, `conditional`, etc.) | union of edges from their sub-providers                                                                                   |
| Constants, sentinels, plain inputs               | no edges                                                                                                                  |

Kahn's algorithm produces the resolution order. On cycle detection it throws with the addresses of the boxes involved.

### Resolve

Provider dispatch lives in a private `resolveProvider` closure inside `computeWorkbook`. The closure captures `state`, `specifications`, and the `resolvedSoFar` accumulator, so individual call sites only pass the provider and the resolving box's own address:

```typescript
function resolveProvider(
  provider: ValueProvider,
  ownAddress: BoxAddress,
): { value: number; warnings: BoxWarning[] };
```

Each provider variant has its own dispatch case; cases are exhaustively typed. Since `ResolvedBox.value` is a plain `number`, arithmetic and boolean coercion are trivial one-liners inlined at each call site — no separate interpret module is needed. Provider dispatch is tested through `computeWorkbook.test.ts` using minimal synthetic specs.

### Reference preservation

`engine/preserveReferences.ts` walks the outer instance keys of `previousWorkbook` after a fresh resolution and, for each address whose new `value` and `warnings` are deep-equal to the previous entry's, reuses the previous `ResolvedBox` reference. This keeps Zustand subscribers stable across recomputes: a cell that didn't change does not re-render, even though the workbook object as a whole was replaced.

### Warning propagation

When resolving a provider, the engine emits direct warnings (e.g., `divide_by_zero` from `quotient`, `required_form_missing` from a reference whose target form is absent). It also propagates upstream warnings: if any input provider's `warnings` is non-empty, the resolved box gains an `upstream` warning naming the originating address.

This makes warnings appear correctly in the UI (an originating cell shows the direct warning prominently; downstream cells show a faded "upstream" indicator) without each provider redeclaring them.

## Persistence

Two destinations: explicit save files (download/upload) and browser local storage (autosave). Both use the same JSON schema.

### Save file shape

```typescript
// persistence/types/saveFile.ts
// PrimaryState is imported from state/types/primaryState.ts
export type SaveFile = PrimaryState & {
  schemaVersion: number; // bumped on breaking schema changes
  taxYear: number; // e.g. 2025
};
```

`persistence/config.ts` exports the build-time constants `CURRENT_SCHEMA_VERSION` and `CURRENT_TAX_YEAR`. These are bumped deliberately when the spec set changes incompatibly or when a new tax year's forms are introduced.

### Module API

```typescript
// persistence/serialize.ts
// schemaVersion and taxYear are populated from persistence/config.ts constants.
export function serialize(state: PrimaryState): SaveFile;

// persistence/deserialize.ts
export function deserialize(raw: unknown): {
  state: PrimaryState;
  warnings: LoadWarning[];
};
```

### Forgiving deserialization

`deserialize` is a hand-rolled validator (no Zod or other dependency). It walks the input, copies recognized fields with type checks, drops unknown fields with a warning, fills defaults for missing fields with a warning, and reports tax-year and schema-version mismatches.

```typescript
// persistence/types/loadWarning.ts
export type LoadWarning =
  | { type: "tax_year_mismatch"; saved: number; current: number }
  | { type: "schema_version_newer"; saved: number; current: number }
  | { type: "unknown_field"; path: string }
  | { type: "invalid_value"; path: string; reason: string }
  | { type: "missing_required_field"; path: string };
```

Warnings carry dotted paths like `formInstancesByClass.fW2[0].inputs.box1` so the UI can present them precisely. The `loadState` action surfaces warnings via a transient toast or modal.

### Migrations

```typescript
// persistence/migrations.ts
export const migrations: Record<number, (savedFile: unknown) => unknown>;
// Each entry maps from-version N to a transformer that produces version N+1.
// Applied in sequence to bring an older save file up to CURRENT_SCHEMA_VERSION.
```

Empty for v1; the plumbing is in place so that a future `schemaVersion: 2` change does not require touching `deserialize`.

A save file with `schemaVersion > CURRENT_SCHEMA_VERSION` triggers a `schema_version_newer` warning and is loaded best-effort using current rules.

### Local storage

Two distinct keys with different durability tiers:

- `thumbtax.preferences` — always written. Holds at minimum the `browserSaveEnabled` flag plus any future user-facing preference. Surviving across "clear my data" actions is intentional.
- `thumbtax.savedState` — only written when `browserSaveEnabled === true`. Holds a complete `SaveFile`. Cleared immediately when the user disables the toggle.

A third key, `thumbtax.uiState`, holds browser-only ephemera that should _not_ be in the download file (most notably Connections graph node positions; see [Connections graph](#connections-graph)).

`persistence/localStorage.ts` exports a `useAutosave()` hook used at the top of `App.tsx`. It debounces writes to `thumbtax.savedState` (~300 ms after the last commit) to avoid hammering local storage on every keystroke commit. On mount, it reads any saved state and dispatches `loadState`.

## Connections graph

The graph is derived data, computed by `connectionsGraph/extract.ts`. Rendering is done by `ui/connectionsView/`.

### Data shape

```typescript
// connectionsGraph/types/connectionsGraph.ts
export type ConnectionsGraph = {
  nodes: Array<ConnectionsNode>;
  edges: Array<ConnectionsEdge>;
};

// connectionsGraph/types/connectionsNode.ts
export type ConnectionsNode = {
  form: FormClass;
  status: "added" | "not_added"; // drives faded styling
  instanceCount: number; // 0 when not_added
};

// connectionsGraph/types/connectionsEdge.ts
export type ConnectionsEdge = {
  source: FormClass;
  target: FormClass;
  references: Array<EdgeReference>; // every individual reference between this pair
};

// connectionsGraph/types/edgeReference.ts
// Note: EdgeReference currently carries only source/target identity. Richer metadata
// (aggregation kind, cardinality, conditionality) will be designed after the initial
// version is built and we can see how the graph is actually used.
export type EdgeReference = {
  sourceBox: BoxIdentifier;
  targetBox?: BoxIdentifier;
};
```

Nodes are per-form-class, not per-instance: one W-2 thumbnail regardless of how many W-2 instances the user has, with a small badge showing the count when greater than one. This matches the "thumbnail of the first page" idea from the plan and avoids visual explosion for users with many instances.

Edge direction: `A → B` means "form A's spec references form B's values." Multiple references between the same `(A, B)` collapse to one graph edge whose `references` array carries the full list for tooltips and education.

### Extraction

`connectionsGraph/extract.ts` walks every form's spec via a reusable provider visitor (`visitProviderReferences.ts`) that yields each cross-form `(sourceBox, targetBox)` reference. The same visitor is used by the engine where it needs to enumerate cross-form dependencies.

When the user toggles "show unadded forms" off, the _renderer_ filters `status === "not_added"` nodes and incident edges. This is purely a UI concern and is not part of the extracted graph data.

### Position persistence

Node positions live in `thumbtax.uiState` (browser-only) under `connectionsGraphPositions: Partial<Record<FormClass, { x: number; y: number }>>`. They are intentionally excluded from the SaveFile so a downloaded file does not impose someone else's layout on the loader.

Initial layout is a simple deterministic placement: income-section forms on the left, taxes-section forms on the right, ordered top-to-bottom by `formClassOrder`. The placement function is its own module so we can swap in a fancier algorithm (e.g., dagre, force-directed) later for polish.

## UI

### Routes

```
/         MainPage      form list + (on wide viewports) inline graph
/about    AboutPage     description, terms, privacy, attributions
```

On narrow viewports, a "Show connections" entry in the navigation drawer (and a button in the control bar) opens a React Aria `<ModalOverlay>` + `<Modal>` styled as a bottom sheet, containing the same `<ConnectionsGraph>` component. On wide viewports, the graph renders inline alongside the form list and the bottom-sheet trigger is hidden via CSS.

### Component tree

```
<App>
  <Router>
    <RootLayout>
      <NavigationBar />              // converts to <NavigationDrawer> on narrow
      <Outlet />
    </RootLayout>
  </Router>
</App>

<MainPage>
  <ControlBar />
  <MainPageLayout>
    <ConnectionsGraph />             // hidden via CSS on narrow
    <PrimaryView>
      <IncomeSection><FormList section="income" /></IncomeSection>
      <TaxesSection><FormList section="taxes"  /></TaxesSection>
    </PrimaryView>
  </MainPageLayout>
  <ConnectionsBottomSheet>           // narrow-only modal
    <ConnectionsGraph />
  </ConnectionsBottomSheet>
</MainPage>

<ControlBar>
  <TaxYearIndicator />
  <FilingStatusSelector />
  <UndoRedoButtons />
  <AddFormButton />                  // opens AddFormPicker dialog
  <BrowserSaveToggle />
  <DownloadButton />
  <UploadButton />                   // React Aria FileTrigger
  <ExportMenu />                     // CSV / Excel
  <OverflowMenu />                   // collapsed controls on narrow viewports
</ControlBar>
```

### Form list

The form list is fundamentally tabular. For each `formClass` in `formClassOrder` whose spec's `section` matches the section, the list renders a `<FormClassTable>`. Within a class table, lines are grouped by spec section (`<FormSectionGroup>`); each line becomes a `<FormLineRow>` with one `<FormBoxCell>` per _(instance × column on this line)_ pair.

```
<FormLineRow>
  <LineLabelCell />
  // for each instance in formInstancesByClass[class]:
  //   for each column declared on this line by the spec section:
  //     (a box exists at this position iff spec has a TaxFormBox at this columnIndex)
  <FormBoxCell box, instance, column />
</FormLineRow>
```

The header row mirrors the body: under the line-label header column, a per-instance group whose sub-cells are the column labels. When the section declares no columns, the per-instance group is a single unlabeled cell.

Cells render based on the box's `provider.type`:

- `number_input` → React Aria `<NumberField>`.
- `checkbox_input` → React Aria `<Checkbox>`.
- `selection_input` → React Aria `<Select>` over the listed options, each displayed with its label.
- `list_amounts_input` → custom multi-input (a small list editor; sum displayed below).
- `unused`, `unsupported` → static "—" or "N/A".
- All other (computed) providers → static formatted display of `value`.

Cell formatting is driven by the box's `format` (`financial`, `percentage`, `plain`, `checkbox`).

### Custom keyboard navigation

The plan's enter-key focus order — _next column of same line in same instance → first column of next line in same instance → first column of first line in next instance_ — does not match DOM order, since per-line DOM order interleaves columns across instances. React Aria's `useFocusManager` follows DOM order and can't express this directly.

The form list owns a `FocusContext` provider that solves this with a refs registry:

```typescript
// ui/formList/focus/types/focusKey.ts
export type FocusKey = {
  class: FormClass;
  instance: FormInstanceId;
  line: string; // line.index
  column?: string; // box.columnIndex
};

// ui/formList/focus/types/focusRegistry.ts
export type FocusRegistry = {
  register(key: FocusKey, el: HTMLElement): () => void;
  focusNext(from: FocusKey): void;
  focusPrevious(from: FocusKey): void;
};
```

Each input cell calls a `useFormListFocus(key)` hook that registers its element on mount and returns key handlers for the enter and shift-enter keys. The "next" key is computed by a pure function `computeNextFocusKey(current, { specs, state })` that walks the focus order derived from spec + state. The provider looks up the resulting key in its registry and calls `.focus()` on the registered element. Cells whose providers are not user inputs simply don't register, so they are skipped automatically.

The pure `computeNextFocusKey` is fully unit-testable independent of any DOM. The provider's wiring is thin enough that it does not need its own dedicated tests beyond a single integration test in `FormList.test.tsx`.

The standard tab key follows DOM order naturally; we do not override it.

### Adding, removing, and reordering forms

`AddFormButton` opens an `AddFormPicker` dialog (React Aria `<DialogTrigger>` + `<Dialog>`) listing every form class. Classes that are at their `maxInstances` are disabled with explanatory help text. Selecting a class dispatches `addFormInstance(formClass)` and closes the dialog. The newly created instance's first focusable input is focused via the focus registry.

Each `FormClassTable` also has an inline "Add another instance" button when the class is below `maxInstances`. Each instance has a remove button (with confirmation) and left/right reorder buttons. Each class has up/down reorder buttons.

When a referenced form class is missing (e.g., a Form 1040 box that needs Schedule C), the cell shows a `required_form_missing` warning state with a button to add the form, dispatching `addFormInstance` with the missing class.

### Connections renderer

`ConnectionsGraph.tsx` is a thin React Flow integration: it consumes the extracted graph plus stored positions, registers a custom `<FormNode>` (the small thumbnail with badge) and `<ReferenceEdge>` (a styled string, alluding to the "thumbtacks" name), and dispatches position updates back into `thumbtax.uiState` on drag end. Pan/zoom and click-to-navigate to the form's section are standard React Flow features. The "show unadded forms" toggle is a local UI state in this component.

### Primitives

`ui/primitives/` contains thin wrappers around React Aria components. Each wrapper sets project-specific styling and potentially default props. The number of default props should be kept low.

## Exporters

`exporters/exportToXlsx.ts` and `exporters/exportToCsv.ts` use SheetJS to produce downloadable files. Both walk specifications and primary state in display order, joining workbook values per cell. The XLSX exporter produces one worksheet per form class (with one column block per instance); the CSV exporter produces a single tabular dump.

The exporters are pure functions that return a `Blob` (or `ArrayBuffer`); the UI's `ExportMenu` triggers the download via a temporary anchor element.

## Testing

[Vitest](https://vitest.dev) is the test runner. Tests are co-located with source files. Component tests run under jsdom via `@testing-library/react`. No snapshot tests.

### What we test

- **Pure modules** (engine, computeNextFocusKey, the deserializer, the connections extractor, exporters): exhaustive unit tests using small synthetic fixtures. The engine tests construct minimal test-only specs to exercise each provider variant and warning case in isolation.
- **State store**: action behavior, undo/redo, workbook recomputation triggers.
- **Persistence**: round-trip serialize/deserialize, every `LoadWarning` variant, schema-version handling, tax-year mismatch.
- **UI components**: rendering and interaction via accessible queries (`getByRole`, `getByLabel`). Focus behavior is tested at the form-list integration level by simulating enter-key presses.
- **Integration**: a small number of "real spec" tests at the top of the pyramid that run `computeWorkbook` against the actual specifications under representative scenarios. Their job is to catch drift between specs and engine.

### What we don't test

- React Aria's internal behavior — already covered upstream.
- CSS modules.
- The `forms/*.ts` static spec data files for tax-law correctness; that is a manual review concern.

## Deployment

Thumbtax is hosted via GitHub Pages. A GitHub Actions workflow runs typecheck, lint, and tests; runs `vite build`; and deploys to GitHub Pages on every push to `main` whose checks pass.

Build constants (`CURRENT_SCHEMA_VERSION`, `CURRENT_TAX_YEAR`) are read from `persistence/config.ts` at build time. There is no runtime configuration; everything is baked into the bundle.
