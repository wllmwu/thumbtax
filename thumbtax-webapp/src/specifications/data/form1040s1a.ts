import type { FormSpecification } from "#src/specifications/types/formSpecification";

export const Form1040S1A: FormSpecification = {
  class: "f1040s1a",
  title: "Schedule 1-A (Form 1040)",
  subtitle: "Additional Deductions",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-1040",
  category: "taxes",
  maxInstances: 1,
  sections: [
    {
      heading: "Part I. Modified Adjusted Gross Income (MAGI) Amount",
      lines: [
        {
          index: "1",
          description:
            "Enter the amount from Form 1040, 1040-SR, or 1040-NR, line 11b",
          box: {
            identifier: "1",
            value: { type: "box_reference", form: "f1040", box: "11b" },
          },
        },
        {
          index: "2a",
          description: "Enter any income from Puerto Rico that you excluded",
          box: {
            identifier: "2a",
            value: { type: "number_input" },
          },
        },
        {
          index: "2b",
          description: "Enter the amount from Form 2555, line 45",
          box: {
            identifier: "2b",
            value: { type: "number_input" },
          },
        },
        {
          index: "2c",
          description: "Enter the amount from Form 2555, line 50",
          box: {
            identifier: "2c",
            value: { type: "number_input" },
          },
        },
        {
          index: "2d",
          description: "Enter the amount from Form 4563, line 15",
          box: {
            identifier: "2d",
            value: { type: "number_input" },
          },
        },
        {
          index: "2e",
          description: "Add lines 2a, 2b, 2c, and 2d",
          box: {
            identifier: "2e",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "2a" },
                { type: "box_reference", box: "2b" },
                { type: "box_reference", box: "2c" },
                { type: "box_reference", box: "2d" },
              ],
            },
          },
        },
        {
          index: "3",
          description: "Add lines 1 and 2e",
          box: {
            identifier: "3",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "1" },
                { type: "box_reference", box: "2e" },
              ],
            },
          },
        },
      ],
    },
    {
      heading: "Part II. No Tax on Tips",
      lines: [
        {
          index: "4",
          description:
            "Qualified tips received as an employee. If you received tips as an employee with respect to employment with more than one employer, enter -0- on lines 4a and 4b and see the instructions to determine the amount to enter on line 4c. If you received tips as an employee in more than one occupation, see the instructions.",
          box: {
            identifier: "4",
            value: { type: "unused" },
          },
        },
        {
          index: "4a",
          description:
            "Enter qualified tips included on Form W-2, box 7, but see the instructions if Form W-2, box 5 is more than $176,100 or you received tips that are not subject to social security and Medicare taxes",
          box: {
            identifier: "4a",
            value: { type: "number_input" },
          },
        },
        {
          index: "4b",
          description:
            "Qualified tips included on Form 4137, line 1, row A, column (c). If Form 4137 is not filed, enter -0-",
          box: {
            identifier: "4b",
            value: { type: "number_input" },
          },
        },
        {
          index: "4c",
          description:
            "If you only received qualified tips as an employee with respect to employment with one employer, enter the larger of line 4a or line 4b. Otherwise, see the instructions to determine the amount to enter on line 4c. If you received tips as an employee in more than one occupation, see the instructions",
          box: {
            identifier: "4c",
            value: { type: "number_input" },
          },
        },
        {
          index: "5",
          description:
            "Qualified tips received in the course of a trade or business.\nQualified tip amount included in Form 1099-NEC, box 1; Form 1099-MISC, box 3; or Form 1099-K, box 1a. Do not enter more than the net profit from the trade or business. If you received qualified tips in the course of more than one trade or business or in more than one occupation, see instructions",
          box: {
            identifier: "5",
            value: { type: "number_input" },
          },
        },
        {
          index: "6",
          description: "Add lines 4c and 5",
          box: {
            identifier: "6",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "4c" },
                { type: "box_reference", box: "5" },
              ],
            },
          },
        },
        {
          index: "7",
          description: "Enter the smaller of the amount on line 6 or $25,000",
          box: {
            identifier: "7",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "6" },
                { type: "number_constant", value: 25000 },
              ],
            },
          },
        },
        {
          index: "8",
          description: "Enter the amount from line 3",
          box: {
            identifier: "8",
            value: { type: "box_reference", box: "3" },
          },
        },
        {
          index: "9",
          description: "Enter $150,000 ($300,000 if married filing jointly)",
          box: {
            identifier: "9",
            value: {
              type: "filing_status_map",
              values: {
                married_filing_jointly: {
                  type: "number_constant",
                  value: 300000,
                },
              },
              default: { type: "number_constant", value: 150000 },
            },
          },
        },
        {
          index: "10",
          description:
            "Subtract line 9 from line 8. If zero or less, enter the amount from line 7 on line 13",
          box: {
            identifier: "10",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "8" },
              subtrahend: { type: "box_reference", box: "9" },
            },
          },
        },
        {
          index: "11",
          description:
            "Divide line 10 by $1,000. If the resulting number isn't a whole number, decrease the result to the next lower whole number",
          box: {
            identifier: "11",
            value: {
              type: "quotient",
              dividend: { type: "box_reference", box: "10" },
              divisor: { type: "number_constant", value: 1000 },
              round: "down",
            },
          },
        },
        {
          index: "12",
          description: "Multiply line 11 by $100",
          box: {
            identifier: "12",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "11" },
                { type: "number_constant", value: 100 },
              ],
            },
          },
        },
        {
          index: "13",
          description:
            "**Qualified tips deduction.** Subtract line 12 from line 7. If zero or less, enter -0-",
          box: {
            identifier: "13",
            value: {
              type: "conditional",
              condition: {
                type: "comparison",
                value: { type: "box_reference", box: "10" },
                maximum: { type: "number_constant", value: 0 },
              },
              trueValue: { type: "box_reference", box: "7" },
              falseValue: {
                type: "non_negative_clamp",
                value: {
                  type: "difference",
                  minuend: { type: "box_reference", box: "7" },
                  subtrahend: { type: "box_reference", box: "12" },
                },
              },
            },
          },
        },
      ],
    },
    {
      heading: "Part III. No Tax on Overtime",
      lines: [
        {
          index: "14a",
          description:
            "Qualified overtime compensation included in Form W-2, box 1. If you received qualified overtime compensation not reported on Form W-2, box 1, see instructions",
          box: {
            identifier: "14a",
            value: { type: "number_input" },
          },
        },
        {
          index: "14b",
          description:
            "Qualified overtime compensation included in Form 1099-NEC, box 1, or Form 1099-MISC, box 3 (see instructions)",
          box: {
            identifier: "14b",
            value: { type: "number_input" },
          },
        },
        {
          index: "14c",
          description: "Add lines 14a and 14b",
          box: {
            identifier: "14c",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "14a" },
                { type: "box_reference", box: "14b" },
              ],
            },
          },
        },
        {
          index: "15",
          description:
            "Enter the smaller of the amount on line 14c or $12,500 ($25,000 if married filing jointly)",
          box: {
            identifier: "15",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "14c" },
                {
                  type: "filing_status_map",
                  values: {
                    married_filing_jointly: {
                      type: "number_constant",
                      value: 25000,
                    },
                  },
                  default: { type: "number_constant", value: 12500 },
                },
              ],
            },
          },
        },
        {
          index: "16",
          description: "Enter the amount from line 3",
          box: {
            identifier: "16",
            value: { type: "box_reference", box: "3" },
          },
        },
        {
          index: "17",
          description: "Enter $150,000 ($300,000 if married filing jointly)",
          box: {
            identifier: "17",
            value: {
              type: "filing_status_map",
              values: {
                married_filing_jointly: {
                  type: "number_constant",
                  value: 300000,
                },
              },
              default: { type: "number_constant", value: 150000 },
            },
          },
        },
        {
          index: "18",
          description:
            "Subtract line 17 from line 16. If zero or less, enter the amount from line 15 on line 21",
          box: {
            identifier: "18",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "16" },
              subtrahend: { type: "box_reference", box: "17" },
            },
          },
        },
        {
          index: "19",
          description:
            "Divide line 18 by $1,000. If the resulting number isn't a whole number, decrease the result to the next lower whole number",
          box: {
            identifier: "19",
            value: {
              type: "quotient",
              dividend: { type: "box_reference", box: "18" },
              divisor: { type: "number_constant", value: 1000 },
              round: "down",
            },
          },
        },
        {
          index: "20",
          description: "Multiply line 19 by $100",
          box: {
            identifier: "20",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "19" },
                { type: "number_constant", value: 100 },
              ],
            },
          },
        },
        {
          index: "21",
          description:
            "**Qualified overtime compensation deduction.** Subtract line 20 from line 15. If zero or less, enter -0-",
          box: {
            identifier: "21",
            value: {
              type: "conditional",
              condition: {
                type: "comparison",
                value: { type: "box_reference", box: "18" },
                maximum: { type: "number_constant", value: 0 },
              },
              trueValue: { type: "box_reference", box: "15" },
              falseValue: {
                type: "non_negative_clamp",
                value: {
                  type: "difference",
                  minuend: { type: "box_reference", box: "15" },
                  subtrahend: { type: "box_reference", box: "20" },
                },
              },
            },
          },
        },
      ],
    },
    {
      heading: "Part IV. No Tax on Car Loan Interest",
      columns: [
        { index: "(i)", description: "Vehicle identification number (VIN)" },
        {
          index: "(ii)",
          description:
            "Interest for this loan deducted on Schedule C, Schedule E, or Schedule F",
        },
        {
          index: "(iii)",
          description: "Interest for this loan paid in 2025 less column (ii)",
        },
      ],
      lines: [
        {
          index: "22",
          description:
            "Applicable passenger vehicle (see instructions). If more than two VINs, see instructions.",
          boxes: [
            {
              identifier: "22(i)",
              value: { type: "unused" },
              column: "(i)",
            },
            {
              identifier: "22(ii)",
              value: { type: "unused" },
              column: "(ii)",
            },
            {
              identifier: "22(iii)",
              value: { type: "unused" },
              column: "(iii)",
            },
          ],
        },
        {
          index: "22a",
          description: "Applicable passenger vehicle",
          boxes: [
            {
              identifier: "22a(i)",
              value: { type: "unused" },
              column: "(i)",
            },
            {
              identifier: "22a(ii)",
              value: { type: "number_input" },
              column: "(ii)",
            },
            {
              identifier: "22a(iii)",
              value: { type: "number_input" },
              column: "(iii)",
            },
          ],
        },
        {
          index: "22b",
          description: "Applicable passenger vehicle",
          boxes: [
            {
              identifier: "22b(i)",
              value: { type: "unused" },
              column: "(i)",
            },
            {
              identifier: "22b(ii)",
              value: { type: "number_input" },
              column: "(ii)",
            },
            {
              identifier: "22b(iii)",
              value: { type: "number_input" },
              column: "(iii)",
            },
          ],
        },
      ],
    },
    {
      lines: [
        {
          index: "23",
          description: "Add lines 22a and 22b, column (iii)",
          box: {
            identifier: "23",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "22a(iii)" },
                { type: "box_reference", box: "22b(iii)" },
              ],
            },
          },
        },
        {
          index: "24",
          description: "Enter the smaller of the amount on line 23 or $10,000",
          box: {
            identifier: "24",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "23" },
                { type: "number_constant", value: 10000 },
              ],
            },
          },
        },
        {
          index: "25",
          description: "Enter the amount from line 3",
          box: {
            identifier: "25",
            value: { type: "box_reference", box: "3" },
          },
        },
        {
          index: "26",
          description: "Enter $100,000 ($200,000 if married filing jointly)",
          box: {
            identifier: "26",
            value: {
              type: "filing_status_map",
              values: {
                married_filing_jointly: {
                  type: "number_constant",
                  value: 200000,
                },
              },
              default: { type: "number_constant", value: 100000 },
            },
          },
        },
        {
          index: "27",
          description:
            "Subtract line 26 from line 25. If zero or less, enter the amount from line 24 on line 30",
          box: {
            identifier: "27",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "25" },
              subtrahend: { type: "box_reference", box: "26" },
            },
          },
        },
        {
          index: "28",
          description:
            "Divide line 27 by $1,000. If the resulting number isn't a whole number, increase the result to the next higher whole number",
          box: {
            identifier: "28",
            value: {
              type: "quotient",
              dividend: { type: "box_reference", box: "27" },
              divisor: { type: "number_constant", value: 1000 },
              round: "up",
            },
          },
        },
        {
          index: "29",
          description: "Multiply line 28 by $200",
          box: {
            identifier: "29",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "28" },
                { type: "number_constant", value: 200 },
              ],
            },
          },
        },
        {
          index: "30",
          description:
            "**Qualified passenger vehicle loan interest deduction.** Subtract line 29 from line 24. If zero or less, enter -0-",
          box: {
            identifier: "30",
            value: {
              type: "conditional",
              condition: {
                type: "comparison",
                value: { type: "box_reference", box: "27" },
                maximum: { type: "number_constant", value: 0 },
              },
              trueValue: { type: "box_reference", box: "24" },
              falseValue: {
                type: "non_negative_clamp",
                value: {
                  type: "difference",
                  minuend: { type: "box_reference", box: "24" },
                  subtrahend: { type: "box_reference", box: "29" },
                },
              },
            },
          },
        },
      ],
    },
    {
      heading: "Part V. Enhanced Deduction for Seniors",
      lines: [
        {
          index: "31",
          description: "Enter the amount from line 3",
          box: {
            identifier: "31",
            value: { type: "box_reference", box: "3" },
          },
        },
        {
          index: "32",
          description: "Enter $75,000 ($150,000 if married filing jointly)",
          box: {
            identifier: "32",
            value: {
              type: "filing_status_map",
              values: {
                married_filing_jointly: {
                  type: "number_constant",
                  value: 150000,
                },
              },
              default: { type: "number_constant", value: 75000 },
            },
          },
        },
        {
          index: "33",
          description:
            "Subtract line 32 from line 31. If zero or less, enter $6,000 on line 35",
          box: {
            identifier: "33",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "31" },
              subtrahend: { type: "box_reference", box: "32" },
            },
          },
        },
        {
          index: "34",
          description: "Multiply line 33 by 6% (0.06)",
          box: {
            identifier: "34",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "33" },
                { type: "number_constant", value: 0.06 },
              ],
            },
          },
        },
        {
          index: "35",
          description:
            "Subtract line 34 from $6,000. If zero or less, enter -0-",
          box: {
            identifier: "35",
            value: {
              type: "conditional",
              condition: {
                type: "comparison",
                value: { type: "box_reference", box: "33" },
                maximum: { type: "number_constant", value: 0 },
              },
              trueValue: { type: "number_constant", value: 6000 },
              falseValue: {
                type: "non_negative_clamp",
                value: {
                  type: "difference",
                  minuend: { type: "number_constant", value: 6000 },
                  subtrahend: { type: "box_reference", box: "34" },
                },
              },
            },
          },
        },
        {
          index: "36a",
          description:
            "If you have a valid social security number (see instructions) and were born before January 2, 1961, enter the amount from line 35",
          box: {
            identifier: "36a",
            value: { type: "number_input" },
          },
        },
        {
          index: "36b",
          description:
            "If you are married filing jointly, your spouse has a valid social security number (see instructions), and your spouse was born before January 2, 1961, enter the amount from line 35",
          box: {
            identifier: "36b",
            value: { type: "number_input" },
          },
        },
        {
          index: "37",
          description:
            "**Enhanced deduction for seniors.** Add lines 36a and 36b",
          box: {
            identifier: "37",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "36a" },
                { type: "box_reference", box: "36b" },
              ],
            },
          },
        },
      ],
    },
    {
      heading: "Part VI. Total Additional Deductions",
      lines: [
        {
          index: "38",
          description:
            "Add lines 13, 21, 30, and 37. Enter here and on Form 1040 or 1040-SR, line 13b, or on Form 1040-NR, line 13c",
          box: {
            identifier: "38",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "13" },
                { type: "box_reference", box: "21" },
                { type: "box_reference", box: "30" },
                { type: "box_reference", box: "37" },
              ],
            },
          },
        },
      ],
    },
  ],
};
