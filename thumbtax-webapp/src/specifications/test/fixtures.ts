import { FORM_CLASSES } from "#src/common/types/formClass";

import type {
  FormBox,
  FormLine,
  FormSection,
  FormSpecification,
} from "#src/specifications/types/formSpecification";
import type { SpecificationRegistry } from "#src/specifications/types/specificationRegistry";

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
    irsPageUrl: "",
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
