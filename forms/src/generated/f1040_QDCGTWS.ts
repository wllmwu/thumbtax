import type { FormSpecification } from "../types/formSpecification";

export const f1040_QDCGTWS: FormSpecification = {
  class: "f1040_QDCGTWS",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-1040",
  category: "taxes",
  maxInstances: 1,
  title: "Qualified Dividends and Capital Gain Tax Worksheet",
  subtitle: "Line 16",
  sections: [
    {
      lines: [
        {
          index: "1",
          instructions:
            "Enter the amount from Form 1040 or 1040-SR, line 15. However, if you are filing Form 2555 (relating to foreign earned income), enter the amount from line 3 of the Foreign Earned Income Tax Worksheet",
          box: {
            identifier: "1",
            value: {
              type: "override_number_input",
              computedValue: {
                type: "box_reference",
                box: "15",
                form: "f1040",
              },
            },
          },
        },
        {
          index: "2",
          instructions: "Enter the amount from Form 1040 or 1040-SR, line 3a",
          box: {
            identifier: "2",
            value: { type: "box_reference", box: "3a", form: "f1040" },
          },
        },
        {
          index: "3",
          instructions: [
            {
              $$mdtype: "Tag",
              name: "p",
              attributes: {},
              children: ["Are you filing Schedule D?"],
            },
            {
              $$mdtype: "Tag",
              name: "ul",
              attributes: {},
              children: [
                {
                  $$mdtype: "Tag",
                  name: "li",
                  attributes: {},
                  children: [
                    "Yes. Enter the smaller of line 15 or line 16 of Schedule D. If either line 15 or line 16 is blank or a loss, enter -0-.",
                  ],
                },
                {
                  $$mdtype: "Tag",
                  name: "li",
                  attributes: {},
                  children: [
                    "No. Enter the amount from Form 1040 or 1040-SR, line 7a.",
                  ],
                },
              ],
            },
          ],
          box: {
            identifier: "3",
            value: {
              type: "conditional",
              condition: { type: "form_instance_count", form: "f1040sD" },
              trueValue: {
                type: "non_negative_clamp",
                value: {
                  type: "minimum",
                  values: [
                    { type: "box_reference", box: "15", form: "f1040sD" },
                    { type: "box_reference", box: "16", form: "f1040sD" },
                  ],
                },
              },
              falseValue: { type: "box_reference", box: "7a", form: "f1040" },
            },
          },
        },
        {
          index: "4",
          instructions: "Add lines 2 and 3",
          box: {
            identifier: "4",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "2" },
                { type: "box_reference", box: "3" },
              ],
            },
          },
        },
        {
          index: "5",
          instructions:
            "Subtract line 4 from line 1. If zero or less, enter -0-",
          box: {
            identifier: "5",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "1" },
                subtrahend: { type: "box_reference", box: "4" },
              },
            },
          },
        },
        {
          index: "6",
          instructions: [
            {
              $$mdtype: "Tag",
              name: "p",
              attributes: {},
              children: ["Enter:"],
            },
            {
              $$mdtype: "Tag",
              name: "ul",
              attributes: {},
              children: [
                {
                  $$mdtype: "Tag",
                  name: "li",
                  attributes: {},
                  children: ["$48,350 if single or married filing separately,"],
                },
                {
                  $$mdtype: "Tag",
                  name: "li",
                  attributes: {},
                  children: [
                    "$96,700 if married filing jointly or qualifying surviving spouse,",
                  ],
                },
                {
                  $$mdtype: "Tag",
                  name: "li",
                  attributes: {},
                  children: ["$64,750 if head of household."],
                },
              ],
            },
          ],
          box: {
            identifier: "6",
            value: {
              type: "filing_status_map",
              values: {
                head_of_household: { type: "number_constant", value: 64750 },
                married_filing_jointly: {
                  type: "number_constant",
                  value: 96700,
                },
                married_filing_separately: {
                  type: "number_constant",
                  value: 48350,
                },
                qualifying_surviving_spouse: {
                  type: "number_constant",
                  value: 96700,
                },
                single: { type: "number_constant", value: 48350 },
              },
            },
          },
        },
        {
          index: "7",
          instructions: "Enter the smaller of line 1 or line 6",
          box: {
            identifier: "7",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "1" },
                { type: "box_reference", box: "6" },
              ],
            },
          },
        },
        {
          index: "8",
          instructions: "Enter the smaller of line 5 or line 7",
          box: {
            identifier: "8",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "5" },
                { type: "box_reference", box: "7" },
              ],
            },
          },
        },
        {
          index: "9",
          instructions:
            "Subtract line 8 from line 7. This amount is taxed at 0%",
          box: {
            identifier: "9",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "7" },
              subtrahend: { type: "box_reference", box: "8" },
            },
          },
        },
        {
          index: "10",
          instructions: "Enter the smaller of line 1 or line 4",
          box: {
            identifier: "10",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "1" },
                { type: "box_reference", box: "4" },
              ],
            },
          },
        },
        {
          index: "11",
          instructions: "Enter the amount from line 9",
          box: { identifier: "11", value: { type: "box_reference", box: "9" } },
        },
        {
          index: "12",
          instructions: "Subtract line 11 from line 10",
          box: {
            identifier: "12",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "10" },
              subtrahend: { type: "box_reference", box: "11" },
            },
          },
        },
        {
          index: "13",
          instructions: [
            {
              $$mdtype: "Tag",
              name: "p",
              attributes: {},
              children: ["Enter:"],
            },
            {
              $$mdtype: "Tag",
              name: "ul",
              attributes: {},
              children: [
                {
                  $$mdtype: "Tag",
                  name: "li",
                  attributes: {},
                  children: ["$533,400 if single,"],
                },
                {
                  $$mdtype: "Tag",
                  name: "li",
                  attributes: {},
                  children: ["$300,000 if married filing separately,"],
                },
                {
                  $$mdtype: "Tag",
                  name: "li",
                  attributes: {},
                  children: [
                    "$600,050 if married filing jointly or qualifying surviving spouse,",
                  ],
                },
                {
                  $$mdtype: "Tag",
                  name: "li",
                  attributes: {},
                  children: ["$566,700 if head of household."],
                },
              ],
            },
          ],
          box: {
            identifier: "13",
            value: {
              type: "filing_status_map",
              values: {
                head_of_household: { type: "number_constant", value: 566700 },
                married_filing_jointly: {
                  type: "number_constant",
                  value: 600050,
                },
                married_filing_separately: {
                  type: "number_constant",
                  value: 300000,
                },
                qualifying_surviving_spouse: {
                  type: "number_constant",
                  value: 600050,
                },
                single: { type: "number_constant", value: 533400 },
              },
            },
          },
        },
        {
          index: "14",
          instructions: "Enter the smaller of line 1 or line 13",
          box: {
            identifier: "14",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "1" },
                { type: "box_reference", box: "13" },
              ],
            },
          },
        },
        {
          index: "15",
          instructions: "Add lines 5 and 9",
          box: {
            identifier: "15",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "5" },
                { type: "box_reference", box: "9" },
              ],
            },
          },
        },
        {
          index: "16",
          instructions:
            "Subtract line 15 from line 14. If zero or less, enter -0-",
          box: {
            identifier: "16",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "14" },
                subtrahend: { type: "box_reference", box: "15" },
              },
            },
          },
        },
        {
          index: "17",
          instructions: "Enter the smaller of line 12 or line 16",
          box: {
            identifier: "17",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "12" },
                { type: "box_reference", box: "16" },
              ],
            },
          },
        },
        {
          index: "18",
          instructions: "Multiply line 17 by 15% (0.15)",
          box: {
            identifier: "18",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "17" },
                { type: "number_constant", value: 0.15 },
              ],
            },
          },
        },
        {
          index: "19",
          instructions: "Add lines 9 and 17",
          box: {
            identifier: "19",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "9" },
                { type: "box_reference", box: "17" },
              ],
            },
          },
        },
        {
          index: "20",
          instructions: "Subtract line 19 from line 10",
          box: {
            identifier: "20",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "10" },
              subtrahend: { type: "box_reference", box: "19" },
            },
          },
        },
        {
          index: "21",
          instructions: "Multiply line 20 by 20% (0.20)",
          box: {
            identifier: "21",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "20" },
                { type: "number_constant", value: 0.2 },
              ],
            },
          },
        },
        {
          index: "22",
          instructions:
            "Figure the tax on the amount on line 5. If the amount on line 5 is less than $100,000, use the Tax Table to figure the tax. If the amount on line 5 is $100,000 or more, use the Tax Computation Worksheet",
          box: {
            identifier: "22",
            value: {
              type: "filing_status_map",
              values: {
                head_of_household: {
                  type: "piecewise_function",
                  input: { type: "box_reference", box: "5" },
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
                            { type: "box_reference", box: "5" },
                            { type: "number_constant", value: 0.22 },
                          ],
                        },
                        subtrahend: { type: "number_constant", value: 6825 },
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
                            { type: "box_reference", box: "5" },
                            { type: "number_constant", value: 0.24 },
                          ],
                        },
                        subtrahend: { type: "number_constant", value: 8892 },
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
                            { type: "box_reference", box: "5" },
                            { type: "number_constant", value: 0.32 },
                          ],
                        },
                        subtrahend: { type: "number_constant", value: 24676 },
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
                            { type: "box_reference", box: "5" },
                            { type: "number_constant", value: 0.35 },
                          ],
                        },
                        subtrahend: { type: "number_constant", value: 32191 },
                      },
                    },
                  ],
                  lastOutput: {
                    type: "difference",
                    minuend: {
                      type: "product",
                      values: [
                        { type: "box_reference", box: "5" },
                        { type: "number_constant", value: 0.37 },
                      ],
                    },
                    subtrahend: { type: "number_constant", value: 44718 },
                  },
                },
                married_filing_separately: {
                  type: "piecewise_function",
                  input: { type: "box_reference", box: "5" },
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
                            { type: "box_reference", box: "5" },
                            { type: "number_constant", value: 0.22 },
                          ],
                        },
                        subtrahend: { type: "number_constant", value: 5086 },
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
                            { type: "box_reference", box: "5" },
                            { type: "number_constant", value: 0.24 },
                          ],
                        },
                        subtrahend: { type: "number_constant", value: 7153 },
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
                            { type: "box_reference", box: "5" },
                            { type: "number_constant", value: 0.32 },
                          ],
                        },
                        subtrahend: { type: "number_constant", value: 22937 },
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
                            { type: "box_reference", box: "5" },
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
                        { type: "box_reference", box: "5" },
                        { type: "number_constant", value: 0.37 },
                      ],
                    },
                    subtrahend: { type: "number_constant", value: 37968.75 },
                  },
                },
                single: {
                  type: "piecewise_function",
                  input: { type: "box_reference", box: "5" },
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
                            { type: "box_reference", box: "5" },
                            { type: "number_constant", value: 0.22 },
                          ],
                        },
                        subtrahend: { type: "number_constant", value: 5086 },
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
                            { type: "box_reference", box: "5" },
                            { type: "number_constant", value: 0.24 },
                          ],
                        },
                        subtrahend: { type: "number_constant", value: 7153 },
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
                            { type: "box_reference", box: "5" },
                            { type: "number_constant", value: 0.32 },
                          ],
                        },
                        subtrahend: { type: "number_constant", value: 22937 },
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
                            { type: "box_reference", box: "5" },
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
                        { type: "box_reference", box: "5" },
                        { type: "number_constant", value: 0.37 },
                      ],
                    },
                    subtrahend: { type: "number_constant", value: 42979.75 },
                  },
                },
              },
              default: {
                type: "piecewise_function",
                input: { type: "box_reference", box: "5" },
                pieces: [
                  {
                    inputUpperBound: { type: "number_constant", value: 206700 },
                    output: {
                      type: "difference",
                      minuend: {
                        type: "product",
                        values: [
                          { type: "box_reference", box: "5" },
                          { type: "number_constant", value: 0.22 },
                        ],
                      },
                      subtrahend: { type: "number_constant", value: 10172 },
                    },
                  },
                  {
                    inputUpperBound: { type: "number_constant", value: 394600 },
                    output: {
                      type: "difference",
                      minuend: {
                        type: "product",
                        values: [
                          { type: "box_reference", box: "5" },
                          { type: "number_constant", value: 0.24 },
                        ],
                      },
                      subtrahend: { type: "number_constant", value: 14306 },
                    },
                  },
                  {
                    inputUpperBound: { type: "number_constant", value: 501050 },
                    output: {
                      type: "difference",
                      minuend: {
                        type: "product",
                        values: [
                          { type: "box_reference", box: "5" },
                          { type: "number_constant", value: 0.32 },
                        ],
                      },
                      subtrahend: { type: "number_constant", value: 45874 },
                    },
                  },
                  {
                    inputUpperBound: { type: "number_constant", value: 751600 },
                    output: {
                      type: "difference",
                      minuend: {
                        type: "product",
                        values: [
                          { type: "box_reference", box: "5" },
                          { type: "number_constant", value: 0.35 },
                        ],
                      },
                      subtrahend: { type: "number_constant", value: 60905.5 },
                    },
                  },
                ],
                lastOutput: {
                  type: "difference",
                  minuend: {
                    type: "product",
                    values: [
                      { type: "box_reference", box: "5" },
                      { type: "number_constant", value: 0.37 },
                    ],
                  },
                  subtrahend: { type: "number_constant", value: 75937.5 },
                },
              },
            },
          },
        },
        {
          index: "23",
          instructions: "Add lines 18, 21, and 22",
          box: {
            identifier: "23",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "18" },
                { type: "box_reference", box: "21" },
                { type: "box_reference", box: "22" },
              ],
            },
          },
        },
        {
          index: "24",
          instructions:
            "Figure the tax on the amount on line 1. If the amount on line 1 is less than $100,000, use the Tax Table to figure the tax. If the amount on line 1 is $100,000 or more, use the Tax Computation Worksheet",
          box: {
            identifier: "24",
            value: {
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
                        subtrahend: { type: "number_constant", value: 6825 },
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
                        subtrahend: { type: "number_constant", value: 8892 },
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
                        subtrahend: { type: "number_constant", value: 24676 },
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
                        subtrahend: { type: "number_constant", value: 32191 },
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
                    subtrahend: { type: "number_constant", value: 44718 },
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
                        subtrahend: { type: "number_constant", value: 5086 },
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
                        subtrahend: { type: "number_constant", value: 7153 },
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
                        subtrahend: { type: "number_constant", value: 22937 },
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
                    subtrahend: { type: "number_constant", value: 37968.75 },
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
                        subtrahend: { type: "number_constant", value: 5086 },
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
                        subtrahend: { type: "number_constant", value: 7153 },
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
                        subtrahend: { type: "number_constant", value: 22937 },
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
                    subtrahend: { type: "number_constant", value: 42979.75 },
                  },
                },
              },
              default: {
                type: "piecewise_function",
                input: { type: "box_reference", box: "1" },
                pieces: [
                  {
                    inputUpperBound: { type: "number_constant", value: 206700 },
                    output: {
                      type: "difference",
                      minuend: {
                        type: "product",
                        values: [
                          { type: "box_reference", box: "1" },
                          { type: "number_constant", value: 0.22 },
                        ],
                      },
                      subtrahend: { type: "number_constant", value: 10172 },
                    },
                  },
                  {
                    inputUpperBound: { type: "number_constant", value: 394600 },
                    output: {
                      type: "difference",
                      minuend: {
                        type: "product",
                        values: [
                          { type: "box_reference", box: "1" },
                          { type: "number_constant", value: 0.24 },
                        ],
                      },
                      subtrahend: { type: "number_constant", value: 14306 },
                    },
                  },
                  {
                    inputUpperBound: { type: "number_constant", value: 501050 },
                    output: {
                      type: "difference",
                      minuend: {
                        type: "product",
                        values: [
                          { type: "box_reference", box: "1" },
                          { type: "number_constant", value: 0.32 },
                        ],
                      },
                      subtrahend: { type: "number_constant", value: 45874 },
                    },
                  },
                  {
                    inputUpperBound: { type: "number_constant", value: 751600 },
                    output: {
                      type: "difference",
                      minuend: {
                        type: "product",
                        values: [
                          { type: "box_reference", box: "1" },
                          { type: "number_constant", value: 0.35 },
                        ],
                      },
                      subtrahend: { type: "number_constant", value: 60905.5 },
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
                  subtrahend: { type: "number_constant", value: 75937.5 },
                },
              },
            },
          },
        },
        {
          index: "25",
          instructions: [
            {
              $$mdtype: "Tag",
              name: "strong",
              attributes: {},
              children: ["Tax on all taxable income."],
            },
            " Enter the smaller of line 23 or line 24. Also include this amount on the entry space on Form 1040 or 1040-SR, line 16. If you are filing Form 2555, don't enter this amount on the entry space on Form 1040 or 1040-SR, line 16. Instead, enter it on line 4 of the Foreign Earned Income Tax Worksheet",
          ],
          box: {
            identifier: "25",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "23" },
                { type: "box_reference", box: "24" },
              ],
            },
          },
        },
      ],
    },
  ],
};
