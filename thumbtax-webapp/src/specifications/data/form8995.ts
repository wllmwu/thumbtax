import type { FormSpecification } from "#src/specifications/types/formSpecification";

// NOTE: Line 1 on Form 8995 is a table with sub-rows i–v and three columns:
// (a) Trade, business, or aggregation name
// (b) Taxpayer identification number
// (c) Qualified business income or (loss)
//
// GAP: The schema has no "text_input" value type, so columns (a) and (b) —
// which accept free-text name and EIN/SSN respectively — are represented as
// "number_input" as a placeholder.
//
// GAP: The schema has no "repeating_rows" construct. Sub-rows i–v are modeled
// as individual lines within a multi-column section.

export const Form8995: FormSpecification = {
  class: "f8995",
  title: "Form 8995",
  subtitle: "Qualified Business Income Deduction Simplified Computation",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-8995",
  category: "taxes",
  maxInstances: 1,
  sections: [
    // -------------------------------------------------------------------------
    // Line 1 — Qualified trade or business table (multi-column)
    // -------------------------------------------------------------------------
    {
      heading: "1 Trade, business, or aggregation information",
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
              identifier: "1i_a",
              // GAP: free-text name; no text_input type available
              value: { type: "number_input" },
            },
            {
              column: "(b)",
              identifier: "1i_b",
              // GAP: EIN/SSN; no text_input type available
              value: { type: "number_input" },
            },
            {
              column: "(c)",
              identifier: "1i_c",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "1ii",
          boxes: [
            {
              column: "(a)",
              identifier: "1ii_a",
              value: { type: "number_input" },
            },
            {
              column: "(b)",
              identifier: "1ii_b",
              value: { type: "number_input" },
            },
            {
              column: "(c)",
              identifier: "1ii_c",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "1iii",
          boxes: [
            {
              column: "(a)",
              identifier: "1iii_a",
              value: { type: "number_input" },
            },
            {
              column: "(b)",
              identifier: "1iii_b",
              value: { type: "number_input" },
            },
            {
              column: "(c)",
              identifier: "1iii_c",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "1iv",
          boxes: [
            {
              column: "(a)",
              identifier: "1iv_a",
              value: { type: "number_input" },
            },
            {
              column: "(b)",
              identifier: "1iv_b",
              value: { type: "number_input" },
            },
            {
              column: "(c)",
              identifier: "1iv_c",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "1v",
          boxes: [
            {
              column: "(a)",
              identifier: "1v_a",
              value: { type: "number_input" },
            },
            {
              column: "(b)",
              identifier: "1v_b",
              value: { type: "number_input" },
            },
            {
              column: "(c)",
              identifier: "1v_c",
              value: { type: "number_input" },
            },
          ],
        },
      ],
    },
    // -------------------------------------------------------------------------
    // Lines 2–17 — Qualified business income deduction computation
    // -------------------------------------------------------------------------
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
                { type: "box_reference", box: "1i_c" },
                { type: "box_reference", box: "1ii_c" },
                { type: "box_reference", box: "1iii_c" },
                { type: "box_reference", box: "1iv_c" },
                { type: "box_reference", box: "1v_c" },
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
            value: { type: "number_input" },
          },
        },
        {
          index: "12",
          description:
            "Enter your net capital gain, if any, increased by any qualified dividends (see instructions)",
          box: {
            identifier: "12",
            value: { type: "number_input" },
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
              type: "numerical_negation",
              value: {
                type: "non_negative_clamp",
                value: {
                  type: "numerical_negation",
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
          },
        },
        {
          index: "17",
          description:
            "Total qualified REIT dividends and PTP (loss) carryforward. Combine lines 6 and 7. If greater than zero, enter -0-",
          box: {
            identifier: "17",
            value: {
              type: "numerical_negation",
              value: {
                type: "non_negative_clamp",
                value: {
                  type: "numerical_negation",
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
          },
        },
      ],
    },
  ],
};
