import { FORM_CLASSES, TAX_YEARS } from "@thumbtax/common";

import type { TaxYear } from "@thumbtax/common";
import type {
  FormBox,
  FormLine,
  FormSection,
  FormSpecification,
  SpecificationRegistry,
} from "@thumbtax/forms";

export function makeBoxFixture(
  overrides?: Partial<FormBox<false>>,
): FormBox<false> {
  return {
    identifier: "1",
    value: { type: "number_constant", value: 0 },
    ...overrides,
  };
}

export function makeBoxFixtureMultiColumn(
  overrides?: Partial<FormBox<true>>,
): FormBox<true> {
  return {
    identifier: "1",
    value: { type: "number_constant", value: 0 },
    column: "(a)",
    ...overrides,
  };
}

export function makeLineFixture(
  overrides?: Partial<FormLine<false>>,
): FormLine<false> {
  return {
    index: "1",
    box: makeBoxFixture(),
    ...overrides,
  };
}

export function makeLineFixtureMultiColumn(
  overrides?: Partial<FormLine<true>>,
): FormLine<true> {
  return {
    index: "1",
    boxes: [makeBoxFixtureMultiColumn()],
    ...overrides,
  };
}

export function makeSectionFixture(
  overrides?: Partial<FormSection<false>>,
): FormSection<false> {
  return {
    lines: [makeLineFixture()],
    ...overrides,
  };
}

export function makeSectionFixtureMultiColumn(
  overrides?: Partial<FormSection<true>>,
): FormSection<true> {
  return {
    lines: [makeLineFixtureMultiColumn()],
    columns: [{ index: "(a)" }],
    ...overrides,
  };
}

export function makeSpecificationFixture(
  overrides?: Partial<FormSpecification>,
): FormSpecification {
  return {
    class: "fW2",
    title: "",
    category: "income",
    maxInstances: null,
    sections: [makeSectionFixture()],
    ...overrides,
  };
}

export function makeRegistryFixture(
  overrides?: Partial<SpecificationRegistry>,
): SpecificationRegistry {
  const defaults = Object.fromEntries(
    FORM_CLASSES.map((formClass) => [
      formClass,
      makeSpecificationFixture({ class: formClass }),
    ]),
  ) as SpecificationRegistry;
  return {
    ...defaults,
    ...overrides,
  };
}

function hasEveryTaxYear<Value>(
  record: Partial<Record<TaxYear, Value>>,
): record is Record<TaxYear, Value> {
  return TAX_YEARS.every((taxYear) => record[taxYear] !== undefined);
}

/**
 * Uses `registry` for every tax year, except the years given in `overrides`.
 */
export function makeSpecificationsByYearFixture(
  registry: SpecificationRegistry = makeRegistryFixture(),
  overrides?: Partial<Record<TaxYear, SpecificationRegistry>>,
): Record<TaxYear, SpecificationRegistry> {
  const specificationsByYear: Partial<Record<TaxYear, SpecificationRegistry>> =
    {};
  for (const taxYear of TAX_YEARS) {
    specificationsByYear[taxYear] = overrides?.[taxYear] ?? registry;
  }
  if (!hasEveryTaxYear(specificationsByYear)) {
    throw new Error("Missing specifications for a tax year");
  }
  return specificationsByYear;
}
