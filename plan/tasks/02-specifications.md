# Form Specifications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Define the data shape of a tax-form specification, expose a service to look them up by class, and register the v1 set of supported forms (Form W-2, Form 1099-INT, Form 1099-DIV, Form 1040, Schedule B, Schedule D, Form 8949).

**Architecture:** Specs are pure static data — no functions, no closures. The shape is `TaxFormSpecification → TaxFormSection[] → TaxFormLine[] → TaxFormBox[]`. Each box holds a `ValueProvider` (a fully-tagged discriminated union over how its value is derived) and a `BoxFormat`. A small registry module imports each form file and exposes lookup helpers. The form files themselves are large but mechanical — each is reviewed against the IRS form by hand. Depends on `01-common-types`.

**Tech Stack:** TypeScript only. No runtime dependencies.

---

## File Structure

- `thumbtax-webapp/src/specifications/types/boxFormat.ts` — `BoxFormat` literal union.
- `thumbtax-webapp/src/specifications/types/valueProvider.ts` — `ValueProvider` discriminated union.
- `thumbtax-webapp/src/specifications/types/taxFormBox.ts` — `TaxFormBox`.
- `thumbtax-webapp/src/specifications/types/taxFormLine.ts` — `TaxFormLine`.
- `thumbtax-webapp/src/specifications/types/taxFormSection.ts` — `TaxFormSection`.
- `thumbtax-webapp/src/specifications/types/taxFormSpecification.ts` — `TaxFormSpecification`.
- `thumbtax-webapp/src/specifications/forms/formW2.ts` — Form W-2 spec.
- `thumbtax-webapp/src/specifications/forms/form1099Int.ts` — Form 1099-INT spec.
- `thumbtax-webapp/src/specifications/forms/form1099Div.ts` — Form 1099-DIV spec.
- `thumbtax-webapp/src/specifications/forms/form1040.ts` — Form 1040 spec.
- `thumbtax-webapp/src/specifications/forms/schB.ts` — Schedule B spec.
- `thumbtax-webapp/src/specifications/forms/schD.ts` — Schedule D spec.
- `thumbtax-webapp/src/specifications/forms/f8949.ts` — Form 8949 spec.
- `thumbtax-webapp/src/specifications/service.ts` — `getFormSpecification`, `allFormClasses`, `allSpecifications`.
- `thumbtax-webapp/src/specifications/service.test.ts` — service tests.

Form files are tax-data, not tested individually for correctness (per system-design's "we don't test forms/*.ts for tax-law correctness" rule). They are validated structurally via `service.test.ts` — every registered class has a spec; every spec's `class` matches its key.

---

### Task 1: `BoxFormat`

**Files:**
- Create: `thumbtax-webapp/src/specifications/types/boxFormat.ts`

- [ ] **Step 1: Write the type**

```typescript
export type BoxFormat = "checkbox" | "financial" | "percentage" | "plain";
```

- [ ] **Step 2: Typecheck**

```bash
cd thumbtax-webapp && npm run typecheck
```

---

### Task 2: `ValueProvider`

**Files:**
- Create: `thumbtax-webapp/src/specifications/types/valueProvider.ts`

- [ ] **Step 1: Write the type**

```typescript
import type { BoxIdentifier } from "#src/common/types/boxIdentifier";
import type { FilingStatus } from "#src/common/types/filingStatus";
import type { FormClass } from "#src/common/types/formClass";

export type ValueProvider =
  | { type: "number_constant"; value: number }
  | { type: "unused" }
  | { type: "unsupported" }
  | { type: "number_input" }
  | { type: "list_amounts_input" }
  | { type: "checkbox_input" }
  | {
      type: "selection_input";
      options: Array<{ label: string; value: ValueProvider }>;
    }
  | { type: "box_reference"; form?: FormClass; box: BoxIdentifier }
  | {
      type: "line_range_sum";
      form?: FormClass;
      fromLine: string;
      toLine: string;
      column?: string;
    }
  | { type: "form_instance_count"; form: FormClass }
  | { type: "sum"; values: Array<ValueProvider> }
  | {
      type: "difference";
      minuend: ValueProvider;
      subtrahend: ValueProvider;
    }
  | { type: "product"; values: Array<ValueProvider> }
  | {
      type: "quotient";
      dividend: ValueProvider;
      divisor: ValueProvider;
    }
  | { type: "minimum"; values: Array<ValueProvider> }
  | { type: "maximum"; values: Array<ValueProvider> }
  | { type: "absolute_value"; value: ValueProvider }
  | { type: "non_negative"; value: ValueProvider }
  | { type: "numerical_negation"; value: ValueProvider }
  | {
      type: "conditional";
      condition: ValueProvider;
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

---

### Task 3: `TaxFormBox`, `TaxFormLine`, `TaxFormSection`, `TaxFormSpecification`

**Files:**
- Create: `thumbtax-webapp/src/specifications/types/taxFormBox.ts`
- Create: `thumbtax-webapp/src/specifications/types/taxFormLine.ts`
- Create: `thumbtax-webapp/src/specifications/types/taxFormSection.ts`
- Create: `thumbtax-webapp/src/specifications/types/taxFormSpecification.ts`

- [ ] **Step 1: Write `TaxFormBox`**

```typescript
import type { BoxIdentifier } from "#src/common/types/boxIdentifier";
import type { BoxFormat } from "#src/specifications/types/boxFormat";
import type { ValueProvider } from "#src/specifications/types/valueProvider";

export type TaxFormBox = {
  identifier: BoxIdentifier;
  columnIndex?: string;
  value: ValueProvider;
  format: BoxFormat;
  helpText?: string;
};
```

- [ ] **Step 2: Write `TaxFormLine`**

```typescript
import type { TaxFormBox } from "#src/specifications/types/taxFormBox";

export type TaxFormLine = {
  index: string;
  description?: string;
  boxes: Array<TaxFormBox>;
};
```

- [ ] **Step 3: Write `TaxFormSection`**

```typescript
import type { TaxFormLine } from "#src/specifications/types/taxFormLine";

export type TaxFormSection = {
  heading?: string;
  columns?: Array<{ index: string; description?: string }>;
  lines: Array<TaxFormLine>;
};
```

- [ ] **Step 4: Write `TaxFormSpecification`**

```typescript
import type { FormClass } from "#src/common/types/formClass";
import type { TaxFormSection } from "#src/specifications/types/taxFormSection";

export type TaxFormSpecification = {
  class: FormClass;
  title: string;
  subtitle?: string;
  description: string;
  irsPageUrl: string;
  category: "income" | "taxes";
  maxInstances: number | null;
  defaultInstanceLabel?: string;
  sections: Array<TaxFormSection>;
};
```

- [ ] **Step 5: Typecheck**

```bash
cd thumbtax-webapp && npm run typecheck
```

- [ ] **Step 6: Commit so far**

```bash
git add thumbtax-webapp/src/specifications/types
git commit -m "Add specification types"
```

---

### Task 4: Form W-2 specification (input-only)

**Files:**
- Create: `thumbtax-webapp/src/specifications/forms/formW2.ts`

A user-facing W-2 covers: Box 1 (wages), Box 2 (federal income tax withheld), Box 3 (Social Security wages), Box 4 (SS tax withheld), Box 5 (Medicare wages), Box 6 (Medicare tax withheld), and tax-relevant input fields. For v1, scope it to Box 1 and Box 2 — the bare minimum to flow into Form 1040.

- [ ] **Step 1: Write the spec**

```typescript
import type { TaxFormSpecification } from "#src/specifications/types/taxFormSpecification";

export const formW2: TaxFormSpecification = {
  class: "fW2",
  title: "Form W-2",
  subtitle: "Wage and Tax Statement",
  description:
    "Issued by employers to report wages paid and taxes withheld for the year.",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-w-2",
  category: "income",
  maxInstances: null,
  defaultInstanceLabel: "Employer name",
  sections: [
    {
      lines: [
        {
          index: "1",
          description: "Wages, tips, other compensation",
          boxes: [
            {
              identifier: "wages",
              value: { type: "number_input" },
              format: "financial",
            },
          ],
        },
        {
          index: "2",
          description: "Federal income tax withheld",
          boxes: [
            {
              identifier: "federalTaxWithheld",
              value: { type: "number_input" },
              format: "financial",
            },
          ],
        },
      ],
    },
  ],
};
```

- [ ] **Step 2: Typecheck**

```bash
cd thumbtax-webapp && npm run typecheck
```

---

### Task 5: Form 1099-INT specification

**Files:**
- Create: `thumbtax-webapp/src/specifications/forms/form1099Int.ts`

- [ ] **Step 1: Write the spec**

```typescript
import type { TaxFormSpecification } from "#src/specifications/types/taxFormSpecification";

export const form1099Int: TaxFormSpecification = {
  class: "f1099Int",
  title: "Form 1099-INT",
  subtitle: "Interest Income",
  description: "Reports taxable interest income from a single payer.",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-1099-int",
  category: "income",
  maxInstances: null,
  defaultInstanceLabel: "Payer name",
  sections: [
    {
      lines: [
        {
          index: "1",
          description: "Interest income",
          boxes: [
            {
              identifier: "interestIncome",
              value: { type: "number_input" },
              format: "financial",
            },
          ],
        },
      ],
    },
  ],
};
```

---

### Task 6: Form 1099-DIV specification

**Files:**
- Create: `thumbtax-webapp/src/specifications/forms/form1099Div.ts`

- [ ] **Step 1: Write the spec**

```typescript
import type { TaxFormSpecification } from "#src/specifications/types/taxFormSpecification";

export const form1099Div: TaxFormSpecification = {
  class: "f1099Div",
  title: "Form 1099-DIV",
  subtitle: "Dividends and Distributions",
  description: "Reports dividend income and capital gain distributions.",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-1099-div",
  category: "income",
  maxInstances: null,
  defaultInstanceLabel: "Payer name",
  sections: [
    {
      lines: [
        {
          index: "1a",
          description: "Total ordinary dividends",
          boxes: [
            {
              identifier: "ordinaryDividends",
              value: { type: "number_input" },
              format: "financial",
            },
          ],
        },
        {
          index: "1b",
          description: "Qualified dividends",
          boxes: [
            {
              identifier: "qualifiedDividends",
              value: { type: "number_input" },
              format: "financial",
            },
          ],
        },
      ],
    },
  ],
};
```

---

### Task 7: Schedule B specification

**Files:**
- Create: `thumbtax-webapp/src/specifications/forms/schB.ts`

Schedule B totals interest from 1099-INTs and ordinary dividends from 1099-DIVs.

- [ ] **Step 1: Write the spec**

```typescript
import type { TaxFormSpecification } from "#src/specifications/types/taxFormSpecification";

export const schB: TaxFormSpecification = {
  class: "schB",
  title: "Schedule B",
  subtitle: "Interest and Ordinary Dividends",
  description:
    "Reconciles interest from Form 1099-INT and ordinary dividends from Form 1099-DIV.",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-schedule-b-form-1040",
  category: "income",
  maxInstances: 1,
  sections: [
    {
      heading: "Part I — Interest",
      lines: [
        {
          index: "2",
          description: "Total interest from Form 1099-INT",
          boxes: [
            {
              identifier: "totalInterest",
              value: {
                type: "box_reference",
                form: "f1099Int",
                box: "interestIncome",
              },
              format: "financial",
            },
          ],
        },
      ],
    },
    {
      heading: "Part II — Ordinary Dividends",
      lines: [
        {
          index: "6",
          description: "Total ordinary dividends from Form 1099-DIV",
          boxes: [
            {
              identifier: "totalOrdinaryDividends",
              value: {
                type: "box_reference",
                form: "f1099Div",
                box: "ordinaryDividends",
              },
              format: "financial",
            },
          ],
        },
      ],
    },
  ],
};
```

---

### Task 8: Form 8949 and Schedule D specifications

**Files:**
- Create: `thumbtax-webapp/src/specifications/forms/f8949.ts`
- Create: `thumbtax-webapp/src/specifications/forms/schD.ts`

For v1 keep these minimal: Form 8949 has user-input totals for short-term and long-term proceeds/basis/gain; Schedule D references them.

- [ ] **Step 1: Write Form 8949 spec**

```typescript
import type { TaxFormSpecification } from "#src/specifications/types/taxFormSpecification";

export const f8949: TaxFormSpecification = {
  class: "f8949",
  title: "Form 8949",
  subtitle: "Sales and Other Dispositions of Capital Assets",
  description:
    "Reports sales of capital assets that flow into Schedule D.",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-8949",
  category: "income",
  maxInstances: null,
  defaultInstanceLabel: "Brokerage name",
  sections: [
    {
      heading: "Part I — Short-Term",
      lines: [
        {
          index: "2",
          description: "Short-term totals: proceeds, basis, gain or loss",
          boxes: [
            {
              identifier: "shortTermProceeds",
              columnIndex: "(d)",
              value: { type: "number_input" },
              format: "financial",
            },
            {
              identifier: "shortTermBasis",
              columnIndex: "(e)",
              value: { type: "number_input" },
              format: "financial",
            },
            {
              identifier: "shortTermGain",
              columnIndex: "(h)",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "shortTermProceeds" },
                subtrahend: {
                  type: "box_reference",
                  box: "shortTermBasis",
                },
              },
              format: "financial",
            },
          ],
        },
      ],
      columns: [
        { index: "(d)", description: "Proceeds" },
        { index: "(e)", description: "Cost basis" },
        { index: "(h)", description: "Gain or loss" },
      ],
    },
    {
      heading: "Part II — Long-Term",
      lines: [
        {
          index: "2",
          description: "Long-term totals: proceeds, basis, gain or loss",
          boxes: [
            {
              identifier: "longTermProceeds",
              columnIndex: "(d)",
              value: { type: "number_input" },
              format: "financial",
            },
            {
              identifier: "longTermBasis",
              columnIndex: "(e)",
              value: { type: "number_input" },
              format: "financial",
            },
            {
              identifier: "longTermGain",
              columnIndex: "(h)",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "longTermProceeds" },
                subtrahend: { type: "box_reference", box: "longTermBasis" },
              },
              format: "financial",
            },
          ],
        },
      ],
      columns: [
        { index: "(d)", description: "Proceeds" },
        { index: "(e)", description: "Cost basis" },
        { index: "(h)", description: "Gain or loss" },
      ],
    },
  ],
};
```

- [ ] **Step 2: Write Schedule D spec**

```typescript
import type { TaxFormSpecification } from "#src/specifications/types/taxFormSpecification";

export const schD: TaxFormSpecification = {
  class: "schD",
  title: "Schedule D",
  subtitle: "Capital Gains and Losses",
  description:
    "Aggregates short-term and long-term capital gain/loss for Form 1040.",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-schedule-d-form-1040",
  category: "income",
  maxInstances: 1,
  sections: [
    {
      heading: "Part I — Short-Term",
      lines: [
        {
          index: "1b",
          description: "Total short-term gain or loss from Form 8949",
          boxes: [
            {
              identifier: "shortTermTotal",
              value: {
                type: "box_reference",
                form: "f8949",
                box: "shortTermGain",
              },
              format: "financial",
            },
          ],
        },
        {
          index: "7",
          description: "Net short-term capital gain or loss",
          boxes: [
            {
              identifier: "netShortTerm",
              value: { type: "box_reference", box: "shortTermTotal" },
              format: "financial",
            },
          ],
        },
      ],
    },
    {
      heading: "Part II — Long-Term",
      lines: [
        {
          index: "8b",
          description: "Total long-term gain or loss from Form 8949",
          boxes: [
            {
              identifier: "longTermTotal",
              value: {
                type: "box_reference",
                form: "f8949",
                box: "longTermGain",
              },
              format: "financial",
            },
          ],
        },
        {
          index: "15",
          description: "Net long-term capital gain or loss",
          boxes: [
            {
              identifier: "netLongTerm",
              value: { type: "box_reference", box: "longTermTotal" },
              format: "financial",
            },
          ],
        },
      ],
    },
    {
      heading: "Part III — Summary",
      lines: [
        {
          index: "16",
          description: "Combined net capital gain or loss",
          boxes: [
            {
              identifier: "combinedNet",
              value: {
                type: "sum",
                values: [
                  { type: "box_reference", box: "netShortTerm" },
                  { type: "box_reference", box: "netLongTerm" },
                ],
              },
              format: "financial",
            },
          ],
        },
      ],
    },
  ],
};
```

---

### Task 9: Form 1040 specification (income side + tax basics)

**Files:**
- Create: `thumbtax-webapp/src/specifications/forms/form1040.ts`

For v1 the 1040 covers wages aggregation, interest/dividends from Schedule B, capital gain from Schedule D, total income, AGI = total income (no adjustments), standard deduction by filing status, taxable income, simplified tax (using a single bracket placeholder via `filing_status_map` constants the implementer can refine), withholding aggregation from W-2, and refund/owed difference.

- [ ] **Step 1: Write the spec**

```typescript
import type { TaxFormSpecification } from "#src/specifications/types/taxFormSpecification";

export const form1040: TaxFormSpecification = {
  class: "f1040",
  title: "Form 1040",
  subtitle: "U.S. Individual Income Tax Return",
  description: "The primary U.S. individual income tax return form.",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-1040",
  category: "taxes",
  maxInstances: 1,
  sections: [
    {
      heading: "Income",
      lines: [
        {
          index: "1a",
          description: "Total wages from Form(s) W-2, box 1",
          boxes: [
            {
              identifier: "totalWages",
              value: {
                type: "box_reference",
                form: "fW2",
                box: "wages",
              },
              format: "financial",
            },
          ],
        },
        {
          index: "2b",
          description: "Taxable interest",
          boxes: [
            {
              identifier: "taxableInterest",
              value: {
                type: "box_reference",
                form: "schB",
                box: "totalInterest",
              },
              format: "financial",
            },
          ],
        },
        {
          index: "3b",
          description: "Ordinary dividends",
          boxes: [
            {
              identifier: "ordinaryDividends",
              value: {
                type: "box_reference",
                form: "schB",
                box: "totalOrdinaryDividends",
              },
              format: "financial",
            },
          ],
        },
        {
          index: "7",
          description: "Capital gain or loss from Schedule D",
          boxes: [
            {
              identifier: "capitalGain",
              value: {
                type: "box_reference",
                form: "schD",
                box: "combinedNet",
              },
              format: "financial",
            },
          ],
        },
        {
          index: "9",
          description: "Total income",
          boxes: [
            {
              identifier: "totalIncome",
              value: {
                type: "sum",
                values: [
                  { type: "box_reference", box: "totalWages" },
                  { type: "box_reference", box: "taxableInterest" },
                  { type: "box_reference", box: "ordinaryDividends" },
                  { type: "box_reference", box: "capitalGain" },
                ],
              },
              format: "financial",
            },
          ],
        },
        {
          index: "11",
          description: "Adjusted gross income",
          boxes: [
            {
              identifier: "adjustedGrossIncome",
              value: { type: "box_reference", box: "totalIncome" },
              format: "financial",
            },
          ],
        },
        {
          index: "12",
          description: "Standard deduction",
          boxes: [
            {
              identifier: "standardDeduction",
              value: {
                type: "filing_status_map",
                values: {
                  single: { type: "number_constant", value: 15000 },
                  married_filing_jointly: {
                    type: "number_constant",
                    value: 30000,
                  },
                  married_filing_separately: {
                    type: "number_constant",
                    value: 15000,
                  },
                  head_of_household: {
                    type: "number_constant",
                    value: 22500,
                  },
                  qualifying_surviving_spouse: {
                    type: "number_constant",
                    value: 30000,
                  },
                },
              },
              format: "financial",
            },
          ],
        },
        {
          index: "15",
          description: "Taxable income",
          boxes: [
            {
              identifier: "taxableIncome",
              value: {
                type: "non_negative",
                value: {
                  type: "difference",
                  minuend: {
                    type: "box_reference",
                    box: "adjustedGrossIncome",
                  },
                  subtrahend: {
                    type: "box_reference",
                    box: "standardDeduction",
                  },
                },
              },
              format: "financial",
            },
          ],
        },
      ],
    },
    {
      heading: "Tax and Refund",
      lines: [
        {
          index: "16",
          description:
            "Estimated tax (simplified flat-rate placeholder; refine in a future task)",
          boxes: [
            {
              identifier: "tax",
              value: {
                type: "product",
                values: [
                  { type: "box_reference", box: "taxableIncome" },
                  { type: "number_constant", value: 0.12 },
                ],
              },
              format: "financial",
            },
          ],
        },
        {
          index: "24",
          description: "Total tax",
          boxes: [
            {
              identifier: "totalTax",
              value: { type: "box_reference", box: "tax" },
              format: "financial",
            },
          ],
        },
        {
          index: "25a",
          description: "Federal income tax withheld from Form(s) W-2",
          boxes: [
            {
              identifier: "withholdingFromW2",
              value: {
                type: "box_reference",
                form: "fW2",
                box: "federalTaxWithheld",
              },
              format: "financial",
            },
          ],
        },
        {
          index: "33",
          description: "Total payments",
          boxes: [
            {
              identifier: "totalPayments",
              value: { type: "box_reference", box: "withholdingFromW2" },
              format: "financial",
            },
          ],
        },
        {
          index: "34",
          description: "Refund (if total payments > total tax)",
          boxes: [
            {
              identifier: "refund",
              value: {
                type: "non_negative",
                value: {
                  type: "difference",
                  minuend: { type: "box_reference", box: "totalPayments" },
                  subtrahend: { type: "box_reference", box: "totalTax" },
                },
              },
              format: "financial",
            },
          ],
        },
        {
          index: "37",
          description: "Amount you owe (if total tax > total payments)",
          boxes: [
            {
              identifier: "amountOwed",
              value: {
                type: "non_negative",
                value: {
                  type: "difference",
                  minuend: { type: "box_reference", box: "totalTax" },
                  subtrahend: { type: "box_reference", box: "totalPayments" },
                },
              },
              format: "financial",
            },
          ],
        },
      ],
    },
  ],
};
```

- [ ] **Step 2: Typecheck**

```bash
cd thumbtax-webapp && npm run typecheck
```

- [ ] **Step 3: Commit**

```bash
git add thumbtax-webapp/src/specifications/forms
git commit -m "Add v1 form specifications: W-2, 1099-INT, 1099-DIV, Schedule B, Form 8949, Schedule D, Form 1040"
```

---

### Task 10: Specifications service (TDD)

**Files:**
- Create: `thumbtax-webapp/src/specifications/service.ts`
- Create: `thumbtax-webapp/src/specifications/service.test.ts`

- [ ] **Step 1: Write the failing tests**

`thumbtax-webapp/src/specifications/service.test.ts`:

```typescript
import { describe, expect, it } from "vitest";

import {
  allFormClasses,
  allSpecifications,
  getFormSpecification,
} from "#src/specifications/service";

describe("specifications service", () => {
  it("getFormSpecification returns the spec whose `class` matches", () => {
    expect(getFormSpecification("f1040").class).toBe("f1040");
    expect(getFormSpecification("fW2").class).toBe("fW2");
  });

  it("allFormClasses returns every supported FormClass", () => {
    const classes = allFormClasses();
    expect(classes).toEqual(
      expect.arrayContaining([
        "f1040",
        "fW2",
        "f1099Int",
        "f1099Div",
        "schB",
        "schD",
        "f8949",
      ]),
    );
  });

  it("allSpecifications has one entry per allFormClasses entry", () => {
    expect(allSpecifications().length).toBe(allFormClasses().length);
  });

  it("every spec's class matches its registry key", () => {
    for (const spec of allSpecifications()) {
      expect(getFormSpecification(spec.class)).toBe(spec);
    }
  });
});
```

- [ ] **Step 2: Run, verify FAIL**

```bash
cd thumbtax-webapp && npm test -- service.test
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement the service**

`thumbtax-webapp/src/specifications/service.ts`:

```typescript
import type { FormClass } from "#src/common/types/formClass";
import { f8949 } from "#src/specifications/forms/f8949";
import { form1040 } from "#src/specifications/forms/form1040";
import { form1099Div } from "#src/specifications/forms/form1099Div";
import { form1099Int } from "#src/specifications/forms/form1099Int";
import { formW2 } from "#src/specifications/forms/formW2";
import { schB } from "#src/specifications/forms/schB";
import { schD } from "#src/specifications/forms/schD";
import type { TaxFormSpecification } from "#src/specifications/types/taxFormSpecification";

const registry: Record<FormClass, TaxFormSpecification> = {
  f1040: form1040,
  fW2: formW2,
  f1099Int: form1099Int,
  f1099Div: form1099Div,
  schB: schB,
  schD: schD,
  f8949: f8949,
};

export function getFormSpecification(
  formClass: FormClass,
): TaxFormSpecification {
  return registry[formClass];
}

export function allFormClasses(): FormClass[] {
  return Object.keys(registry) as FormClass[];
}

export function allSpecifications(): TaxFormSpecification[] {
  return allFormClasses().map((cls) => registry[cls]);
}
```

- [ ] **Step 4: Run, verify PASS**

```bash
cd thumbtax-webapp && npm test
```

- [ ] **Step 5: Commit**

```bash
git add thumbtax-webapp/src/specifications
git commit -m "Add specifications service"
```
