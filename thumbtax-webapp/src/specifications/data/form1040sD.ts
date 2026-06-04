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
      heading:
        "Part I. Short-Term Capital Gains and Losses\u2014Generally Assets Held One Year or Less (see instructions)",
      columns: [
        {
          index: "(d)",
          description: "Proceeds (sales price)",
        },
        {
          index: "(e)",
          description: "Cost (or other basis)",
        },
        {
          index: "(g)",
          description:
            "Adjustments to gain or loss from Form(s) 8949, Part I, line 2, column (g)",
        },
        {
          index: "(h)",
          description:
            "Gain or (loss). Subtract column (e) from column (d) and combine the result with column (g)",
        },
      ],
      lines: [
        {
          // TODO: conditional aggregation
          index: "1a",
          description:
            "Totals for all short-term transactions reported on Form 1099-B or Form 1099-DA for which basis was reported to the IRS and for which you have no adjustments (see instructions). However, if you choose to report all these transactions on Form 8949, leave this line blank and go to line 1b",
          boxes: [
            {
              identifier: "1a(d)",
              column: "(d)",
              value: {
                type: "select_instance_boxes_input",
                options: [{ form: "f1099B", box: "1d" }],
              },
            },
            {
              identifier: "1a(e)",
              column: "(e)",
              value: {
                type: "select_instance_boxes_input",
                options: [{ form: "f1099B", box: "1e" }],
              },
            },
            {
              identifier: "1a(g)",
              column: "(g)",
              value: { type: "unused" },
            },
            {
              identifier: "1a(h)",
              column: "(h)",
              value: {
                type: "sum",
                values: [
                  {
                    type: "difference",
                    minuend: { type: "box_reference", box: "1a(d)" },
                    subtrahend: { type: "box_reference", box: "1a(e)" },
                  },
                  { type: "box_reference", box: "1a(g)" },
                ],
              },
            },
          ],
        },
        {
          index: "1b",
          description:
            "Totals for all transactions reported on Form(s) 8949 with Box A or Box G checked",
          boxes: [
            {
              identifier: "1b(d)",
              column: "(d)",
              value: { type: "number_input" },
            },
            {
              identifier: "1b(e)",
              column: "(e)",
              value: { type: "number_input" },
            },
            {
              identifier: "1b(g)",
              column: "(g)",
              value: { type: "number_input" },
            },
            {
              identifier: "1b(h)",
              column: "(h)",
              value: {
                type: "sum",
                values: [
                  {
                    type: "difference",
                    minuend: { type: "box_reference", box: "1b(d)" },
                    subtrahend: { type: "box_reference", box: "1b(e)" },
                  },
                  { type: "box_reference", box: "1b(g)" },
                ],
              },
            },
          ],
        },
        {
          index: "2",
          description:
            "Totals for all transactions reported on Form(s) 8949 with Box B or Box H checked",
          boxes: [
            {
              identifier: "2(d)",
              column: "(d)",
              value: { type: "number_input" },
            },
            {
              identifier: "2(e)",
              column: "(e)",
              value: { type: "number_input" },
            },
            {
              identifier: "2(g)",
              column: "(g)",
              value: { type: "number_input" },
            },
            {
              identifier: "2(h)",
              column: "(h)",
              value: {
                type: "sum",
                values: [
                  {
                    type: "difference",
                    minuend: { type: "box_reference", box: "2(d)" },
                    subtrahend: { type: "box_reference", box: "2(e)" },
                  },
                  { type: "box_reference", box: "2(g)" },
                ],
              },
            },
          ],
        },
        {
          index: "3",
          description:
            "Totals for all transactions reported on Form(s) 8949 with Box C or Box I checked",
          boxes: [
            {
              identifier: "3(d)",
              column: "(d)",
              value: { type: "number_input" },
            },
            {
              identifier: "3(e)",
              column: "(e)",
              value: { type: "number_input" },
            },
            {
              identifier: "3(g)",
              column: "(g)",
              value: { type: "number_input" },
            },
            {
              identifier: "3(h)",
              column: "(h)",
              value: {
                type: "sum",
                values: [
                  {
                    type: "difference",
                    minuend: { type: "box_reference", box: "3(d)" },
                    subtrahend: { type: "box_reference", box: "3(e)" },
                  },
                  { type: "box_reference", box: "3(g)" },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      heading: "Part I (continued)",
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
            "**Net short-term capital gain or (loss).** Combine lines 1a through 6 in column (h). If you have any long-term capital gains or losses, go to Part II below. Otherwise, go to Part III on the back",
          box: {
            identifier: "7",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "1a(h)" },
                { type: "box_reference", box: "1b(h)" },
                { type: "box_reference", box: "2(h)" },
                { type: "box_reference", box: "3(h)" },
                { type: "box_reference", box: "4" },
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
        "Part II. Long-Term Capital Gains and Losses\u2014Generally Assets Held More Than One Year (see instructions)",
      columns: [
        {
          index: "(d)",
          description: "Proceeds (sales price)",
        },
        {
          index: "(e)",
          description: "Cost (or other basis)",
        },
        {
          index: "(g)",
          description:
            "Adjustments to gain or loss from Form(s) 8949, Part II, line 2, column (g)",
        },
        {
          index: "(h)",
          description:
            "Gain or (loss). Subtract column (e) from column (d) and combine the result with column (g)",
        },
      ],
      lines: [
        {
          // TODO: conditional aggregation
          index: "8a",
          description:
            "Totals for all long-term transactions reported on Form 1099-B or Form 1099-DA for which basis was reported to the IRS and for which you have no adjustments (see instructions). However, if you choose to report all these transactions on Form 8949, leave this line blank and go to line 8b",
          boxes: [
            {
              identifier: "8a(d)",
              column: "(d)",
              value: {
                type: "select_instance_boxes_input",
                options: [{ form: "f1099B", box: "1d" }],
              },
            },
            {
              identifier: "8a(e)",
              column: "(e)",
              value: {
                type: "select_instance_boxes_input",
                options: [{ form: "f1099B", box: "1e" }],
              },
            },
            {
              identifier: "8a(g)",
              column: "(g)",
              value: { type: "unused" },
            },
            {
              identifier: "8a(h)",
              column: "(h)",
              value: {
                type: "sum",
                values: [
                  {
                    type: "difference",
                    minuend: { type: "box_reference", box: "8a(d)" },
                    subtrahend: { type: "box_reference", box: "8a(e)" },
                  },
                  { type: "box_reference", box: "8a(g)" },
                ],
              },
            },
          ],
        },
        {
          index: "8b",
          description:
            "Totals for all transactions reported on Form(s) 8949 with Box D or Box J checked",
          boxes: [
            {
              identifier: "8b(d)",
              column: "(d)",
              value: { type: "number_input" },
            },
            {
              identifier: "8b(e)",
              column: "(e)",
              value: { type: "number_input" },
            },
            {
              identifier: "8b(g)",
              column: "(g)",
              value: { type: "number_input" },
            },
            {
              identifier: "8b(h)",
              column: "(h)",
              value: {
                type: "sum",
                values: [
                  {
                    type: "difference",
                    minuend: { type: "box_reference", box: "8b(d)" },
                    subtrahend: { type: "box_reference", box: "8b(e)" },
                  },
                  { type: "box_reference", box: "8b(g)" },
                ],
              },
            },
          ],
        },
        {
          index: "9",
          description:
            "Totals for all transactions reported on Form(s) 8949 with Box E or Box K checked",
          boxes: [
            {
              identifier: "9(d)",
              column: "(d)",
              value: { type: "number_input" },
            },
            {
              identifier: "9(e)",
              column: "(e)",
              value: { type: "number_input" },
            },
            {
              identifier: "9(g)",
              column: "(g)",
              value: { type: "number_input" },
            },
            {
              identifier: "9(h)",
              column: "(h)",
              value: {
                type: "sum",
                values: [
                  {
                    type: "difference",
                    minuend: { type: "box_reference", box: "9(d)" },
                    subtrahend: { type: "box_reference", box: "9(e)" },
                  },
                  { type: "box_reference", box: "9(g)" },
                ],
              },
            },
          ],
        },
        {
          index: "10",
          description:
            "Totals for all transactions reported on Form(s) 8949 with Box F or Box L checked",
          boxes: [
            {
              identifier: "10(d)",
              column: "(d)",
              value: { type: "number_input" },
            },
            {
              identifier: "10(e)",
              column: "(e)",
              value: { type: "number_input" },
            },
            {
              identifier: "10(g)",
              column: "(g)",
              value: { type: "number_input" },
            },
            {
              identifier: "10(h)",
              column: "(h)",
              value: {
                type: "sum",
                values: [
                  {
                    type: "difference",
                    minuend: { type: "box_reference", box: "10(d)" },
                    subtrahend: { type: "box_reference", box: "10(e)" },
                  },
                  { type: "box_reference", box: "10(g)" },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      heading: "Part II (continued)",
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
            value: { type: "box_reference", form: "f1099DIV", box: "2a" },
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
            "**Net long-term capital gain or (loss).** Combine lines 8a through 14 in column (h). Then, go to Part III on the back",
          box: {
            identifier: "15",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "8a(h)" },
                { type: "box_reference", box: "8b(h)" },
                { type: "box_reference", box: "9(h)" },
                { type: "box_reference", box: "10(h)" },
                { type: "box_reference", box: "11" },
                { type: "box_reference", box: "12" },
                { type: "box_reference", box: "13" },
                { type: "box_reference", box: "14" },
              ],
            },
          },
        },
      ],
    },
    {
      heading: "Part III. Summary",
      lines: [
        {
          index: "16",
          description:
            "Combine lines 7 and 15 and enter the result\n- If line 16 is a gain, enter the amount from line 16 on Form 1040, 1040-SR, or 1040-NR, line 7a. Then, go to line 17 below.\n- If line 16 is a loss, skip lines 17 through 20 below. Then, go to line 21. Also be sure to complete line 22.\n- If line 16 is zero, skip lines 17 through 21 below and enter -0- on Form 1040, 1040-SR, or 1040-NR, line 7a. Then, go to line 22.",
          box: {
            identifier: "16",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "7" },
                { type: "box_reference", box: "15" },
              ],
            },
          },
        },
        {
          index: "17",
          description:
            "Are lines 15 and 16 both gains?\n- Yes. Go to line 18.\n- No. Skip lines 18 through 21, and go to line 22.",
          box: {
            identifier: "17",
            value: { type: "unused" },
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
            "Are lines 18 and 19 both zero or blank and you are not filing Form 4952?\n- Yes. Complete the Qualified Dividends and Capital Gain Tax Worksheet in the instructions for Form 1040, line 16. Don't complete lines 21 and 22 below.\n- No. Complete the Schedule D Tax Worksheet in the instructions. Don't complete lines 21 and 22 below.",
          box: {
            identifier: "20",
            value: { type: "unused" },
          },
        },
        {
          index: "21",
          description:
            "If line 16 is a loss, enter here and on Form 1040, 1040-SR, or 1040-NR, line 7a, the smaller of:\n- The loss on line 16; or\n- ($3,000), or if married filing separately, ($1,500)",
          box: {
            identifier: "21",
            value: {
              type: "conditional",
              condition: {
                type: "comparison",
                value: { type: "box_reference", box: "16" },
                maximum: { type: "number_constant", value: 0 },
                strict: true,
              },
              trueValue: {
                type: "maximum",
                values: [
                  { type: "box_reference", box: "16" },
                  {
                    type: "filing_status_map",
                    values: {
                      married_filing_separately: {
                        type: "number_constant",
                        value: -1500,
                      },
                    },
                    default: { type: "number_constant", value: -3000 },
                  },
                ],
              },
              falseValue: { type: "number_constant", value: 0 },
            },
          },
        },
        {
          index: "22",
          description:
            "Do you have qualified dividends on Form 1040, 1040-SR, or 1040-NR, line 3a?\n- Yes. Complete the Qualified Dividends and Capital Gain Tax Worksheet in the instructions for Form 1040, line 16.\n- No. Complete the rest of Form 1040, 1040-SR, or 1040-NR.",
          box: {
            identifier: "22",
            value: { type: "unused" },
          },
        },
      ],
    },
  ],
};
