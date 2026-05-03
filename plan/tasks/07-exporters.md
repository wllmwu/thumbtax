# Exporters Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pure functions that walk specifications + primary state + workbook and produce CSV / XLSX blobs the UI can hand to the browser as a download.

**Architecture:** `exportToCsv` produces a single CSV (one header row, then one row per line × column × instance). `exportToXlsx` produces a workbook with one sheet per form class (each sheet has rows for lines, columns grouped per instance). Both walk in display order: outer loop over `formClassOrder`, inner over instances and spec sections/lines/boxes. Both emit human-readable cell values (formatted via the box's `format`). They return a `Blob`. The UI plan handles the actual download trigger. Depends on `02-specifications`, `03-engine`, `04-state`.

**Tech Stack:** SheetJS (`xlsx` package).

---

## File Structure

- `thumbtax-webapp/src/exporters/formatBoxValue.ts` — small helper: `(value: number, format: BoxFormat) => string`.
- `thumbtax-webapp/src/exporters/formatBoxValue.test.ts`
- `thumbtax-webapp/src/exporters/exportToCsv.ts`
- `thumbtax-webapp/src/exporters/exportToCsv.test.ts`
- `thumbtax-webapp/src/exporters/exportToXlsx.ts`
- `thumbtax-webapp/src/exporters/exportToXlsx.test.ts`

---

### Task 1: `formatBoxValue` (TDD)

**Files:**
- Create: `thumbtax-webapp/src/exporters/formatBoxValue.test.ts`
- Create: `thumbtax-webapp/src/exporters/formatBoxValue.ts`

- [ ] **Step 1: Write tests**

```typescript
import { describe, expect, it } from "vitest";

import { formatBoxValue } from "#src/exporters/formatBoxValue";

describe("formatBoxValue", () => {
  it("formats financial as fixed-2 with leading $", () => {
    expect(formatBoxValue(1234.5, "financial")).toBe("$1234.50");
  });

  it("formats percentage with trailing %", () => {
    expect(formatBoxValue(0.125, "percentage")).toBe("12.50%");
  });

  it("formats checkbox as Yes/No", () => {
    expect(formatBoxValue(0, "checkbox")).toBe("No");
    expect(formatBoxValue(1, "checkbox")).toBe("Yes");
  });

  it("formats plain as the raw number string", () => {
    expect(formatBoxValue(42, "plain")).toBe("42");
  });
});
```

- [ ] **Step 2: Run, verify FAIL**

```bash
cd thumbtax-webapp && npm test -- formatBoxValue
```

- [ ] **Step 3: Implement**

```typescript
import type { BoxFormat } from "#src/specifications/types/boxFormat";

export function formatBoxValue(value: number, format: BoxFormat): string {
  switch (format) {
    case "financial":
      return `$${value.toFixed(2)}`;
    case "percentage":
      return `${(value * 100).toFixed(2)}%`;
    case "checkbox":
      return value === 0 ? "No" : "Yes";
    case "plain":
      return String(value);
  }
}
```

- [ ] **Step 4: Run, verify PASS, commit**

```bash
cd thumbtax-webapp && npm test
git add thumbtax-webapp/src/exporters/formatBoxValue.ts thumbtax-webapp/src/exporters/formatBoxValue.test.ts
git commit -m "Add formatBoxValue helper"
```

---

### Task 2: `exportToCsv` (TDD)

**Files:**
- Create: `thumbtax-webapp/src/exporters/exportToCsv.test.ts`
- Create: `thumbtax-webapp/src/exporters/exportToCsv.ts`

- [ ] **Step 1: Write tests**

```typescript
import { describe, expect, it } from "vitest";

import { computeWorkbook } from "#src/engine/computeWorkbook";
import { exportToCsv } from "#src/exporters/exportToCsv";
import {
  allFormClasses,
  getFormSpecification,
} from "#src/specifications/service";
import type { FormClass } from "#src/common/types/formClass";
import type { TaxFormSpecification } from "#src/specifications/types/taxFormSpecification";
import type { PrimaryState } from "#src/state/types/primaryState";

function specs() {
  return new Map<FormClass, TaxFormSpecification>(
    allFormClasses().map((c) => [c, getFormSpecification(c)]),
  );
}

describe("exportToCsv", () => {
  it("emits a header row with expected columns", async () => {
    const state: PrimaryState = {
      filingStatus: "single",
      formClassOrder: ["fW2"],
      formInstancesByClass: {
        fW2: [
          {
            instanceId: "w1",
            label: "Acme",
            inputs: { wages: { type: "number", value: 50 } },
          },
        ],
      },
      preferences: { browserSaveEnabled: false },
    };
    const workbook = computeWorkbook({ specifications: specs(), state });

    const blob = exportToCsv({ specifications: specs(), state, workbook });
    const text = await blob.text();

    const lines = text.trim().split("\n");
    expect(lines[0]).toBe(
      "Form,Instance,Section,Line,Column,Box,Value",
    );
    expect(text).toContain("fW2,Acme,,1,,wages,$50.00");
  });

  it("returns a blob with text/csv content type", () => {
    const state: PrimaryState = {
      filingStatus: "single",
      formClassOrder: [],
      formInstancesByClass: {},
      preferences: { browserSaveEnabled: false },
    };
    const workbook = computeWorkbook({ specifications: specs(), state });
    const blob = exportToCsv({ specifications: specs(), state, workbook });
    expect(blob.type).toContain("text/csv");
  });
});
```

- [ ] **Step 2: Run, verify FAIL**

```bash
cd thumbtax-webapp && npm test -- exportToCsv
```

- [ ] **Step 3: Implement**

```typescript
import type { FormClass } from "#src/common/types/formClass";
import type { Workbook } from "#src/engine/types/workbook";
import { formatBoxValue } from "#src/exporters/formatBoxValue";
import type { TaxFormSpecification } from "#src/specifications/types/taxFormSpecification";
import type { PrimaryState } from "#src/state/types/primaryState";

type Specs = Map<FormClass, TaxFormSpecification>;

function escapeCsv(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportToCsv(input: {
  specifications: Specs;
  state: PrimaryState;
  workbook: Workbook;
}): Blob {
  const { specifications, state, workbook } = input;
  const rows: string[] = [];
  rows.push("Form,Instance,Section,Line,Column,Box,Value");

  for (const formClass of state.formClassOrder) {
    const spec = specifications.get(formClass);
    if (!spec) continue;
    const instances = state.formInstancesByClass[formClass] ?? [];
    for (const instance of instances) {
      const instanceLabel = instance.label ?? "";
      for (const section of spec.sections) {
        const sectionHeading = section.heading ?? "";
        for (const line of section.lines) {
          for (const box of line.boxes) {
            const resolved = workbook[instance.instanceId]?.[box.identifier];
            const value = resolved
              ? formatBoxValue(resolved.value, box.format)
              : "";
            rows.push(
              [
                formClass,
                instanceLabel,
                sectionHeading,
                line.index,
                box.columnIndex ?? "",
                box.identifier,
                value,
              ]
                .map(escapeCsv)
                .join(","),
            );
          }
        }
      }
    }
  }

  return new Blob([rows.join("\n") + "\n"], { type: "text/csv;charset=utf-8" });
}
```

- [ ] **Step 4: Run, verify PASS, commit**

```bash
cd thumbtax-webapp && npm test
git add thumbtax-webapp/src/exporters/exportToCsv.ts thumbtax-webapp/src/exporters/exportToCsv.test.ts
git commit -m "Add exportToCsv"
```

---

### Task 3: `exportToXlsx` (TDD)

**Files:**
- Create: `thumbtax-webapp/src/exporters/exportToXlsx.test.ts`
- Create: `thumbtax-webapp/src/exporters/exportToXlsx.ts`

- [ ] **Step 1: Write tests**

```typescript
import * as XLSX from "xlsx";
import { describe, expect, it } from "vitest";

import { computeWorkbook } from "#src/engine/computeWorkbook";
import { exportToXlsx } from "#src/exporters/exportToXlsx";
import {
  allFormClasses,
  getFormSpecification,
} from "#src/specifications/service";
import type { FormClass } from "#src/common/types/formClass";
import type { TaxFormSpecification } from "#src/specifications/types/taxFormSpecification";
import type { PrimaryState } from "#src/state/types/primaryState";

function specs() {
  return new Map<FormClass, TaxFormSpecification>(
    allFormClasses().map((c) => [c, getFormSpecification(c)]),
  );
}

describe("exportToXlsx", () => {
  it("creates one sheet per present form class", async () => {
    const state: PrimaryState = {
      filingStatus: "single",
      formClassOrder: ["fW2", "f1040"],
      formInstancesByClass: {
        fW2: [
          {
            instanceId: "w1",
            inputs: { wages: { type: "number", value: 60000 } },
          },
        ],
        f1040: [{ instanceId: "i1", inputs: {} }],
      },
      preferences: { browserSaveEnabled: false },
    };
    const workbook = computeWorkbook({ specifications: specs(), state });

    const blob = exportToXlsx({ specifications: specs(), state, workbook });
    const buf = new Uint8Array(await blob.arrayBuffer());
    const wb = XLSX.read(buf, { type: "array" });

    expect(wb.SheetNames).toContain("fW2");
    expect(wb.SheetNames).toContain("f1040");
  });
});
```

- [ ] **Step 2: Run, verify FAIL**

```bash
cd thumbtax-webapp && npm test -- exportToXlsx
```

- [ ] **Step 3: Implement**

```typescript
import * as XLSX from "xlsx";

import type { FormClass } from "#src/common/types/formClass";
import type { Workbook } from "#src/engine/types/workbook";
import { formatBoxValue } from "#src/exporters/formatBoxValue";
import type { TaxFormSpecification } from "#src/specifications/types/taxFormSpecification";
import type { PrimaryState } from "#src/state/types/primaryState";

type Specs = Map<FormClass, TaxFormSpecification>;

function buildSheet(
  spec: TaxFormSpecification,
  instances: PrimaryState["formInstancesByClass"][FormClass],
  workbook: Workbook,
): XLSX.WorkSheet {
  const rows: Array<Array<string>> = [];
  const header: string[] = ["Section", "Line", "Box", "Column"];
  for (const inst of instances ?? []) {
    header.push(inst.label ?? inst.instanceId.slice(0, 6));
  }
  rows.push(header);

  for (const section of spec.sections) {
    for (const line of section.lines) {
      for (const box of line.boxes) {
        const row: string[] = [
          section.heading ?? "",
          line.index,
          box.identifier,
          box.columnIndex ?? "",
        ];
        for (const inst of instances ?? []) {
          const resolved = workbook[inst.instanceId]?.[box.identifier];
          row.push(
            resolved ? formatBoxValue(resolved.value, box.format) : "",
          );
        }
        rows.push(row);
      }
    }
  }

  return XLSX.utils.aoa_to_sheet(rows);
}

export function exportToXlsx(input: {
  specifications: Specs;
  state: PrimaryState;
  workbook: Workbook;
}): Blob {
  const { specifications, state, workbook } = input;
  const xlsxWb = XLSX.utils.book_new();

  for (const formClass of state.formClassOrder) {
    const spec = specifications.get(formClass);
    if (!spec) continue;
    const instances = state.formInstancesByClass[formClass];
    if (!instances || instances.length === 0) continue;
    const sheet = buildSheet(spec, instances, workbook);
    XLSX.utils.book_append_sheet(xlsxWb, sheet, formClass);
  }

  const arrayBuffer: ArrayBuffer = XLSX.write(xlsxWb, {
    type: "array",
    bookType: "xlsx",
  });
  return new Blob([arrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}
```

- [ ] **Step 4: Run, verify PASS, commit**

```bash
cd thumbtax-webapp && npm test
git add thumbtax-webapp/src/exporters
git commit -m "Add exportToXlsx"
```
