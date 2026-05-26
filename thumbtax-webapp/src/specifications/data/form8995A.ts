import type { FormSpecification } from "#src/specifications/types/formSpecification";

// NOTE: Part I, Line 1 is a table with rows A, B, C and five columns:
// (a) Trade, business, or aggregation name
// (b) Check if specified service
// (c) Check if aggregation
// (d) Taxpayer identification number
// (e) Check if patron
//
// GAP: The schema has no "text_input" value type, so column (a) (trade/business name)
// and column (d) (taxpayer identification number) are represented as "number_input"
// as a placeholder.
//
// GAP: The schema has no "checkbox_group" or per-row checkbox construct. Columns (b),
// (c), and (e) are checkboxes per row; each is represented as "checkbox_input".
//
// Part II lines 2–15 and Part III lines 17–19, 25–26 each have three columns (A, B, C)
// representing three separate trades, businesses, or aggregations. These are modeled
// as multi-column sections.
//
// Part III lines 20–24 are single-value lines (not per-trade) but are embedded within
// Part III's multi-column layout. They are represented with single boxes under column A
// with a note that columns B and C do not apply.
//
// GAP: The schema has no "percent_input" type. Line 24 (Phase-in percentage, %)
// is represented as "number_input".

export const Form8995A: FormSpecification = {
  class: "f8995A",
  title: "Form 8995-A",
  subtitle: "Qualified Business Income Deduction",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-8995-a",
  category: "taxes",
  maxInstances: 1,
  sections: [
    // -------------------------------------------------------------------------
    // Part I — Trade, Business, or Aggregation Information
    // -------------------------------------------------------------------------
    {
      heading: "Part I Trade, Business, or Aggregation Information",
      columns: [
        { index: "(a)", description: "Trade, business, or aggregation name" },
        { index: "(b)", description: "Check if specified service" },
        { index: "(c)", description: "Check if aggregation" },
        { index: "(d)", description: "Taxpayer identification number" },
        { index: "(e)", description: "Check if patron" },
      ],
      lines: [
        {
          index: "1A",
          description: "Trade, business, or aggregation A",
          boxes: [
            {
              column: "(a)",
              identifier: "1A_a",
              // GAP: free-text name; no text_input type available
              value: { type: "number_input" },
            },
            {
              column: "(b)",
              identifier: "1A_b",
              value: { type: "checkbox_input" },
            },
            {
              column: "(c)",
              identifier: "1A_c",
              value: { type: "checkbox_input" },
            },
            {
              column: "(d)",
              identifier: "1A_d",
              // GAP: EIN/SSN; no text_input type available
              value: { type: "number_input" },
            },
            {
              column: "(e)",
              identifier: "1A_e",
              value: { type: "checkbox_input" },
            },
          ],
        },
        {
          index: "1B",
          description: "Trade, business, or aggregation B",
          boxes: [
            {
              column: "(a)",
              identifier: "1B_a",
              value: { type: "number_input" },
            },
            {
              column: "(b)",
              identifier: "1B_b",
              value: { type: "checkbox_input" },
            },
            {
              column: "(c)",
              identifier: "1B_c",
              value: { type: "checkbox_input" },
            },
            {
              column: "(d)",
              identifier: "1B_d",
              value: { type: "number_input" },
            },
            {
              column: "(e)",
              identifier: "1B_e",
              value: { type: "checkbox_input" },
            },
          ],
        },
        {
          index: "1C",
          description: "Trade, business, or aggregation C",
          boxes: [
            {
              column: "(a)",
              identifier: "1C_a",
              value: { type: "number_input" },
            },
            {
              column: "(b)",
              identifier: "1C_b",
              value: { type: "checkbox_input" },
            },
            {
              column: "(c)",
              identifier: "1C_c",
              value: { type: "checkbox_input" },
            },
            {
              column: "(d)",
              identifier: "1C_d",
              value: { type: "number_input" },
            },
            {
              column: "(e)",
              identifier: "1C_e",
              value: { type: "checkbox_input" },
            },
          ],
        },
      ],
    },
    // -------------------------------------------------------------------------
    // Part II — Determine Your Adjusted Qualified Business Income
    // Lines 2–15 have three columns (A, B, C), one per trade/business/aggregation.
    // Line 16 is a single-value total.
    // -------------------------------------------------------------------------
    {
      heading: "Part II Determine Your Adjusted Qualified Business Income",
      columns: [{ index: "A" }, { index: "B" }, { index: "C" }],
      lines: [
        {
          index: "2",
          description:
            "Qualified business income from the trade, business, or aggregation. See instructions",
          boxes: [
            { column: "A", identifier: "2_A", value: { type: "number_input" } },
            { column: "B", identifier: "2_B", value: { type: "number_input" } },
            { column: "C", identifier: "2_C", value: { type: "number_input" } },
          ],
        },
        {
          index: "3",
          description:
            "Multiply line 2 by 20% (0.20). If your taxable income is $197,300 or less ($394,600 if married filing jointly), skip lines 4 through 12 and enter the amount from line 3 on line 13",
          boxes: [
            {
              column: "A",
              identifier: "3_A",
              value: {
                type: "product",
                values: [
                  { type: "box_reference", box: "2_A" },
                  { type: "number_constant", value: 0.2 },
                ],
              },
            },
            {
              column: "B",
              identifier: "3_B",
              value: {
                type: "product",
                values: [
                  { type: "box_reference", box: "2_B" },
                  { type: "number_constant", value: 0.2 },
                ],
              },
            },
            {
              column: "C",
              identifier: "3_C",
              value: {
                type: "product",
                values: [
                  { type: "box_reference", box: "2_C" },
                  { type: "number_constant", value: 0.2 },
                ],
              },
            },
          ],
        },
        {
          index: "4",
          description:
            "Allocable share of W-2 wages from the trade, business, or aggregation",
          boxes: [
            { column: "A", identifier: "4_A", value: { type: "number_input" } },
            { column: "B", identifier: "4_B", value: { type: "number_input" } },
            { column: "C", identifier: "4_C", value: { type: "number_input" } },
          ],
        },
        {
          index: "5",
          description: "Multiply line 4 by 50% (0.50)",
          boxes: [
            {
              column: "A",
              identifier: "5_A",
              value: {
                type: "product",
                values: [
                  { type: "box_reference", box: "4_A" },
                  { type: "number_constant", value: 0.5 },
                ],
              },
            },
            {
              column: "B",
              identifier: "5_B",
              value: {
                type: "product",
                values: [
                  { type: "box_reference", box: "4_B" },
                  { type: "number_constant", value: 0.5 },
                ],
              },
            },
            {
              column: "C",
              identifier: "5_C",
              value: {
                type: "product",
                values: [
                  { type: "box_reference", box: "4_C" },
                  { type: "number_constant", value: 0.5 },
                ],
              },
            },
          ],
        },
        {
          index: "6",
          description: "Multiply line 4 by 25% (0.25)",
          boxes: [
            {
              column: "A",
              identifier: "6_A",
              value: {
                type: "product",
                values: [
                  { type: "box_reference", box: "4_A" },
                  { type: "number_constant", value: 0.25 },
                ],
              },
            },
            {
              column: "B",
              identifier: "6_B",
              value: {
                type: "product",
                values: [
                  { type: "box_reference", box: "4_B" },
                  { type: "number_constant", value: 0.25 },
                ],
              },
            },
            {
              column: "C",
              identifier: "6_C",
              value: {
                type: "product",
                values: [
                  { type: "box_reference", box: "4_C" },
                  { type: "number_constant", value: 0.25 },
                ],
              },
            },
          ],
        },
        {
          index: "7",
          description:
            "Allocable share of the unadjusted basis immediately after acquisition (UBIA) of all qualified property",
          boxes: [
            { column: "A", identifier: "7_A", value: { type: "number_input" } },
            { column: "B", identifier: "7_B", value: { type: "number_input" } },
            { column: "C", identifier: "7_C", value: { type: "number_input" } },
          ],
        },
        {
          index: "8",
          description: "Multiply line 7 by 2.5% (0.025)",
          boxes: [
            {
              column: "A",
              identifier: "8_A",
              value: {
                type: "product",
                values: [
                  { type: "box_reference", box: "7_A" },
                  { type: "number_constant", value: 0.025 },
                ],
              },
            },
            {
              column: "B",
              identifier: "8_B",
              value: {
                type: "product",
                values: [
                  { type: "box_reference", box: "7_B" },
                  { type: "number_constant", value: 0.025 },
                ],
              },
            },
            {
              column: "C",
              identifier: "8_C",
              value: {
                type: "product",
                values: [
                  { type: "box_reference", box: "7_C" },
                  { type: "number_constant", value: 0.025 },
                ],
              },
            },
          ],
        },
        {
          index: "9",
          description: "Add lines 6 and 8",
          boxes: [
            {
              column: "A",
              identifier: "9_A",
              value: {
                type: "sum",
                values: [
                  { type: "box_reference", box: "6_A" },
                  { type: "box_reference", box: "8_A" },
                ],
              },
            },
            {
              column: "B",
              identifier: "9_B",
              value: {
                type: "sum",
                values: [
                  { type: "box_reference", box: "6_B" },
                  { type: "box_reference", box: "8_B" },
                ],
              },
            },
            {
              column: "C",
              identifier: "9_C",
              value: {
                type: "sum",
                values: [
                  { type: "box_reference", box: "6_C" },
                  { type: "box_reference", box: "8_C" },
                ],
              },
            },
          ],
        },
        {
          index: "10",
          description: "Enter the greater of line 5 or line 9",
          boxes: [
            {
              column: "A",
              identifier: "10_A",
              value: {
                type: "maximum",
                values: [
                  { type: "box_reference", box: "5_A" },
                  { type: "box_reference", box: "9_A" },
                ],
              },
            },
            {
              column: "B",
              identifier: "10_B",
              value: {
                type: "maximum",
                values: [
                  { type: "box_reference", box: "5_B" },
                  { type: "box_reference", box: "9_B" },
                ],
              },
            },
            {
              column: "C",
              identifier: "10_C",
              value: {
                type: "maximum",
                values: [
                  { type: "box_reference", box: "5_C" },
                  { type: "box_reference", box: "9_C" },
                ],
              },
            },
          ],
        },
        {
          index: "11",
          description:
            "W-2 wage and UBIA of qualified property limitation. Enter the smaller of line 3 or line 10",
          boxes: [
            {
              column: "A",
              identifier: "11_A",
              value: {
                type: "minimum",
                values: [
                  { type: "box_reference", box: "3_A" },
                  { type: "box_reference", box: "10_A" },
                ],
              },
            },
            {
              column: "B",
              identifier: "11_B",
              value: {
                type: "minimum",
                values: [
                  { type: "box_reference", box: "3_B" },
                  { type: "box_reference", box: "10_B" },
                ],
              },
            },
            {
              column: "C",
              identifier: "11_C",
              value: {
                type: "minimum",
                values: [
                  { type: "box_reference", box: "3_C" },
                  { type: "box_reference", box: "10_C" },
                ],
              },
            },
          ],
        },
        {
          index: "12",
          description:
            "Phased-in reduction. Enter the amount from line 26, if any",
          boxes: [
            {
              column: "A",
              identifier: "12_A",
              value: { type: "number_input" },
            },
            {
              column: "B",
              identifier: "12_B",
              value: { type: "number_input" },
            },
            {
              column: "C",
              identifier: "12_C",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "13",
          description:
            "Qualified business income deduction before patron reduction. Enter the greater of line 11 or line 12",
          boxes: [
            {
              column: "A",
              identifier: "13_A",
              value: {
                type: "maximum",
                values: [
                  { type: "box_reference", box: "11_A" },
                  { type: "box_reference", box: "12_A" },
                ],
              },
            },
            {
              column: "B",
              identifier: "13_B",
              value: {
                type: "maximum",
                values: [
                  { type: "box_reference", box: "11_B" },
                  { type: "box_reference", box: "12_B" },
                ],
              },
            },
            {
              column: "C",
              identifier: "13_C",
              value: {
                type: "maximum",
                values: [
                  { type: "box_reference", box: "11_C" },
                  { type: "box_reference", box: "12_C" },
                ],
              },
            },
          ],
        },
        {
          index: "14",
          description:
            "Patron reduction. Enter the amount from Schedule D (Form 8995-A), line 6, if any. See instructions",
          boxes: [
            {
              column: "A",
              identifier: "14_A",
              value: { type: "number_input" },
            },
            {
              column: "B",
              identifier: "14_B",
              value: { type: "number_input" },
            },
            {
              column: "C",
              identifier: "14_C",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "15",
          description:
            "Qualified business income component. Subtract line 14 from line 13",
          boxes: [
            {
              column: "A",
              identifier: "15_A",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "13_A" },
                subtrahend: { type: "box_reference", box: "14_A" },
              },
            },
            {
              column: "B",
              identifier: "15_B",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "13_B" },
                subtrahend: { type: "box_reference", box: "14_B" },
              },
            },
            {
              column: "C",
              identifier: "15_C",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "13_C" },
                subtrahend: { type: "box_reference", box: "14_C" },
              },
            },
          ],
        },
      ],
    },
    // Line 16 is a single-column total (not per-trade)
    {
      lines: [
        {
          index: "16",
          description:
            "Total qualified business income component. Add all amounts reported on line 15",
          box: {
            identifier: "16",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "15_A" },
                { type: "box_reference", box: "15_B" },
                { type: "box_reference", box: "15_C" },
              ],
            },
          },
        },
      ],
    },
    // -------------------------------------------------------------------------
    // Part III — Phased-in Reduction
    // Lines 17–19 and 25–26 have three columns (A, B, C).
    // Lines 20–24 are single-value (not per-trade/business).
    // -------------------------------------------------------------------------
    {
      heading: "Part III Phased-in Reduction",
      columns: [{ index: "A" }, { index: "B" }, { index: "C" }],
      lines: [
        {
          index: "17",
          description: "Enter the amounts from line 3",
          boxes: [
            {
              column: "A",
              identifier: "17_A",
              value: { type: "box_reference", box: "3_A" },
            },
            {
              column: "B",
              identifier: "17_B",
              value: { type: "box_reference", box: "3_B" },
            },
            {
              column: "C",
              identifier: "17_C",
              value: { type: "box_reference", box: "3_C" },
            },
          ],
        },
        {
          index: "18",
          description: "Enter the amounts from line 10",
          boxes: [
            {
              column: "A",
              identifier: "18_A",
              value: { type: "box_reference", box: "10_A" },
            },
            {
              column: "B",
              identifier: "18_B",
              value: { type: "box_reference", box: "10_B" },
            },
            {
              column: "C",
              identifier: "18_C",
              value: { type: "box_reference", box: "10_C" },
            },
          ],
        },
        {
          index: "19",
          description: "Subtract line 18 from line 17",
          boxes: [
            {
              column: "A",
              identifier: "19_A",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "17_A" },
                subtrahend: { type: "box_reference", box: "18_A" },
              },
            },
            {
              column: "B",
              identifier: "19_B",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "17_B" },
                subtrahend: { type: "box_reference", box: "18_B" },
              },
            },
            {
              column: "C",
              identifier: "19_C",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "17_C" },
                subtrahend: { type: "box_reference", box: "18_C" },
              },
            },
          ],
        },
        // Lines 20–24 are single-value lines (apply across all trades/businesses).
        // They are represented under column A; columns B and C do not apply.
        {
          index: "20",
          description:
            "Taxable income before qualified business income deduction",
          boxes: [
            {
              column: "A",
              identifier: "20",
              value: { type: "number_input" },
            },
            {
              column: "B",
              identifier: "20_B_unused",
              value: { type: "unused" },
            },
            {
              column: "C",
              identifier: "20_C_unused",
              value: { type: "unused" },
            },
          ],
        },
        {
          index: "21",
          description:
            "Threshold. Enter $197,300 ($394,600 if married filing jointly)",
          boxes: [
            {
              column: "A",
              identifier: "21",
              value: {
                type: "filing_status_map",
                values: {
                  married_filing_jointly: {
                    type: "number_constant",
                    value: 394600,
                  },
                },
                default: { type: "number_constant", value: 197300 },
              },
            },
            {
              column: "B",
              identifier: "21_B_unused",
              value: { type: "unused" },
            },
            {
              column: "C",
              identifier: "21_C_unused",
              value: { type: "unused" },
            },
          ],
        },
        {
          index: "22",
          description: "Subtract line 21 from line 20",
          boxes: [
            {
              column: "A",
              identifier: "22",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "20" },
                subtrahend: { type: "box_reference", box: "21" },
              },
            },
            {
              column: "B",
              identifier: "22_B_unused",
              value: { type: "unused" },
            },
            {
              column: "C",
              identifier: "22_C_unused",
              value: { type: "unused" },
            },
          ],
        },
        {
          index: "23",
          description:
            "Phase-in range. Enter $50,000 ($100,000 if married filing jointly)",
          boxes: [
            {
              column: "A",
              identifier: "23",
              value: {
                type: "filing_status_map",
                values: {
                  married_filing_jointly: {
                    type: "number_constant",
                    value: 100000,
                  },
                },
                default: { type: "number_constant", value: 50000 },
              },
            },
            {
              column: "B",
              identifier: "23_B_unused",
              value: { type: "unused" },
            },
            {
              column: "C",
              identifier: "23_C_unused",
              value: { type: "unused" },
            },
          ],
        },
        {
          index: "24",
          description: "Phase-in percentage. Divide line 22 by line 23",
          // GAP: result is a percentage; no percent_input or percent display type available
          boxes: [
            {
              column: "A",
              identifier: "24",
              value: {
                type: "quotient",
                dividend: { type: "box_reference", box: "22" },
                divisor: { type: "box_reference", box: "23" },
              },
            },
            {
              column: "B",
              identifier: "24_B_unused",
              value: { type: "unused" },
            },
            {
              column: "C",
              identifier: "24_C_unused",
              value: { type: "unused" },
            },
          ],
        },
        {
          index: "25",
          description: "Total phase-in reduction. Multiply line 19 by line 24",
          boxes: [
            {
              column: "A",
              identifier: "25_A",
              value: {
                type: "product",
                values: [
                  { type: "box_reference", box: "19_A" },
                  { type: "box_reference", box: "24" },
                ],
              },
            },
            {
              column: "B",
              identifier: "25_B",
              value: {
                type: "product",
                values: [
                  { type: "box_reference", box: "19_B" },
                  { type: "box_reference", box: "24" },
                ],
              },
            },
            {
              column: "C",
              identifier: "25_C",
              value: {
                type: "product",
                values: [
                  { type: "box_reference", box: "19_C" },
                  { type: "box_reference", box: "24" },
                ],
              },
            },
          ],
        },
        {
          index: "26",
          description:
            "Qualified business income after phase-in reduction. Subtract line 25 from line 17. Enter this amount here and on line 12, for the corresponding trade or business",
          boxes: [
            {
              column: "A",
              identifier: "26_A",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "17_A" },
                subtrahend: { type: "box_reference", box: "25_A" },
              },
            },
            {
              column: "B",
              identifier: "26_B",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "17_B" },
                subtrahend: { type: "box_reference", box: "25_B" },
              },
            },
            {
              column: "C",
              identifier: "26_C",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "17_C" },
                subtrahend: { type: "box_reference", box: "25_C" },
              },
            },
          ],
        },
      ],
    },
    // -------------------------------------------------------------------------
    // Part IV — Determine Your Qualified Business Income Deduction
    // -------------------------------------------------------------------------
    {
      heading: "Part IV Determine Your Qualified Business Income Deduction",
      lines: [
        {
          index: "27",
          description:
            "Total qualified business income component from all qualified trades, businesses, or aggregations. Enter the amount from line 16",
          box: {
            identifier: "27",
            value: { type: "box_reference", box: "16" },
          },
        },
        {
          index: "28",
          description:
            "Qualified REIT dividends and publicly traded partnership (PTP) income or (loss). See instructions",
          box: {
            identifier: "28",
            value: { type: "number_input" },
          },
        },
        {
          index: "29",
          description:
            "Qualified REIT dividends and PTP (loss) carryforward from prior years",
          box: {
            identifier: "29",
            value: { type: "number_input", coerceSign: "negative" },
          },
        },
        {
          index: "30",
          description:
            "Total qualified REIT dividends and PTP income. Combine lines 28 and 29. If less than zero, enter -0-",
          box: {
            identifier: "30",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "sum",
                values: [
                  { type: "box_reference", box: "28" },
                  { type: "box_reference", box: "29" },
                ],
              },
            },
          },
        },
        {
          index: "31",
          description: "REIT and PTP component. Multiply line 30 by 20% (0.20)",
          box: {
            identifier: "31",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "30" },
                { type: "number_constant", value: 0.2 },
              ],
            },
          },
        },
        {
          index: "32",
          description:
            "Qualified business income deduction before the income limitation. Add lines 27 and 31",
          box: {
            identifier: "32",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "27" },
                { type: "box_reference", box: "31" },
              ],
            },
          },
        },
        {
          index: "33",
          description:
            "Taxable income before qualified business income deduction",
          box: {
            identifier: "33",
            value: { type: "number_input" },
          },
        },
        {
          index: "34",
          description:
            "Enter your net capital gain, if any, increased by any qualified dividends (see instructions)",
          box: {
            identifier: "34",
            value: { type: "number_input" },
          },
        },
        {
          index: "35",
          description:
            "Subtract line 34 from line 33. If zero or less, enter -0-",
          box: {
            identifier: "35",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "33" },
                subtrahend: { type: "box_reference", box: "34" },
              },
            },
          },
        },
        {
          index: "36",
          description: "Income limitation. Multiply line 35 by 20% (0.20)",
          box: {
            identifier: "36",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "35" },
                { type: "number_constant", value: 0.2 },
              ],
            },
          },
        },
        {
          index: "37",
          description:
            "Qualified business income deduction before the domestic production activities deduction (DPAD) under section 199A(g). Enter the smaller of line 32 or line 36",
          box: {
            identifier: "37",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "32" },
                { type: "box_reference", box: "36" },
              ],
            },
          },
        },
        {
          index: "38",
          description:
            "DPAD under section 199A(g) allocated from an agricultural or horticultural cooperative. Don't enter more than line 33 minus line 37",
          box: {
            identifier: "38",
            value: { type: "number_input" },
          },
        },
        {
          index: "39",
          description:
            "Total qualified business income deduction. Add lines 37 and 38",
          box: {
            identifier: "39",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "37" },
                { type: "box_reference", box: "38" },
              ],
            },
          },
        },
        {
          index: "40",
          description:
            "Total qualified REIT dividends and PTP (loss) carryforward. Combine lines 28 and 29. If zero or greater, enter -0-",
          box: {
            identifier: "40",
            value: {
              type: "numerical_negation",
              value: {
                type: "non_negative_clamp",
                value: {
                  type: "numerical_negation",
                  value: {
                    type: "sum",
                    values: [
                      { type: "box_reference", box: "28" },
                      { type: "box_reference", box: "29" },
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
