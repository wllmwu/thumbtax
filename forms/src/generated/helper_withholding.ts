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
              options: [{ form: "helper_income", box: "9" }],
            },
          },
        },
        {
          index: "2",
          instructions: "Federal income type",
          box: {
            identifier: "2",
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
          index: "3",
          instructions: "Federal income tax withholding rate",
          box: {
            identifier: "3",
            value: {
              type: "override_number_input",
              computedValue: { type: "box_reference", box: "2" },
            },
            format: "percentage",
          },
        },
        {
          index: "4",
          instructions: "Additional federal withholding",
          box: { identifier: "4", value: { type: "number_input" } },
        },
        {
          index: "5",
          instructions: "Federal income tax withheld",
          box: {
            identifier: "5",
            value: {
              type: "sum",
              values: [
                {
                  type: "product",
                  values: [
                    { type: "box_reference", box: "1" },
                    { type: "box_reference", box: "3" },
                  ],
                },
                { type: "box_reference", box: "4" },
              ],
            },
          },
        },
        {
          index: "6",
          instructions: "Social Security tax withholding rate",
          box: {
            identifier: "6",
            value: {
              type: "override_number_input",
              computedValue: { type: "number_constant", value: 0.062 },
            },
            format: "percentage",
          },
        },
        {
          index: "7",
          instructions: "Social Security tax withheld",
          box: {
            identifier: "7",
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
                  { type: "box_reference", box: "6" },
                ],
              },
            },
            format: "percentage",
          },
        },
        {
          index: "8",
          instructions: "Medicare tax withholding rate",
          box: {
            identifier: "8",
            value: {
              type: "override_number_input",
              computedValue: { type: "number_constant", value: 0.0145 },
            },
            format: "percentage",
          },
        },
        {
          index: "9",
          instructions: "Medicare tax withheld",
          box: {
            identifier: "9",
            value: {
              type: "override_number_input",
              computedValue: {
                type: "product",
                values: [
                  { type: "box_reference", box: "1" },
                  { type: "box_reference", box: "8" },
                ],
              },
            },
            format: "percentage",
          },
        },
        {
          index: "10",
          instructions: "Additional Medicare tax withholding rate",
          box: {
            identifier: "10",
            value: {
              type: "override_number_input",
              computedValue: { type: "number_constant", value: 0.009 },
            },
            format: "percentage",
          },
        },
        {
          index: "11",
          instructions: "Additional Medicare tax withheld",
          box: {
            identifier: "11",
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
                  { type: "box_reference", box: "10" },
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
