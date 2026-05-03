# Connections Graph Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the cross-form-reference graph from the registered specifications and current state. Produce one node per form class (with a "added" / "not_added" status and an instance count) and one edge per `(source, target)` pair, carrying the list of individual references between them.

**Architecture:** A reusable `visitProviderReferences` walks any `ValueProvider` and yields each `box_reference` / `line_range_sum` / `form_instance_count` reference along with the source `BoxIdentifier`. The `extract` function applies the visitor over every spec, collapses references by `(source-class, target-class)` pair, and merges with state to compute node statuses and instance counts. Renderer code lives in the UI plan; only the data extraction lives here. Depends on `02-specifications`, `04-state`.

**Tech Stack:** TypeScript only.

---

## File Structure

- `thumbtax-webapp/src/connectionsGraph/types/connectionsGraph.ts` — `ConnectionsGraph`.
- `thumbtax-webapp/src/connectionsGraph/types/connectionsNode.ts` — `ConnectionsNode`.
- `thumbtax-webapp/src/connectionsGraph/types/connectionsEdge.ts` — `ConnectionsEdge`.
- `thumbtax-webapp/src/connectionsGraph/types/edgeReference.ts` — `EdgeReference`.
- `thumbtax-webapp/src/connectionsGraph/visitProviderReferences.ts` — generator that yields cross-form references.
- `thumbtax-webapp/src/connectionsGraph/visitProviderReferences.test.ts`
- `thumbtax-webapp/src/connectionsGraph/extract.ts` — `extractConnectionsGraph(specifications, state)`.
- `thumbtax-webapp/src/connectionsGraph/extract.test.ts`

---

### Task 1: Types

**Files:**
- Create: all four files under `thumbtax-webapp/src/connectionsGraph/types/`.

- [ ] **Step 1: `EdgeReference`**

```typescript
import type { BoxIdentifier } from "#src/common/types/boxIdentifier";

export type EdgeReference = {
  sourceBox: BoxIdentifier;
  targetBox?: BoxIdentifier;
};
```

- [ ] **Step 2: `ConnectionsNode`**

```typescript
import type { FormClass } from "#src/common/types/formClass";

export type ConnectionsNode = {
  form: FormClass;
  status: "added" | "not_added";
  instanceCount: number;
};
```

- [ ] **Step 3: `ConnectionsEdge`**

```typescript
import type { FormClass } from "#src/common/types/formClass";
import type { EdgeReference } from "#src/connectionsGraph/types/edgeReference";

export type ConnectionsEdge = {
  source: FormClass;
  target: FormClass;
  references: Array<EdgeReference>;
};
```

- [ ] **Step 4: `ConnectionsGraph`**

```typescript
import type { ConnectionsEdge } from "#src/connectionsGraph/types/connectionsEdge";
import type { ConnectionsNode } from "#src/connectionsGraph/types/connectionsNode";

export type ConnectionsGraph = {
  nodes: Array<ConnectionsNode>;
  edges: Array<ConnectionsEdge>;
};
```

- [ ] **Step 5: Typecheck and commit**

```bash
cd thumbtax-webapp && npm run typecheck
git add thumbtax-webapp/src/connectionsGraph/types
git commit -m "Add connections-graph types"
```

---

### Task 2: `visitProviderReferences` (TDD)

**Files:**
- Create: `thumbtax-webapp/src/connectionsGraph/visitProviderReferences.test.ts`
- Create: `thumbtax-webapp/src/connectionsGraph/visitProviderReferences.ts`

The visitor yields `{ targetForm, targetBox? }` for each cross-form reference embedded in a provider tree. `box_reference` and `line_range_sum` with no `form` are not cross-form, so they are skipped. `form_instance_count` references the named form; its `targetBox` is undefined.

- [ ] **Step 1: Write tests**

```typescript
import { describe, expect, it } from "vitest";

import type { FormClass } from "#src/common/types/formClass";
import { collectProviderReferences } from "#src/connectionsGraph/visitProviderReferences";
import type { ValueProvider } from "#src/specifications/types/valueProvider";

describe("collectProviderReferences", () => {
  it("returns nothing for a constant", () => {
    expect(
      collectProviderReferences({ type: "number_constant", value: 1 }),
    ).toEqual([]);
  });

  it("yields a cross-form box_reference", () => {
    const provider: ValueProvider = {
      type: "box_reference",
      form: "fW2",
      box: "wages",
    };
    expect(collectProviderReferences(provider)).toEqual([
      { targetForm: "fW2" as FormClass, targetBox: "wages" },
    ]);
  });

  it("does not yield same-form box_reference (no form)", () => {
    const provider: ValueProvider = { type: "box_reference", box: "wages" };
    expect(collectProviderReferences(provider)).toEqual([]);
  });

  it("yields cross-form line_range_sum", () => {
    const provider: ValueProvider = {
      type: "line_range_sum",
      form: "fW2",
      fromLine: "1",
      toLine: "2",
    };
    expect(collectProviderReferences(provider)).toEqual([
      { targetForm: "fW2" as FormClass, targetBox: undefined },
    ]);
  });

  it("yields form_instance_count", () => {
    const provider: ValueProvider = {
      type: "form_instance_count",
      form: "fW2",
    };
    expect(collectProviderReferences(provider)).toEqual([
      { targetForm: "fW2" as FormClass, targetBox: undefined },
    ]);
  });

  it("recurses through composites", () => {
    const provider: ValueProvider = {
      type: "sum",
      values: [
        { type: "box_reference", form: "fW2", box: "wages" },
        { type: "box_reference", form: "f1099Int", box: "interestIncome" },
      ],
    };
    const refs = collectProviderReferences(provider);
    expect(refs).toHaveLength(2);
    expect(refs[0].targetForm).toBe("fW2");
    expect(refs[1].targetForm).toBe("f1099Int");
  });

  it("recurses through filing_status_map values and default", () => {
    const provider: ValueProvider = {
      type: "filing_status_map",
      values: { single: { type: "box_reference", form: "fW2", box: "wages" } },
      default: { type: "box_reference", form: "f1040", box: "totalIncome" },
    };
    const refs = collectProviderReferences(provider);
    expect(refs).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Run, verify FAIL**

```bash
cd thumbtax-webapp && npm test -- visitProviderReferences
```

- [ ] **Step 3: Implement**

```typescript
import type { BoxIdentifier } from "#src/common/types/boxIdentifier";
import type { FormClass } from "#src/common/types/formClass";
import type { ValueProvider } from "#src/specifications/types/valueProvider";

export type ProviderReference = {
  targetForm: FormClass;
  targetBox?: BoxIdentifier;
};

export function* visitProviderReferences(
  provider: ValueProvider,
): Generator<ProviderReference> {
  switch (provider.type) {
    case "number_constant":
    case "unused":
    case "unsupported":
    case "number_input":
    case "list_amounts_input":
    case "checkbox_input":
      return;
    case "selection_input":
      for (const opt of provider.options) {
        yield* visitProviderReferences(opt.value);
      }
      return;
    case "box_reference":
      if (provider.form !== undefined) {
        yield { targetForm: provider.form, targetBox: provider.box };
      }
      return;
    case "line_range_sum":
      if (provider.form !== undefined) {
        yield { targetForm: provider.form };
      }
      return;
    case "form_instance_count":
      yield { targetForm: provider.form };
      return;
    case "sum":
    case "product":
    case "minimum":
    case "maximum":
      for (const v of provider.values) yield* visitProviderReferences(v);
      return;
    case "difference":
      yield* visitProviderReferences(provider.minuend);
      yield* visitProviderReferences(provider.subtrahend);
      return;
    case "quotient":
      yield* visitProviderReferences(provider.dividend);
      yield* visitProviderReferences(provider.divisor);
      return;
    case "absolute_value":
    case "non_negative":
    case "numerical_negation":
    case "logical_negation":
      yield* visitProviderReferences(provider.value);
      return;
    case "conditional":
      yield* visitProviderReferences(provider.condition);
      yield* visitProviderReferences(provider.trueValue);
      yield* visitProviderReferences(provider.falseValue);
      return;
    case "comparison":
      yield* visitProviderReferences(provider.value);
      if (provider.minimum) yield* visitProviderReferences(provider.minimum);
      if (provider.maximum) yield* visitProviderReferences(provider.maximum);
      return;
    case "filing_status_map":
      for (const v of Object.values(provider.values)) {
        if (v) yield* visitProviderReferences(v);
      }
      if (provider.default) yield* visitProviderReferences(provider.default);
      return;
  }
}

export function collectProviderReferences(
  provider: ValueProvider,
): ProviderReference[] {
  return Array.from(visitProviderReferences(provider));
}
```

- [ ] **Step 4: Run, verify PASS, commit**

```bash
cd thumbtax-webapp && npm test
git add thumbtax-webapp/src/connectionsGraph/visitProviderReferences.ts thumbtax-webapp/src/connectionsGraph/visitProviderReferences.test.ts
git commit -m "Add provider reference visitor"
```

---

### Task 3: `extractConnectionsGraph` (TDD)

**Files:**
- Create: `thumbtax-webapp/src/connectionsGraph/extract.test.ts`
- Create: `thumbtax-webapp/src/connectionsGraph/extract.ts`

- [ ] **Step 1: Write tests**

```typescript
import { describe, expect, it } from "vitest";

import { extractConnectionsGraph } from "#src/connectionsGraph/extract";
import {
  allFormClasses,
  getFormSpecification,
} from "#src/specifications/service";
import type { FormClass } from "#src/common/types/formClass";
import type { TaxFormSpecification } from "#src/specifications/types/taxFormSpecification";
import type { PrimaryState } from "#src/state/types/primaryState";

function realSpecs() {
  const m = new Map<FormClass, TaxFormSpecification>();
  for (const c of allFormClasses()) m.set(c, getFormSpecification(c));
  return m;
}

const emptyState: PrimaryState = {
  filingStatus: "single",
  formClassOrder: [],
  formInstancesByClass: {},
  preferences: { browserSaveEnabled: false },
};

describe("extractConnectionsGraph", () => {
  it("includes one node per supported form class", () => {
    const graph = extractConnectionsGraph(realSpecs(), emptyState);
    expect(graph.nodes.map((n) => n.form).sort()).toEqual(
      allFormClasses().slice().sort(),
    );
  });

  it("marks present forms as added with correct instance counts", () => {
    const state: PrimaryState = {
      ...emptyState,
      formClassOrder: ["fW2"],
      formInstancesByClass: {
        fW2: [
          { instanceId: "a", inputs: {} },
          { instanceId: "b", inputs: {} },
        ],
      },
    };
    const graph = extractConnectionsGraph(realSpecs(), state);
    const w2 = graph.nodes.find((n) => n.form === "fW2");
    expect(w2?.status).toBe("added");
    expect(w2?.instanceCount).toBe(2);
  });

  it("emits an edge from f1040 to fW2 with the totalWages reference", () => {
    const graph = extractConnectionsGraph(realSpecs(), emptyState);
    const edge = graph.edges.find(
      (e) => e.source === "f1040" && e.target === "fW2",
    );
    expect(edge).toBeDefined();
    expect(edge?.references).toContainEqual({
      sourceBox: "totalWages",
      targetBox: "wages",
    });
  });

  it("collapses multiple references between the same pair into one edge", () => {
    const graph = extractConnectionsGraph(realSpecs(), emptyState);
    const edges1040ToFw2 = graph.edges.filter(
      (e) => e.source === "f1040" && e.target === "fW2",
    );
    expect(edges1040ToFw2.length).toBe(1);
    expect(edges1040ToFw2[0].references.length).toBeGreaterThanOrEqual(2);
  });
});
```

- [ ] **Step 2: Run, verify FAIL**

```bash
cd thumbtax-webapp && npm test -- extract
```

- [ ] **Step 3: Implement**

```typescript
import type { FormClass } from "#src/common/types/formClass";
import type { ConnectionsEdge } from "#src/connectionsGraph/types/connectionsEdge";
import type { ConnectionsGraph } from "#src/connectionsGraph/types/connectionsGraph";
import type { ConnectionsNode } from "#src/connectionsGraph/types/connectionsNode";
import type { EdgeReference } from "#src/connectionsGraph/types/edgeReference";
import { visitProviderReferences } from "#src/connectionsGraph/visitProviderReferences";
import type { TaxFormSpecification } from "#src/specifications/types/taxFormSpecification";
import type { PrimaryState } from "#src/state/types/primaryState";

type Specs = Map<FormClass, TaxFormSpecification>;

function pairKey(source: FormClass, target: FormClass): string {
  return `${source}->${target}`;
}

export function extractConnectionsGraph(
  specifications: Specs,
  state: PrimaryState,
): ConnectionsGraph {
  const nodes: ConnectionsNode[] = [];
  for (const [formClass] of specifications) {
    const instances = state.formInstancesByClass[formClass] ?? [];
    nodes.push({
      form: formClass,
      status: instances.length > 0 ? "added" : "not_added",
      instanceCount: instances.length,
    });
  }

  const edgesByPair = new Map<
    string,
    { source: FormClass; target: FormClass; references: EdgeReference[] }
  >();

  for (const [sourceClass, spec] of specifications) {
    for (const section of spec.sections) {
      for (const line of section.lines) {
        for (const box of line.boxes) {
          for (const ref of visitProviderReferences(box.value)) {
            if (ref.targetForm === sourceClass) continue;
            const key = pairKey(sourceClass, ref.targetForm);
            const entry =
              edgesByPair.get(key) ??
              {
                source: sourceClass,
                target: ref.targetForm,
                references: [],
              };
            entry.references.push({
              sourceBox: box.identifier,
              targetBox: ref.targetBox,
            });
            edgesByPair.set(key, entry);
          }
        }
      }
    }
  }

  const edges: ConnectionsEdge[] = Array.from(edgesByPair.values());
  return { nodes, edges };
}
```

- [ ] **Step 4: Run, verify PASS, commit**

```bash
cd thumbtax-webapp && npm test
git add thumbtax-webapp/src/connectionsGraph
git commit -m "Add extractConnectionsGraph"
```
