import type { FormSpecification } from "#src/specifications/types/formSpecification";

export const Form1040SSE: FormSpecification = {
  class: "f1040sSE",
  title: "Schedule SE (Form 1040)",
  subtitle: "Self-Employment Tax",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-schedule-se-form-1040",
  category: "taxes",
  maxInstances: 1,
  sections: [
    {
      heading: "Part I Self-Employment Tax",
      lines: [
        {
          // Line A is a checkbox; using checkbox_input
          index: "A",
          description:
            "If you are a minister, member of a religious order, or Christian Science practitioner and you filed Form 4361, but you had $400 or more of other net earnings from self-employment, check here and continue with Part I",
          box: {
            identifier: "A",
            value: { type: "checkbox_input" },
          },
        },
        {
          index: "1a",
          description:
            "Net farm profit or (loss) from Schedule F, line 34, and farm partnerships, Schedule K-1 (Form 1065), box 14, code A",
          box: {
            identifier: "1a",
            value: { type: "number_input" },
          },
        },
        {
          index: "1b",
          description:
            "If you received social security retirement or disability benefits, enter the amount of Conservation Reserve Program payments included on Schedule F, line 4b, or listed on Schedule K-1 (Form 1065), box 20, code AQ",
          box: {
            identifier: "1b",
            // Entered as a negative (shown in parentheses on the form)
            value: { type: "number_input", coerceSign: "negative" },
          },
        },
        {
          index: "2",
          description:
            "Net profit or (loss) from Schedule C, line 31; and Schedule K-1 (Form 1065), box 14, code A (other than farming). See instructions for other income to report or if you are a minister or member of a religious order",
          box: {
            identifier: "2",
            value: { type: "number_input" },
          },
        },
        {
          index: "3",
          description: "Combine lines 1a, 1b, and 2",
          box: {
            identifier: "3",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "1a" },
                { type: "box_reference", box: "1b" },
                { type: "box_reference", box: "2" },
              ],
            },
          },
        },
        {
          index: "4a",
          description:
            "If line 3 is more than zero, multiply line 3 by 92.35% (0.9235). Otherwise, enter amount from line 3",
          box: {
            identifier: "4a",
            value: {
              type: "conditional",
              condition: {
                type: "comparison",
                value: { type: "box_reference", box: "3" },
                minimum: { type: "number_constant", value: 0 },
                strict: true,
              },
              trueValue: {
                type: "product",
                values: [
                  { type: "box_reference", box: "3" },
                  { type: "number_constant", value: 0.9235 },
                ],
              },
              falseValue: { type: "box_reference", box: "3" },
            },
          },
        },
        {
          index: "4b",
          description:
            "If you elect one or both of the optional methods, enter the total of lines 15 and 17 here",
          box: {
            identifier: "4b",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "15" },
                { type: "box_reference", box: "17" },
              ],
            },
          },
        },
        {
          index: "4c",
          description:
            "Combine lines 4a and 4b. If less than $400, stop; you don't owe self-employment tax. Exception: If less than $400 and you had church employee income, enter -0- and continue",
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
            "Enter your church employee income from Form W-2. See instructions for definition of church employee income",
          box: {
            identifier: "5a",
            value: { type: "number_input" },
          },
        },
        {
          index: "5b",
          description:
            "Multiply line 5a by 92.35% (0.9235). If less than $100, enter -0-",
          box: {
            identifier: "5b",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "product",
                values: [
                  { type: "box_reference", box: "5a" },
                  { type: "number_constant", value: 0.9235 },
                ],
              },
            },
          },
        },
        {
          index: "6",
          description: "Add lines 4c and 5b",
          box: {
            identifier: "6",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "4c" },
                { type: "box_reference", box: "5b" },
              ],
            },
          },
        },
        {
          index: "7",
          description:
            "Maximum amount of combined wages and self-employment earnings subject to social security tax or the 6.2% portion of the 7.65% railroad retirement (tier 1) tax for 2025",
          box: {
            identifier: "7",
            value: { type: "number_constant", value: 176100 },
          },
        },
        {
          index: "8a",
          description:
            "Total social security wages and tips (total of boxes 3 and 7 on Form(s) W-2) and railroad retirement (tier 1) compensation. If $176,100 or more, skip lines 8b through 10, and go to line 11",
          box: {
            identifier: "8a",
            value: { type: "number_input" },
          },
        },
        {
          index: "8b",
          description:
            "Unreported tips subject to social security tax from Form 4137, line 10",
          box: {
            identifier: "8b",
            value: { type: "number_input" },
          },
        },
        {
          index: "8c",
          description:
            "Wages subject to social security tax from Form 8919, line 10",
          box: {
            identifier: "8c",
            value: { type: "number_input" },
          },
        },
        {
          index: "8d",
          description: "Add lines 8a, 8b, and 8c",
          box: {
            identifier: "8d",
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
            "Subtract line 8d from line 7. If zero or less, enter -0- here and on line 10 and go to line 11",
          box: {
            identifier: "9",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "7" },
                subtrahend: { type: "box_reference", box: "8d" },
              },
            },
          },
        },
        {
          index: "10",
          description:
            "Multiply the smaller of line 6 or line 9 by 12.4% (0.124)",
          box: {
            identifier: "10",
            value: {
              type: "product",
              values: [
                {
                  type: "minimum",
                  values: [
                    { type: "box_reference", box: "6" },
                    { type: "box_reference", box: "9" },
                  ],
                },
                { type: "number_constant", value: 0.124 },
              ],
            },
          },
        },
        {
          index: "11",
          description: "Multiply line 6 by 2.9% (0.029)",
          box: {
            identifier: "11",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "6" },
                { type: "number_constant", value: 0.029 },
              ],
            },
          },
        },
        {
          index: "12",
          description:
            "Self-employment tax. Add lines 10 and 11. Enter here and on Schedule 2 (Form 1040), line 4, or Form 1040-SS, Part I, line 3",
          box: {
            identifier: "12",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "10" },
                { type: "box_reference", box: "11" },
              ],
            },
          },
        },
        {
          index: "13",
          description:
            "Deduction for one-half of self-employment tax. Multiply line 12 by 50% (0.50). Enter here and on Schedule 1 (Form 1040), line 15",
          box: {
            identifier: "13",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "12" },
                { type: "number_constant", value: 0.5 },
              ],
            },
          },
        },
      ],
    },
    {
      heading:
        "Part II Optional Methods To Figure Net Earnings (see instructions)",
      lines: [
        {
          index: "14",
          description: "Maximum income for optional methods",
          box: {
            identifier: "14",
            value: { type: "number_constant", value: 7240 },
          },
        },
        {
          index: "15",
          description:
            "Enter the smaller of: two-thirds (2/3) of gross farm income (not less than zero) or $7,240. Also, include this amount on line 4b above",
          box: {
            identifier: "15",
            // Gap: the form requires computing 2/3 of gross farm income (from Sch. F, line 9 / Sch. K-1),
            // which is not a directly available box reference here; defaulting to number_input.
            value: { type: "number_input" },
          },
        },
        {
          index: "16",
          description: "Subtract line 15 from line 14",
          box: {
            identifier: "16",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "14" },
              subtrahend: { type: "box_reference", box: "15" },
            },
          },
        },
        {
          index: "17",
          description:
            "Enter the smaller of: two-thirds (2/3) of gross nonfarm income (not less than zero) or the amount on line 16. Also, include this amount on line 4b above",
          box: {
            identifier: "17",
            // Gap: the form requires computing 2/3 of gross nonfarm income (from Sch. C, line 7 / Sch. K-1),
            // which is not a directly available box reference here; defaulting to number_input.
            value: { type: "number_input" },
          },
        },
      ],
    },
  ],
};
