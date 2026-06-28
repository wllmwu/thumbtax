import type { FormSpecification } from "@thumbtax/forms";

export const Form8995: FormSpecification = {
  class: "f8995",
  title: "Form 8995",
  subtitle: "Qualified Business Income Deduction Simplified Computation",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-8995",
  category: "taxes",
  maxInstances: 1,
  sections: [
    {
      columns: [
        { index: "(a)", description: "Trade, business, or aggregation name" },
        { index: "(b)", description: "Taxpayer identification number" },
        { index: "(c)", description: "Qualified business income or (loss)" },
      ],
      lines: [
        {
          index: "1i",
          boxes: [
            {
              column: "(a)",
              identifier: "1i(a)",
              value: { type: "unused" },
            },
            {
              column: "(b)",
              identifier: "1i(b)",
              value: { type: "unused" },
            },
            {
              column: "(c)",
              identifier: "1i(c)",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "1ii",
          boxes: [
            {
              column: "(a)",
              identifier: "1ii(a)",
              value: { type: "unused" },
            },
            {
              column: "(b)",
              identifier: "1ii(b)",
              value: { type: "unused" },
            },
            {
              column: "(c)",
              identifier: "1ii(c)",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "1iii",
          boxes: [
            {
              column: "(a)",
              identifier: "1iii(a)",
              value: { type: "unused" },
            },
            {
              column: "(b)",
              identifier: "1iii(b)",
              value: { type: "unused" },
            },
            {
              column: "(c)",
              identifier: "1iii(c)",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "1iv",
          boxes: [
            {
              column: "(a)",
              identifier: "1iv(a)",
              value: { type: "unused" },
            },
            {
              column: "(b)",
              identifier: "1iv(b)",
              value: { type: "unused" },
            },
            {
              column: "(c)",
              identifier: "1iv(c)",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "1v",
          boxes: [
            {
              column: "(a)",
              identifier: "1v(a)",
              value: { type: "unused" },
            },
            {
              column: "(b)",
              identifier: "1v(b)",
              value: { type: "unused" },
            },
            {
              column: "(c)",
              identifier: "1v(c)",
              value: { type: "number_input" },
            },
          ],
        },
      ],
    },
    {
      lines: [
        {
          index: "2",
          description:
            "Total qualified business income or (loss). Combine lines 1i through 1v, column (c)",
          box: {
            identifier: "2",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "1i(c)" },
                { type: "box_reference", box: "1ii(c)" },
                { type: "box_reference", box: "1iii(c)" },
                { type: "box_reference", box: "1iv(c)" },
                { type: "box_reference", box: "1v(c)" },
              ],
            },
          },
        },
        {
          index: "3",
          description:
            "Qualified business net (loss) carryforward from the prior year",
          box: {
            identifier: "3",
            value: { type: "number_input", coerceSign: "negative" },
          },
        },
        {
          index: "4",
          description:
            "Total qualified business income. Combine lines 2 and 3. If zero or less, enter -0-",
          box: {
            identifier: "4",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "sum",
                values: [
                  { type: "box_reference", box: "2" },
                  { type: "box_reference", box: "3" },
                ],
              },
            },
          },
        },
        {
          index: "5",
          description:
            "Qualified business income component. Multiply line 4 by 20% (0.20)",
          box: {
            identifier: "5",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "4" },
                { type: "number_constant", value: 0.2 },
              ],
            },
          },
        },
        {
          index: "6",
          description:
            "Qualified REIT dividends and publicly traded partnership (PTP) income or (loss) (see instructions)",
          box: {
            identifier: "6",
            value: { type: "number_input" },
          },
        },
        {
          index: "7",
          description:
            "Qualified REIT dividends and qualified PTP (loss) carryforward from the prior year",
          box: {
            identifier: "7",
            value: { type: "number_input", coerceSign: "negative" },
          },
        },
        {
          index: "8",
          description:
            "Total qualified REIT dividends and PTP income. Combine lines 6 and 7. If zero or less, enter -0-",
          box: {
            identifier: "8",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "sum",
                values: [
                  { type: "box_reference", box: "6" },
                  { type: "box_reference", box: "7" },
                ],
              },
            },
          },
        },
        {
          index: "9",
          description: "REIT and PTP component. Multiply line 8 by 20% (0.20)",
          box: {
            identifier: "9",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "8" },
                { type: "number_constant", value: 0.2 },
              ],
            },
          },
        },
        {
          index: "10",
          description:
            "Qualified business income deduction before the income limitation. Add lines 5 and 9",
          box: {
            identifier: "10",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "5" },
                { type: "box_reference", box: "9" },
              ],
            },
          },
        },
        {
          index: "11",
          description:
            "Taxable income before qualified business income deduction (see instructions)",
          box: {
            identifier: "11",
            value: {
              type: "difference",
              minuend: {
                type: "box_reference",
                form: "f1040",
                box: "11a",
                required: true,
              },
              subtrahend: {
                type: "sum",
                values: [
                  {
                    type: "box_reference",
                    form: "f1040",
                    box: "12e",
                    required: true,
                  },
                  {
                    type: "box_reference",
                    form: "f1040",
                    box: "13b",
                    required: true,
                  },
                ],
              },
            },
          },
        },
        {
          index: "12",
          description:
            "Enter your net capital gain, if any, increased by any qualified dividends (see instructions)",
          box: {
            identifier: "12",
            value: {
              type: "sum",
              values: [
                {
                  type: "box_reference",
                  form: "f1040",
                  box: "3a",
                  required: true,
                },
                {
                  type: "conditional",
                  condition: { type: "form_instance_count", form: "f1040sD" },
                  trueValue: {
                    type: "non_negative_clamp",
                    value: {
                      type: "minimum",
                      values: [
                        { type: "box_reference", form: "f1040sD", box: "15" },
                        { type: "box_reference", form: "f1040sD", box: "16" },
                      ],
                    },
                  },
                  falseValue: {
                    type: "box_reference",
                    form: "f1040",
                    box: "7a",
                    required: true,
                  },
                },
              ],
            },
          },
        },
        {
          index: "13",
          description:
            "Subtract line 12 from line 11. If zero or less, enter -0-",
          box: {
            identifier: "13",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "11" },
                subtrahend: { type: "box_reference", box: "12" },
              },
            },
          },
        },
        {
          index: "14",
          description: "Income limitation. Multiply line 13 by 20% (0.20)",
          box: {
            identifier: "14",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "13" },
                { type: "number_constant", value: 0.2 },
              ],
            },
          },
        },
        {
          index: "15",
          description:
            "Qualified business income deduction. Enter the smaller of line 10 or line 14. Also enter this amount on the applicable line of your return (see instructions)",
          box: {
            identifier: "15",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "10" },
                { type: "box_reference", box: "14" },
              ],
            },
          },
        },
        {
          index: "16",
          description:
            "Total qualified business (loss) carryforward. Combine lines 2 and 3. If greater than zero, enter -0-",
          box: {
            identifier: "16",
            value: {
              type: "non_positive_clamp",
              value: {
                type: "sum",
                values: [
                  { type: "box_reference", box: "2" },
                  { type: "box_reference", box: "3" },
                ],
              },
            },
          },
        },
        {
          index: "17",
          description:
            "Total qualified REIT dividends and PTP (loss) carryforward. Combine lines 6 and 7. If greater than zero, enter -0-",
          box: {
            identifier: "17",
            value: {
              type: "non_positive_clamp",
              value: {
                type: "sum",
                values: [
                  { type: "box_reference", box: "6" },
                  { type: "box_reference", box: "7" },
                ],
              },
            },
          },
        },
      ],
    },
  ],
};
