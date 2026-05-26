import type { FormSpecification } from "#src/specifications/types/formSpecification";

export const Form6251: FormSpecification = {
  class: "f6251",
  title: "Form 6251",
  subtitle: "Alternative Minimum Tax—Individuals",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-6251",
  category: "taxes",
  maxInstances: 1,
  sections: [
    {
      heading: "Part I. Alternative Minimum Taxable Income",
      lines: [
        {
          index: "1a",
          description:
            "Subtract Schedule 1-A (Form 1040), line 37, from Form 1040, 1040-SR, or 1040-NR, line 14",
          box: {
            identifier: "1a",
            value: { type: "number_input" },
          },
        },
        {
          index: "1b",
          description:
            "Subtract line 1a from Form 1040, 1040-SR, or 1040-NR, line 11b (if less than zero, enter as a negative amount)",
          box: {
            identifier: "1b",
            value: { type: "number_input" },
          },
        },
        {
          index: "2a",
          description:
            "If filing Schedule A (Form 1040), enter the taxes from Schedule A, line 7; otherwise, enter the amount from Form 1040 or 1040-SR, line 12e",
          box: {
            identifier: "2a",
            value: { type: "number_input" },
          },
        },
        {
          index: "2b",
          description:
            "Tax refund from Schedule 1 (Form 1040), line 1 or line 8z",
          box: {
            identifier: "2b",
            // Parenthesized (negative) on the form
            value: { type: "number_input", coerceSign: "negative" },
          },
        },
        {
          index: "2c",
          description:
            "Investment interest expense (difference between regular tax and AMT)",
          box: {
            identifier: "2c",
            value: { type: "number_input" },
          },
        },
        {
          index: "2d",
          description: "Depletion (difference between regular tax and AMT)",
          box: {
            identifier: "2d",
            value: { type: "number_input" },
          },
        },
        {
          index: "2e",
          description:
            "Net operating loss deduction from Schedule 1 (Form 1040), line 8a. Enter as a positive amount",
          box: {
            identifier: "2e",
            value: { type: "number_input", coerceSign: "positive" },
          },
        },
        {
          index: "2f",
          description: "Alternative tax net operating loss deduction",
          box: {
            identifier: "2f",
            // Parenthesized (negative) on the form
            value: { type: "number_input", coerceSign: "negative" },
          },
        },
        {
          index: "2g",
          description:
            "Interest from specified private activity bonds exempt from the regular tax",
          box: {
            identifier: "2g",
            value: { type: "number_input" },
          },
        },
        {
          index: "2h",
          description: "Qualified small business stock, see instructions",
          box: {
            identifier: "2h",
            value: { type: "number_input" },
          },
        },
        {
          index: "2i",
          description:
            "Exercise of incentive stock options (excess of AMT income over regular tax income)",
          box: {
            identifier: "2i",
            value: { type: "number_input" },
          },
        },
        {
          index: "2j",
          description:
            "Estates and trusts (amount from Schedule K-1 (Form 1041), box 12, code A)",
          box: {
            identifier: "2j",
            value: { type: "number_input" },
          },
        },
        {
          index: "2k",
          description:
            "Disposition of property (difference between AMT and regular tax gain or loss)",
          box: {
            identifier: "2k",
            value: { type: "number_input" },
          },
        },
        {
          index: "2l",
          description:
            "Depreciation on assets placed in service after 1986 (difference between regular tax and AMT)",
          box: {
            identifier: "2l",
            value: { type: "number_input" },
          },
        },
        {
          index: "2m",
          description:
            "Passive activities (difference between AMT and regular tax income or loss)",
          box: {
            identifier: "2m",
            value: { type: "number_input" },
          },
        },
        {
          index: "2n",
          description:
            "Loss limitations (difference between AMT and regular tax income or loss)",
          box: {
            identifier: "2n",
            value: { type: "number_input" },
          },
        },
        {
          index: "2o",
          description:
            "Circulation costs (difference between regular tax and AMT)",
          box: {
            identifier: "2o",
            value: { type: "number_input" },
          },
        },
        {
          index: "2p",
          description:
            "Long-term contracts (difference between AMT and regular tax income)",
          box: {
            identifier: "2p",
            value: { type: "number_input" },
          },
        },
        {
          index: "2q",
          description: "Mining costs (difference between regular tax and AMT)",
          box: {
            identifier: "2q",
            value: { type: "number_input" },
          },
        },
        {
          index: "2r",
          description:
            "Research and experimental costs (difference between regular tax and AMT)",
          box: {
            identifier: "2r",
            value: { type: "number_input" },
          },
        },
        {
          index: "2s",
          description:
            "Income from certain installment sales before January 1, 1987",
          box: {
            identifier: "2s",
            // Parenthesized (negative) on the form
            value: { type: "number_input", coerceSign: "negative" },
          },
        },
        {
          index: "2t",
          description: "Intangible drilling costs preference",
          box: {
            identifier: "2t",
            value: { type: "number_input" },
          },
        },
        {
          index: "3",
          description:
            "Other adjustments, including income-based related adjustments",
          box: {
            identifier: "3",
            value: { type: "number_input" },
          },
        },
        {
          index: "4",
          description:
            "Alternative minimum taxable income. Combine lines 1b through 3. (If married filing separately and line 4 is more than $900,350, see instructions.)",
          box: {
            identifier: "4",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "1b" },
                { type: "box_reference", box: "2a" },
                { type: "box_reference", box: "2b" },
                { type: "box_reference", box: "2c" },
                { type: "box_reference", box: "2d" },
                { type: "box_reference", box: "2e" },
                { type: "box_reference", box: "2f" },
                { type: "box_reference", box: "2g" },
                { type: "box_reference", box: "2h" },
                { type: "box_reference", box: "2i" },
                { type: "box_reference", box: "2j" },
                { type: "box_reference", box: "2k" },
                { type: "box_reference", box: "2l" },
                { type: "box_reference", box: "2m" },
                { type: "box_reference", box: "2n" },
                { type: "box_reference", box: "2o" },
                { type: "box_reference", box: "2p" },
                { type: "box_reference", box: "2q" },
                { type: "box_reference", box: "2r" },
                { type: "box_reference", box: "2s" },
                { type: "box_reference", box: "2t" },
                { type: "box_reference", box: "3" },
              ],
            },
          },
        },
      ],
    },
    {
      heading: "Part II. Alternative Minimum Tax (AMT)",
      lines: [
        {
          index: "5",
          description:
            "Exemption. IF your filing status is... AND line 4 is not over... THEN enter on line 5...: Single or head of household: $626,350 → $88,100; Married filing jointly or qualifying surviving spouse: $1,252,700 → $137,000; Married filing separately: $626,350 → $68,500. If line 4 is over the amount shown above for your filing status, see instructions.",
          box: {
            // NOTE: Schema gap — this line involves a lookup table based on
            // filing status and line 4 amount, with a phase-out above the
            // thresholds. The selection_input options below represent the
            // standard (non-phase-out) amounts; a full computation would
            // require a conditional / phase-out formula not yet expressible
            // in the schema, so we fall back to number_input.
            identifier: "5",
            value: { type: "number_input" },
          },
        },
        {
          index: "6",
          description:
            "Subtract line 5 from line 4. If more than zero, go to line 7. If zero or less, enter -0- here and on lines 7, 9, and 11, and go to line 10",
          box: {
            identifier: "6",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "4" },
                subtrahend: { type: "box_reference", box: "5" },
              },
            },
          },
        },
        {
          index: "7",
          description:
            "If you are filing Form 2555, see instructions for the amount to enter. If you reported capital gain distributions directly on Form 1040 or 1040-SR, line 7; you reported qualified dividends on Form 1040 or 1040-SR, line 3a; or you had a gain on both lines 15 and 16 of Schedule D (Form 1040) (as refigured for the AMT, if necessary), complete Part III on the back and enter the amount from line 40 here. All others: If line 6 is $239,100 or less ($119,550 or less if married filing separately), multiply line 6 by 26% (0.26). Otherwise, multiply line 6 by 28% (0.28) and subtract $4,782 ($2,391 if married filing separately) from the result.",
          box: {
            // NOTE: Schema gap — this line has three separate computation
            // paths (Form 2555 filers, capital-gains/qualified-dividends
            // filers who use Part III, and all others with a two-bracket
            // AMT rate schedule). The current schema cannot fully express
            // the conditional rate-bracket logic, so we use number_input.
            identifier: "7",
            value: { type: "number_input" },
          },
        },
        {
          index: "8",
          description:
            "Alternative minimum tax foreign tax credit (see instructions)",
          box: {
            identifier: "8",
            value: { type: "number_input" },
          },
        },
        {
          index: "9",
          description: "Tentative minimum tax. Subtract line 8 from line 7",
          box: {
            identifier: "9",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "7" },
              subtrahend: { type: "box_reference", box: "8" },
            },
          },
        },
        {
          index: "10",
          description:
            "Add Form 1040 or 1040-SR, line 16 (minus any tax from Form 4972), and Schedule 2 (Form 1040), line 1z. Subtract from the result Schedule 3 (Form 1040), line 1 and any negative amount reported on Form 8978, line 14 (treated as a positive number). If zero or less, enter -0-. If you used Schedule J to figure your tax on Form 1040 or 1040-SR, line 16, refigure that tax without using Schedule J before completing this line. See instructions",
          box: {
            // NOTE: Schema gap — this line references multiple cross-form
            // values (Form 1040 line 16 minus Form 4972 tax, Schedule 2
            // line 1z, Schedule 3 line 1, Form 8978 line 14) and applies
            // a non_negative_clamp. Full computation requires cross-form
            // references not all of which are currently modeled; using
            // number_input as a fallback.
            identifier: "10",
            value: { type: "number_input" },
          },
        },
        {
          index: "11",
          description:
            "AMT. Subtract line 10 from line 9. If zero or less, enter -0-. Enter here and on Schedule 2 (Form 1040), line 2",
          box: {
            identifier: "11",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "9" },
                subtrahend: { type: "box_reference", box: "10" },
              },
            },
          },
        },
      ],
    },
    {
      heading: "Part III. Tax Computation Using Maximum Capital Gains Rates",
      lines: [
        {
          index: "12",
          description:
            "Enter the amount from Form 6251, line 6. If you are filing Form 2555, enter the amount from line 3 of the worksheet in the instructions for line 7",
          box: {
            identifier: "12",
            value: { type: "number_input" },
          },
        },
        {
          index: "13",
          description:
            "Enter the amount from line 4 of the Qualified Dividends and Capital Gain Tax Worksheet in the Instructions for Form 1040 or the amount from line 13 of the Schedule D Tax Worksheet in the Instructions for Schedule D (Form 1040), whichever applies (as refigured for the AMT, if necessary). See instructions. If you are filing Form 2555, see instructions for the amount to enter",
          box: {
            identifier: "13",
            value: { type: "number_input" },
          },
        },
        {
          index: "14",
          description:
            "Enter the amount from Schedule D (Form 1040), line 19 (as refigured for the AMT, if necessary). See instructions. If you are filing Form 2555, see instructions for the amount to enter",
          box: {
            identifier: "14",
            value: { type: "number_input" },
          },
        },
        {
          index: "15",
          description:
            "If you did not complete a Schedule D Tax Worksheet for the regular tax or the AMT, enter the amount from line 13. Otherwise, add lines 13 and 14, and enter the smaller of that result or the amount from line 10 of the Schedule D Tax Worksheet (as refigured for the AMT, if necessary). If you are filing Form 2555, see instructions for the amount to enter",
          box: {
            // NOTE: Schema gap — this requires a conditional choice between
            // entering line 13 directly or computing min(13+14, SchedD line
            // 10). The conditional depends on whether the taxpayer completed
            // a Schedule D Tax Worksheet, which is not currently expressible.
            identifier: "15",
            value: { type: "number_input" },
          },
        },
        {
          index: "16",
          description: "Enter the smaller of line 12 or line 15",
          box: {
            identifier: "16",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "12" },
                { type: "box_reference", box: "15" },
              ],
            },
          },
        },
        {
          index: "17",
          description: "Subtract line 16 from line 12",
          box: {
            identifier: "17",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "12" },
              subtrahend: { type: "box_reference", box: "16" },
            },
          },
        },
        {
          index: "18",
          description:
            "If line 17 is $239,100 or less ($119,550 or less if married filing separately), multiply line 17 by 26% (0.26). Otherwise, multiply line 17 by 28% (0.28) and subtract $4,782 ($2,391 if married filing separately) from the result",
          box: {
            // NOTE: Schema gap — two-bracket rate schedule conditional on
            // line 17 amount and filing status. Not fully expressible; using
            // number_input.
            identifier: "18",
            value: { type: "number_input" },
          },
        },
        {
          index: "19",
          description:
            "Enter: $96,700 if married filing jointly or qualifying surviving spouse; $48,350 if single or married filing separately; or $64,750 if head of household.",
          box: {
            identifier: "19",
            value: {
              type: "filing_status_map",
              values: {
                married_filing_jointly: {
                  type: "number_constant",
                  value: 96700,
                },
                qualifying_surviving_spouse: {
                  type: "number_constant",
                  value: 96700,
                },
                single: { type: "number_constant", value: 48350 },
                married_filing_separately: {
                  type: "number_constant",
                  value: 48350,
                },
                head_of_household: { type: "number_constant", value: 64750 },
              },
            },
          },
        },
        {
          index: "20",
          description:
            "Enter the amount from line 5 of the Qualified Dividends and Capital Gain Tax Worksheet or the amount from line 14 of the Schedule D Tax Worksheet, whichever applies (as figured for the regular tax). If you did not complete either worksheet for the regular tax, enter the amount from Form 1040 or 1040-SR, line 15; if zero or less, enter -0-. If you are filing Form 2555, see instructions for the amount to enter",
          box: {
            identifier: "20",
            value: { type: "number_input" },
          },
        },
        {
          index: "21",
          description:
            "Subtract line 20 from line 19. If zero or less, enter -0-",
          box: {
            identifier: "21",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "19" },
                subtrahend: { type: "box_reference", box: "20" },
              },
            },
          },
        },
        {
          index: "22",
          description: "Enter the smaller of line 12 or line 13",
          box: {
            identifier: "22",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "12" },
                { type: "box_reference", box: "13" },
              ],
            },
          },
        },
        {
          index: "23",
          description:
            "Enter the smaller of line 21 or line 22. This amount is taxed at 0%",
          box: {
            identifier: "23",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "21" },
                { type: "box_reference", box: "22" },
              ],
            },
          },
        },
        {
          index: "24",
          description: "Subtract line 23 from line 22",
          box: {
            identifier: "24",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "22" },
              subtrahend: { type: "box_reference", box: "23" },
            },
          },
        },
        {
          index: "25",
          description:
            "Enter: $533,400 if single; $300,000 if married filing separately; $600,050 if married filing jointly or qualifying surviving spouse; or $566,700 if head of household.",
          box: {
            identifier: "25",
            value: {
              type: "filing_status_map",
              values: {
                single: { type: "number_constant", value: 533400 },
                married_filing_separately: {
                  type: "number_constant",
                  value: 300000,
                },
                married_filing_jointly: {
                  type: "number_constant",
                  value: 600050,
                },
                qualifying_surviving_spouse: {
                  type: "number_constant",
                  value: 600050,
                },
                head_of_household: { type: "number_constant", value: 566700 },
              },
            },
          },
        },
        {
          index: "26",
          description: "Enter the amount from line 21",
          box: {
            identifier: "26",
            value: { type: "box_reference", box: "21" },
          },
        },
        {
          index: "27",
          description:
            "Enter the amount from line 5 of the Qualified Dividends and Capital Gain Tax Worksheet or the amount from line 21 of the Schedule D Tax Worksheet, whichever applies (as figured for the regular tax). If you did not complete either worksheet for the regular tax, enter the amount from Form 1040 or 1040-SR, line 15; if zero or less, enter -0-. If you are filing Form 2555, see instructions for the amount to enter",
          box: {
            identifier: "27",
            value: { type: "number_input" },
          },
        },
        {
          index: "28",
          description: "Add line 26 and line 27",
          box: {
            identifier: "28",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "26" },
                { type: "box_reference", box: "27" },
              ],
            },
          },
        },
        {
          index: "29",
          description:
            "Subtract line 28 from line 25. If zero or less, enter -0-",
          box: {
            identifier: "29",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "25" },
                subtrahend: { type: "box_reference", box: "28" },
              },
            },
          },
        },
        {
          index: "30",
          description: "Enter the smaller of line 24 or line 29",
          box: {
            identifier: "30",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "24" },
                { type: "box_reference", box: "29" },
              ],
            },
          },
        },
        {
          index: "31",
          description: "Multiply line 30 by 15% (0.15)",
          box: {
            identifier: "31",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "30" },
                { type: "number_constant", value: 0.15 },
              ],
            },
          },
        },
        {
          index: "32",
          description: "Add lines 23 and 30",
          box: {
            identifier: "32",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "23" },
                { type: "box_reference", box: "30" },
              ],
            },
          },
        },
        {
          index: "33",
          description:
            "Subtract line 32 from line 22 (skip if lines 32 and 12 are the same)",
          box: {
            identifier: "33",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "22" },
              subtrahend: { type: "box_reference", box: "32" },
            },
          },
        },
        {
          index: "34",
          description: "Multiply line 33 by 20% (0.20)",
          box: {
            identifier: "34",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "33" },
                { type: "number_constant", value: 0.2 },
              ],
            },
          },
        },
        {
          index: "35",
          description:
            "Add lines 17, 32, and 33 (skip if line 14 is zero or blank)",
          box: {
            identifier: "35",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "17" },
                { type: "box_reference", box: "32" },
                { type: "box_reference", box: "33" },
              ],
            },
          },
        },
        {
          index: "36",
          description: "Subtract line 35 from line 12",
          box: {
            identifier: "36",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "12" },
              subtrahend: { type: "box_reference", box: "35" },
            },
          },
        },
        {
          index: "37",
          description: "Multiply line 36 by 25% (0.25)",
          box: {
            identifier: "37",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "36" },
                { type: "number_constant", value: 0.25 },
              ],
            },
          },
        },
        {
          index: "38",
          description: "Add lines 18, 31, 34, and 37",
          box: {
            identifier: "38",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "18" },
                { type: "box_reference", box: "31" },
                { type: "box_reference", box: "34" },
                { type: "box_reference", box: "37" },
              ],
            },
          },
        },
        {
          index: "39",
          description:
            "If line 12 is $239,100 or less ($119,550 or less if married filing separately), multiply line 12 by 26% (0.26). Otherwise, multiply line 12 by 28% (0.28) and subtract $4,782 ($2,391 if married filing separately) from the result",
          box: {
            // NOTE: Schema gap — two-bracket rate schedule conditional on
            // line 12 amount and filing status. Not fully expressible; using
            // number_input.
            identifier: "39",
            value: { type: "number_input" },
          },
        },
        {
          index: "40",
          description:
            "Enter the smaller of line 38 or line 39 here and on line 7. If you are filing Form 2555, do not enter this amount on line 7. Instead, enter it on line 4 of the worksheet in the instructions for line 7",
          box: {
            identifier: "40",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "38" },
                { type: "box_reference", box: "39" },
              ],
            },
          },
        },
      ],
    },
  ],
};
