import type { FormSpecification } from "#src/specifications/types/formSpecification";

// NOTE: Form 8949 is structured as a transaction table where each row (line 1)
// represents one capital asset transaction with columns (a)–(h). The schema
// does not support repeating row groups, so line 1 is modeled as a multi-column
// section with one set of column boxes. Each column that accepts free-text or
// dates is represented as "unused"; each numeric column is "number_input".
//
// The checkbox selectors (Box A/B/C/G/H/I for Part I; Box D/E/F/J/K/L for
// Part II) cannot be expressed as selection_input because the options are
// mutually exclusive checkboxes that gate which Schedule D line receives the
// totals. These are modeled as "number_input" with a note below.
//
// GAP: The schema has no "checkbox_group_single_select" or "radio" value type,
// so the Part I / Part II box selectors are represented as "number_input" as a
// placeholder.
//
// GAP: The schema has no "repeating_rows" construct, so the transaction rows in
// line 1 are modeled as a single multi-column line rather than an arbitrary
// number of rows.

export const Form8949: FormSpecification = {
  class: "f8949",
  title: "Form 8949",
  subtitle: "Sales and Other Dispositions of Capital Assets",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-8949",
  category: "taxes",
  maxInstances: null,
  sections: [
    // -------------------------------------------------------------------------
    // Part I – Short-Term Transactions
    // -------------------------------------------------------------------------
    {
      heading:
        "Part I Short-Term. Transactions involving capital assets you held 1 year or less are generally short-term (see instructions). For long-term transactions, see page 2.",
      lines: [
        // Box selector — GAP: no radio/single-select checkbox type; using number_input as placeholder.
        {
          index: "(A)",
          description:
            "Short-term transactions reported on Form(s) 1099-B showing basis was reported to the IRS (see Note above)",
          box: {
            identifier: "partI_boxA",
            value: { type: "number_input" },
          },
        },
        {
          index: "(B)",
          description:
            "Short-term transactions reported on Form(s) 1099-B showing basis was not reported to the IRS",
          box: {
            identifier: "partI_boxB",
            value: { type: "number_input" },
          },
        },
        {
          index: "(C)",
          description:
            "Short-term transactions, other than digital asset transactions, not reported to you on Form 1099-B or Form 1099-DA",
          box: {
            identifier: "partI_boxC",
            value: { type: "number_input" },
          },
        },
        {
          index: "(G)",
          description:
            "Short-term transactions reported on Form(s) 1099-DA showing basis was reported to the IRS (see Note above)",
          box: {
            identifier: "partI_boxG",
            value: { type: "number_input" },
          },
        },
        {
          index: "(H)",
          description:
            "Short-term transactions reported on Form(s) 1099-DA showing basis was not reported to the IRS",
          box: {
            identifier: "partI_boxH",
            value: { type: "number_input" },
          },
        },
        {
          index: "(I)",
          description:
            "Short-term digital asset transactions not reported to you on Form 1099-DA or Form 1099-B",
          box: {
            identifier: "partI_boxI",
            value: { type: "number_input" },
          },
        },
      ],
    },
    // Line 1 transaction table – Part I (multi-column)
    // GAP: The schema cannot express repeating transaction rows. One set of
    // column boxes is provided to capture the structure of a single row.
    {
      heading:
        "1 Transaction rows (one set of columns per transaction). GAP: schema does not support repeating rows; only one row is modeled here.",
      columns: [
        {
          index: "(a)",
          description: "(a) Description of property (Example: 100 sh. XYZ Co.)",
        },
        { index: "(b)", description: "(b) Date acquired (Mo., day, yr.)" },
        {
          index: "(c)",
          description: "(c) Date sold or disposed of (Mo., day, yr.)",
        },
        {
          index: "(d)",
          description: "(d) Proceeds (sales price) (see instructions)",
        },
        {
          index: "(e)",
          description:
            "(e) Cost or other basis. See the Note below and see Column (e) in the separate instructions.",
        },
        {
          index: "(f)",
          description:
            "(f) Code(s) from instructions. Adjustment, if any, to gain or loss — if you enter an amount in column (g), enter a code in column (f). See the separate instructions.",
        },
        {
          index: "(g)",
          description:
            "(g) Amount of adjustment. Adjustment, if any, to gain or loss — see the separate instructions.",
        },
        {
          index: "(h)",
          description:
            "(h) Gain or (loss). Subtract column (e) from column (d) and combine the result with column (g).",
        },
      ],
      lines: [
        {
          index: "1",
          description:
            "Transaction row (description, dates, proceeds, basis, adjustment code, adjustment amount, gain or loss)",
          boxes: [
            // (a) Description of property — text; no text_input type, using unused
            {
              identifier: "partI_1_a",
              column: "(a)",
              value: { type: "unused" },
            },
            // (b) Date acquired — date; no date type, using unused
            {
              identifier: "partI_1_b",
              column: "(b)",
              value: { type: "unused" },
            },
            // (c) Date sold — date; using unused
            {
              identifier: "partI_1_c",
              column: "(c)",
              value: { type: "unused" },
            },
            // (d) Proceeds
            {
              identifier: "partI_1_d",
              column: "(d)",
              value: { type: "number_input" },
            },
            // (e) Cost or other basis
            {
              identifier: "partI_1_e",
              column: "(e)",
              value: { type: "number_input" },
            },
            // (f) Adjustment code — text; using unused
            {
              identifier: "partI_1_f",
              column: "(f)",
              value: { type: "unused" },
            },
            // (g) Amount of adjustment
            {
              identifier: "partI_1_g",
              column: "(g)",
              value: { type: "number_input" },
            },
            // (h) Gain or (loss)
            {
              identifier: "partI_1_h",
              column: "(h)",
              value: { type: "number_input" },
            },
          ],
        },
        // Line 2 — Totals row
        {
          index: "2",
          description:
            "Totals. Add the amounts in columns (d), (e), (g), and (h) (subtract negative amounts). Enter each total here and include on your Schedule D, line 1b (if Box A or Box G above is checked), line 2 (if Box B or Box H above is checked), or line 3 (if Box C or Box I above is checked)",
          boxes: [
            // (a) not summed
            {
              identifier: "partI_2_a",
              column: "(a)",
              value: { type: "unused" },
            },
            // (b) not summed
            {
              identifier: "partI_2_b",
              column: "(b)",
              value: { type: "unused" },
            },
            // (c) not summed
            {
              identifier: "partI_2_c",
              column: "(c)",
              value: { type: "unused" },
            },
            // (d) Total proceeds
            {
              identifier: "partI_2_d",
              column: "(d)",
              value: { type: "number_input" },
            },
            // (e) Total cost or basis
            {
              identifier: "partI_2_e",
              column: "(e)",
              value: { type: "number_input" },
            },
            // (f) not summed
            {
              identifier: "partI_2_f",
              column: "(f)",
              value: { type: "unused" },
            },
            // (g) Total adjustment
            {
              identifier: "partI_2_g",
              column: "(g)",
              value: { type: "number_input" },
            },
            // (h) Total gain or (loss)
            {
              identifier: "partI_2_h",
              column: "(h)",
              value: { type: "number_input" },
            },
          ],
        },
      ],
    },
    // -------------------------------------------------------------------------
    // Part II – Long-Term Transactions
    // -------------------------------------------------------------------------
    {
      heading:
        "Part II Long-Term. Transactions involving capital assets you held more than 1 year are generally long-term (see instructions). For short-term transactions, see page 1.",
      lines: [
        // Box selector — GAP: no radio/single-select checkbox type; using number_input as placeholder.
        {
          index: "(D)",
          description:
            "Long-term transactions reported on Form(s) 1099-B showing basis was reported to the IRS (see Note above)",
          box: {
            identifier: "partII_boxD",
            value: { type: "number_input" },
          },
        },
        {
          index: "(E)",
          description:
            "Long-term transactions reported on Form(s) 1099-B showing basis was not reported to the IRS",
          box: {
            identifier: "partII_boxE",
            value: { type: "number_input" },
          },
        },
        {
          index: "(F)",
          description:
            "Long-term transactions, other than digital asset transactions, not reported to you on Form 1099-B or Form 1099-DA",
          box: {
            identifier: "partII_boxF",
            value: { type: "number_input" },
          },
        },
        {
          index: "(J)",
          description:
            "Long-term transactions reported on Form(s) 1099-DA showing basis was reported to the IRS (see Note above)",
          box: {
            identifier: "partII_boxJ",
            value: { type: "number_input" },
          },
        },
        {
          index: "(K)",
          description:
            "Long-term transactions reported on Form(s) 1099-DA showing basis was not reported to the IRS",
          box: {
            identifier: "partII_boxK",
            value: { type: "number_input" },
          },
        },
        {
          index: "(L)",
          description:
            "Long-term digital asset transactions not reported to you on Form 1099-DA or Form 1099-B",
          box: {
            identifier: "partII_boxL",
            value: { type: "number_input" },
          },
        },
      ],
    },
    // Line 1 transaction table – Part II (multi-column)
    {
      heading:
        "1 Transaction rows (one set of columns per transaction). GAP: schema does not support repeating rows; only one row is modeled here.",
      columns: [
        {
          index: "(a)",
          description: "(a) Description of property (Example: 100 sh. XYZ Co.)",
        },
        { index: "(b)", description: "(b) Date acquired (Mo., day, yr.)" },
        {
          index: "(c)",
          description: "(c) Date sold or disposed of (Mo., day, yr.)",
        },
        {
          index: "(d)",
          description: "(d) Proceeds (sales price) (see instructions)",
        },
        {
          index: "(e)",
          description:
            "(e) Cost or other basis. See the Note below and see Column (e) in the separate instructions.",
        },
        {
          index: "(f)",
          description:
            "(f) Code(s) from instructions. Adjustment, if any, to gain or loss — if you enter an amount in column (g), enter a code in column (f). See the separate instructions.",
        },
        {
          index: "(g)",
          description:
            "(g) Amount of adjustment. Adjustment, if any, to gain or loss — see the separate instructions.",
        },
        {
          index: "(h)",
          description:
            "(h) Gain or (loss). Subtract column (e) from column (d) and combine the result with column (g).",
        },
      ],
      lines: [
        {
          index: "1",
          description:
            "Transaction row (description, dates, proceeds, basis, adjustment code, adjustment amount, gain or loss)",
          boxes: [
            {
              identifier: "partII_1_a",
              column: "(a)",
              value: { type: "unused" },
            },
            {
              identifier: "partII_1_b",
              column: "(b)",
              value: { type: "unused" },
            },
            {
              identifier: "partII_1_c",
              column: "(c)",
              value: { type: "unused" },
            },
            {
              identifier: "partII_1_d",
              column: "(d)",
              value: { type: "number_input" },
            },
            {
              identifier: "partII_1_e",
              column: "(e)",
              value: { type: "number_input" },
            },
            {
              identifier: "partII_1_f",
              column: "(f)",
              value: { type: "unused" },
            },
            {
              identifier: "partII_1_g",
              column: "(g)",
              value: { type: "number_input" },
            },
            {
              identifier: "partII_1_h",
              column: "(h)",
              value: { type: "number_input" },
            },
          ],
        },
        // Line 2 — Totals row
        {
          index: "2",
          description:
            "Totals. Add the amounts in columns (d), (e), (g), and (h) (subtract negative amounts). Enter each total here and include on your Schedule D, line 8b (if Box D or Box J above is checked), line 9 (if Box E or Box K above is checked), or line 10 (if Box F or Box L above is checked)",
          boxes: [
            {
              identifier: "partII_2_a",
              column: "(a)",
              value: { type: "unused" },
            },
            {
              identifier: "partII_2_b",
              column: "(b)",
              value: { type: "unused" },
            },
            {
              identifier: "partII_2_c",
              column: "(c)",
              value: { type: "unused" },
            },
            {
              identifier: "partII_2_d",
              column: "(d)",
              value: { type: "number_input" },
            },
            {
              identifier: "partII_2_e",
              column: "(e)",
              value: { type: "number_input" },
            },
            {
              identifier: "partII_2_f",
              column: "(f)",
              value: { type: "unused" },
            },
            {
              identifier: "partII_2_g",
              column: "(g)",
              value: { type: "number_input" },
            },
            {
              identifier: "partII_2_h",
              column: "(h)",
              value: { type: "number_input" },
            },
          ],
        },
      ],
    },
  ],
};
