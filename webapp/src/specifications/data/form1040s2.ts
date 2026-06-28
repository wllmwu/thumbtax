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
          description: "Additions to tax:",
          box: {
            identifier: "1",
            value: { type: "unused" },
          },
        },
        {
          index: "1a",
          description:
            "Excess advance premium tax credit repayment. Attach Form 8962",
          box: {
            identifier: "1a",
            value: { type: "number_input" },
          },
        },
        {
          index: "1b",
          description:
            "Repayment of new clean vehicle credit(s) transferred to a registered dealer from Schedule A (Form 8936), Part II. Attach Form 8936 and Schedule A (Form 8936)",
          box: {
            identifier: "1b",
            value: { type: "number_input" },
          },
        },
        {
          index: "1c",
          description:
            "Repayment of previously owned clean vehicle credit(s) transferred to a registered dealer from Schedule A (Form 8936), Part IV. Attach Form 8936 and Schedule A (Form 8936)",
          box: {
            identifier: "1c",
            value: { type: "number_input" },
          },
        },
        {
          index: "1d",
          description:
            "Recapture of net EPE from Form 4255, line 2a, column (l)",
          box: {
            identifier: "1d",
            value: { type: "number_input" },
          },
        },
        {
          index: "1e",
          description:
            "Excessive payments (EPs) on gross EPE from Form 4255. See instructions",
          box: {
            identifier: "1e",
            value: { type: "number_input" },
          },
        },
        {
          index: "1f",
          description: "20% EP from Form 4255. See instructions",
          box: {
            identifier: "1f",
            value: { type: "number_input" },
          },
        },
        {
          index: "1y",
          description: "Other additions to tax (see instructions)",
          box: {
            identifier: "1y",
            value: { type: "number_input" },
          },
        },
        {
          index: "1z",
          description: "Add lines 1a through 1y",
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
          description: "Alternative minimum tax. Attach Form 6251",
          box: {
            identifier: "2",
            value: {
              type: "box_reference",
              form: "f6251",
              box: "11",
              required: true,
            },
          },
        },
        {
          index: "3",
          description:
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
          description: "Self-employment tax. Attach Schedule SE",
          box: {
            identifier: "4",
            value: { type: "number_input" },
          },
        },
        {
          // TODO: Form 4137
          index: "5",
          description:
            "Social security and Medicare tax on unreported tip income. Attach Form 4137",
          box: {
            identifier: "5",
            value: { type: "number_input" },
          },
        },
        {
          index: "6",
          description:
            "Uncollected social security and Medicare tax on wages. Attach Form 8919",
          box: {
            identifier: "6",
            value: { type: "number_input" },
          },
        },
        {
          index: "7",
          description:
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
          description:
            "Additional tax on IRAs or other tax-favored accounts. Attach Form 5329 if required",
          box: {
            identifier: "8",
            value: { type: "number_input" },
          },
        },
        {
          index: "9",
          description: "Household employment taxes. Attach Schedule H",
          box: {
            identifier: "9",
            value: { type: "number_input" },
          },
        },
        {
          index: "10",
          description: "Reserved for future use",
          box: {
            identifier: "10",
            value: { type: "unused" },
          },
        },
        {
          index: "11",
          description: "Additional Medicare Tax. Attach Form 8959",
          box: {
            identifier: "11",
            value: {
              type: "box_reference",
              form: "f8959",
              box: "18",
              required: true,
            },
          },
        },
        {
          index: "12",
          description: "Net investment income tax. Attach Form 8960",
          box: {
            identifier: "12",
            value: {
              type: "box_reference",
              form: "f8960",
              box: "17",
              required: true,
            },
          },
        },
        {
          index: "13",
          description:
            "Uncollected social security and Medicare or RRTA tax on tips or group-term life insurance from Form W-2, box 12",
          box: {
            identifier: "13",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", form: "fW2_12_codes", box: "A" },
                { type: "box_reference", form: "fW2_12_codes", box: "B" },
                { type: "box_reference", form: "fW2_12_codes", box: "M" },
                { type: "box_reference", form: "fW2_12_codes", box: "N" },
              ],
            },
          },
        },
        {
          index: "14",
          description:
            "Interest on tax due on installment income from the sale of certain residential lots and timeshares",
          box: {
            identifier: "14",
            value: { type: "number_input" },
          },
        },
        {
          index: "15",
          description:
            "Interest on the deferred tax on gain from certain installment sales with a sales price over $150,000",
          box: {
            identifier: "15",
            value: { type: "number_input" },
          },
        },
        {
          index: "16",
          description:
            "Recapture of low-income housing credit. Attach Form 8611",
          box: {
            identifier: "16",
            value: { type: "number_input" },
          },
        },
        {
          index: "17",
          description: "Other additional taxes:",
          box: {
            identifier: "17",
            value: { type: "unused" },
          },
        },
        {
          index: "17a",
          description:
            "Recapture of other credits. List type, form number, and amount",
          box: {
            identifier: "17a",
            value: { type: "list_amounts_input" },
          },
        },
        {
          index: "17b",
          description:
            "Recapture of federal mortgage subsidy. If you sold your home, see instructions",
          box: {
            identifier: "17b",
            value: { type: "number_input" },
          },
        },
        {
          index: "17c",
          description: "Additional tax on HSA distributions. Attach Form 8889",
          box: {
            identifier: "17c",
            value: { type: "box_reference", form: "f8889", box: "17b" },
          },
        },
        {
          index: "17d",
          description:
            "Additional tax on an HSA because you didn't remain an eligible individual. Attach Form 8889",
          box: {
            identifier: "17d",
            value: { type: "box_reference", form: "f8889", box: "21" },
          },
        },
        {
          index: "17e",
          description:
            "Additional tax on Archer MSA distributions. Attach Form 8853",
          box: {
            identifier: "17e",
            value: { type: "number_input" },
          },
        },
        {
          index: "17f",
          description:
            "Additional tax on Medicare Advantage MSA distributions. Attach Form 8853",
          box: {
            identifier: "17f",
            value: { type: "number_input" },
          },
        },
        {
          index: "17g",
          description:
            "Recapture of a charitable contribution deduction related to a fractional interest in tangible personal property",
          box: {
            identifier: "17g",
            value: { type: "number_input" },
          },
        },
        {
          index: "17h",
          description:
            "Income you received from a nonqualified deferred compensation plan that fails to meet the requirements of section 409A",
          box: {
            identifier: "17h",
            value: { type: "number_input" },
          },
        },
        {
          index: "17i",
          description:
            "Compensation you received from a nonqualified deferred compensation plan described in section 457A",
          box: {
            identifier: "17i",
            value: { type: "number_input" },
          },
        },
        {
          index: "17j",
          description: "Section 72(m)(5) excess benefits tax",
          box: {
            identifier: "17j",
            value: { type: "number_input" },
          },
        },
        {
          index: "17k",
          description: "Golden parachute payments",
          box: {
            identifier: "17k",
            value: { type: "number_input" },
          },
        },
        {
          index: "17l",
          description: "Tax on accumulation distribution of trusts",
          box: {
            identifier: "17l",
            value: { type: "number_input" },
          },
        },
        {
          index: "17m",
          description:
            "Excise tax on insider stock compensation from an expatriated corporation",
          box: {
            identifier: "17m",
            value: { type: "number_input" },
          },
        },
        {
          index: "17n",
          description:
            "Look-back interest under section 167(g) or 460(b) from Form 8697 or 8866",
          box: {
            identifier: "17n",
            value: { type: "number_input" },
          },
        },
        {
          index: "17o",
          description:
            "Tax on non-effectively connected income for any part of the year you were a nonresident alien from Form 1040-NR",
          box: {
            identifier: "17o",
            value: { type: "number_input" },
          },
        },
        {
          index: "17p",
          description:
            "Any interest from Form 8621, line 16f, relating to distributions from, and dispositions of, stock of a section 1291 fund",
          box: {
            identifier: "17p",
            value: { type: "number_input" },
          },
        },
        {
          index: "17q",
          description: "Any interest from Form 8621, line 24",
          box: {
            identifier: "17q",
            value: { type: "number_input" },
          },
        },
        {
          index: "17z",
          description: "Any other taxes. List type and amount",
          box: {
            identifier: "17z",
            value: { type: "list_amounts_input" },
          },
        },
        {
          index: "18",
          description: "Total additional taxes. Add lines 17a through 17z",
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
          description:
            "Recapture of net EPE from Form 4255, line 1d, column (l)",
          box: {
            identifier: "19",
            value: { type: "number_input" },
          },
        },
        {
          index: "20",
          description:
            "Section 965 net tax liability installment from Form 965-A",
          box: {
            identifier: "20",
            value: { type: "number_input" },
          },
        },
        {
          index: "21",
          description:
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
