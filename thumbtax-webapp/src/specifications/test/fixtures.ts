import type {
  FormBox,
  FormLine,
  FormSection,
  FormSpecification,
} from "#src/specifications/types/formSpecification";

export function makeBoxFixture(
  overrides?: Partial<FormBox<false>>,
): FormBox<false> {
  return {
    identifier: "1",
    value: { type: "number_constant", value: 0 },
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

export function makeSectionFixture(
  overrides?: Partial<FormSection<false>>,
): FormSection<false> {
  return {
    lines: [makeLineFixture()],
    ...overrides,
  };
}

export function makeFormSpecFixture(
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
