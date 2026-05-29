import {
  makeInstanceFixture,
  TEST_CLASS,
  TEST_INSTANCE_ID,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";

export const form_instance_count: ValueProviderFixture[] = [
  {
    description: "resolves to number of form instances",
    provider: { type: "form_instance_count", form: "f1040" },
    instanceRegistry: {
      f1040: [
        makeInstanceFixture({ id: "1040-1", class: "f1040" }),
        makeInstanceFixture({ id: "1040-2", class: "f1040" }),
        makeInstanceFixture({ id: "1040-3", class: "f1040" }),
      ],
      [TEST_CLASS]: [
        makeInstanceFixture({ id: TEST_INSTANCE_ID, class: TEST_CLASS }),
        makeInstanceFixture({ id: "W2-2", class: TEST_CLASS }),
      ],
    },
    expected: { value: 3, errors: [] },
  },
  {
    description: "resolves to 0 when the class is not present",
    provider: { type: "form_instance_count", form: "f1040" },
    instanceRegistry: {
      [TEST_CLASS]: [
        makeInstanceFixture({ id: TEST_INSTANCE_ID, class: TEST_CLASS }),
        makeInstanceFixture({ id: "W2-2", class: TEST_CLASS }),
      ],
    },
    expected: { value: 0, errors: [] },
  },
];
