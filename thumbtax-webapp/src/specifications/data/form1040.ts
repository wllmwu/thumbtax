import type { FormSpecification } from "#src/specifications/types/formSpecification";

export const Form1040: FormSpecification = {
  class: "f1040",
  title: "Form 1040",
  subtitle: "U.S. Individual Income Tax Return",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-1040",
  category: "taxes",
  maxInstances: 1,
  sections: [
    {
      heading: "Income",
      lines: [
        {
          index: "1a",
          description:
            "Total amount from Form(s) W-2, box 1 (see instructions)",
          box: {
            identifier: "1a",
            value: { type: "box_reference", form: "fW2", box: "1" },
          },
        },
        {
          index: "1b",
          description: "Household employee wages not reported on Form(s) W-2",
          box: {
            identifier: "1b",
            value: { type: "number_input" },
          },
        },
        {
          index: "1c",
          description: "Tip income not reported on line 1a (see instructions)",
          box: {
            identifier: "1c",
            value: { type: "number_input" },
          },
        },
        {
          index: "1d",
          description:
            "Medicaid waiver payments not reported on Form(s) W-2 (see instructions)",
          box: {
            identifier: "1d",
            value: { type: "number_input" },
          },
        },
        {
          index: "1e",
          description:
            "Taxable dependent care benefits from Form 2441, line 26",
          box: {
            identifier: "1e",
            value: { type: "number_input" },
          },
        },
        {
          index: "1f",
          description:
            "Employer-provided adoption benefits from Form 8839, line 31",
          box: {
            identifier: "1f",
            value: { type: "number_input" },
          },
        },
        {
          index: "1g",
          description: "Wages from Form 8919, line 6",
          box: {
            identifier: "1g",
            value: { type: "number_input" },
          },
        },
        {
          index: "1h",
          description: "Other earned income (see instructions)",
          box: {
            identifier: "1h",
            value: { type: "list_amounts_input" },
          },
        },
        {
          index: "1i",
          description: "Nontaxable combat pay election (see instructions)",
          box: {
            identifier: "1i",
            value: { type: "number_input" },
          },
        },
        {
          index: "1z",
          description: "Add lines 1a through 1h",
          box: {
            identifier: "1z",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "1a" },
                { type: "box_reference", box: "1b" },
                { type: "box_reference", box: "1c" },
                { type: "box_reference", box: "1d" },
                { type: "box_reference", box: "1e" },
                { type: "box_reference", box: "1f" },
                { type: "box_reference", box: "1g" },
                { type: "box_reference", box: "1h" },
              ],
            },
          },
        },
        {
          index: "2a",
          description: "Tax-exempt interest",
          box: {
            identifier: "2a",
            value: { type: "number_input" },
          },
        },
        {
          index: "2b",
          description: "Taxable interest",
          box: {
            identifier: "2b",
            value: { type: "number_input" },
          },
        },
        {
          index: "3a",
          description: "Qualified dividends",
          box: {
            identifier: "3a",
            value: { type: "number_input" },
          },
        },
        {
          index: "3b",
          description: "Ordinary dividends",
          box: {
            identifier: "3b",
            value: { type: "number_input" },
          },
        },
        {
          index: "3c",
          box: {
            identifier: "3c",
            value: { type: "unused" },
          },
        },
        {
          index: "4a",
          description: "IRA distributions",
          box: {
            identifier: "4a",
            value: { type: "number_input" },
          },
        },
        {
          index: "4b",
          description: "Taxable amount",
          box: {
            identifier: "4b",
            value: { type: "number_input" },
          },
        },
        {
          index: "4c",
          box: {
            identifier: "4c",
            value: { type: "unused" },
          },
        },
        {
          index: "5a",
          description: "Pensions and annuities",
          box: {
            identifier: "5a",
            value: { type: "number_input" },
          },
        },
        {
          index: "5b",
          description: "Taxable amount",
          box: {
            identifier: "5b",
            value: { type: "number_input" },
          },
        },
        {
          index: "5c",
          box: {
            identifier: "5c",
            value: { type: "unused" },
          },
        },
        {
          index: "6a",
          description: "Social security benefits",
          box: {
            identifier: "6a",
            value: { type: "number_input" },
          },
        },
        {
          index: "6b",
          description: "Taxable amount",
          box: {
            identifier: "6b",
            value: { type: "number_input" },
          },
        },
        {
          index: "6c",
          box: {
            identifier: "6c",
            value: { type: "unused" },
          },
        },
        {
          index: "6d",
          box: {
            identifier: "6d",
            value: { type: "unused" },
          },
        },
        {
          index: "7a",
          description: "Capital gain or (loss). Attach Schedule D if required",
          box: {
            identifier: "7a",
            value: { type: "number_input" },
          },
        },
        {
          index: "7b",
          box: {
            identifier: "7b",
            value: { type: "unused" },
          },
        },
        {
          index: "8",
          description: "Additional income from Schedule 1, line 10",
          box: {
            identifier: "8",
            value: { type: "number_input" },
          },
        },
        {
          index: "9",
          description:
            "Add lines 1z, 2b, 3b, 4b, 5b, 6b, 7a, and 8. This is your **total income**",
          box: {
            identifier: "9",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "1z" },
                { type: "box_reference", box: "2b" },
                { type: "box_reference", box: "3b" },
                { type: "box_reference", box: "4b" },
                { type: "box_reference", box: "5b" },
                { type: "box_reference", box: "6b" },
                { type: "box_reference", box: "7a" },
                { type: "box_reference", box: "8" },
              ],
            },
          },
        },
        {
          index: "10",
          description: "Adjustments to income from Schedule 1, line 26",
          box: {
            identifier: "10",
            value: { type: "number_input" },
          },
        },
        {
          index: "11a",
          description:
            "Subtract line 10 from line 9. This is your **adjusted gross income**",
          box: {
            identifier: "11a",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "9" },
              subtrahend: { type: "box_reference", box: "10" },
            },
          },
        },
      ],
    },
    {
      heading: "Tax and Credits",
      lines: [
        {
          index: "11b",
          description: "Amount from line 11a (adjusted gross income)",
          box: {
            identifier: "11b",
            value: { type: "box_reference", box: "11a" },
          },
        },
        {
          index: "12a",
          box: {
            identifier: "12a",
            value: { type: "unused" },
          },
        },
        {
          index: "12b",
          box: {
            identifier: "12b",
            value: { type: "unused" },
          },
        },
        {
          index: "12c",
          box: {
            identifier: "12c",
            value: { type: "unused" },
          },
        },
        {
          index: "12d",
          box: {
            identifier: "12d",
            value: { type: "unused" },
          },
        },
        {
          index: "12e",
          description:
            "**Standard deduction or itemized deductions** (from Schedule A)",
          box: {
            identifier: "12e",
            value: {
              type: "filing_status_map",
              values: {
                single: {
                  type: "number_constant",
                  value: 15750,
                },
                married_filing_separately: {
                  type: "number_constant",
                  value: 15750,
                },
                married_filing_jointly: {
                  type: "number_constant",
                  value: 31500,
                },
                qualifying_surviving_spouse: {
                  type: "number_constant",
                  value: 31500,
                },
                head_of_household: {
                  type: "number_constant",
                  value: 23625,
                },
              },
            },
          },
        },
        {
          index: "13a",
          description:
            "Qualified business income deduction from Form 8995 or Form 8995-A",
          box: {
            identifier: "13a",
            value: { type: "number_input" },
          },
        },
        {
          index: "13b",
          description: "Additional deductions from Schedule 1-A, line 38",
          box: {
            identifier: "13b",
            value: { type: "number_input" },
          },
        },
        {
          index: "14",
          description: "Add lines 12e, 13a, and 13b",
          box: {
            identifier: "14",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "12e" },
                { type: "box_reference", box: "13a" },
                { type: "box_reference", box: "13b" },
              ],
            },
          },
        },
        {
          index: "15",
          description:
            "Subtract line 14 from line 11b. If zero or less, enter -0-. This is your **taxable income**",
          box: {
            identifier: "15",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "11b" },
                subtrahend: { type: "box_reference", box: "14" },
              },
            },
          },
        },
        {
          index: "16",
          description: "**Tax** (see instructions)",
          box: {
            identifier: "16",
            value: { type: "number_input" },
          },
        },
        {
          index: "17",
          description: "Amount from Schedule 2, line 3",
          box: {
            identifier: "17",
            value: { type: "number_input" },
          },
        },
        {
          index: "18",
          description: "Add lines 16 and 17",
          box: {
            identifier: "18",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "16" },
                { type: "box_reference", box: "17" },
              ],
            },
          },
        },
        {
          index: "19",
          description:
            "Child tax credit or credit for other dependents from Schedule 8812",
          box: {
            identifier: "19",
            value: { type: "number_input" },
          },
        },
        {
          index: "20",
          description: "Amount from Schedule 3, line 8",
          box: {
            identifier: "20",
            value: { type: "number_input" },
          },
        },
        {
          index: "21",
          description: "Add lines 19 and 20",
          box: {
            identifier: "21",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "19" },
                { type: "box_reference", box: "20" },
              ],
            },
          },
        },
        {
          index: "22",
          description:
            "Subtract line 21 from line 18. If zero or less, enter -0-",
          box: {
            identifier: "22",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "18" },
                subtrahend: { type: "box_reference", box: "21" },
              },
            },
          },
        },
        {
          index: "23",
          description:
            "Other taxes, including self-employment tax, from Schedule 2, line 21",
          box: {
            identifier: "23",
            value: { type: "number_input" },
          },
        },
        {
          index: "24",
          description: "Add lines 22 and 23. This is your **total tax**",
          box: {
            identifier: "24",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "22" },
                { type: "box_reference", box: "23" },
              ],
            },
          },
        },
      ],
    },
    {
      heading: "Payments and Refundable Credits",
      lines: [
        {
          index: "25",
          description: "Federal income tax withheld from:",
          box: {
            identifier: "25",
            value: { type: "unused" },
          },
        },
        {
          index: "25a",
          description: "Form(s) W-2",
          box: {
            identifier: "25a",
            value: { type: "box_reference", form: "fW2", box: "2" },
          },
        },
        {
          index: "25b",
          description: "Form(s) 1099",
          box: {
            identifier: "25b",
            value: { type: "number_input" },
          },
        },
        {
          index: "25c",
          description: "Other forms (see instructions)",
          box: {
            identifier: "25c",
            value: { type: "number_input" },
          },
        },
        {
          index: "25d",
          description: "Add lines 25a through 25c",
          box: {
            identifier: "25d",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "25a" },
                { type: "box_reference", box: "25b" },
                { type: "box_reference", box: "25c" },
              ],
            },
          },
        },
        {
          index: "26",
          description:
            "2025 estimated tax payments and amount applied from 2024 return",
          box: {
            identifier: "26",
            value: { type: "number_input" },
          },
        },
        {
          index: "27a",
          description: "Earned income credit (EIC)",
          box: {
            identifier: "27a",
            value: { type: "number_input" },
          },
        },
        {
          index: "27b",
          description: "Clergy filing Schedule SE (see instructions)",
          box: {
            identifier: "27b",
            value: { type: "number_input" },
          },
        },
        {
          index: "27c",
          box: {
            identifier: "27c",
            value: { type: "unused" },
          },
        },
        {
          index: "28",
          description: "Additional child tax credit (ACTC) from Schedule 8812",
          box: {
            identifier: "28",
            value: { type: "number_input" },
          },
        },
        {
          index: "29",
          description: "American opportunity credit from Form 8863, line 8",
          box: {
            identifier: "29",
            value: { type: "number_input" },
          },
        },
        {
          index: "30",
          description: "Refundable adoption credit from Form 8839, line 13",
          box: {
            identifier: "30",
            value: { type: "number_input" },
          },
        },
        {
          index: "31",
          description: "Amount from Schedule 3, line 15",
          box: {
            identifier: "31",
            value: { type: "number_input" },
          },
        },
        {
          index: "32",
          description:
            "Add lines 27a, 28, 29, 30, and 31. These are your **total other payments and refundable credits**",
          box: {
            identifier: "32",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "27a" },
                { type: "box_reference", box: "28" },
                { type: "box_reference", box: "29" },
                { type: "box_reference", box: "30" },
                { type: "box_reference", box: "31" },
              ],
            },
          },
        },
        {
          index: "33",
          description:
            "Add lines 25d, 26, and 32. These are your **total payments**",
          box: {
            identifier: "33",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "25d" },
                { type: "box_reference", box: "26" },
                { type: "box_reference", box: "32" },
              ],
            },
          },
        },
      ],
    },
    {
      heading: "Refund",
      lines: [
        {
          index: "34",
          description:
            "If line 33 is more than line 24, subtract line 24 from line 33. This is the amount you **overpaid**",
          box: {
            identifier: "34",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "33" },
                subtrahend: { type: "box_reference", box: "24" },
              },
            },
          },
        },
        {
          index: "35",
          description: "Amount of line 34 you want refunded to you",
          box: {
            identifier: "35",
            value: { type: "unused" },
          },
        },
        {
          index: "36",
          description:
            "Amount of line 34 you want applied to your 2026 estimated tax",
          box: {
            identifier: "36",
            value: { type: "unused" },
          },
        },
      ],
    },
    {
      heading: "Amount You Owe",
      lines: [
        {
          index: "37",
          description:
            "Subtract line 33 from line 24. This is the **amount you owe**",
          box: {
            identifier: "37",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "24" },
                subtrahend: { type: "box_reference", box: "33" },
              },
            },
          },
        },
        {
          index: "38",
          description: "Estimated tax penalty (see instructions)",
          box: {
            identifier: "38",
            value: { type: "number_input" },
          },
        },
      ],
    },
  ],
};
