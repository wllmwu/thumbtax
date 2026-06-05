import type { FormSpecification } from "#src/specifications/types/formSpecification";

export const Form1040SA: FormSpecification = {
  class: "f1040sA",
  title: "Schedule A (Form 1040)",
  subtitle: "Itemized Deductions",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-schedule-a-form-1040",
  category: "taxes",
  maxInstances: 1,
  sections: [
    {
      heading: "Medical and Dental Expenses",
      lines: [
        {
          index: "1",
          description: "Medical and dental expenses (see instructions)",
          box: {
            identifier: "1",
            value: { type: "number_input" },
          },
        },
        {
          index: "2",
          description: "Enter amount from Form 1040 or 1040-SR, line 11b",
          box: {
            identifier: "2",
            value: {
              type: "box_reference",
              form: "f1040",
              box: "11b",
              required: true,
            },
          },
        },
        {
          index: "3",
          description: "Multiply line 2 by 7.5% (0.075)",
          box: {
            identifier: "3",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "2" },
                { type: "number_constant", value: 0.075 },
              ],
            },
          },
        },
        {
          index: "4",
          description:
            "Subtract line 3 from line 1. If line 3 is more than line 1, enter -0-",
          box: {
            identifier: "4",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "1" },
                subtrahend: { type: "box_reference", box: "3" },
              },
            },
          },
        },
      ],
    },
    {
      heading: "Taxes You Paid",
      lines: [
        {
          index: "5",
          description: "State and local taxes (SALT):",
          box: {
            identifier: "5",
            value: { type: "unused" },
          },
        },
        {
          index: "5a",
          description:
            "State and local income taxes or general sales taxes. You may include either income taxes or general sales taxes on line 5a, but not both",
          box: {
            identifier: "5a",
            value: { type: "number_input" },
          },
        },
        {
          index: "5b",
          description: "State and local real estate taxes (see instructions)",
          box: {
            identifier: "5b",
            value: { type: "number_input" },
          },
        },
        {
          index: "5c",
          description: "State and local personal property taxes",
          box: {
            identifier: "5c",
            value: { type: "number_input" },
          },
        },
        {
          index: "5d",
          description: "Add lines 5a through 5c",
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
          index: "5e",
          description:
            "Enter the smaller of line 5d or $40,000 ($20,000 if married filing separately). If Form 1040 or 1040-SR, line 11b is more than $500,000 ($250,000 if married filing separately), or if you completed Form 2555, Form 4563, or excluded income from Puerto Rico, see instructions",
          box: {
            identifier: "5e",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "5d" },
                {
                  type: "filing_status_map",
                  values: {
                    married_filing_separately: {
                      type: "number_constant",
                      value: 20000,
                    },
                  },
                  default: { type: "number_constant", value: 40000 },
                },
              ],
            },
          },
        },
        {
          index: "6",
          description: "Other taxes. List type and amount:",
          box: {
            identifier: "6",
            value: { type: "list_amounts_input" },
          },
        },
        {
          index: "7",
          description: "Add lines 5e and 6",
          box: {
            identifier: "7",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "5e" },
                { type: "box_reference", box: "6" },
              ],
            },
          },
        },
      ],
    },
    {
      heading: "Interest You Paid",
      lines: [
        {
          index: "8",
          description:
            "Home mortgage interest and points. If you didn't use all of your home mortgage loan(s) to buy, build, or improve your home, see instructions",
          box: {
            identifier: "8",
            value: { type: "unused" },
          },
        },
        {
          index: "8a",
          description:
            "Home mortgage interest and points reported to you on Form 1098. See instructions if limited",
          box: {
            identifier: "8a",
            value: { type: "number_input" },
          },
        },
        {
          index: "8b",
          description:
            "Home mortgage interest not reported to you on Form 1098. See instructions if limited. If paid to the person from whom you bought the home, see instructions",
          box: {
            identifier: "8b",
            value: { type: "number_input" },
          },
        },
        {
          index: "8c",
          description:
            "Points not reported to you on Form 1098. See instructions for special rules",
          box: {
            identifier: "8c",
            value: { type: "number_input" },
          },
        },
        {
          index: "8d",
          description: "Reserved for future use",
          box: {
            identifier: "8d",
            value: { type: "unused" },
          },
        },
        {
          index: "8e",
          description: "Add lines 8a through 8c",
          box: {
            identifier: "8e",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "8a" },
                { type: "box_reference", box: "8b" },
                { type: "box_reference", box: "8c" },
              ],
            },
          },
        },
        {
          index: "9",
          description:
            "Investment interest. Attach Form 4952 if required. See instructions",
          box: {
            identifier: "9",
            value: { type: "number_input" },
          },
        },
        {
          index: "10",
          description: "Add lines 8e and 9",
          box: {
            identifier: "10",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "8e" },
                { type: "box_reference", box: "9" },
              ],
            },
          },
        },
      ],
    },
    {
      heading: "Gifts to Charity",
      lines: [
        {
          index: "11",
          description:
            "Gifts by cash or check. If you made any gift of $250 or more, see instructions",
          box: {
            identifier: "11",
            value: { type: "number_input" },
          },
        },
        {
          index: "12",
          description:
            "Other than by cash or check. If you made any gift of $250 or more, see instructions. You must attach Form 8283 if over $500",
          box: {
            identifier: "12",
            value: { type: "number_input" },
          },
        },
        {
          index: "13",
          description: "Carryover from prior year",
          box: {
            identifier: "13",
            value: { type: "number_input" },
          },
        },
        {
          index: "14",
          description: "Add lines 11 through 13",
          box: {
            identifier: "14",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "11" },
                { type: "box_reference", box: "12" },
                { type: "box_reference", box: "13" },
              ],
            },
          },
        },
      ],
    },
    {
      heading: "Casualty and Theft Losses",
      lines: [
        {
          index: "15",
          description:
            "Casualty and theft loss(es) from a federally declared disaster (other than net qualified disaster losses). Attach Form 4684 and enter the amount from line 18 of that form. See instructions",
          box: {
            identifier: "15",
            value: { type: "number_input" },
          },
        },
      ],
    },
    {
      heading: "Other Itemized Deductions",
      lines: [
        {
          index: "16",
          description:
            "Other\u2014from list in instructions. List type and amount:",
          box: {
            identifier: "16",
            value: { type: "list_amounts_input" },
          },
        },
      ],
    },
    {
      heading: "Total Itemized Deductions",
      lines: [
        {
          index: "17",
          description:
            "Add the amounts in the far right column for lines 4 through 16. Also, enter this amount on Form 1040 or 1040-SR, line 12e",
          box: {
            identifier: "17",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "4" },
                { type: "box_reference", box: "7" },
                { type: "box_reference", box: "10" },
                { type: "box_reference", box: "14" },
                { type: "box_reference", box: "15" },
                { type: "box_reference", box: "16" },
              ],
            },
          },
        },
        {
          index: "18",
          description:
            "If you elect to itemize deductions even though they are less than your standard deduction, check this box",
          box: {
            identifier: "18",
            value: { type: "checkbox_input" },
          },
        },
      ],
    },
  ],
};
