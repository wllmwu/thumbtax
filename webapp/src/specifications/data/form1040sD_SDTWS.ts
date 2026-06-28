import { taxComputation } from "#src/specifications/data/taxComputation";

import type { FormSpecification } from "@thumbtax/forms";

export const Form1040SD_SDTWS: FormSpecification = {
  class: "f1040sD_SDTWS",
  title: "Schedule D Tax Worksheet",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-schedule-d-form-1040",
  category: "taxes",
  maxInstances: 1,
  sections: [
    {
      lines: [
        {
          index: "1",
          description:
            "Enter your taxable income from Form 1040, 1040-SR, or 1040-NR, line 15. (However, if you are filing Form 2555 (relating to foreign earned income), enter instead the amount from line 3 of the Foreign Earned Income Tax Worksheet in the instructions for Form 1040, line 16.)",
          box: {
            identifier: "1",
            value: {
              type: "override_number_input",
              computedValue: {
                type: "box_reference",
                form: "f1040",
                box: "15",
                required: true,
              },
            },
          },
        },
        {
          index: "2",
          description:
            "Enter your qualified dividends from Form 1040, 1040-SR, or 1040-NR, line 3a",
          box: {
            identifier: "2",
            value: {
              type: "box_reference",
              form: "f1040",
              box: "3a",
              required: true,
            },
          },
        },
        {
          index: "3",
          description:
            "Enter the amount from Form 4952 (used to figure investment interest expense deduction), line 4g",
          box: {
            identifier: "3",
            value: { type: "number_input" },
          },
        },
        {
          index: "4",
          description: "Enter the amount from Form 4952, line 4e",
          box: {
            identifier: "4",
            value: { type: "number_input" },
          },
        },
        {
          index: "5",
          description:
            "Subtract line 4 from line 3. If zero or less, enter -0-",
          box: {
            identifier: "5",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "3" },
                subtrahend: { type: "box_reference", box: "4" },
              },
            },
          },
        },
        {
          index: "6",
          description:
            "Subtract line 5 from line 2. If zero or less, enter -0-",
          box: {
            identifier: "6",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "2" },
                subtrahend: { type: "box_reference", box: "5" },
              },
            },
          },
        },
        {
          index: "7",
          description: "Enter the smaller of line 15 or line 16 of Schedule D",
          box: {
            identifier: "7",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", form: "f1040sD", box: "15" },
                { type: "box_reference", form: "f1040sD", box: "16" },
              ],
            },
          },
        },
        {
          index: "8",
          description: "Enter the smaller of line 3 or line 4",
          box: {
            identifier: "8",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "3" },
                { type: "box_reference", box: "4" },
              ],
            },
          },
        },
        {
          index: "9",
          description:
            "Subtract line 8 from line 7. If zero or less, enter -0-",
          box: {
            identifier: "9",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "7" },
                subtrahend: { type: "box_reference", box: "8" },
              },
            },
          },
        },
        {
          index: "10",
          description: "Add lines 6 and 9",
          box: {
            identifier: "10",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "6" },
                { type: "box_reference", box: "9" },
              ],
            },
          },
        },
        {
          index: "11",
          description: "Add lines 18 and 19 of Schedule D",
          box: {
            identifier: "11",
            value: {
              type: "sum",
              values: [
                {
                  type: "box_reference",
                  form: "f1040sD",
                  box: "18",
                  required: true,
                },
                {
                  type: "box_reference",
                  form: "f1040sD",
                  box: "19",
                  required: true,
                },
              ],
            },
          },
        },
        {
          index: "12",
          description: "Enter the smaller of line 9 or line 11",
          box: {
            identifier: "12",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "9" },
                { type: "box_reference", box: "11" },
              ],
            },
          },
        },
        {
          index: "13",
          description: "Subtract line 12 from line 10",
          box: {
            identifier: "13",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "10" },
              subtrahend: { type: "box_reference", box: "12" },
            },
          },
        },
        {
          index: "14",
          description:
            "Subtract line 13 from line 1. If zero or less, enter -0-",
          box: {
            identifier: "14",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "1" },
                subtrahend: { type: "box_reference", box: "13" },
              },
            },
          },
        },
        {
          index: "15",
          description:
            "Enter:\n- $48,350 if single or married filing separately;\n- $96,700 if married filing jointly or qualifying surviving spouse; or\n- $64,750 if head of household.",
          box: {
            identifier: "15",
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
          index: "16",
          description: "Enter the smaller of line 1 or line 15",
          box: {
            identifier: "16",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "1" },
                { type: "box_reference", box: "15" },
              ],
            },
          },
        },
        {
          index: "17",
          description: "Enter the smaller of line 14 or line 16",
          box: {
            identifier: "17",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "14" },
                { type: "box_reference", box: "16" },
              ],
            },
          },
        },
        {
          index: "18",
          description:
            "Subtract line 10 from line 1. If zero or less, enter -0-",
          box: {
            identifier: "18",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "1" },
                subtrahend: { type: "box_reference", box: "10" },
              },
            },
          },
        },
        {
          index: "19",
          description:
            "Enter the smaller of line 1 or:\n- $197,300 if single or married filing separately;\n- $394,600 if married filing jointly or qualifying surviving spouse; or\n- $197,300 if head of household.",
          box: {
            identifier: "19",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "1" },
                {
                  type: "filing_status_map",
                  values: {
                    head_of_household: {
                      type: "number_constant",
                      value: 197300,
                    },
                    married_filing_jointly: {
                      type: "number_constant",
                      value: 394600,
                    },
                    married_filing_separately: {
                      type: "number_constant",
                      value: 197300,
                    },
                    qualifying_surviving_spouse: {
                      type: "number_constant",
                      value: 394600,
                    },
                    single: { type: "number_constant", value: 197300 },
                  },
                },
              ],
            },
          },
        },
        {
          index: "20",
          description: "Enter the smaller of line 14 or line 19",
          box: {
            identifier: "20",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "14" },
                { type: "box_reference", box: "19" },
              ],
            },
          },
        },
        {
          index: "21",
          description: "Enter the larger of line 18 or line 20",
          box: {
            identifier: "21",
            value: {
              type: "maximum",
              values: [
                { type: "box_reference", box: "18" },
                { type: "box_reference", box: "20" },
              ],
            },
          },
        },
        {
          index: "22",
          description:
            "Subtract line 17 from line 16. This amount is taxed at 0%\nIf lines 1 and 16 are the same, skip lines 23 through 43 and go to line 44. Otherwise, go to line 23.",
          box: {
            identifier: "22",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "16" },
              subtrahend: { type: "box_reference", box: "17" },
            },
          },
        },
        {
          index: "23",
          description: "Enter the smaller of line 1 or line 13",
          box: {
            identifier: "23",
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
          index: "24",
          description: "Enter the amount from line 22",
          box: {
            identifier: "24",
            value: { type: "box_reference", box: "22" },
          },
        },
        {
          index: "25",
          description:
            "Subtract line 24 from line 23. If zero or less, enter -0-",
          box: {
            identifier: "25",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "23" },
                subtrahend: { type: "box_reference", box: "24" },
              },
            },
          },
        },
        {
          index: "26",
          description:
            "Enter:\n- $533,400 if single;\n- $300,000 if married filing separately;\n- $600,050 if married filing jointly or qualifying surviving spouse; or\n- $566,700 if head of household.",
          box: {
            identifier: "26",
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
          index: "27",
          description: "Enter the smaller of line 1 or line 26",
          box: {
            identifier: "27",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "1" },
                { type: "box_reference", box: "26" },
              ],
            },
          },
        },
        {
          index: "28",
          description: "Add lines 21 and 22",
          box: {
            identifier: "28",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "21" },
                { type: "box_reference", box: "22" },
              ],
            },
          },
        },
        {
          index: "29",
          description:
            "Subtract line 28 from line 27. If zero or less, enter -0-",
          box: {
            identifier: "29",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "27" },
                subtrahend: { type: "box_reference", box: "28" },
              },
            },
          },
        },
        {
          index: "30",
          description: "Enter the smaller of line 25 or line 29",
          box: {
            identifier: "30",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "25" },
                { type: "box_reference", box: "29" },
              ],
            },
          },
        },
        {
          index: "31",
          description: "Multiply line 30 by 15% (0.15)",
          box: {
            identifier: "31",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "30" },
                { type: "number_constant", value: 0.15 },
              ],
            },
          },
        },
        {
          index: "32",
          description:
            "Add lines 24 and 30\nIf lines 1 and 32 are the same, skip lines 33 through 43 and go to line 44. Otherwise, go to line 33.",
          box: {
            identifier: "32",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "24" },
                { type: "box_reference", box: "30" },
              ],
            },
          },
        },
        {
          index: "33",
          description: "Subtract line 32 from line 23",
          box: {
            identifier: "33",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "23" },
              subtrahend: { type: "box_reference", box: "32" },
            },
          },
        },
        {
          index: "34",
          description:
            "Multiply line 33 by 20% (0.20)\nIf Schedule D, line 19, is zero or blank, skip lines 35 through 40 and go to line 41. Otherwise, go to line 35.",
          box: {
            identifier: "34",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "33" },
                { type: "number_constant", value: 0.2 },
              ],
            },
          },
        },
        {
          index: "35",
          description:
            "Enter the smaller of line 9 above or Schedule D, line 19",
          box: {
            identifier: "35",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "9" },
                { type: "box_reference", form: "f1040sD", box: "19" },
              ],
            },
          },
        },
        {
          index: "36",
          description: "Add lines 10 and 21",
          box: {
            identifier: "36",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "10" },
                { type: "box_reference", box: "21" },
              ],
            },
          },
        },
        {
          index: "37",
          description: "Enter the amount from line 1 above",
          box: {
            identifier: "37",
            value: { type: "box_reference", box: "1" },
          },
        },
        {
          index: "38",
          description:
            "Subtract line 37 from line 36. If zero or less, enter -0-",
          box: {
            identifier: "38",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "36" },
                subtrahend: { type: "box_reference", box: "37" },
              },
            },
          },
        },
        {
          index: "39",
          description:
            "Subtract line 38 from line 35. If zero or less, enter -0-",
          box: {
            identifier: "39",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "35" },
                subtrahend: { type: "box_reference", box: "38" },
              },
            },
          },
        },
        {
          index: "40",
          description:
            "Multiply line 39 by 25% (0.25)\nIf Schedule D, line 18, is zero or blank, skip lines 41 through 43 and go to line 44. Otherwise, go to line 41.",
          box: {
            identifier: "40",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "39" },
                { type: "number_constant", value: 0.25 },
              ],
            },
          },
        },
        {
          index: "41",
          description: "Add lines 21, 22, 30, 33, and 39",
          box: {
            identifier: "41",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "21" },
                { type: "box_reference", box: "22" },
                { type: "box_reference", box: "30" },
                { type: "box_reference", box: "33" },
                { type: "box_reference", box: "39" },
              ],
            },
          },
        },
        {
          index: "42",
          description: "Subtract line 41 from line 1",
          box: {
            identifier: "42",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "1" },
              subtrahend: { type: "box_reference", box: "41" },
            },
          },
        },
        {
          index: "43",
          description: "Multiply line 42 by 28% (0.28)",
          box: {
            identifier: "43",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "42" },
                { type: "number_constant", value: 0.28 },
              ],
            },
          },
        },
        {
          index: "44",
          description:
            "Figure the tax on the amount on line 21. If the amount on line 21 is less than $100,000, use the Tax Table to figure the tax. If the amount on line 21 is $100,000 or more, use the Tax Computation Worksheet",
          box: {
            identifier: "44",
            value: taxComputation({ box: "21" }),
          },
        },
        {
          index: "45",
          description: "Add lines 31, 34, 40, 43, and 44",
          box: {
            identifier: "45",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "31" },
                { type: "box_reference", box: "34" },
                { type: "box_reference", box: "40" },
                { type: "box_reference", box: "43" },
                { type: "box_reference", box: "44" },
              ],
            },
          },
        },
        {
          index: "46",
          description:
            "Figure the tax on the amount on line 1. If the amount on line 1 is less than $100,000, use the Tax Table to figure the tax. If the amount on line 1 is $100,000 or more, use the Tax Computation Worksheet",
          box: {
            identifier: "46",
            value: taxComputation({ box: "1" }),
          },
        },
        {
          index: "47",
          description:
            "**Tax on all taxable income (including capital gains and qualified dividends).** Enter the smaller of line 45 or line 46. Also, include this amount on Form 1040, 1040-SR, or 1040-NR, line 16. (If you are filing Form 2555, don’t enter this amount on Form 1040 or 1040-SR, line 16. Instead, enter it on line 4 of the Foreign Earned Income Tax Worksheet in the Instructions for Form 1040.)",
          box: {
            identifier: "47",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "45" },
                { type: "box_reference", box: "46" },
              ],
            },
          },
        },
      ],
    },
  ],
};
