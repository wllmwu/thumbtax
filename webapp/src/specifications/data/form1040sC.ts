import type { FormSpecification } from "@thumbtax/forms";

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
          instructions:
            'Gross receipts or sales. See instructions for line 1 if this income was reported to you on Form W-2 and the "Statutory employee" box on that form was checked',
          box: { identifier: "1", value: { type: "number_input" } },
        },
        {
          index: "2",
          instructions: "Returns and allowances",
          box: { identifier: "2", value: { type: "number_input" } },
        },
        {
          index: "3",
          instructions: "Subtract line 2 from line 1",
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
          instructions: "Cost of goods sold (from line 42)",
          box: { identifier: "4", value: { type: "box_reference", box: "42" } },
        },
        {
          index: "5",
          instructions: "**Gross profit.** Subtract line 4 from line 3",
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
          instructions:
            "Other income, including federal and state gasoline or fuel tax credit or refund (see instructions)",
          box: { identifier: "6", value: { type: "number_input" } },
        },
        {
          index: "7",
          instructions: "**Gross income.** Add lines 5 and 6",
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
          instructions: "Advertising",
          box: { identifier: "8", value: { type: "number_input" } },
        },
        {
          index: "9",
          instructions: "Car and truck expenses (see instructions)",
          box: { identifier: "9", value: { type: "number_input" } },
        },
        {
          index: "10",
          instructions: "Commissions and fees",
          box: { identifier: "10", value: { type: "number_input" } },
        },
        {
          index: "11",
          instructions: "Contract labor (see instructions)",
          box: { identifier: "11", value: { type: "number_input" } },
        },
        {
          index: "12",
          instructions: "Depletion",
          box: { identifier: "12", value: { type: "number_input" } },
        },
        {
          index: "13",
          instructions:
            "Depreciation and section 179 expense deduction (not included in Part III) (see instructions)",
          box: { identifier: "13", value: { type: "number_input" } },
        },
        {
          index: "14",
          instructions: "Employee benefit programs (other than on line 19)",
          box: { identifier: "14", value: { type: "number_input" } },
        },
        {
          index: "15",
          instructions: "Insurance (other than health)",
          box: { identifier: "15", value: { type: "number_input" } },
        },
        {
          index: "16",
          instructions: "Interest (see instructions):",
          box: { identifier: "16", value: { type: "unused" } },
        },
        {
          index: "16a",
          instructions: "Mortgage (paid to banks, etc.)",
          box: { identifier: "16a", value: { type: "number_input" } },
        },
        {
          index: "16b",
          instructions: "Other",
          box: { identifier: "16b", value: { type: "number_input" } },
        },
        {
          index: "17",
          instructions: "Legal and professional services",
          box: { identifier: "17", value: { type: "number_input" } },
        },
        {
          index: "18",
          instructions: "Office expense (see instructions)",
          box: { identifier: "18", value: { type: "number_input" } },
        },
        {
          index: "19",
          instructions: "Pension and profit-sharing plans",
          box: { identifier: "19", value: { type: "number_input" } },
        },
        {
          index: "20",
          instructions: "Rent or lease (see instructions):",
          box: { identifier: "20", value: { type: "unused" } },
        },
        {
          index: "20a",
          instructions: "Vehicles, machinery, and equipment",
          box: { identifier: "20a", value: { type: "number_input" } },
        },
        {
          index: "20b",
          instructions: "Other business property",
          box: { identifier: "20b", value: { type: "number_input" } },
        },
        {
          index: "21",
          instructions: "Repairs and maintenance",
          box: { identifier: "21", value: { type: "number_input" } },
        },
        {
          index: "22",
          instructions: "Supplies (not included in Part III)",
          box: { identifier: "22", value: { type: "number_input" } },
        },
        {
          index: "23",
          instructions: "Taxes and licenses",
          box: { identifier: "23", value: { type: "number_input" } },
        },
        {
          index: "24",
          instructions: "Travel and meals:",
          box: { identifier: "24", value: { type: "unused" } },
        },
        {
          index: "24a",
          instructions: "Travel",
          box: { identifier: "24a", value: { type: "number_input" } },
        },
        {
          index: "24b",
          instructions: "Deductible meals (see instructions)",
          box: { identifier: "24b", value: { type: "number_input" } },
        },
        {
          index: "25",
          instructions: "Utilities",
          box: { identifier: "25", value: { type: "number_input" } },
        },
        {
          index: "26",
          instructions: "Wages (less employment credits)",
          box: { identifier: "26", value: { type: "number_input" } },
        },
        {
          index: "27a",
          instructions:
            "Energy efficient commercial buildings deduction (attach Form 7205)",
          box: { identifier: "27a", value: { type: "number_input" } },
        },
        {
          index: "27b",
          instructions: "Other expenses (from line 48)",
          box: {
            identifier: "27b",
            value: { type: "box_reference", box: "48" },
          },
        },
        {
          index: "28",
          instructions:
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
          instructions:
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
          instructions:
            "Expenses for business use of your home. Do not report these expenses elsewhere. Attach Form 8829 unless using the simplified method. See instructions.\n**Simplified method filers only:** Use the Simplified Method Worksheet in the instructions to figure the amount to enter on line 30",
          box: { identifier: "30", value: { type: "number_input" } },
        },
        {
          index: "31",
          instructions:
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
          instructions:
            "If you have a loss, check the box that describes your investment in this activity. See instructions.\n- If you checked 32a, enter the loss on both Schedule 1 (Form 1040), line 3, and on Schedule SE, line 2\n- If you checked 32b, you **must** attach Form 6198. Your loss may be limited.",
          box: { identifier: "32", value: { type: "unused" } },
        },
        {
          index: "32a",
          instructions: "All investment is at risk.",
          box: { identifier: "32a", value: { type: "checkbox_input" } },
        },
        {
          index: "32b",
          instructions: "Some investment is not at risk.",
          box: { identifier: "32b", value: { type: "checkbox_input" } },
        },
      ],
    },
    {
      heading: "Part III. Cost of Goods Sold (see instructions)",
      lines: [
        {
          index: "33",
          instructions: "Method(s) used to value closing inventory",
          box: { identifier: "33", value: { type: "unused" } },
        },
        {
          index: "34",
          instructions:
            'Was there any change in determining quantities, costs, or valuations between opening and closing inventory? If "Yes," attach explanation',
          box: { identifier: "34", value: { type: "unused" } },
        },
        {
          index: "35",
          instructions:
            "Inventory at beginning of year. If different from last year's closing inventory, attach explanation",
          box: { identifier: "35", value: { type: "number_input" } },
        },
        {
          index: "36",
          instructions:
            "Purchases less cost of items withdrawn for personal use",
          box: { identifier: "36", value: { type: "number_input" } },
        },
        {
          index: "37",
          instructions:
            "Cost of labor. Do not include any amounts paid to yourself",
          box: { identifier: "37", value: { type: "number_input" } },
        },
        {
          index: "38",
          instructions: "Materials and supplies",
          box: { identifier: "38", value: { type: "number_input" } },
        },
        {
          index: "39",
          instructions: "Other costs",
          box: { identifier: "39", value: { type: "number_input" } },
        },
        {
          index: "40",
          instructions: "Add lines 35 through 39",
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
          instructions: "Inventory at end of year",
          box: { identifier: "41", value: { type: "number_input" } },
        },
        {
          index: "42",
          instructions:
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
    {
      heading: "Part IV. Information on Your Vehicle",
      lines: [
        {
          index: "43\u201347b",
          instructions: "Unused",
          box: { identifier: "43", value: { type: "unused" } },
        },
      ],
    },
    {
      heading: "Part V. Other Expenses",
      lines: [
        {
          index: "48",
          instructions: "**Total other expenses.** Enter here and on line 27b",
          box: { identifier: "48", value: { type: "list_amounts_input" } },
        },
      ],
    },
  ],
};
