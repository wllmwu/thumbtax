import type { FormSpecification } from "#src/specifications/types/formSpecification";

export const Form1040SD: FormSpecification = {
  class: "f1040sD",
  title: "Schedule D (Form 1040)",
  subtitle: "Capital Gains and Losses",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-schedule-d-form-1040",
  category: "taxes",
  maxInstances: 1,
  sections: [
    {
      // Header
      lines: [
        {
          index: "opportunity_fund",
          description:
            "Did you dispose of any investment(s) in a qualified opportunity fund during the tax year?",
          box: {
            identifier: "opportunity_fund",
            value: { type: "checkbox_input" },
          },
        },
      ],
    },
    {
      // Part I: Short-Term Capital Gains and Losses—Generally Assets Held One Year or Less
      heading:
        "Part I Short-Term Capital Gains and Losses—Generally Assets Held One Year or Less (see instructions)",
      columns: [
        {
          index: "d",
          description: "(d) Proceeds (sales price)",
        },
        {
          index: "e",
          description: "(e) Cost (or other basis)",
        },
        {
          index: "g",
          description:
            "(g) Adjustments to gain or loss from Form(s) 8949, Part I, line 2, column (g)",
        },
        {
          index: "h",
          description:
            "(h) Gain or (loss) Subtract column (e) from column (d) and combine the result with column (g)",
        },
      ],
      lines: [
        {
          index: "1a",
          description:
            "Totals for all short-term transactions reported on Form 1099-B or Form 1099-DA for which basis was reported to the IRS and for which you have no adjustments (see instructions). However, if you choose to report all these transactions on Form 8949, leave this line blank and go to line 1b",
          boxes: [
            {
              identifier: "1a_d",
              column: "d",
              value: { type: "number_input" },
            },
            {
              identifier: "1a_e",
              column: "e",
              value: { type: "number_input" },
            },
            {
              identifier: "1a_g",
              column: "g",
              value: { type: "number_input" },
            },
            {
              identifier: "1a_h",
              column: "h",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "1b",
          description:
            "Totals for all transactions reported on Form(s) 8949 with Box A or Box G checked",
          boxes: [
            {
              identifier: "1b_d",
              column: "d",
              value: { type: "number_input" },
            },
            {
              identifier: "1b_e",
              column: "e",
              value: { type: "number_input" },
            },
            {
              identifier: "1b_g",
              column: "g",
              value: { type: "number_input" },
            },
            {
              identifier: "1b_h",
              column: "h",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "2",
          description:
            "Totals for all transactions reported on Form(s) 8949 with Box B or Box H checked",
          boxes: [
            {
              identifier: "2_d",
              column: "d",
              value: { type: "number_input" },
            },
            {
              identifier: "2_e",
              column: "e",
              value: { type: "number_input" },
            },
            {
              identifier: "2_g",
              column: "g",
              value: { type: "number_input" },
            },
            {
              identifier: "2_h",
              column: "h",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "3",
          description:
            "Totals for all transactions reported on Form(s) 8949 with Box C or Box I checked",
          boxes: [
            {
              identifier: "3_d",
              column: "d",
              value: { type: "number_input" },
            },
            {
              identifier: "3_e",
              column: "e",
              value: { type: "number_input" },
            },
            {
              identifier: "3_g",
              column: "g",
              value: { type: "number_input" },
            },
            {
              identifier: "3_h",
              column: "h",
              value: { type: "number_input" },
            },
          ],
        },
      ],
    },
    {
      // Part I continued: single-column lines 4–7
      lines: [
        {
          index: "4",
          description:
            "Short-term gain from Form 6252 and short-term gain or (loss) from Forms 4684, 6781, and 8824",
          box: {
            identifier: "4",
            value: { type: "number_input" },
          },
        },
        {
          index: "5",
          description:
            "Net short-term gain or (loss) from partnerships, S corporations, estates, and trusts from Schedule(s) K-1",
          box: {
            identifier: "5",
            value: { type: "number_input" },
          },
        },
        {
          index: "6",
          description:
            "Short-term capital loss carryover. Enter the amount, if any, from line 8 of your Capital Loss Carryover Worksheet in the instructions",
          box: {
            identifier: "6",
            value: { type: "number_input", coerceSign: "negative" },
          },
        },
        {
          index: "7",
          description:
            "Net short-term capital gain or (loss). Combine lines 1a through 6 in column (h). If you have any long-term capital gains or losses, go to Part II below. Otherwise, go to Part III on the back",
          box: {
            identifier: "7",
            value: { type: "number_input" },
          },
        },
      ],
    },
    {
      // Part II: Long-Term Capital Gains and Losses—Generally Assets Held More Than One Year
      heading:
        "Part II Long-Term Capital Gains and Losses—Generally Assets Held More Than One Year (see instructions)",
      columns: [
        {
          index: "d",
          description: "(d) Proceeds (sales price)",
        },
        {
          index: "e",
          description: "(e) Cost (or other basis)",
        },
        {
          index: "g",
          description:
            "(g) Adjustments to gain or loss from Form(s) 8949, Part II, line 2, column (g)",
        },
        {
          index: "h",
          description:
            "(h) Gain or (loss) Subtract column (e) from column (d) and combine the result with column (g)",
        },
      ],
      lines: [
        {
          index: "8a",
          description:
            "Totals for all long-term transactions reported on Form 1099-B or Form 1099-DA for which basis was reported to the IRS and for which you have no adjustments (see instructions). However, if you choose to report all these transactions on Form 8949, leave this line blank and go to line 8b",
          boxes: [
            {
              identifier: "8a_d",
              column: "d",
              value: { type: "number_input" },
            },
            {
              identifier: "8a_e",
              column: "e",
              value: { type: "number_input" },
            },
            {
              identifier: "8a_g",
              column: "g",
              value: { type: "number_input" },
            },
            {
              identifier: "8a_h",
              column: "h",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "8b",
          description:
            "Totals for all transactions reported on Form(s) 8949 with Box D or Box J checked",
          boxes: [
            {
              identifier: "8b_d",
              column: "d",
              value: { type: "number_input" },
            },
            {
              identifier: "8b_e",
              column: "e",
              value: { type: "number_input" },
            },
            {
              identifier: "8b_g",
              column: "g",
              value: { type: "number_input" },
            },
            {
              identifier: "8b_h",
              column: "h",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "9",
          description:
            "Totals for all transactions reported on Form(s) 8949 with Box E or Box K checked",
          boxes: [
            {
              identifier: "9_d",
              column: "d",
              value: { type: "number_input" },
            },
            {
              identifier: "9_e",
              column: "e",
              value: { type: "number_input" },
            },
            {
              identifier: "9_g",
              column: "g",
              value: { type: "number_input" },
            },
            {
              identifier: "9_h",
              column: "h",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "10",
          description:
            "Totals for all transactions reported on Form(s) 8949 with Box F or Box L checked",
          boxes: [
            {
              identifier: "10_d",
              column: "d",
              value: { type: "number_input" },
            },
            {
              identifier: "10_e",
              column: "e",
              value: { type: "number_input" },
            },
            {
              identifier: "10_g",
              column: "g",
              value: { type: "number_input" },
            },
            {
              identifier: "10_h",
              column: "h",
              value: { type: "number_input" },
            },
          ],
        },
      ],
    },
    {
      // Part II continued: single-column lines 11–15
      lines: [
        {
          index: "11",
          description:
            "Gain from Form 4797, Part I; long-term gain from Forms 2439 and 6252; and long-term gain or (loss) from Forms 4684, 6781, and 8824",
          box: {
            identifier: "11",
            value: { type: "number_input" },
          },
        },
        {
          index: "12",
          description:
            "Net long-term gain or (loss) from partnerships, S corporations, estates, and trusts from Schedule(s) K-1",
          box: {
            identifier: "12",
            value: { type: "number_input" },
          },
        },
        {
          index: "13",
          description: "Capital gain distributions. See the instructions",
          box: {
            identifier: "13",
            value: { type: "number_input" },
          },
        },
        {
          index: "14",
          description:
            "Long-term capital loss carryover. Enter the amount, if any, from line 13 of your Capital Loss Carryover Worksheet in the instructions",
          box: {
            identifier: "14",
            value: { type: "number_input", coerceSign: "negative" },
          },
        },
        {
          index: "15",
          description:
            "Net long-term capital gain or (loss). Combine lines 8a through 14 in column (h). Then, go to Part III on the back",
          box: {
            identifier: "15",
            value: { type: "number_input" },
          },
        },
      ],
    },
    {
      // Part III: Summary
      heading: "Part III Summary",
      lines: [
        {
          index: "16",
          description: "Combine lines 7 and 15 and enter the result",
          box: {
            identifier: "16",
            value: { type: "number_input" },
          },
        },
        {
          index: "17",
          description: "Are lines 15 and 16 both gains?",
          box: {
            identifier: "17",
            // NOTE: Schema gap — no yes_no type; using checkbox_input as placeholder
            value: { type: "checkbox_input" },
          },
        },
        {
          index: "18",
          description:
            "If you are required to complete the 28% Rate Gain Worksheet (see instructions), enter the amount, if any, from line 7 of that worksheet",
          box: {
            identifier: "18",
            value: { type: "number_input" },
          },
        },
        {
          index: "19",
          description:
            "If you are required to complete the Unrecaptured Section 1250 Gain Worksheet (see instructions), enter the amount, if any, from line 18 of that worksheet",
          box: {
            identifier: "19",
            value: { type: "number_input" },
          },
        },
        {
          index: "20",
          description:
            "Are lines 18 and 19 both zero or blank and you are not filing Form 4952?",
          box: {
            identifier: "20",
            // NOTE: Schema gap — no yes_no type; using checkbox_input as placeholder
            value: { type: "checkbox_input" },
          },
        },
        {
          index: "21",
          description:
            "If line 16 is a loss, enter here and on Form 1040, 1040-SR, or 1040-NR, line 7a, the smaller of: the loss on line 16; or ($3,000), or if married filing separately, ($1,500)",
          box: {
            identifier: "21",
            value: { type: "number_input", coerceSign: "negative" },
          },
        },
        {
          index: "22",
          description:
            "Do you have qualified dividends on Form 1040, 1040-SR, or 1040-NR, line 3a?",
          box: {
            identifier: "22",
            // NOTE: Schema gap — no yes_no type; using checkbox_input as placeholder
            value: { type: "checkbox_input" },
          },
        },
      ],
    },
  ],
};
