import type { FormSpecification } from "../types/formSpecification";

export const helper_withholding_federal_regular: FormSpecification = {
  class: "helper_withholding_federal_regular",
  irsPageUrl: "",
  category: "income",
  maxInstances: null,
  title: "My federal income withholding",
  subtitle: "Helper form: Federal income tax withholding",
  instructions: {
    $$mdtype: "Tag",
    name: "p",
    attributes: {},
    children: [
      'Thumbtax uses this "helper" form to model a part of your income tax withholding.',
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
          index: "2",
          instructions: "Amount subject to withholding",
          box: {
            identifier: "2",
            value: {
              type: "override_number_input",
              computedValue: { type: "box_reference", box: "1" },
            },
          },
        },
        {
          index: "3",
          instructions: "Withholding rate",
          box: {
            identifier: "3",
            value: {
              type: "override_number_input",
              computedValue: {
                type: "quotient",
                dividend: {
                  type: "filing_status_map",
                  values: {
                    head_of_household: {
                      type: "piecewise_function",
                      input: { type: "box_reference", box: "2" },
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
                                { type: "box_reference", box: "2" },
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
                                { type: "box_reference", box: "2" },
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
                                { type: "box_reference", box: "2" },
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
                                { type: "box_reference", box: "2" },
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
                            { type: "box_reference", box: "2" },
                            { type: "number_constant", value: 0.37 },
                          ],
                        },
                        subtrahend: { type: "number_constant", value: 44718 },
                      },
                    },
                    married_filing_separately: {
                      type: "piecewise_function",
                      input: { type: "box_reference", box: "2" },
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
                                { type: "box_reference", box: "2" },
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
                                { type: "box_reference", box: "2" },
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
                                { type: "box_reference", box: "2" },
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
                                { type: "box_reference", box: "2" },
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
                            { type: "box_reference", box: "2" },
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
                      input: { type: "box_reference", box: "2" },
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
                                { type: "box_reference", box: "2" },
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
                                { type: "box_reference", box: "2" },
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
                                { type: "box_reference", box: "2" },
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
                                { type: "box_reference", box: "2" },
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
                            { type: "box_reference", box: "2" },
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
                    input: { type: "box_reference", box: "2" },
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
                              { type: "box_reference", box: "2" },
                              { type: "number_constant", value: 0.22 },
                            ],
                          },
                          subtrahend: { type: "number_constant", value: 10172 },
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
                              { type: "box_reference", box: "2" },
                              { type: "number_constant", value: 0.24 },
                            ],
                          },
                          subtrahend: { type: "number_constant", value: 14306 },
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
                              { type: "box_reference", box: "2" },
                              { type: "number_constant", value: 0.32 },
                            ],
                          },
                          subtrahend: { type: "number_constant", value: 45874 },
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
                              { type: "box_reference", box: "2" },
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
                          { type: "box_reference", box: "2" },
                          { type: "number_constant", value: 0.37 },
                        ],
                      },
                      subtrahend: { type: "number_constant", value: 75937.5 },
                    },
                  },
                },
                divisor: { type: "box_reference", box: "2" },
              },
            },
            format: "percentage",
          },
        },
        {
          index: "4",
          instructions: "Federal income tax withheld",
          box: {
            identifier: "4",
            value: {
              type: "override_number_input",
              computedValue: {
                type: "product",
                values: [
                  { type: "box_reference", box: "2" },
                  { type: "box_reference", box: "3" },
                ],
              },
            },
          },
        },
      ],
    },
  ],
};
