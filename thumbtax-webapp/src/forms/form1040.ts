import type { TaxFormSpecification } from "#src/types/taxFormSpecification";

export const Form1040: TaxFormSpecification = {
  class: "f1040",
  title: "Form 1040",
  subtitle: "U.S. Individual Income Tax Return",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-1040",
  cardinality: "single",
  sections: [
    {
      heading: "Income",
      lines: [
        {
          index: "1a",
          description:
            "Total amount from Form(s) W-2, box 1 (see instructions)",
          boxes: [
            {
              identifier: "1a",
              value: {
                type: "form_reference",
                form: "fW2",
                box: "1",
              },
            },
          ],
        },
        {
          index: "1b",
          description: "Household employee wages not reported on Form(s) W-2",
          boxes: [
            {
              identifier: "1b",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "1c",
          description: "Tip income not reported on line 1a (see instructions)",
          boxes: [
            {
              identifier: "1c",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "1d",
          description:
            "Medicaid waiver payments not reported on Form(s) W-2 (see instructions)",
          boxes: [
            {
              identifier: "1d",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "1e",
          description:
            "Taxable dependent care benefits from Form 2441, line 26",
          boxes: [
            {
              identifier: "1e",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "1f",
          description:
            "Employer-provided adoption benefits from Form 8839, line 31",
          boxes: [
            {
              identifier: "1f",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "1g",
          description: "Wages from Form 8919, line 6",
          boxes: [
            {
              identifier: "1g",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "1h",
          description: "Other earned income (see instructions)",
          boxes: [
            {
              identifier: "1h",
              value: { type: "list_amounts_input" },
            },
          ],
        },
        {
          index: "1i",
          description: "Nontaxable combat pay election (see instructions)",
          boxes: [
            {
              identifier: "1i",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "1z",
          description: "Add lines 1a through 1h",
          boxes: [
            {
              identifier: "1z",
              value: { type: "sum_range", fromLine: "1a", toLine: "1h" },
            },
          ],
        },
        {
          index: "2a",
          description: "Tax-exempt interest",
          boxes: [
            {
              identifier: "2a",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "2b",
          description: "Taxable interest",
          boxes: [
            {
              identifier: "2b",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "3a",
          description: "Qualified dividends",
          boxes: [
            {
              identifier: "3a",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "3b",
          description: "Ordinary dividends",
          boxes: [
            {
              identifier: "3b",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "3c",
          boxes: [
            {
              identifier: "3c",
              value: { type: "unused" },
            },
          ],
        },
        {
          index: "4a",
          description: "IRA distributions",
          boxes: [
            {
              identifier: "4a",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "4b",
          description: "Taxable amount",
          boxes: [
            {
              identifier: "4b",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "4c",
          boxes: [
            {
              identifier: "4c",
              value: { type: "unused" },
            },
          ],
        },
        {
          index: "5a",
          description: "Pensions and annuities",
          boxes: [
            {
              identifier: "5a",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "5b",
          description: "Taxable amount",
          boxes: [
            {
              identifier: "5b",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "5c",
          boxes: [
            {
              identifier: "5c",
              value: { type: "unused" },
            },
          ],
        },
        {
          index: "6a",
          description: "Social security benefits",
          boxes: [
            {
              identifier: "6a",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "6b",
          description: "Taxable amount",
          boxes: [
            {
              identifier: "6b",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "6c",
          boxes: [
            {
              identifier: "6c",
              value: { type: "unused" },
            },
          ],
        },
        {
          index: "6d",
          boxes: [
            {
              identifier: "6d",
              value: { type: "unused" },
            },
          ],
        },
        {
          index: "7a",
          description: "Capital gain or (loss). Attach Schedule D if required",
          boxes: [
            {
              identifier: "7a",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "7b",
          boxes: [
            {
              identifier: "7b",
              value: { type: "unused" },
            },
          ],
        },
        {
          index: "8",
          description: "Additional income from Schedule 1, line 10",
          boxes: [
            {
              identifier: "8",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "9",
          description:
            "Add lines 1z, 2b, 3b, 4b, 5b, 6b, 7a, and 8. This is your **total income**",
          boxes: [
            {
              identifier: "9",
              value: {
                type: "sum",
                values: ["1z", "2b", "3b", "4b", "5b", "6b", "7a", "8"],
              },
            },
          ],
        },
        {
          index: "10",
          description: "Adjustments to income from Schedule 1, line 26",
          boxes: [
            {
              identifier: "10",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "11a",
          description:
            "Subtract line 10 from line 9. This is your **adjusted gross income**",
          boxes: [
            {
              identifier: "11a",
              value: { type: "difference", minuend: "9", subtrahend: "10" },
            },
          ],
        },
      ],
    },
    {
      heading: "Tax and Credits",
      lines: [
        {
          index: "11b",
          description: "Amount from line 11a (adjusted gross income)",
          boxes: [
            {
              identifier: "11b",
              value: "11a",
            },
          ],
        },
        {
          index: "12a",
          boxes: [
            {
              identifier: "12a",
              value: { type: "unused" },
            },
          ],
        },
        {
          index: "12b",
          boxes: [
            {
              identifier: "12b",
              value: { type: "unused" },
            },
          ],
        },
        {
          index: "12c",
          boxes: [
            {
              identifier: "12c",
              value: { type: "unused" },
            },
          ],
        },
        {
          index: "12d",
          boxes: [
            {
              identifier: "12d",
              value: { type: "unused" },
            },
          ],
        },
        {
          index: "12e",
          description:
            "**Standard deduction or itemized deductions** (from Schedule A)",
          boxes: [
            {
              identifier: "12e",
              value: {
                type: "filing_status_map",
                values: {
                  single: 15750,
                  married_filing_separately: 15750,
                  married_filing_jointly: 31500,
                  qualifying_surviving_spouse: 31500,
                  head_of_household: 23625,
                },
              },
            },
          ],
        },
        {
          index: "13a",
          description:
            "Qualified business income deduction from Form 8995 or Form 8995-A",
          boxes: [
            {
              identifier: "13a",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "13b",
          description: "Additional deductions from Schedule 1-A, line 38",
          boxes: [
            {
              identifier: "13b",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "14",
          description: "Add lines 12e, 13a, and 13b",
          boxes: [
            {
              identifier: "14",
              value: { type: "sum", values: ["12e", "13a", "13b"] },
            },
          ],
        },
        {
          index: "15",
          description:
            "Subtract line 14 from line 11b. If zero or less, enter -0-. This is your **taxable income**",
          boxes: [
            {
              identifier: "15",
              value: {
                type: "absolute_value",
                value: { type: "difference", minuend: "11b", subtrahend: "14" },
              },
            },
          ],
        },
        {
          index: "16",
          description: "**Tax** (see instructions)",
          boxes: [
            {
              identifier: "16",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "17",
          description: "Amount from Schedule 2, line 3",
          boxes: [
            {
              identifier: "17",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "18",
          description: "Add lines 16 and 17",
          boxes: [
            {
              identifier: "18",
              value: { type: "sum", values: ["16", "17"] },
            },
          ],
        },
        {
          index: "19",
          description:
            "Child tax credit or credit for other dependents from Schedule 8812",
          boxes: [
            {
              identifier: "19",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "20",
          description: "Amount from Schedule 3, line 8",
          boxes: [
            {
              identifier: "20",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "21",
          description: "Add lines 19 and 20",
          boxes: [
            {
              identifier: "21",
              value: { type: "sum", values: ["19", "20"] },
            },
          ],
        },
        {
          index: "22",
          description:
            "Subtract line 21 from line 18. If zero or less, enter -0-",
          boxes: [
            {
              identifier: "22",
              value: {
                type: "absolute_value",
                value: { type: "difference", minuend: "18", subtrahend: "21" },
              },
            },
          ],
        },
        {
          index: "23",
          description:
            "Other taxes, including self-employment tax, from Schedule 2, line 21",
          boxes: [
            {
              identifier: "23",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "24",
          description: "Add lines 22 and 23. This is your **total tax**",
          boxes: [
            {
              identifier: "24",
              value: { type: "sum", values: ["22", "23"] },
            },
          ],
        },
      ],
    },
    {
      heading: "Payments and Refundable Credits",
      lines: [
        {
          index: "25",
          description: "Federal income tax withheld from:",
          boxes: [],
        },
        {
          index: "25a",
          description: "Form(s) W-2",
          boxes: [
            {
              identifier: "25a",
              value: { type: "form_reference", form: "fW2", box: "2" },
            },
          ],
        },
        {
          index: "25b",
          description: "Form(s) 1099",
          boxes: [
            {
              identifier: "25b",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "25c",
          description: "Other forms (see instructions)",
          boxes: [
            {
              identifier: "25c",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "25d",
          description: "Add lines 25a through 25c",
          boxes: [
            {
              identifier: "25d",
              value: { type: "sum_range", fromLine: "25a", toLine: "25c" },
            },
          ],
        },
        {
          index: "26",
          description:
            "2025 estimated tax payments and amount applied from 2024 return",
          boxes: [
            {
              identifier: "26",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "27a",
          description: "Earned income credit (EIC)",
          boxes: [
            {
              identifier: "27a",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "27b",
          description: "Clergy filing Schedule SE (see instructions)",
          boxes: [
            {
              identifier: "27b",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "27c",
          boxes: [
            {
              identifier: "27c",
              value: { type: "unused" },
            },
          ],
        },
        {
          index: "28",
          description: "Additional child tax credit (ACTC) from Schedule 8812",
          boxes: [
            {
              identifier: "28",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "29",
          description: "American opportunity credit from Form 8863, line 8",
          boxes: [
            {
              identifier: "29",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "30",
          description: "Refundable adoption credit from Form 8839, line 13",
          boxes: [
            {
              identifier: "30",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "31",
          description: "Amount from Schedule 3, line 15",
          boxes: [
            {
              identifier: "31",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "32",
          description:
            "Add lines 27a, 28, 29, 30, and 31. These are your **total other payments and refundable credits**",
          boxes: [
            {
              identifier: "32",
              value: { type: "sum", values: ["27a", "28", "29", "30", "31"] },
            },
          ],
        },
        {
          index: "33",
          description:
            "Add lines 25d, 26, and 32. These are your **total payments**",
          boxes: [
            {
              identifier: "33",
              value: { type: "sum", values: ["25d", "26", "32"] },
            },
          ],
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
          boxes: [
            {
              identifier: "34",
              value: {
                type: "absolute_value",
                value: { type: "difference", minuend: "33", subtrahend: "24" },
              },
            },
          ],
        },
        {
          index: "35",
          description: "Amount of line 34 you want refunded to you",
          boxes: [
            {
              identifier: "35",
              value: { type: "unused" },
            },
          ],
        },
        {
          index: "36",
          description:
            "Amount of line 34 you want applied to your 2026 estimated tax",
          boxes: [
            {
              identifier: "36",
              value: { type: "unused" },
            },
          ],
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
          boxes: [
            {
              identifier: "37",
              value: {
                type: "absolute_value",
                value: { type: "difference", minuend: "24", subtrahend: "33" },
              },
            },
          ],
        },
        {
          index: "38",
          description: "Estimated tax penalty (see instructions)",
          boxes: [
            {
              identifier: "38",
              value: { type: "number_input" },
            },
          ],
        },
      ],
    },
  ],
};
