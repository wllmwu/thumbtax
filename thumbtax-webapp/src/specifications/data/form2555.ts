import type { FormSpecification } from "#src/specifications/types/formSpecification";

export const Form2555: FormSpecification = {
  class: "f2555",
  title: "Form 2555",
  subtitle: "Foreign Earned Income",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-2555",
  category: "taxes",
  maxInstances: 1,
  sections: [
    {
      heading: "Part I — General Information",
      lines: [
        {
          index: "1",
          description: "Your foreign address (including country)",
          box: {
            identifier: "1",
            // GAP: no text_input value type; using number_input as fallback
            value: { type: "number_input" },
          },
        },
        {
          index: "2",
          description: "Your occupation",
          box: {
            identifier: "2",
            // GAP: no text_input value type; using number_input as fallback
            value: { type: "number_input" },
          },
        },
        {
          index: "3",
          description: "Employer's name",
          box: {
            identifier: "3",
            // GAP: no text_input value type; using number_input as fallback
            value: { type: "number_input" },
          },
        },
        {
          index: "4a",
          description: "Employer's U.S. address",
          box: {
            identifier: "4a",
            // GAP: no text_input value type; using number_input as fallback
            value: { type: "number_input" },
          },
        },
        {
          index: "4b",
          description: "Employer's foreign address",
          box: {
            identifier: "4b",
            // GAP: no text_input value type; using number_input as fallback
            value: { type: "number_input" },
          },
        },
        {
          index: "5",
          description:
            "Employer is (check any that apply): a A foreign entity, b A U.S. company, c Self, d A foreign affiliate of a U.S. company, e Other (specify)",
          box: {
            identifier: "5",
            // GAP: multi-checkbox group cannot be expressed; using number_input as fallback
            value: { type: "number_input" },
          },
        },
        {
          index: "6a",
          description:
            "If you previously filed Form 2555 or Form 2555-EZ, enter the last year you filed the form.",
          box: {
            identifier: "6a",
            // GAP: no text_input value type; using number_input as fallback
            value: { type: "number_input" },
          },
        },
        {
          index: "6b",
          description:
            "If you didn't previously file Form 2555 or Form 2555-EZ to claim either of the exclusions, check here and go to line 7.",
          box: {
            identifier: "6b",
            value: { type: "checkbox_input" },
          },
        },
        {
          index: "6c",
          description: "Have you ever revoked either of the exclusions?",
          box: {
            identifier: "6c",
            value: { type: "checkbox_input" },
          },
        },
        {
          index: "6d",
          description:
            'If you answered "Yes," enter the type of exclusion and the tax year for which the revocation was effective.',
          box: {
            identifier: "6d",
            // GAP: no text_input value type; using number_input as fallback
            value: { type: "number_input" },
          },
        },
        {
          index: "7",
          description: "Of what country are you a citizen/national?",
          box: {
            identifier: "7",
            // GAP: no text_input value type; using number_input as fallback
            value: { type: "number_input" },
          },
        },
        {
          index: "8a",
          description:
            "Did you maintain a separate foreign residence for your family because of adverse living conditions at your tax home? See Second foreign household in the instructions.",
          box: {
            identifier: "8a",
            value: { type: "checkbox_input" },
          },
        },
        {
          index: "8b",
          description:
            'If "Yes," enter city and country of the separate foreign residence. Also, enter the number of days during your tax year that you maintained a second household at that address.',
          box: {
            identifier: "8b",
            // GAP: no text_input value type; using number_input as fallback
            value: { type: "number_input" },
          },
        },
        {
          index: "9",
          description:
            "List your tax home(s) during your tax year and date(s) established.",
          box: {
            identifier: "9",
            // GAP: no text_input value type; using number_input as fallback
            value: { type: "number_input" },
          },
        },
      ],
    },
    {
      heading: "Part II — Taxpayers Qualifying Under Bona Fide Residence Test",
      lines: [
        {
          index: "10",
          description: "Date bona fide residence began, and ended",
          box: {
            identifier: "10",
            // GAP: date range input cannot be expressed; using number_input as fallback
            value: { type: "number_input" },
          },
        },
        {
          index: "11",
          description:
            "Kind of living quarters in foreign country: a Purchased house, b Rented house or apartment, c Rented room, d Quarters furnished by employer",
          box: {
            identifier: "11",
            // GAP: multi-checkbox selection cannot be expressed; using number_input as fallback
            value: { type: "number_input" },
          },
        },
        {
          index: "12a",
          description:
            "Did any of your family live with you abroad during any part of the tax year?",
          box: {
            identifier: "12a",
            value: { type: "checkbox_input" },
          },
        },
        {
          index: "12b",
          description: 'If "Yes," who and for what period?',
          box: {
            identifier: "12b",
            // GAP: no text_input value type; using number_input as fallback
            value: { type: "number_input" },
          },
        },
        {
          index: "13a",
          description:
            "Have you submitted a statement to the authorities of the foreign country where you claim bona fide residence that you aren't a resident of that country? See instructions.",
          box: {
            identifier: "13a",
            value: { type: "checkbox_input" },
          },
        },
        {
          index: "13b",
          description:
            "Are you required to pay income tax to the country where you claim bona fide residence? See instructions.",
          box: {
            identifier: "13b",
            value: { type: "checkbox_input" },
          },
        },
        {
          index: "14",
          description:
            "If you were present in the United States or its territories during the tax year, complete columns (a)–(d) below. Don't include the income from column (d) in Part IV, but report it on Form 1040 or 1040-SR.",
          box: {
            identifier: "14",
            // GAP: multi-row table input cannot be expressed; using number_input as fallback
            value: { type: "number_input" },
          },
        },
        {
          index: "15a",
          description:
            "List any contractual terms or other conditions relating to the length of your employment abroad.",
          box: {
            identifier: "15a",
            // GAP: no text_input value type; using number_input as fallback
            value: { type: "number_input" },
          },
        },
        {
          index: "15b",
          description:
            "Enter the type of visa under which you entered the foreign country.",
          box: {
            identifier: "15b",
            // GAP: no text_input value type; using number_input as fallback
            value: { type: "number_input" },
          },
        },
        {
          index: "15c",
          description:
            'Did your visa limit the length of your stay or employment in a foreign country? If "Yes," attach explanation.',
          box: {
            identifier: "15c",
            value: { type: "checkbox_input" },
          },
        },
        {
          index: "15d",
          description:
            "Did you maintain a home in the United States while living abroad?",
          box: {
            identifier: "15d",
            value: { type: "checkbox_input" },
          },
        },
        {
          index: "15e",
          description:
            'If "Yes," enter address of your home, whether it was rented, the names of the occupants, and their relationship to you.',
          box: {
            identifier: "15e",
            // GAP: no text_input value type; using number_input as fallback
            value: { type: "number_input" },
          },
        },
      ],
    },
    {
      heading: "Part III — Taxpayers Qualifying Under Physical Presence Test",
      lines: [
        {
          index: "16",
          description:
            "The physical presence test is based on the 12-month period from [date] through [date].",
          box: {
            identifier: "16",
            // GAP: date range input cannot be expressed; using number_input as fallback
            value: { type: "number_input" },
          },
        },
        {
          index: "17",
          description:
            "Enter your principal country of employment during your tax year.",
          box: {
            identifier: "17",
            // GAP: no text_input value type; using number_input as fallback
            value: { type: "number_input" },
          },
        },
        {
          index: "18",
          description:
            "If you traveled abroad during the 12-month period entered on line 16, complete columns (a)–(f) below. Exclude travel between foreign countries that didn't involve travel on or over international waters, or in or over the United States, for 24 hours or more. If you have no travel to report during the period, enter \"Physically present in a foreign country or countries for the entire 12-month period.\" Don't include the income from column (f) below in Part IV, but report it on Form 1040 or 1040-SR.",
          box: {
            identifier: "18",
            // GAP: multi-row table input with columns (a) Name of country (including U.S.), (b) Date arrived, (c) Date left, (d) Full days present in country, (e) Number of days in U.S. on business, (f) Income earned in U.S. on business (attach computation) cannot be expressed; using number_input as fallback
            value: { type: "number_input" },
          },
        },
      ],
    },
    {
      heading: "Part IV — All Taxpayers (2025 Foreign Earned Income)",
      lines: [
        {
          index: "19",
          description: "Total wages, salaries, bonuses, commissions, etc.",
          box: {
            identifier: "19",
            value: { type: "number_input" },
          },
        },
        {
          index: "20",
          description:
            "Allowable share of income for personal services performed (see instructions):",
          box: {
            identifier: "20",
            value: { type: "unused" },
          },
          children: [
            {
              index: "20a",
              description: "In a business (including farming) or profession",
              box: {
                identifier: "20a",
                value: { type: "number_input" },
              },
            },
            {
              index: "20b",
              description:
                "In a partnership. List partnership's name and address and type of income.",
              box: {
                identifier: "20b",
                value: { type: "number_input" },
              },
            },
          ],
        },
        {
          index: "21",
          description:
            "Noncash income (market value of property or facilities furnished by employer—attach statement showing how it was determined):",
          box: {
            identifier: "21",
            value: { type: "unused" },
          },
          children: [
            {
              index: "21a",
              description: "Home (lodging)",
              box: {
                identifier: "21a",
                value: { type: "number_input" },
              },
            },
            {
              index: "21b",
              description: "Meals",
              box: {
                identifier: "21b",
                value: { type: "number_input" },
              },
            },
            {
              index: "21c",
              description: "Car",
              box: {
                identifier: "21c",
                value: { type: "number_input" },
              },
            },
            {
              index: "21d",
              description:
                "Other property or facilities. List type and amount.",
              box: {
                identifier: "21d",
                value: { type: "number_input" },
              },
            },
          ],
        },
        {
          index: "22",
          description:
            "Allowances, reimbursements, or expenses paid on your behalf for services you performed:",
          box: {
            identifier: "22",
            value: { type: "unused" },
          },
          children: [
            {
              index: "22a",
              description: "Cost of living and overseas differential",
              box: {
                identifier: "22a",
                value: { type: "number_input" },
              },
            },
            {
              index: "22b",
              description: "Family",
              box: {
                identifier: "22b",
                value: { type: "number_input" },
              },
            },
            {
              index: "22c",
              description: "Education",
              box: {
                identifier: "22c",
                value: { type: "number_input" },
              },
            },
            {
              index: "22d",
              description: "Home leave",
              box: {
                identifier: "22d",
                value: { type: "number_input" },
              },
            },
            {
              index: "22e",
              description: "Quarters",
              box: {
                identifier: "22e",
                value: { type: "number_input" },
              },
            },
            {
              index: "22f",
              description: "For any other purpose. List type and amount.",
              box: {
                identifier: "22f",
                value: { type: "number_input" },
              },
            },
            {
              index: "22g",
              description: "Add lines 22a through 22f",
              box: {
                identifier: "22g",
                value: {
                  type: "sum",
                  values: [
                    { type: "box_reference", box: "22a" },
                    { type: "box_reference", box: "22b" },
                    { type: "box_reference", box: "22c" },
                    { type: "box_reference", box: "22d" },
                    { type: "box_reference", box: "22e" },
                    { type: "box_reference", box: "22f" },
                  ],
                },
              },
            },
          ],
        },
        {
          index: "23",
          description: "Other foreign earned income. List type and amount.",
          box: {
            identifier: "23",
            value: { type: "number_input" },
          },
        },
        {
          index: "24",
          description: "Add lines 19 through 21d, line 22g, and line 23",
          box: {
            identifier: "24",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "19" },
                { type: "box_reference", box: "20a" },
                { type: "box_reference", box: "20b" },
                { type: "box_reference", box: "21a" },
                { type: "box_reference", box: "21b" },
                { type: "box_reference", box: "21c" },
                { type: "box_reference", box: "21d" },
                { type: "box_reference", box: "22g" },
                { type: "box_reference", box: "23" },
              ],
            },
          },
        },
        {
          index: "25",
          description:
            "Total amount of meals and lodging included on line 24 that is excludable (see instructions)",
          box: {
            identifier: "25",
            value: { type: "number_input" },
          },
        },
        {
          index: "26",
          description:
            "Subtract line 25 from line 24. Enter the result here and on line 27 on page 3. This is your 2025 foreign earned income.",
          box: {
            identifier: "26",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "24" },
              subtrahend: { type: "box_reference", box: "25" },
            },
          },
        },
      ],
    },
    {
      heading: "Part V — All Taxpayers",
      lines: [
        {
          index: "27",
          description: "Enter the amount from line 26",
          box: {
            identifier: "27",
            value: { type: "box_reference", box: "26" },
          },
        },
      ],
    },
    {
      heading:
        "Part VI — Taxpayers Claiming the Housing Exclusion and/or Deduction",
      lines: [
        {
          index: "28",
          description:
            "Qualified housing expenses for the tax year (see instructions)",
          box: {
            identifier: "28",
            value: { type: "number_input" },
          },
        },
        {
          index: "29a",
          description:
            "Enter location where housing expenses incurred. See instructions.",
          box: {
            identifier: "29a",
            // GAP: no text_input value type; using number_input as fallback
            value: { type: "number_input" },
          },
        },
        {
          index: "29b",
          description: "Enter limit on housing expenses. See instructions.",
          box: {
            identifier: "29b",
            value: { type: "number_input" },
          },
        },
        {
          index: "30",
          description: "Enter the smaller of line 28 or line 29b",
          box: {
            identifier: "30",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "28" },
                { type: "box_reference", box: "29b" },
              ],
            },
          },
        },
        {
          index: "31",
          description:
            "Number of days in your qualifying period that fall within your 2025 tax year (see instructions)",
          box: {
            identifier: "31",
            value: { type: "number_input" },
          },
        },
        {
          index: "32",
          description:
            "Multiply $56.99 by the number of days on line 31. If 365 is entered on line 31, enter $20,800 here.",
          box: {
            identifier: "32",
            value: { type: "number_input" },
          },
        },
        {
          index: "33",
          description:
            "Subtract line 32 from line 30. If the result is zero or less, don't complete the rest of this part or any of Part IX.",
          box: {
            identifier: "33",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "30" },
              subtrahend: { type: "box_reference", box: "32" },
            },
          },
        },
        {
          index: "34",
          description: "Enter employer-provided amounts. See instructions.",
          box: {
            identifier: "34",
            value: { type: "number_input" },
          },
        },
        {
          index: "35",
          description:
            'Divide line 34 by line 27. Enter the result as a decimal (rounded to at least three places), but don\'t enter more than "1.000".',
          box: {
            identifier: "35",
            value: {
              type: "minimum",
              values: [
                {
                  type: "quotient",
                  dividend: { type: "box_reference", box: "34" },
                  divisor: { type: "box_reference", box: "27" },
                },
                { type: "number_constant", value: 1 },
              ],
            },
          },
        },
        {
          index: "36",
          description:
            "Housing exclusion. Multiply line 33 by line 35. Enter the result but don't enter more than the amount on line 34. Also, complete Part VIII.",
          box: {
            identifier: "36",
            value: {
              type: "minimum",
              values: [
                {
                  type: "product",
                  values: [
                    { type: "box_reference", box: "33" },
                    { type: "box_reference", box: "35" },
                  ],
                },
                { type: "box_reference", box: "34" },
              ],
            },
          },
        },
      ],
    },
    {
      heading:
        "Part VII — Taxpayers Claiming the Foreign Earned Income Exclusion",
      lines: [
        {
          index: "37",
          description:
            "Maximum foreign earned income exclusion. Enter $130,000.",
          box: {
            identifier: "37",
            value: { type: "number_constant", value: 130000 },
          },
        },
        {
          index: "38",
          description:
            "If you completed Part VI, enter the number from line 31. All others, enter the number of days in your qualifying period that fall within your 2025 tax year. See the instructions for line 31.",
          box: {
            identifier: "38",
            value: { type: "number_input" },
          },
        },
        {
          index: "39",
          description:
            'If line 38 and the number of days in your 2025 tax year (usually 365) are the same, enter "1.000." Otherwise, divide line 38 by the number of days in your 2025 tax year and enter the result as a decimal (rounded to at least three places).',
          box: {
            identifier: "39",
            value: { type: "number_input" },
          },
        },
        {
          index: "40",
          description: "Multiply line 37 by line 39",
          box: {
            identifier: "40",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "37" },
                { type: "box_reference", box: "39" },
              ],
            },
          },
        },
        {
          index: "41",
          description: "Subtract line 36 from line 27",
          box: {
            identifier: "41",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "27" },
              subtrahend: { type: "box_reference", box: "36" },
            },
          },
        },
        {
          index: "42",
          description:
            "Foreign earned income exclusion. Enter the smaller of line 40 or line 41. Also, complete Part VIII.",
          box: {
            identifier: "42",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "40" },
                { type: "box_reference", box: "41" },
              ],
            },
          },
        },
      ],
    },
    {
      heading:
        "Part VIII — Taxpayers Claiming the Housing Exclusion, Foreign Earned Income Exclusion, or Both",
      lines: [
        {
          index: "43",
          description: "Add lines 36 and 42",
          box: {
            identifier: "43",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "36" },
                { type: "box_reference", box: "42" },
              ],
            },
          },
        },
        {
          index: "44",
          description:
            "Deductions allowed in figuring your adjusted gross income (Form 1040 or 1040-SR, line 11) that are allocable to the excluded income. See instructions and attach computation.",
          box: {
            identifier: "44",
            value: { type: "number_input" },
          },
        },
        {
          index: "45",
          description:
            "Subtract line 44 from line 43. Enter the result here and on Schedule 1 (Form 1040), line 8d. Complete the Foreign Earned Income Tax Worksheet in the Instructions for Form 1040 if you enter an amount on this line.",
          box: {
            identifier: "45",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "43" },
              subtrahend: { type: "box_reference", box: "44" },
            },
          },
        },
      ],
    },
    {
      heading:
        "Part IX — Taxpayers Claiming the Housing Deduction—Complete this part only if (a) line 33 is more than line 36, and (b) line 27 is more than line 43.",
      lines: [
        {
          index: "46",
          description: "Subtract line 36 from line 33",
          box: {
            identifier: "46",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "33" },
              subtrahend: { type: "box_reference", box: "36" },
            },
          },
        },
        {
          index: "47",
          description: "Subtract line 43 from line 27",
          box: {
            identifier: "47",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "27" },
              subtrahend: { type: "box_reference", box: "43" },
            },
          },
        },
        {
          index: "48",
          description: "Enter the smaller of line 46 or line 47",
          box: {
            identifier: "48",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "46" },
                { type: "box_reference", box: "47" },
              ],
            },
          },
        },
        {
          index: "49",
          description:
            "Housing deduction carryover from 2024 (from the Housing Deduction Carryover Worksheet in the instructions)",
          box: {
            identifier: "49",
            value: { type: "number_input" },
          },
        },
        {
          index: "50",
          description:
            "Housing deduction. Add lines 48 and 49. Enter the total here and on Schedule 1 (Form 1040), line 24j. Complete the Foreign Earned Income Tax Worksheet in the Instructions for Form 1040 if you enter an amount on this line.",
          box: {
            identifier: "50",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "48" },
                { type: "box_reference", box: "49" },
              ],
            },
          },
        },
      ],
    },
  ],
};
