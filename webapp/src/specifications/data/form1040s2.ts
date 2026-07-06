import type { FormSpecification } from "@thumbtax/forms";

export const Form1040S2: FormSpecification = {
  class: "f1040s2",
  title: "Schedule 2 (Form 1040)",
  subtitle: "Additional Taxes",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-1040",
  category: "taxes",
  maxInstances: 1,
  sections: [
    {
      heading: "Part I. Tax",
      lines: [
        {
          index: "1",
          instructions: "Additions to tax:",
          box: { identifier: "1", value: { type: "unused" } },
        },
        {
          index: "1a",
          instructions:
            "Excess advance premium tax credit repayment. Attach Form 8962",
          box: { identifier: "1a", value: { type: "number_input" } },
        },
        {
          index: "1b",
          instructions:
            "Repayment of new clean vehicle credit(s) transferred to a registered dealer from Schedule A (Form 8936), Part II. Attach Form 8936 and Schedule A (Form 8936)",
          box: { identifier: "1b", value: { type: "number_input" } },
        },
        {
          index: "1c",
          instructions:
            "Repayment of previously owned clean vehicle credit(s) transferred to a registered dealer from Schedule A (Form 8936), Part IV. Attach Form 8936 and Schedule A (Form 8936)",
          box: { identifier: "1c", value: { type: "number_input" } },
        },
        {
          index: "1d",
          instructions:
            "Recapture of net EPE from Form 4255, line 2a, column (l)",
          box: { identifier: "1d", value: { type: "number_input" } },
        },
        {
          index: "1e",
          instructions:
            "Excessive payments (EPs) on gross EPE from Form 4255. See instructions",
          box: { identifier: "1e", value: { type: "number_input" } },
        },
        {
          index: "1f",
          instructions: "20% EP from Form 4255. See instructions",
          box: { identifier: "1f", value: { type: "number_input" } },
        },
        {
          index: "1y",
          instructions: "Other additions to tax (see instructions)",
          box: { identifier: "1y", value: { type: "number_input" } },
        },
        {
          index: "1z",
          instructions: "Add lines 1a through 1y",
          box: {
            identifier: "1z",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "1a" },
                { type: "box_reference", box: "1b" },
                { type: "box_reference", box: "1c" },
                { type: "box_reference", box: "1d" },
                { type: "box_reference", box: "1e" },
                { type: "box_reference", box: "1f" },
                { type: "box_reference", box: "1y" },
              ],
            },
          },
        },
        {
          index: "2",
          instructions: "Alternative minimum tax. Attach Form 6251",
          box: {
            identifier: "2",
            value: {
              type: "box_reference",
              box: "11",
              form: "f6251",
              required: true,
            },
          },
        },
        {
          index: "3",
          instructions:
            "Add lines 1z and 2. Enter here and on Form 1040, 1040-SR, or 1040-NR, line 17",
          box: {
            identifier: "3",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "1z" },
                { type: "box_reference", box: "2" },
              ],
            },
          },
        },
      ],
    },
    {
      heading: "Part II. Other Taxes",
      lines: [
        {
          // TODO: Schedule SE
          index: "4",
          instructions: "Self-employment tax. Attach Schedule SE",
          box: { identifier: "4", value: { type: "number_input" } },
        },
        {
          // TODO: Form 4137
          index: "5",
          instructions:
            "Social security and Medicare tax on unreported tip income. Attach Form 4137",
          box: { identifier: "5", value: { type: "number_input" } },
        },
        {
          index: "6",
          instructions:
            "Uncollected social security and Medicare tax on wages. Attach Form 8919",
          box: { identifier: "6", value: { type: "number_input" } },
        },
        {
          index: "7",
          instructions:
            "Total additional social security and Medicare tax. Add lines 5 and 6",
          box: {
            identifier: "7",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "5" },
                { type: "box_reference", box: "6" },
              ],
            },
          },
        },
        {
          index: "8",
          instructions:
            "Additional tax on IRAs or other tax-favored accounts. Attach Form 5329 if required",
          box: { identifier: "8", value: { type: "number_input" } },
        },
        {
          index: "9",
          instructions: "Household employment taxes. Attach Schedule H",
          box: { identifier: "9", value: { type: "number_input" } },
        },
        {
          index: "10",
          instructions: "Reserved for future use",
          box: { identifier: "10", value: { type: "unused" } },
        },
        {
          index: "11",
          instructions: "Additional Medicare Tax. Attach Form 8959",
          box: {
            identifier: "11",
            value: {
              type: "box_reference",
              box: "18",
              form: "f8959",
              required: true,
            },
          },
        },
        {
          index: "12",
          instructions: "Net investment income tax. Attach Form 8960",
          box: {
            identifier: "12",
            value: {
              type: "box_reference",
              box: "17",
              form: "f8960",
              required: true,
            },
          },
        },
        {
          index: "13",
          instructions:
            "Uncollected social security and Medicare or RRTA tax on tips or group-term life insurance from Form W-2, box 12",
          box: {
            identifier: "13",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "A", form: "fW2_12_codes" },
                { type: "box_reference", box: "B", form: "fW2_12_codes" },
                { type: "box_reference", box: "M", form: "fW2_12_codes" },
                { type: "box_reference", box: "N", form: "fW2_12_codes" },
              ],
            },
          },
        },
        {
          index: "14",
          instructions:
            "Interest on tax due on installment income from the sale of certain residential lots and timeshares",
          box: { identifier: "14", value: { type: "number_input" } },
        },
        {
          index: "15",
          instructions:
            "Interest on the deferred tax on gain from certain installment sales with a sales price over $150,000",
          box: { identifier: "15", value: { type: "number_input" } },
        },
        {
          index: "16",
          instructions:
            "Recapture of low-income housing credit. Attach Form 8611",
          box: { identifier: "16", value: { type: "number_input" } },
        },
        {
          index: "17",
          instructions: "Other additional taxes:",
          box: { identifier: "17", value: { type: "unused" } },
        },
        {
          index: "17a",
          instructions:
            "Recapture of other credits. List type, form number, and amount",
          box: { identifier: "17a", value: { type: "list_amounts_input" } },
        },
        {
          index: "17b",
          instructions:
            "Recapture of federal mortgage subsidy. If you sold your home, see instructions",
          box: { identifier: "17b", value: { type: "number_input" } },
        },
        {
          index: "17c",
          instructions: "Additional tax on HSA distributions. Attach Form 8889",
          box: {
            identifier: "17c",
            value: { type: "box_reference", box: "17b", form: "f8889" },
          },
        },
        {
          index: "17d",
          instructions:
            "Additional tax on an HSA because you didn't remain an eligible individual. Attach Form 8889",
          box: {
            identifier: "17d",
            value: { type: "box_reference", box: "21", form: "f8889" },
          },
        },
        {
          index: "17e",
          instructions:
            "Additional tax on Archer MSA distributions. Attach Form 8853",
          box: { identifier: "17e", value: { type: "number_input" } },
        },
        {
          index: "17f",
          instructions:
            "Additional tax on Medicare Advantage MSA distributions. Attach Form 8853",
          box: { identifier: "17f", value: { type: "number_input" } },
        },
        {
          index: "17g",
          instructions:
            "Recapture of a charitable contribution deduction related to a fractional interest in tangible personal property",
          box: { identifier: "17g", value: { type: "number_input" } },
        },
        {
          index: "17h",
          instructions:
            "Income you received from a nonqualified deferred compensation plan that fails to meet the requirements of section 409A",
          box: { identifier: "17h", value: { type: "number_input" } },
        },
        {
          index: "17i",
          instructions:
            "Compensation you received from a nonqualified deferred compensation plan described in section 457A",
          box: { identifier: "17i", value: { type: "number_input" } },
        },
        {
          index: "17j",
          instructions: "Section 72(m)(5) excess benefits tax",
          box: { identifier: "17j", value: { type: "number_input" } },
        },
        {
          index: "17k",
          instructions: "Golden parachute payments",
          box: { identifier: "17k", value: { type: "number_input" } },
        },
        {
          index: "17l",
          instructions: "Tax on accumulation distribution of trusts",
          box: { identifier: "17l", value: { type: "number_input" } },
        },
        {
          index: "17m",
          instructions:
            "Excise tax on insider stock compensation from an expatriated corporation",
          box: { identifier: "17m", value: { type: "number_input" } },
        },
        {
          index: "17n",
          instructions:
            "Look-back interest under section 167(g) or 460(b) from Form 8697 or 8866",
          box: { identifier: "17n", value: { type: "number_input" } },
        },
        {
          index: "17o",
          instructions:
            "Tax on non-effectively connected income for any part of the year you were a nonresident alien from Form 1040-NR",
          box: { identifier: "17o", value: { type: "number_input" } },
        },
        {
          index: "17p",
          instructions:
            "Any interest from Form 8621, line 16f, relating to distributions from, and dispositions of, stock of a section 1291 fund",
          box: { identifier: "17p", value: { type: "number_input" } },
        },
        {
          index: "17q",
          instructions: "Any interest from Form 8621, line 24",
          box: { identifier: "17q", value: { type: "number_input" } },
        },
        {
          index: "17z",
          instructions: "Any other taxes. List type and amount",
          box: { identifier: "17z", value: { type: "list_amounts_input" } },
        },
        {
          index: "18",
          instructions: "Total additional taxes. Add lines 17a through 17z",
          box: {
            identifier: "18",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "17a" },
                { type: "box_reference", box: "17b" },
                { type: "box_reference", box: "17c" },
                { type: "box_reference", box: "17d" },
                { type: "box_reference", box: "17e" },
                { type: "box_reference", box: "17f" },
                { type: "box_reference", box: "17g" },
                { type: "box_reference", box: "17h" },
                { type: "box_reference", box: "17i" },
                { type: "box_reference", box: "17j" },
                { type: "box_reference", box: "17k" },
                { type: "box_reference", box: "17l" },
                { type: "box_reference", box: "17m" },
                { type: "box_reference", box: "17n" },
                { type: "box_reference", box: "17o" },
                { type: "box_reference", box: "17p" },
                { type: "box_reference", box: "17q" },
                { type: "box_reference", box: "17z" },
              ],
            },
          },
        },
        {
          index: "19",
          instructions:
            "Recapture of net EPE from Form 4255, line 1d, column (l)",
          box: { identifier: "19", value: { type: "number_input" } },
        },
        {
          index: "20",
          instructions:
            "Section 965 net tax liability installment from Form 965-A",
          box: { identifier: "20", value: { type: "number_input" } },
        },
        {
          index: "21",
          instructions:
            "Add lines 4, 7 through 16, 18, and 19. These are your **total other taxes.** Enter here and on Form 1040 or 1040-SR, line 23; or Form 1040-NR, line 23b",
          box: {
            identifier: "21",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "4" },
                { type: "box_reference", box: "7" },
                { type: "box_reference", box: "8" },
                { type: "box_reference", box: "9" },
                { type: "box_reference", box: "10" },
                { type: "box_reference", box: "11" },
                { type: "box_reference", box: "12" },
                { type: "box_reference", box: "13" },
                { type: "box_reference", box: "14" },
                { type: "box_reference", box: "15" },
                { type: "box_reference", box: "16" },
                { type: "box_reference", box: "18" },
                { type: "box_reference", box: "19" },
              ],
            },
          },
        },
      ],
    },
  ],
};
