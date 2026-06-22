import { describe, expect, it } from "vitest";

import { computeWorkbook } from "#src/engine/computeWorkbook";
import { absolute_value } from "#src/engine/test/absolute_value.fixture";
import { box_reference } from "#src/engine/test/box_reference.fixture";
import { checkbox_input } from "#src/engine/test/checkbox_input.fixture";
import { comparison } from "#src/engine/test/comparison.fixture";
import { conditional } from "#src/engine/test/conditional.fixture";
import { conjunction } from "#src/engine/test/conjunction.fixture";
import { difference } from "#src/engine/test/difference.fixture";
import { disjunction } from "#src/engine/test/disjunction.fixture";
import { filing_status_map } from "#src/engine/test/filing_status_map.fixture";
import {
  BOX_UNDER_TEST_ID,
  ERROR_PROVIDER,
  makeInstanceFixture,
  TEST_CLASS,
  TEST_INSTANCE_ID,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";
import { form_instance_count } from "#src/engine/test/form_instance_count.fixture";
import { list_amounts_input } from "#src/engine/test/list_amounts_input.fixture";
import { logical_negation } from "#src/engine/test/logical_negation.fixture";
import { maximum } from "#src/engine/test/maximum.fixture";
import { minimum } from "#src/engine/test/minimum.fixture";
import { non_negative_clamp } from "#src/engine/test/non_negative_clamp.fixture";
import { non_positive_clamp } from "#src/engine/test/non_positive_clamp.fixture";
import { number_constant } from "#src/engine/test/number_constant.fixture";
import { number_input } from "#src/engine/test/number_input.fixture";
import { numerical_negation } from "#src/engine/test/numerical_negation.fixture";
import { override_number_input } from "#src/engine/test/override_number_input.fixture";
import { piecewise_function } from "#src/engine/test/piecewise_function.fixture";
import { product } from "#src/engine/test/product.fixture";
import { quotient } from "#src/engine/test/quotient.fixture";
import { select_instance_boxes_input } from "#src/engine/test/select_instance_boxes_input.fixture";
import { select_value_input } from "#src/engine/test/select_value_input.fixture";
import { sum } from "#src/engine/test/sum.fixture";
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

import type { FilingStatus } from "@thumbtax/common";
import type { InstanceRegistry } from "#src/common/types/formInstance";
import type { FormInstanceId } from "#src/common/types/formInstanceId";
import type { ResolvedBox, Workbook } from "#src/common/types/workbook";
import type { SpecificationRegistry } from "#src/specifications/types/specificationRegistry";
import type { ValueProvider } from "#src/specifications/types/valueProvider";

function makeTestData(fixture: Omit<ValueProviderFixture, "description">): {
  specificationRegistry: SpecificationRegistry;
  filingStatus: FilingStatus;
  instanceRegistry: InstanceRegistry;
  expected: ResolvedBox;
} {
  const specificationRegistry = fixture.provider
    ? makeRegistryFixture({
        [TEST_CLASS]: makeSpecificationFixture({
          class: TEST_CLASS,
          sections: [
            makeSectionFixture({
              lines: [
                makeLineFixture({
                  box: makeBoxFixture({
                    identifier: BOX_UNDER_TEST_ID,
                    value: fixture.provider,
                  }),
                }),
              ],
            }),
          ],
        }),
      })
    : fixture.specificationRegistry;

  if (!specificationRegistry) {
    throw new Error("No provider or specification registry given");
  }

  return {
    specificationRegistry,
    filingStatus: "single",
    instanceRegistry: {
      [TEST_CLASS]: [
        makeInstanceFixture({ id: TEST_INSTANCE_ID, class: TEST_CLASS }),
      ],
    },
    ...fixture,
  };
}

const providerFixtures: Record<ValueProvider["type"], ValueProviderFixture[]> =
  {
    absolute_value,
    box_reference,
    checkbox_input,
    comparison,
    conditional,
    conjunction,
    difference,
    disjunction,
    filing_status_map,
    form_instance_count,
    list_amounts_input,
    logical_negation,
    maximum,
    minimum,
    non_negative_clamp,
    non_positive_clamp,
    number_constant,
    number_input,
    numerical_negation,
    override_number_input,
    piecewise_function,
    product,
    quotient,
    select_instance_boxes_input,
    select_value_input,
    sum,
    unsupported: [
      {
        description: "resolves to 0",
        provider: { type: "unsupported" },
        expected: { value: 0, errors: [] },
      },
    ],
    unused: [
      {
        description: "resolves to 0",
        provider: { type: "unused" },
        expected: { value: 0, errors: [] },
      },
    ],
  };

describe("computeWorkbook", () => {
  it.each(
    Object.entries(providerFixtures).flatMap(([type, fixtures]) =>
      fixtures.map((fixture) => ({ type, ...fixture })),
    ),
  )("resolves $type: $description", (fixture) => {
    const { specificationRegistry, instanceRegistry, filingStatus, expected } =
      makeTestData(fixture);

    const result = computeWorkbook(
      specificationRegistry,
      instanceRegistry,
      filingStatus,
      {},
    );

    expect(result[TEST_INSTANCE_ID][BOX_UNDER_TEST_ID]).toEqual(expected);
  });

  it("resolves nested value providers", () => {
    const { specificationRegistry, instanceRegistry, filingStatus, expected } =
      makeTestData({
        provider: {
          type: "conditional",
          condition: {
            type: "logical_negation",
            value: {
              type: "comparison",
              value: {
                type: "filing_status_map",
                values: {
                  single: {
                    type: "form_instance_count",
                    form: TEST_CLASS,
                  },
                },
              },
              maximum: { type: "number_constant", value: 2 },
            },
          },
          trueValue: { type: "number_constant", value: 3 },
          falseValue: {
            type: "product",
            values: [
              { type: "number_constant", value: 4 },
              {
                type: "sum",
                values: [
                  { type: "number_constant", value: 5 },
                  {
                    type: "non_negative_clamp",
                    value: {
                      type: "difference",
                      minuend: { type: "number_constant", value: 6 },
                      subtrahend: {
                        type: "absolute_value",
                        value: { type: "number_constant", value: -7 },
                      },
                    },
                  },
                  ERROR_PROVIDER,
                  {
                    type: "quotient",
                    dividend: { type: "number_constant", value: 5 },
                    divisor: { type: "number_constant", value: 4 },
                  },
                ],
              },
            ],
          },
        },
        expected: { value: 25, errors: [{ type: "divide_by_zero" }] },
      });

    const result = computeWorkbook(
      specificationRegistry,
      instanceRegistry,
      filingStatus,
      {},
    );

    expect(result[TEST_INSTANCE_ID][BOX_UNDER_TEST_ID]).toEqual(expected);
  });

  it("resolves dependency chains", () => {
    const { specificationRegistry, instanceRegistry, filingStatus, expected } =
      makeTestData({
        specificationRegistry: makeRegistryFixture({
          f1040: makeSpecificationFixture({
            class: "f1040",
            sections: [
              makeSectionFixture({
                lines: [
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: "1", // 10
                      value: { type: "number_constant", value: 10 },
                    }),
                  }),
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: "2", // 20, 30
                      value: { type: "number_input" },
                    }),
                  }),
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: "3", // 35, 45
                      value: {
                        type: "sum",
                        values: [
                          { type: "box_reference", box: "1" },
                          { type: "box_reference", box: "2" },
                          { type: "number_constant", value: 5 },
                          ERROR_PROVIDER,
                        ],
                      },
                    }),
                  }),
                ],
              }),
              makeSectionFixtureMultiColumn({
                columns: [{ index: "(a)" }, { index: "(b)" }],
                lines: [
                  makeLineFixtureMultiColumn({
                    boxes: [
                      makeBoxFixtureMultiColumn({
                        identifier: "4(a)", // 41
                        column: "(a)",
                        value: { type: "number_constant", value: 41 },
                      }),
                      makeBoxFixtureMultiColumn({
                        identifier: "4(b)", // 35, 41
                        column: "(b)",
                        value: {
                          type: "minimum",
                          values: [
                            { type: "box_reference", box: "3" },
                            { type: "box_reference", box: "4(a)" },
                          ],
                        },
                      }),
                    ],
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
                      identifier: "1", // 46
                      value: { type: "list_amounts_input" },
                    }),
                  }),
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: "2", // 3496
                      value: {
                        type: "product",
                        values: [
                          { type: "box_reference", form: "f1040", box: "4(b)" },
                          { type: "box_reference", box: "1" },
                        ],
                      },
                    }),
                  }),
                ],
              }),
              makeSectionFixture({
                lines: [
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: "3", // 3494
                      value: {
                        type: "difference",
                        minuend: { type: "box_reference", box: "2" },
                        subtrahend: {
                          type: "form_instance_count",
                          form: "f1040",
                        },
                      },
                    }),
                  }),
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: BOX_UNDER_TEST_ID,
                      value: {
                        type: "select_value_input",
                        options: [
                          {
                            label: "A", // 3494
                            value: { type: "box_reference", box: "3" },
                          },
                          {
                            label: "B",
                            value: {
                              type: "box_reference",
                              form: "f1040",
                              box: "4(b)",
                            },
                          },
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
            makeInstanceFixture({
              class: "f1040",
              id: "1040-1",
              inputs: { "2": { type: "number", value: 20 } },
            }),
            makeInstanceFixture({
              class: "f1040",
              id: "1040-2",
              inputs: { "2": { type: "number", value: 30 } },
            }),
          ],
          [TEST_CLASS]: [
            makeInstanceFixture({
              class: TEST_CLASS,
              id: TEST_INSTANCE_ID,
              inputs: {
                "1": {
                  type: "amount_list",
                  value: [
                    { label: "foo", amount: 12 },
                    { label: "bar", amount: 34 },
                  ],
                },
                [BOX_UNDER_TEST_ID]: {
                  type: "selection",
                  selectedIndex: 0,
                },
              },
            }),
          ],
        },
        expected: {
          value: 3494,
          errors: [
            {
              type: "upstream",
              sourceAddress: { instance: TEST_INSTANCE_ID, box: "3" },
            },
          ],
        },
      });

    const result = computeWorkbook(
      specificationRegistry,
      instanceRegistry,
      filingStatus,
      {},
    );

    expect(result[TEST_INSTANCE_ID][BOX_UNDER_TEST_ID]).toEqual(expected);
  });

  describe("referential equality preservation", () => {
    it("preserves box reference when resolved value is unchanged with no errors", () => {
      const originalBox: ResolvedBox = { value: 42, errors: [] };
      const originalWorkbook: Workbook = {
        [TEST_INSTANCE_ID]: { [BOX_UNDER_TEST_ID]: originalBox },
      };
      const {
        specificationRegistry,
        instanceRegistry,
        filingStatus,
        expected,
      } = makeTestData({
        provider: { type: "number_input" },
        instanceRegistry: {
          [TEST_CLASS]: [
            makeInstanceFixture({
              id: TEST_INSTANCE_ID,
              class: TEST_CLASS,
              inputs: {
                [BOX_UNDER_TEST_ID]: { type: "number", value: 42 },
              },
            }),
          ],
        },
        expected: originalBox,
      });

      const newWorkbook = computeWorkbook(
        specificationRegistry,
        instanceRegistry,
        filingStatus,
        originalWorkbook,
      );

      const resultBox = newWorkbook[TEST_INSTANCE_ID][BOX_UNDER_TEST_ID];
      expect(resultBox).toEqual(expected);
      expect(resultBox).toBe(originalBox);
    });

    it("preserves box reference when resolved value is unchanged with same errors", () => {
      const originalBox: ResolvedBox = {
        value: 42,
        errors: [{ type: "divide_by_zero" }],
      };
      const originalWorkbook: Workbook = {
        [TEST_INSTANCE_ID]: { [BOX_UNDER_TEST_ID]: originalBox },
      };
      const {
        specificationRegistry,
        instanceRegistry,
        filingStatus,
        expected,
      } = makeTestData({
        provider: {
          type: "sum",
          values: [{ type: "number_constant", value: 42 }, ERROR_PROVIDER],
        },
        expected: originalBox,
      });

      const newWorkbook = computeWorkbook(
        specificationRegistry,
        instanceRegistry,
        filingStatus,
        originalWorkbook,
      );

      const resultBox = newWorkbook[TEST_INSTANCE_ID][BOX_UNDER_TEST_ID];
      expect(resultBox).toEqual(expected);
      expect(resultBox).toBe(originalBox);
    });

    it("preserves box reference when upstream dependencies change but own value is unchanged", () => {
      const {
        specificationRegistry: specificationRegistry1,
        instanceRegistry: instanceRegistry1,
        filingStatus: filingStatus1,
        expected: expected1,
      } = makeTestData({
        specificationRegistry: makeRegistryFixture({
          [TEST_CLASS]: makeSpecificationFixture({
            class: TEST_CLASS,
            sections: [
              makeSectionFixture({
                lines: [
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: "1",
                      value: { type: "number_input" },
                    }),
                  }),
                  makeLineFixture({
                    box: makeBoxFixture({
                      identifier: BOX_UNDER_TEST_ID,
                      value: {
                        type: "absolute_value",
                        value: {
                          type: "box_reference",
                          box: "1",
                        },
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
                "1": { type: "number", value: 42 },
              },
            }),
          ],
        },
        expected: { value: 42, errors: [] },
      });

      const workbook1 = computeWorkbook(
        specificationRegistry1,
        instanceRegistry1,
        filingStatus1,
        {},
      );

      const originalBox = workbook1[TEST_INSTANCE_ID][BOX_UNDER_TEST_ID];
      expect(originalBox).toEqual(expected1);

      const {
        specificationRegistry: specificationRegistry2,
        instanceRegistry: instanceRegistry2,
        filingStatus: filingStatus2,
        expected: expected2,
      } = makeTestData({
        specificationRegistry: specificationRegistry1,
        instanceRegistry: {
          [TEST_CLASS]: [
            makeInstanceFixture({
              id: TEST_INSTANCE_ID,
              class: TEST_CLASS,
              inputs: {
                "1": { type: "number", value: -42 },
              },
            }),
          ],
        },
        expected: { value: 42, errors: [] },
      });

      const workbook2 = computeWorkbook(
        specificationRegistry2,
        instanceRegistry2,
        filingStatus2,
        workbook1,
      );

      const resultBox = workbook2[TEST_INSTANCE_ID][BOX_UNDER_TEST_ID];
      expect(resultBox).toEqual(expected2);
      expect(resultBox).toBe(originalBox);
    });

    it("creates new box reference when resolved value changes", () => {
      const originalBox: ResolvedBox = { value: 42, errors: [] };
      const originalWorkbook: Workbook = {
        [TEST_INSTANCE_ID]: { [BOX_UNDER_TEST_ID]: originalBox },
      };
      const {
        specificationRegistry,
        instanceRegistry,
        filingStatus,
        expected,
      } = makeTestData({
        provider: { type: "number_input" },
        instanceRegistry: {
          [TEST_CLASS]: [
            makeInstanceFixture({
              id: TEST_INSTANCE_ID,
              class: TEST_CLASS,
              inputs: {
                [BOX_UNDER_TEST_ID]: { type: "number", value: 43 },
              },
            }),
          ],
        },
        expected: { value: 43, errors: [] },
      });

      const newWorkbook = computeWorkbook(
        specificationRegistry,
        instanceRegistry,
        filingStatus,
        originalWorkbook,
      );

      const resultBox = newWorkbook[TEST_INSTANCE_ID][BOX_UNDER_TEST_ID];
      expect(resultBox).toEqual(expected);
      expect(resultBox).not.toBe(originalBox);
    });

    it("creates new box reference when errors change even if value is unchanged", () => {
      const originalBox: ResolvedBox = { value: 0, errors: [] };
      const originalWorkbook: Workbook = {
        [TEST_INSTANCE_ID]: { [BOX_UNDER_TEST_ID]: originalBox },
      };
      const {
        specificationRegistry,
        instanceRegistry,
        filingStatus,
        expected,
      } = makeTestData({
        provider: {
          type: "quotient",
          dividend: { type: "number_constant", value: 0 },
          divisor: { type: "number_constant", value: 0 },
        },
        expected: { value: 0, errors: [{ type: "divide_by_zero" }] },
      });

      const newWorkbook = computeWorkbook(
        specificationRegistry,
        instanceRegistry,
        filingStatus,
        originalWorkbook,
      );

      const resultBox = newWorkbook[TEST_INSTANCE_ID][BOX_UNDER_TEST_ID];
      expect(resultBox).toEqual(expected);
      expect(resultBox).not.toBe(originalBox);
    });

    it("preserves form instance record reference when none of its boxes change", () => {
      const originalWorkbook: Workbook = {
        "1040-1": {
          "1": { value: 10, errors: [] },
        },
        [TEST_INSTANCE_ID]: {
          "1": { value: 10, errors: [] },
          "2": { value: 0, errors: [{ type: "divide_by_zero" }] },
        },
      };
      const specificationRegistry = makeRegistryFixture({
        f1040: makeSpecificationFixture({
          class: "f1040",
          sections: [
            makeSectionFixture({
              lines: [
                makeLineFixture({
                  box: makeBoxFixture({
                    identifier: "1",
                    value: { type: "number_input" },
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
                    identifier: "1",
                    value: {
                      type: "minimum",
                      values: [
                        { type: "box_reference", form: "f1040", box: "1" },
                        { type: "number_constant", value: 10 },
                      ],
                    },
                  }),
                }),
                makeLineFixture({
                  box: makeBoxFixture({
                    identifier: "2",
                    value: {
                      type: "quotient",
                      dividend: { type: "box_reference", box: "1" },
                      divisor: { type: "number_constant", value: 0 },
                    },
                  }),
                }),
              ],
            }),
          ],
        }),
      });
      const instanceRegistry: InstanceRegistry = {
        f1040: [
          makeInstanceFixture({
            id: "1040-1",
            class: "f1040",
            inputs: {
              "1": { type: "number", value: 20 },
            },
          }),
        ],
        [TEST_CLASS]: [
          makeInstanceFixture({
            id: TEST_INSTANCE_ID,
            class: TEST_CLASS,
          }),
        ],
      };

      const newWorkbook = computeWorkbook(
        specificationRegistry,
        instanceRegistry,
        "single",
        originalWorkbook,
      );

      expect(newWorkbook).toEqual({
        "1040-1": {
          "1": { value: 20, errors: [] },
        },
        [TEST_INSTANCE_ID]: {
          "1": { value: 10, errors: [] },
          "2": { value: 0, errors: [{ type: "divide_by_zero" }] },
        },
      });
      expect(newWorkbook[TEST_INSTANCE_ID]).toBe(
        originalWorkbook[TEST_INSTANCE_ID],
      );
    });

    it("creates new form instance record reference when any of its boxes change", () => {
      const originalWorkbook: Workbook = {
        [TEST_INSTANCE_ID]: {
          "1": { value: 20, errors: [] },
          "2": { value: 0, errors: [{ type: "divide_by_zero" }] },
        },
      };
      const specificationRegistry = makeRegistryFixture({
        [TEST_CLASS]: makeSpecificationFixture({
          class: TEST_CLASS,
          sections: [
            makeSectionFixture({
              lines: [
                makeLineFixture({
                  box: makeBoxFixture({
                    identifier: "1",
                    value: { type: "number_input" },
                  }),
                }),
                makeLineFixture({
                  box: makeBoxFixture({
                    identifier: "2",
                    value: {
                      type: "quotient",
                      dividend: { type: "box_reference", box: "1" },
                      divisor: { type: "number_constant", value: 0 },
                    },
                  }),
                }),
              ],
            }),
          ],
        }),
      });
      const instanceRegistry: InstanceRegistry = {
        [TEST_CLASS]: [
          makeInstanceFixture({
            id: TEST_INSTANCE_ID,
            class: TEST_CLASS,
            inputs: {
              "1": { type: "number", value: 21 },
            },
          }),
        ],
      };

      const newWorkbook = computeWorkbook(
        specificationRegistry,
        instanceRegistry,
        "single",
        originalWorkbook,
      );

      expect(newWorkbook).toEqual({
        [TEST_INSTANCE_ID]: {
          "1": { value: 21, errors: [] },
          "2": { value: 0, errors: [{ type: "divide_by_zero" }] },
        },
      });
      expect(newWorkbook[TEST_INSTANCE_ID]).not.toBe(
        originalWorkbook[TEST_INSTANCE_ID],
      );
    });

    it("excludes entries for instances no longer in the registry but preserves missing boxes", () => {
      const originalWorkbook: Workbook = {
        "1040-1": {
          "1": { value: 10, errors: [] },
        },
        [TEST_INSTANCE_ID]: {
          "1": { value: 10, errors: [] },
          "2": { value: 0, errors: [{ type: "divide_by_zero" }] },
        },
      };
      const specificationRegistry = makeRegistryFixture({
        [TEST_CLASS]: makeSpecificationFixture({
          class: TEST_CLASS,
          sections: [
            makeSectionFixture({
              lines: [
                makeLineFixture({
                  box: makeBoxFixture({
                    identifier: "1",
                    value: { type: "number_input" },
                  }),
                }),
              ],
            }),
          ],
        }),
      });
      const instanceRegistry: InstanceRegistry = {
        [TEST_CLASS]: [
          makeInstanceFixture({
            id: TEST_INSTANCE_ID,
            class: TEST_CLASS,
            inputs: {
              "1": { type: "number", value: 20 },
            },
          }),
        ],
      };

      const newWorkbook = computeWorkbook(
        specificationRegistry,
        instanceRegistry,
        "single",
        originalWorkbook,
      );

      expect(newWorkbook).toEqual({
        [TEST_INSTANCE_ID]: {
          "1": { value: 20, errors: [] },
          "2": { value: 0, errors: [{ type: "divide_by_zero" }] },
        },
      });
      expect(newWorkbook["1040-1"]).toBeUndefined();
      expect(newWorkbook[TEST_INSTANCE_ID]["2"]).toBe(
        originalWorkbook[TEST_INSTANCE_ID]["2"],
      );
    });

    it("does not mutate the old workbook or its nested records", () => {
      const originalBox: ResolvedBox = { value: 42, errors: [] };
      const originalRecord: Workbook[FormInstanceId] = {
        [BOX_UNDER_TEST_ID]: originalBox,
      };
      const originalWorkbook: Workbook = {
        [TEST_INSTANCE_ID]: originalRecord,
      };
      Object.freeze(originalBox);
      Object.freeze(originalRecord);
      Object.freeze(originalWorkbook);

      const {
        specificationRegistry,
        instanceRegistry,
        filingStatus,
        expected,
      } = makeTestData({
        provider: { type: "number_input" },
        instanceRegistry: {
          [TEST_CLASS]: [
            makeInstanceFixture({
              id: TEST_INSTANCE_ID,
              class: TEST_CLASS,
              inputs: {
                [BOX_UNDER_TEST_ID]: { type: "number", value: 43 },
              },
            }),
          ],
        },
        expected: { value: 43, errors: [] },
      });

      const newWorkbook = computeWorkbook(
        specificationRegistry,
        instanceRegistry,
        filingStatus,
        originalWorkbook,
      );

      expect(newWorkbook[TEST_INSTANCE_ID][BOX_UNDER_TEST_ID]).toEqual(
        expected,
      );
      expect(originalBox).toEqual({ value: 42, errors: [] });
      expect(originalRecord).toEqual({
        [BOX_UNDER_TEST_ID]: { value: 42, errors: [] },
      });
      expect(originalRecord[BOX_UNDER_TEST_ID]).toBe(originalBox);
      expect(originalWorkbook).toEqual({
        [TEST_INSTANCE_ID]: {
          [BOX_UNDER_TEST_ID]: { value: 42, errors: [] },
        },
      });
      expect(originalWorkbook[TEST_INSTANCE_ID]).toBe(originalRecord);
    });
  });
});
