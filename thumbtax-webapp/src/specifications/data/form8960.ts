import type { FormSpecification } from "#src/specifications/types/formSpecification";

export const Form8960: FormSpecification = {
  class: "f8960",
  title: "Form 8960",
  subtitle: "Net Investment Income Tax\u2014Individuals, Estates, and Trusts",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-8960",
  category: "taxes",
  maxInstances: 1,
  sections: [
    {
      heading: "Part I. Investment Income",
      lines: [
        {
          index: "1",
          description: "Taxable interest (see instructions)",
          box: {
            identifier: "1",
            value: { type: "box_reference", form: "f1040", box: "2b" },
          },
        },
        {
          index: "2",
          description: "Ordinary dividends (see instructions)",
          box: {
            identifier: "2",
            value: { type: "box_reference", form: "f1040", box: "3b" },
          },
        },
        {
          index: "3",
          description: "Annuities (see instructions)",
          box: { identifier: "3", value: { type: "number_input" } },
        },
        {
          index: "4a",
          description:
            "Rental real estate, royalties, partnerships, S corporations, trusts, trades or businesses, etc. (see instructions)",
          box: {
            identifier: "4a",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", form: "f1040s1", box: "3" },
                { type: "box_reference", form: "f1040s1", box: "5" },
                { type: "box_reference", form: "f1040s1", box: "6" },
              ],
            },
          },
        },
        {
          index: "4b",
          description:
            "Adjustment for net income or loss derived in the ordinary course of a non-section 1411 trade or business (see instructions)",
          box: { identifier: "4b", value: { type: "number_input" } },
        },
        {
          index: "4c",
          description: "Combine lines 4a and 4b",
          box: {
            identifier: "4c",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "4a" },
                { type: "box_reference", box: "4b" },
              ],
            },
          },
        },
        {
          index: "5a",
          description:
            "Net gain or loss from disposition of property (see instructions)",
          box: {
            identifier: "5a",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", form: "f1040", box: "7a" },
                { type: "box_reference", form: "f1040s1", box: "4" },
              ],
            },
          },
        },
        {
          index: "5b",
          description:
            "Net gain or loss from disposition of property that is not subject to net investment income tax (see instructions)",
          box: { identifier: "5b", value: { type: "number_input" } },
        },
        {
          index: "5c",
          description:
            "Adjustment from disposition of partnership interest or S corporation stock (see instructions)",
          box: { identifier: "5c", value: { type: "number_input" } },
        },
        {
          index: "5d",
          description: "Combine lines 5a through 5c",
          box: {
            identifier: "5d",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "5a" },
                { type: "box_reference", box: "5b" },
                { type: "box_reference", box: "5c" },
              ],
            },
          },
        },
        {
          index: "6",
          description:
            "Adjustments to investment income for certain CFCs and PFICs (see instructions)",
          box: { identifier: "6", value: { type: "number_input" } },
        },
        {
          index: "7",
          description:
            "Other modifications to investment income (see instructions)",
          box: { identifier: "7", value: { type: "number_input" } },
        },
        {
          index: "8",
          description:
            "Total investment income. Combine lines 1, 2, 3, 4c, 5d, 6, and 7",
          box: {
            identifier: "8",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "1" },
                { type: "box_reference", box: "2" },
                { type: "box_reference", box: "3" },
                { type: "box_reference", box: "4c" },
                { type: "box_reference", box: "5d" },
                { type: "box_reference", box: "6" },
                { type: "box_reference", box: "7" },
              ],
            },
          },
        },
      ],
    },
    {
      heading:
        "Part II. Investment Expenses Allocable to Investment Income and Modifications",
      lines: [
        {
          index: "9a",
          description: "Investment interest expenses (see instructions)",
          box: { identifier: "9a", value: { type: "number_input" } },
        },
        {
          index: "9b",
          description:
            "State, local, and foreign income tax (see instructions)",
          box: { identifier: "9b", value: { type: "number_input" } },
        },
        {
          index: "9c",
          description: "Miscellaneous investment expenses (see instructions)",
          box: { identifier: "9c", value: { type: "number_input" } },
        },
        {
          index: "9d",
          description: "Add lines 9a, 9b, and 9c",
          box: {
            identifier: "9d",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "9a" },
                { type: "box_reference", box: "9b" },
                { type: "box_reference", box: "9c" },
              ],
            },
          },
        },
        {
          index: "10",
          description: "Additional modifications (see instructions)",
          box: { identifier: "10", value: { type: "number_input" } },
        },
        {
          index: "11",
          description:
            "Total deductions and modifications. Add lines 9d and 10",
          box: {
            identifier: "11",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "9d" },
                { type: "box_reference", box: "10" },
              ],
            },
          },
        },
      ],
    },
    {
      heading: "Part III. Tax Computation",
      lines: [
        {
          index: "12",
          description:
            "Net investment income. Subtract Part II, line 11, from Part I, line 8. Individuals, complete lines 13\u201317. Estates and trusts, complete lines 18a\u201321. If zero or less, enter -0-",
          box: {
            identifier: "12",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "8" },
                subtrahend: { type: "box_reference", box: "11" },
              },
            },
          },
        },
        {
          index: "13",
          description: "Modified adjusted gross income (see instructions)",
          box: {
            identifier: "13",
            value: { type: "box_reference", form: "f1040", box: "11a" },
          },
        },
        {
          index: "14",
          description: "Threshold based on filing status (see instructions)",
          box: {
            identifier: "14",
            value: {
              type: "filing_status_map",
              values: {
                head_of_household: { type: "number_constant", value: 200000 },
                married_filing_jointly: {
                  type: "number_constant",
                  value: 250000,
                },
                married_filing_separately: {
                  type: "number_constant",
                  value: 125000,
                },
                qualifying_surviving_spouse: {
                  type: "number_constant",
                  value: 250000,
                },
                single: { type: "number_constant", value: 200000 },
              },
            },
          },
        },
        {
          index: "15",
          description:
            "Subtract line 14 from line 13. If zero or less, enter -0-",
          box: {
            identifier: "15",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "13" },
                subtrahend: { type: "box_reference", box: "14" },
              },
            },
          },
        },
        {
          index: "16",
          description: "Enter the smaller of line 12 or line 15",
          box: {
            identifier: "16",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "12" },
                { type: "box_reference", box: "15" },
              ],
            },
          },
        },
        {
          index: "17",
          description:
            "Net investment income tax for individuals. Multiply line 16 by 3.8% (0.038). Enter here and include on your tax return (see instructions)",
          box: {
            identifier: "17",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "16" },
                { type: "number_constant", value: 0.038 },
              ],
            },
          },
        },
        {
          index: "18a",
          description: "Net investment income (line 12 above)",
          box: { identifier: "18a", value: { type: "unsupported" } },
        },
        {
          index: "18b",
          description:
            "Deductions for distributions of net investment income and charitable deductions (see instructions)",
          box: { identifier: "18b", value: { type: "unsupported" } },
        },
        {
          index: "18c",
          description:
            "Undistributed net investment income. Subtract line 18b from line 18a (see instructions). If zero or less, enter -0-",
          box: { identifier: "18c", value: { type: "unsupported" } },
        },
        {
          index: "19a",
          description: "Adjusted gross income (see instructions)",
          box: { identifier: "19a", value: { type: "unsupported" } },
        },
        {
          index: "19b",
          description:
            "Highest tax bracket for estates and trusts for the year (see instructions)",
          box: { identifier: "19b", value: { type: "unsupported" } },
        },
        {
          index: "19c",
          description:
            "Subtract line 19b from line 19a. If zero or less, enter -0-",
          box: { identifier: "19c", value: { type: "unsupported" } },
        },
        {
          index: "20",
          description: "Enter the smaller of line 18c or line 19c",
          box: { identifier: "20", value: { type: "unsupported" } },
        },
        {
          index: "21",
          description:
            "Net investment income tax for estates and trusts. Multiply line 20 by 3.8% (0.038). Enter here and include on your tax return (see instructions)",
          box: { identifier: "21", value: { type: "unsupported" } },
        },
      ],
    },
  ],
};
