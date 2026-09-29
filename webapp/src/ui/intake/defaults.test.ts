import { TAX_YEARS } from "@thumbtax/common";
import { describe, expect, it } from "vitest";

import {
  makeDefaultEmploymentIncomeComponent,
  makeDefaultOtherIncomeComponent,
} from "#src/ui/intake/defaults";

describe("makeDefaultEmploymentIncomeComponent", () => {
  it.each(TAX_YEARS)("covers all of tax year %i", (taxYear) => {
    const { dateRange } = makeDefaultEmploymentIncomeComponent(taxYear);

    expect(dateRange.start.toString()).toBe(`${taxYear}-01-01`);
    expect(dateRange.end.toString()).toBe(`${taxYear}-12-31`);
  });
});

describe("makeDefaultOtherIncomeComponent", () => {
  it.each(TAX_YEARS)("covers all of tax year %i", (taxYear) => {
    const { dateRange } = makeDefaultOtherIncomeComponent(taxYear);

    expect(dateRange.start.toString()).toBe(`${taxYear}-01-01`);
    expect(dateRange.end.toString()).toBe(`${taxYear}-12-31`);
  });
});
