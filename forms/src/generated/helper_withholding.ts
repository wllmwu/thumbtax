import type { FormSpecification } from "../types/formSpecification";

export const helper_withholding: FormSpecification = {
  class: "helper_withholding",
  irsPageUrl: "",
  category: "income",
  maxInstances: null,
  title: "My federal withholding",
  subtitle: "Helper form: My federal withholding",
  instructions: {
    $$mdtype: "Tag",
    name: "p",
    attributes: {},
    children: [
      'Thumbtax uses this "helper" form to model a part of your federal income tax withholding.',
      " ",
      "This isn't a real tax form.",
      " ",
      "You can modify these values directly or use the wizard again to replace them.",
    ],
  },
  sections: [
    {
      lines: [
        {
          index: "1",
          instructions: "Gross amount",
          box: {
            identifier: "1",
            value: {
              type: "select_instance_boxes_input",
              options: [{ form: "helper_income", box: "4" }],
            },
          },
        },
        {
          index: "2a",
          instructions: "Federal income type",
          box: {
            identifier: "2a",
            value: {
              type: "select_value_input",
              options: [
                {
                  key: "regular",
                  label: "Regular income",
                  value: {
                    type: "quotient",
                    dividend: {
                      type: "filing_status_map",
                      values: {
                        head_of_household: {
                          type: "piecewise_function",
                          input: { type: "box_reference", box: "1" },
                          pieces: [
                            {
                              inputUpperBound: {
                                type: "number_constant",
                                value: 103350,
                              },
                              output: {
                                type: "difference",
                                minuend: {
                                  type: "product",
                                  values: [
                                    { type: "box_reference", box: "1" },
                                    { type: "number_constant", value: 0.22 },
                                  ],
                                },
                                subtrahend: {
                                  type: "number_constant",
                                  value: 6825,
                                },
                              },
                            },
                            {
                              inputUpperBound: {
                                type: "number_constant",
                                value: 197300,
                              },
                              output: {
                                type: "difference",
                                minuend: {
                                  type: "product",
                                  values: [
                                    { type: "box_reference", box: "1" },
                                    { type: "number_constant", value: 0.24 },
                                  ],
                                },
                                subtrahend: {
                                  type: "number_constant",
                                  value: 8892,
                                },
                              },
                            },
                            {
                              inputUpperBound: {
                                type: "number_constant",
                                value: 250500,
                              },
                              output: {
                                type: "difference",
                                minuend: {
                                  type: "product",
                                  values: [
                                    { type: "box_reference", box: "1" },
                                    { type: "number_constant", value: 0.32 },
                                  ],
                                },
                                subtrahend: {
                                  type: "number_constant",
                                  value: 24676,
                                },
                              },
                            },
                            {
                              inputUpperBound: {
                                type: "number_constant",
                                value: 626350,
                              },
                              output: {
                                type: "difference",
                                minuend: {
                                  type: "product",
                                  values: [
                                    { type: "box_reference", box: "1" },
                                    { type: "number_constant", value: 0.35 },
                                  ],
                                },
                                subtrahend: {
                                  type: "number_constant",
                                  value: 32191,
                                },
                              },
                            },
                          ],
                          lastOutput: {
                            type: "difference",
                            minuend: {
                              type: "product",
                              values: [
                                { type: "box_reference", box: "1" },
                                { type: "number_constant", value: 0.37 },
                              ],
                            },
                            subtrahend: {
                              type: "number_constant",
                              value: 44718,
                            },
                          },
                        },
                        married_filing_separately: {
                          type: "piecewise_function",
                          input: { type: "box_reference", box: "1" },
                          pieces: [
                            {
                              inputUpperBound: {
                                type: "number_constant",
                                value: 103350,
                              },
                              output: {
                                type: "difference",
                                minuend: {
                                  type: "product",
                                  values: [
                                    { type: "box_reference", box: "1" },
                                    { type: "number_constant", value: 0.22 },
                                  ],
                                },
                                subtrahend: {
                                  type: "number_constant",
                                  value: 5086,
                                },
                              },
                            },
                            {
                              inputUpperBound: {
                                type: "number_constant",
                                value: 197300,
                              },
                              output: {
                                type: "difference",
                                minuend: {
                                  type: "product",
                                  values: [
                                    { type: "box_reference", box: "1" },
                                    { type: "number_constant", value: 0.24 },
                                  ],
                                },
                                subtrahend: {
                                  type: "number_constant",
                                  value: 7153,
                                },
                              },
                            },
                            {
                              inputUpperBound: {
                                type: "number_constant",
                                value: 250525,
                              },
                              output: {
                                type: "difference",
                                minuend: {
                                  type: "product",
                                  values: [
                                    { type: "box_reference", box: "1" },
                                    { type: "number_constant", value: 0.32 },
                                  ],
                                },
                                subtrahend: {
                                  type: "number_constant",
                                  value: 22937,
                                },
                              },
                            },
                            {
                              inputUpperBound: {
                                type: "number_constant",
                                value: 375800,
                              },
                              output: {
                                type: "difference",
                                minuend: {
                                  type: "product",
                                  values: [
                                    { type: "box_reference", box: "1" },
                                    { type: "number_constant", value: 0.35 },
                                  ],
                                },
                                subtrahend: {
                                  type: "number_constant",
                                  value: 30452.75,
                                },
                              },
                            },
                          ],
                          lastOutput: {
                            type: "difference",
                            minuend: {
                              type: "product",
                              values: [
                                { type: "box_reference", box: "1" },
                                { type: "number_constant", value: 0.37 },
                              ],
                            },
                            subtrahend: {
                              type: "number_constant",
                              value: 37968.75,
                            },
                          },
                        },
                        single: {
                          type: "piecewise_function",
                          input: { type: "box_reference", box: "1" },
                          pieces: [
                            {
                              inputUpperBound: {
                                type: "number_constant",
                                value: 103350,
                              },
                              output: {
                                type: "difference",
                                minuend: {
                                  type: "product",
                                  values: [
                                    { type: "box_reference", box: "1" },
                                    { type: "number_constant", value: 0.22 },
                                  ],
                                },
                                subtrahend: {
                                  type: "number_constant",
                                  value: 5086,
                                },
                              },
                            },
                            {
                              inputUpperBound: {
                                type: "number_constant",
                                value: 197300,
                              },
                              output: {
                                type: "difference",
                                minuend: {
                                  type: "product",
                                  values: [
                                    { type: "box_reference", box: "1" },
                                    { type: "number_constant", value: 0.24 },
                                  ],
                                },
                                subtrahend: {
                                  type: "number_constant",
                                  value: 7153,
                                },
                              },
                            },
                            {
                              inputUpperBound: {
                                type: "number_constant",
                                value: 250525,
                              },
                              output: {
                                type: "difference",
                                minuend: {
                                  type: "product",
                                  values: [
                                    { type: "box_reference", box: "1" },
                                    { type: "number_constant", value: 0.32 },
                                  ],
                                },
                                subtrahend: {
                                  type: "number_constant",
                                  value: 22937,
                                },
                              },
                            },
                            {
                              inputUpperBound: {
                                type: "number_constant",
                                value: 626350,
                              },
                              output: {
                                type: "difference",
                                minuend: {
                                  type: "product",
                                  values: [
                                    { type: "box_reference", box: "1" },
                                    { type: "number_constant", value: 0.35 },
                                  ],
                                },
                                subtrahend: {
                                  type: "number_constant",
                                  value: 30452.75,
                                },
                              },
                            },
                          ],
                          lastOutput: {
                            type: "difference",
                            minuend: {
                              type: "product",
                              values: [
                                { type: "box_reference", box: "1" },
                                { type: "number_constant", value: 0.37 },
                              ],
                            },
                            subtrahend: {
                              type: "number_constant",
                              value: 42979.75,
                            },
                          },
                        },
                      },
                      default: {
                        type: "piecewise_function",
                        input: { type: "box_reference", box: "1" },
                        pieces: [
                          {
                            inputUpperBound: {
                              type: "number_constant",
                              value: 206700,
                            },
                            output: {
                              type: "difference",
                              minuend: {
                                type: "product",
                                values: [
                                  { type: "box_reference", box: "1" },
                                  { type: "number_constant", value: 0.22 },
                                ],
                              },
                              subtrahend: {
                                type: "number_constant",
                                value: 10172,
                              },
                            },
                          },
                          {
                            inputUpperBound: {
                              type: "number_constant",
                              value: 394600,
                            },
                            output: {
                              type: "difference",
                              minuend: {
                                type: "product",
                                values: [
                                  { type: "box_reference", box: "1" },
                                  { type: "number_constant", value: 0.24 },
                                ],
                              },
                              subtrahend: {
                                type: "number_constant",
                                value: 14306,
                              },
                            },
                          },
                          {
                            inputUpperBound: {
                              type: "number_constant",
                              value: 501050,
                            },
                            output: {
                              type: "difference",
                              minuend: {
                                type: "product",
                                values: [
                                  { type: "box_reference", box: "1" },
                                  { type: "number_constant", value: 0.32 },
                                ],
                              },
                              subtrahend: {
                                type: "number_constant",
                                value: 45874,
                              },
                            },
                          },
                          {
                            inputUpperBound: {
                              type: "number_constant",
                              value: 751600,
                            },
                            output: {
                              type: "difference",
                              minuend: {
                                type: "product",
                                values: [
                                  { type: "box_reference", box: "1" },
                                  { type: "number_constant", value: 0.35 },
                                ],
                              },
                              subtrahend: {
                                type: "number_constant",
                                value: 60905.5,
                              },
                            },
                          },
                        ],
                        lastOutput: {
                          type: "difference",
                          minuend: {
                            type: "product",
                            values: [
                              { type: "box_reference", box: "1" },
                              { type: "number_constant", value: 0.37 },
                            ],
                          },
                          subtrahend: {
                            type: "number_constant",
                            value: 75937.5,
                          },
                        },
                      },
                    },
                    divisor: { type: "box_reference", box: "1" },
                  },
                },
                {
                  key: "supplemental",
                  label: "Supplemental income",
                  value: { type: "number_constant", value: 0.22 },
                },
                {
                  key: "not_applicable",
                  label: "N/A",
                  value: { type: "number_constant", value: 0 },
                },
              ],
            },
          },
        },
        {
          index: "2b",
          instructions: "Federal income tax withholding rate",
          box: {
            identifier: "2b",
            value: {
              type: "override_number_input",
              computedValue: { type: "box_reference", box: "2a" },
            },
            format: "percentage",
          },
        },
        {
          index: "2c",
          instructions: "Additional federal withholding",
          box: { identifier: "2c", value: { type: "number_input" } },
        },
        {
          index: "2d",
          instructions: "Federal income tax withheld",
          box: {
            identifier: "2d",
            value: {
              type: "sum",
              values: [
                {
                  type: "product",
                  values: [
                    { type: "box_reference", box: "1" },
                    { type: "box_reference", box: "2b" },
                  ],
                },
                { type: "box_reference", box: "2c" },
              ],
            },
          },
        },
        {
          index: "3a",
          instructions: "Social Security tax withholding rate",
          box: {
            identifier: "3a",
            value: {
              type: "override_number_input",
              computedValue: { type: "number_constant", value: 0.062 },
            },
            format: "percentage",
          },
        },
        {
          index: "3b",
          instructions: "Social Security tax withheld",
          box: {
            identifier: "3b",
            value: {
              type: "override_number_input",
              computedValue: {
                type: "product",
                values: [
                  {
                    type: "minimum",
                    values: [
                      { type: "box_reference", box: "1" },
                      { type: "number_constant", value: 184500 },
                    ],
                  },
                  { type: "box_reference", box: "3a" },
                ],
              },
            },
            format: "percentage",
          },
        },
        {
          index: "4a",
          instructions: "Medicare tax withholding rate",
          box: {
            identifier: "4a",
            value: {
              type: "override_number_input",
              computedValue: { type: "number_constant", value: 0.0145 },
            },
            format: "percentage",
          },
        },
        {
          index: "4b",
          instructions: "Medicare tax withheld",
          box: {
            identifier: "4b",
            value: {
              type: "override_number_input",
              computedValue: {
                type: "product",
                values: [
                  { type: "box_reference", box: "1" },
                  { type: "box_reference", box: "4a" },
                ],
              },
            },
            format: "percentage",
          },
        },
        {
          index: "5a",
          instructions: "Additional Medicare tax withholding rate",
          box: {
            identifier: "5a",
            value: {
              type: "override_number_input",
              computedValue: { type: "number_constant", value: 0.009 },
            },
            format: "percentage",
          },
        },
        {
          index: "5b",
          instructions: "Additional Medicare tax withheld",
          box: {
            identifier: "5b",
            value: {
              type: "override_number_input",
              computedValue: {
                type: "product",
                values: [
                  {
                    type: "non_negative_clamp",
                    value: {
                      type: "difference",
                      minuend: { type: "box_reference", box: "1" },
                      subtrahend: { type: "number_constant", value: 200000 },
                    },
                  },
                  { type: "box_reference", box: "5a" },
                ],
              },
            },
            format: "percentage",
          },
        },
      ],
    },
  ],
};
