import type { FormSpecification } from "#src/specifications/types/formSpecification";

export const Form1040SC: FormSpecification = {
  class: "f1040sC",
  title: "Schedule C (Form 1040)",
  subtitle: "Profit or Loss From Business (Sole Proprietorship)",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-schedule-c-form-1040",
  category: "taxes",
  maxInstances: null,
  sections: [
    {
      heading: "Part I. Income",
      lines: [
        {
          index: "1",
          description:
            'Gross receipts or sales. See instructions for line 1 if this income was reported to you on Form W-2 and the "Statutory employee" box on that form was checked',
          box: {
            identifier: "1",
            value: { type: "number_input" },
          },
        },
        {
          index: "2",
          description: "Returns and allowances",
          box: {
            identifier: "2",
            value: { type: "number_input" },
          },
        },
        {
          index: "3",
          description: "Subtract line 2 from line 1",
          box: {
            identifier: "3",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "1" },
              subtrahend: { type: "box_reference", box: "2" },
            },
          },
        },
        {
          index: "4",
          description: "Cost of goods sold (from line 42)",
          box: {
            identifier: "4",
            value: { type: "box_reference", box: "42" },
          },
        },
        {
          index: "5",
          description: "**Gross profit.** Subtract line 4 from line 3",
          box: {
            identifier: "5",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "3" },
              subtrahend: { type: "box_reference", box: "4" },
            },
          },
        },
        {
          index: "6",
          description:
            "Other income, including federal and state gasoline or fuel tax credit or refund (see instructions)",
          box: {
            identifier: "6",
            value: { type: "number_input" },
          },
        },
        {
          index: "7",
          description: "**Gross income.** Add lines 5 and 6",
          box: {
            identifier: "7",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "5" },
                { type: "box_reference", box: "6" },
              ],
            },
          },
        },
      ],
    },
    {
      heading:
        "Part II. Expenses. Enter expenses for business use of your home **only** on line 30.",
      lines: [
        {
          index: "8",
          description: "Advertising",
          box: {
            identifier: "8",
            value: { type: "number_input" },
          },
        },
        {
          index: "9",
          description: "Car and truck expenses (see instructions)",
          box: {
            identifier: "9",
            value: { type: "number_input" },
          },
        },
        {
          index: "10",
          description: "Commissions and fees",
          box: {
            identifier: "10",
            value: { type: "number_input" },
          },
        },
        {
          index: "11",
          description: "Contract labor (see instructions)",
          box: {
            identifier: "11",
            value: { type: "number_input" },
          },
        },
        {
          index: "12",
          description: "Depletion",
          box: {
            identifier: "12",
            value: { type: "number_input" },
          },
        },
        {
          index: "13",
          description:
            "Depreciation and section 179 expense deduction (not included in Part III) (see instructions)",
          box: {
            identifier: "13",
            value: { type: "number_input" },
          },
        },
        {
          index: "14",
          description: "Employee benefit programs (other than on line 19)",
          box: {
            identifier: "14",
            value: { type: "number_input" },
          },
        },
        {
          index: "15",
          description: "Insurance (other than health)",
          box: {
            identifier: "15",
            value: { type: "number_input" },
          },
        },
        {
          index: "16",
          description: "Interest (see instructions):",
          box: {
            identifier: "16",
            value: { type: "unused" },
          },
        },
        {
          index: "16a",
          description: "Mortgage (paid to banks, etc.)",
          box: {
            identifier: "16a",
            value: { type: "number_input" },
          },
        },
        {
          index: "16b",
          description: "Other",
          box: {
            identifier: "16b",
            value: { type: "number_input" },
          },
        },
        {
          index: "17",
          description: "Legal and professional services",
          box: {
            identifier: "17",
            value: { type: "number_input" },
          },
        },
        {
          index: "18",
          description: "Office expense (see instructions)",
          box: {
            identifier: "18",
            value: { type: "number_input" },
          },
        },
        {
          index: "19",
          description: "Pension and profit-sharing plans",
          box: {
            identifier: "19",
            value: { type: "number_input" },
          },
        },
        {
          index: "20",
          description: "Rent or lease (see instructions):",
          box: {
            identifier: "20",
            value: { type: "unused" },
          },
        },
        {
          index: "20a",
          description: "Vehicles, machinery, and equipment",
          box: {
            identifier: "20a",
            value: { type: "number_input" },
          },
        },
        {
          index: "20b",
          description: "Other business property",
          box: {
            identifier: "20b",
            value: { type: "number_input" },
          },
        },
        {
          index: "21",
          description: "Repairs and maintenance",
          box: {
            identifier: "21",
            value: { type: "number_input" },
          },
        },
        {
          index: "22",
          description: "Supplies (not included in Part III)",
          box: {
            identifier: "22",
            value: { type: "number_input" },
          },
        },
        {
          index: "23",
          description: "Taxes and licenses",
          box: {
            identifier: "23",
            value: { type: "number_input" },
          },
        },
        {
          index: "24",
          description: "Travel and meals:",
          box: {
            identifier: "24",
            value: { type: "unused" },
          },
        },
        {
          index: "24a",
          description: "Travel",
          box: {
            identifier: "24a",
            value: { type: "number_input" },
          },
        },
        {
          index: "24b",
          description: "Deductible meals (see instructions)",
          box: {
            identifier: "24b",
            value: { type: "number_input" },
          },
        },
        {
          index: "25",
          description: "Utilities",
          box: {
            identifier: "25",
            value: { type: "number_input" },
          },
        },
        {
          index: "26",
          description: "Wages (less employment credits)",
          box: {
            identifier: "26",
            value: { type: "number_input" },
          },
        },
        {
          index: "27a",
          description:
            "Energy efficient commercial buildings deduction (attach Form 7205)",
          box: {
            identifier: "27a",
            value: { type: "number_input" },
          },
        },
        {
          index: "27b",
          description: "Other expenses (from line 48)",
          box: {
            identifier: "27b",
            value: { type: "box_reference", box: "48" },
          },
        },
        {
          index: "28",
          description:
            "**Total expenses** before expenses for business use of home. Add lines 8 through 27b",
          box: {
            identifier: "28",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "8" },
                { type: "box_reference", box: "9" },
                { type: "box_reference", box: "10" },
                { type: "box_reference", box: "11" },
                { type: "box_reference", box: "12" },
                { type: "box_reference", box: "13" },
                { type: "box_reference", box: "14" },
                { type: "box_reference", box: "15" },
                { type: "box_reference", box: "16a" },
                { type: "box_reference", box: "16b" },
                { type: "box_reference", box: "17" },
                { type: "box_reference", box: "18" },
                { type: "box_reference", box: "19" },
                { type: "box_reference", box: "20a" },
                { type: "box_reference", box: "20b" },
                { type: "box_reference", box: "21" },
                { type: "box_reference", box: "22" },
                { type: "box_reference", box: "23" },
                { type: "box_reference", box: "24a" },
                { type: "box_reference", box: "24b" },
                { type: "box_reference", box: "25" },
                { type: "box_reference", box: "26" },
                { type: "box_reference", box: "27a" },
                { type: "box_reference", box: "27b" },
              ],
            },
          },
        },
        {
          index: "29",
          description:
            "Tentative profit or (loss). Subtract line 28 from line 7",
          box: {
            identifier: "29",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "7" },
              subtrahend: { type: "box_reference", box: "28" },
            },
          },
        },
        {
          index: "30",
          description:
            "Expenses for business use of your home. Do not report these expenses elsewhere. Attach Form 8829 unless using the simplified method. See instructions.\n**Simplified method filers only:** Use the Simplified Method Worksheet in the instructions to figure the amount to enter on line 30",
          box: {
            identifier: "30",
            value: { type: "number_input" },
          },
        },
        {
          index: "31",
          description:
            "**Net profit or (loss).** Subtract line 30 from line 29.\n- If a profit, enter on both Schedule 1 (Form 1040), line 3, and on Schedule SE, line 2.\n- If a loss, you **must** go to line 32.",
          box: {
            identifier: "31",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "29" },
              subtrahend: { type: "box_reference", box: "30" },
            },
          },
        },
        {
          index: "32",
          description:
            "If you have a loss, check the box that describes your investment in this activity. See instructions.\n- If you checked 32a, enter the loss on both Schedule 1 (Form 1040), line 3, and on Schedule SE, line 2\n- If you checked 32b, you **must** attach Form 6198. Your loss may be limited.",
          box: {
            identifier: "32",
            value: { type: "unused" },
          },
        },
        {
          index: "32a",
          description: "All investment is at risk.",
          box: {
            identifier: "32a",
            value: { type: "checkbox_input" },
          },
        },
        {
          index: "32b",
          description: "Some investment is not at risk.",
          box: {
            identifier: "32b",
            value: { type: "checkbox_input" },
          },
        },
      ],
    },
    {
      heading: "Part III. Cost of Goods Sold (see instructions)",
      lines: [
        {
          index: "33",
          description: "Method(s) used to value closing inventory",
          box: {
            identifier: "33",
            value: { type: "unused" },
          },
        },
        {
          index: "34",
          description:
            'Was there any change in determining quantities, costs, or valuations between opening and closing inventory? If "Yes," attach explanation',
          box: {
            identifier: "34",
            value: { type: "unused" },
          },
        },
        {
          index: "35",
          description:
            "Inventory at beginning of year. If different from last year's closing inventory, attach explanation",
          box: {
            identifier: "35",
            value: { type: "number_input" },
          },
        },
        {
          index: "36",
          description:
            "Purchases less cost of items withdrawn for personal use",
          box: {
            identifier: "36",
            value: { type: "number_input" },
          },
        },
        {
          index: "37",
          description:
            "Cost of labor. Do not include any amounts paid to yourself",
          box: {
            identifier: "37",
            value: { type: "number_input" },
          },
        },
        {
          index: "38",
          description: "Materials and supplies",
          box: {
            identifier: "38",
            value: { type: "number_input" },
          },
        },
        {
          index: "39",
          description: "Other costs",
          box: {
            identifier: "39",
            value: { type: "number_input" },
          },
        },
        {
          index: "40",
          description: "Add lines 35 through 39",
          box: {
            identifier: "40",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "35" },
                { type: "box_reference", box: "36" },
                { type: "box_reference", box: "37" },
                { type: "box_reference", box: "38" },
                { type: "box_reference", box: "39" },
              ],
            },
          },
        },
        {
          index: "41",
          description: "Inventory at end of year",
          box: {
            identifier: "41",
            value: { type: "number_input" },
          },
        },
        {
          index: "42",
          description:
            "**Cost of goods sold.** Subtract line 41 from line 40. Enter the result here and on line 4",
          box: {
            identifier: "42",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "40" },
              subtrahend: { type: "box_reference", box: "41" },
            },
          },
        },
      ],
    },
  ],
};
