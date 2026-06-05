import {
  BOX_UNDER_TEST_ID,
  ERROR_PROVIDER,
  makeInstanceFixture,
  TEST_CLASS,
  TEST_INSTANCE_ID,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";
import {
  makeBoxFixture,
  makeBoxFixtureMultiColumn,
  makeLineFixture,
  makeLineFixtureMultiColumn,
  makeRegistryFixture,
  makeSectionFixture,
  makeSectionFixtureMultiColumn,
  makeSpecificationFixture,
} from "#src/specifications/test/fixtures";

export const box_reference: ValueProviderFixture[] = [
  {
    description: "resolves to the referenced box's value in the same form",
    specificationRegistry: makeRegistryFixture({
      [TEST_CLASS]: makeSpecificationFixture({
        class: TEST_CLASS,
        sections: [
          makeSectionFixture({
            lines: [
              makeLineFixture({
                box: makeBoxFixture({
                  identifier: "box-1",
                  value: { type: "number_constant", value: 10 },
                }),
              }),
              makeLineFixture({
                box: makeBoxFixture({
                  identifier: "box-2",
                  value: { type: "number_constant", value: 20 },
                }),
              }),
              makeLineFixture({
                box: makeBoxFixture({
                  identifier: BOX_UNDER_TEST_ID,
                  value: { type: "box_reference", box: "box-2" },
                }),
              }),
            ],
          }),
        ],
      }),
    }),
    expected: { value: 20, errors: [] },
  },
  {
    description:
      "resolves to the sum of the referenced box's values across all instances when form is given",
    specificationRegistry: makeRegistryFixture({
      [TEST_CLASS]: makeSpecificationFixture({
        class: TEST_CLASS,
        sections: [
          makeSectionFixture({
            lines: [
              makeLineFixture({
                box: makeBoxFixture({
                  identifier: BOX_UNDER_TEST_ID,
                  value: {
                    type: "box_reference",
                    form: "f1040",
                    box: "box-2",
                  },
                }),
              }),
            ],
          }),
        ],
      }),
      f1040: makeSpecificationFixture({
        class: "f1040",
        sections: [
          makeSectionFixture({
            lines: [
              makeLineFixture({
                box: makeBoxFixture({
                  identifier: "box-1",
                  value: { type: "number_constant", value: 10 },
                }),
              }),
              makeLineFixture({
                box: makeBoxFixture({
                  identifier: "box-2",
                  value: { type: "number_constant", value: 20 },
                }),
              }),
            ],
          }),
        ],
      }),
    }),
    instanceRegistry: {
      f1040: [
        makeInstanceFixture({ id: "1040-1", class: "f1040" }),
        makeInstanceFixture({ id: "1040-2", class: "f1040" }),
      ],
      [TEST_CLASS]: [
        makeInstanceFixture({ id: TEST_INSTANCE_ID, class: TEST_CLASS }),
      ],
    },
    expected: { value: 40, errors: [] },
  },
  {
    description: "resolves to 0 when the box does not exist",
    provider: {
      type: "box_reference",
      form: "f1040",
      box: "box-2",
    },
    expected: { value: 0, errors: [] },
  },
  {
    description: "resolves to 0 when no instances of the form exist",
    specificationRegistry: makeRegistryFixture({
      [TEST_CLASS]: makeSpecificationFixture({
        class: TEST_CLASS,
        sections: [
          makeSectionFixture({
            lines: [
              makeLineFixture({
                box: makeBoxFixture({
                  identifier: BOX_UNDER_TEST_ID,
                  value: {
                    type: "box_reference",
                    form: "f1040",
                    box: "box-2",
                  },
                }),
              }),
            ],
          }),
        ],
      }),
      f1040: makeSpecificationFixture({
        class: "f1040",
        sections: [
          makeSectionFixture({
            lines: [
              makeLineFixture({
                box: makeBoxFixture({
                  identifier: "box-1",
                  value: { type: "number_constant", value: 10 },
                }),
              }),
              makeLineFixture({
                box: makeBoxFixture({
                  identifier: "box-2",
                  value: { type: "number_constant", value: 20 },
                }),
              }),
            ],
          }),
        ],
      }),
    }),
    expected: { value: 0, errors: [] },
  },
  {
    description: "works when the referenced line has multiple columns",
    specificationRegistry: makeRegistryFixture({
      [TEST_CLASS]: makeSpecificationFixture({
        class: TEST_CLASS,
        sections: [
          makeSectionFixtureMultiColumn({
            columns: [{ index: "(a)" }, { index: "(b)" }],
            lines: [
              makeLineFixtureMultiColumn({
                boxes: [
                  makeBoxFixtureMultiColumn({
                    identifier: "1(a)",
                    value: { type: "number_constant", value: 10 },
                  }),
                  makeBoxFixtureMultiColumn({
                    identifier: "1(b)",
                    value: { type: "number_constant", value: 20 },
                  }),
                ],
              }),
            ],
          }),
          makeSectionFixture({
            lines: [
              makeLineFixture({
                box: makeBoxFixture({
                  identifier: BOX_UNDER_TEST_ID,
                  value: { type: "box_reference", box: "1(b)" },
                }),
              }),
            ],
          }),
        ],
      }),
    }),
    expected: { value: 20, errors: [] },
  },
  {
    description:
      "resolves with required_form_missing error when required is true and no instances of the form exist",
    specificationRegistry: makeRegistryFixture({
      [TEST_CLASS]: makeSpecificationFixture({
        class: TEST_CLASS,
        sections: [
          makeSectionFixture({
            lines: [
              makeLineFixture({
                box: makeBoxFixture({
                  identifier: BOX_UNDER_TEST_ID,
                  value: {
                    type: "box_reference",
                    form: "f1040",
                    box: "box-2",
                    required: true,
                  },
                }),
              }),
            ],
          }),
        ],
      }),
      f1040: makeSpecificationFixture({
        class: "f1040",
        sections: [
          makeSectionFixture({
            lines: [
              makeLineFixture({
                box: makeBoxFixture({
                  identifier: "box-2",
                  value: { type: "number_constant", value: 20 },
                }),
              }),
            ],
          }),
        ],
      }),
    }),
    expected: {
      value: 0,
      errors: [{ type: "required_form_missing", form: "f1040" }],
    },
  },
  {
    description: "propagates errors from the referenced box",
    specificationRegistry: makeRegistryFixture({
      [TEST_CLASS]: makeSpecificationFixture({
        class: TEST_CLASS,
        sections: [
          makeSectionFixture({
            lines: [
              makeLineFixture({
                box: makeBoxFixture({
                  identifier: "box-1",
                  value: ERROR_PROVIDER,
                }),
              }),
              makeLineFixture({
                box: makeBoxFixture({
                  identifier: BOX_UNDER_TEST_ID,
                  value: { type: "box_reference", box: "box-1" },
                }),
              }),
            ],
          }),
        ],
      }),
    }),
    expected: {
      value: 0,
      errors: [
        {
          type: "upstream",
          sourceAddress: {
            instance: TEST_INSTANCE_ID,
            box: "box-1",
          },
        },
      ],
    },
  },
];
