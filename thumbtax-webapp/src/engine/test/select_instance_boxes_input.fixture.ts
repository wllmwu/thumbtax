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
  makeLineFixture,
  makeRegistryFixture,
  makeSectionFixture,
  makeSpecificationFixture,
} from "#src/specifications/test/fixtures";

export const select_instance_boxes_input: ValueProviderFixture[] = [
  {
    description: "resolves to 0 when no input is present",
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
                  identifier: BOX_UNDER_TEST_ID,
                  value: {
                    type: "select_instance_boxes_input",
                    options: [{ form: TEST_CLASS, box: "box-1" }],
                  },
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
    description: "resolves to the sum of selected addresses",
    specificationRegistry: makeRegistryFixture({
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
                  value: { type: "number_constant", value: 100 },
                }),
              }),
            ],
          }),
        ],
      }),
      f8889: makeSpecificationFixture({
        class: "f8889",
        sections: [
          makeSectionFixture({
            lines: [
              makeLineFixture({
                box: makeBoxFixture({
                  identifier: "box-d",
                  value: { type: "number_constant", value: 1000 },
                }),
              }),
            ],
          }),
        ],
      }),
      [TEST_CLASS]: makeSpecificationFixture({
        class: TEST_CLASS,
        sections: [
          makeSectionFixture({
            lines: [
              makeLineFixture({
                box: makeBoxFixture({
                  identifier: "box-t",
                  value: { type: "number_constant", value: 7 },
                }),
              }),
              makeLineFixture({
                box: makeBoxFixture({
                  identifier: BOX_UNDER_TEST_ID,
                  value: {
                    type: "select_instance_boxes_input",
                    options: [
                      { form: "f1040", box: "box-1" },
                      { form: "f1040", box: "box-2" },
                      { form: "f8889", box: "box-d" },
                      { form: TEST_CLASS, box: "box-t" },
                    ],
                  },
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
        makeInstanceFixture({ id: "1040-3", class: "f1040" }),
      ],
      f8889: [makeInstanceFixture({ id: "8889-1", class: "f8889" })],
      [TEST_CLASS]: [
        makeInstanceFixture({
          id: TEST_INSTANCE_ID,
          class: TEST_CLASS,
          inputs: {
            [BOX_UNDER_TEST_ID]: {
              type: "instance_box_selections",
              selected: [
                // 2 of 3 instances selected for box 1
                { instance: "1040-1", box: "box-1" },
                { instance: "1040-2", box: "box-1" },
                // 1 of 3 instances selected for box 2
                { instance: "1040-1", box: "box-2" },
                // 1 of 1 instances selected of a different form class
                { instance: "8889-1", box: "box-d" },
                // a box selected from the test instance
                { instance: TEST_INSTANCE_ID, box: "box-t" },
              ],
            },
          },
        }),
      ],
    },
    // 10 + 10 + 100 + 1000 + 7
    expected: { value: 1127, errors: [] },
  },
  {
    description: "resolves to 0 when nothing is selected",
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
                  identifier: BOX_UNDER_TEST_ID,
                  value: {
                    type: "select_instance_boxes_input",
                    options: [{ form: TEST_CLASS, box: "box-1" }],
                  },
                }),
              }),
            ],
          }),
        ],
      }),
    }),
    instanceRegistry: {
      [TEST_CLASS]: [
        makeInstanceFixture({
          id: TEST_INSTANCE_ID,
          class: TEST_CLASS,
          inputs: {
            [BOX_UNDER_TEST_ID]: {
              type: "instance_box_selections",
              selected: [],
            },
          },
        }),
      ],
    },
    expected: { value: 0, errors: [] },
  },
  {
    description: "propagates errors from selected addresses",
    specificationRegistry: makeRegistryFixture({
      [TEST_CLASS]: makeSpecificationFixture({
        class: TEST_CLASS,
        sections: [
          makeSectionFixture({
            lines: [
              makeLineFixture({
                box: makeBoxFixture({
                  identifier: "box-error",
                  value: ERROR_PROVIDER,
                }),
              }),
              makeLineFixture({
                box: makeBoxFixture({
                  identifier: "box-ok",
                  value: { type: "number_constant", value: 5 },
                }),
              }),
              makeLineFixture({
                box: makeBoxFixture({
                  identifier: BOX_UNDER_TEST_ID,
                  value: {
                    type: "select_instance_boxes_input",
                    options: [
                      { form: TEST_CLASS, box: "box-error" },
                      { form: TEST_CLASS, box: "box-ok" },
                    ],
                  },
                }),
              }),
            ],
          }),
        ],
      }),
    }),
    instanceRegistry: {
      [TEST_CLASS]: [
        makeInstanceFixture({
          id: TEST_INSTANCE_ID,
          class: TEST_CLASS,
          inputs: {
            [BOX_UNDER_TEST_ID]: {
              type: "instance_box_selections",
              selected: [
                { instance: TEST_INSTANCE_ID, box: "box-error" },
                { instance: TEST_INSTANCE_ID, box: "box-ok" },
              ],
            },
          },
        }),
      ],
    },
    expected: { value: 5, errors: [{ type: "divide_by_zero" }] },
  },
  {
    description: "ignores addresses that don't exist",
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
                  identifier: BOX_UNDER_TEST_ID,
                  value: {
                    type: "select_instance_boxes_input",
                    options: [{ form: TEST_CLASS, box: "box-1" }],
                  },
                }),
              }),
            ],
          }),
        ],
      }),
    }),
    instanceRegistry: {
      [TEST_CLASS]: [
        makeInstanceFixture({
          id: TEST_INSTANCE_ID,
          class: TEST_CLASS,
          inputs: {
            [BOX_UNDER_TEST_ID]: {
              type: "instance_box_selections",
              selected: [
                { instance: "does-not-exist", box: "box-1" },
                { instance: TEST_INSTANCE_ID, box: "box-1" },
              ],
            },
          },
        }),
      ],
    },
    expected: { value: 10, errors: [] },
  },
];
