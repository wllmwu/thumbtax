import type { FormSpecification } from "../types/formSpecification";

export const f1040s1: FormSpecification = {
  class: "f1040s1",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-1040",
  category: "taxes",
  maxInstances: 1,
  title: "Schedule 1 (Form 1040)",
  subtitle: "Additional Income and Adjustments to Income",
  sections: [
    {
      heading: "Part I. Additional Income",
      lines: [
        {
          index: "1",
          instructions:
            "Taxable refunds, credits, or offsets of state and local income taxes",
          box: { identifier: "1", value: { type: "number_input" } },
        },
        {
          index: "2a",
          instructions: "Alimony received",
          box: { identifier: "2a", value: { type: "number_input" } },
        },
        {
          index: "2b",
          instructions:
            "Date of original divorce or separation agreement (see instructions)",
          box: { identifier: "2b", value: { type: "unused" } },
        },
        {
          index: "3",
          instructions: "Business income or (loss). Attach Schedule C",
          box: {
            identifier: "3",
            value: { type: "box_reference", box: "31", form: "f1040sC" },
          },
        },
        {
          index: "4",
          instructions: "Other gains or (losses)",
          box: { identifier: "4", value: { type: "number_input" } },
        },
        {
          index: "5",
          instructions:
            "Rental real estate, royalties, partnerships, S corporations, trusts, etc. Attach Schedule E",
          box: { identifier: "5", value: { type: "number_input" } },
        },
        {
          index: "6",
          instructions: "Farm income or (loss). Attach Schedule F",
          box: { identifier: "6", value: { type: "number_input" } },
        },
        {
          index: "7",
          instructions: "Unemployment compensation",
          box: { identifier: "7", value: { type: "number_input" } },
        },
        {
          index: "8",
          instructions: "Other income:",
          box: { identifier: "8", value: { type: "unused" } },
        },
        {
          index: "8a",
          instructions: "Net operating loss",
          box: {
            identifier: "8a",
            value: { type: "number_input", coerceSign: "negative" },
          },
        },
        {
          index: "8b",
          instructions: "Gambling",
          box: { identifier: "8b", value: { type: "number_input" } },
        },
        {
          index: "8c",
          instructions: "Cancellation of debt",
          box: { identifier: "8c", value: { type: "number_input" } },
        },
        {
          index: "8d",
          instructions: "Foreign earned income exclusion from Form 2555",
          box: {
            identifier: "8d",
            value: { type: "number_input", coerceSign: "negative" },
          },
        },
        {
          index: "8e",
          instructions: "Income from Form 8853",
          box: { identifier: "8e", value: { type: "number_input" } },
        },
        {
          index: "8f",
          instructions: "Income from Form 8889",
          box: {
            identifier: "8f",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "16", form: "f8889" },
                { type: "box_reference", box: "20", form: "f8889" },
              ],
            },
          },
        },
        {
          index: "8g",
          instructions: "Alaska Permanent Fund dividends",
          box: { identifier: "8g", value: { type: "number_input" } },
        },
        {
          index: "8h",
          instructions: "Jury duty pay",
          box: { identifier: "8h", value: { type: "number_input" } },
        },
        {
          index: "8i",
          instructions: "Prizes and awards",
          box: { identifier: "8i", value: { type: "number_input" } },
        },
        {
          index: "8j",
          instructions: "Activity not engaged in for profit income",
          box: {
            identifier: "8j",
            value: {
              type: "select_instance_boxes_input",
              options: [{ form: "f1099NEC", box: "1" }],
            },
          },
        },
        {
          index: "8k",
          instructions: "Stock options",
          box: { identifier: "8k", value: { type: "number_input" } },
        },
        {
          index: "8l",
          instructions:
            "Income from the rental of personal property if you engaged in the rental for profit but were not in the business of renting such property",
          box: { identifier: "8l", value: { type: "number_input" } },
        },
        {
          index: "8m",
          instructions:
            "Olympic and Paralympic medals and USOC prize money (see instructions)",
          box: { identifier: "8m", value: { type: "number_input" } },
        },
        {
          index: "8n",
          instructions: "Section 951(a) inclusion (see instructions)",
          box: { identifier: "8n", value: { type: "number_input" } },
        },
        {
          index: "8o",
          instructions: "Section 951A(a) inclusion (see instructions)",
          box: { identifier: "8o", value: { type: "number_input" } },
        },
        {
          index: "8p",
          instructions: "Section 461(l) excess business loss adjustment",
          box: { identifier: "8p", value: { type: "number_input" } },
        },
        {
          index: "8q",
          instructions:
            "Taxable distributions from an ABLE account (see instructions)",
          box: { identifier: "8q", value: { type: "number_input" } },
        },
        {
          index: "8r",
          instructions:
            "Scholarship and fellowship grants not reported on Form W-2",
          box: { identifier: "8r", value: { type: "number_input" } },
        },
        {
          index: "8s",
          instructions:
            "Nontaxable amount of Medicaid waiver payments included on Form 1040, line 1a or 1d",
          box: {
            identifier: "8s",
            value: { type: "number_input", coerceSign: "negative" },
          },
        },
        {
          index: "8t",
          instructions:
            "Pension or annuity from a nonqualified deferred compensation plan or a nongovernmental section 457 plan",
          box: { identifier: "8t", value: { type: "number_input" } },
        },
        {
          index: "8u",
          instructions: "Wages earned while incarcerated",
          box: { identifier: "8u", value: { type: "number_input" } },
        },
        {
          index: "8v",
          instructions:
            "Digital assets received as ordinary income not reported elsewhere. See instructions",
          box: { identifier: "8v", value: { type: "number_input" } },
        },
        {
          index: "8z",
          instructions: "Other income. List type and amount",
          box: { identifier: "8z", value: { type: "list_amounts_input" } },
        },
        {
          index: "9",
          instructions: "Total other income. Add lines 8a through 8z",
          box: {
            identifier: "9",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "8a" },
                { type: "box_reference", box: "8b" },
                { type: "box_reference", box: "8c" },
                { type: "box_reference", box: "8d" },
                { type: "box_reference", box: "8e" },
                { type: "box_reference", box: "8f" },
                { type: "box_reference", box: "8g" },
                { type: "box_reference", box: "8h" },
                { type: "box_reference", box: "8i" },
                { type: "box_reference", box: "8j" },
                { type: "box_reference", box: "8k" },
                { type: "box_reference", box: "8l" },
                { type: "box_reference", box: "8m" },
                { type: "box_reference", box: "8n" },
                { type: "box_reference", box: "8o" },
                { type: "box_reference", box: "8p" },
                { type: "box_reference", box: "8q" },
                { type: "box_reference", box: "8r" },
                { type: "box_reference", box: "8s" },
                { type: "box_reference", box: "8t" },
                { type: "box_reference", box: "8u" },
                { type: "box_reference", box: "8v" },
                { type: "box_reference", box: "8z" },
              ],
            },
          },
        },
        {
          index: "10",
          instructions: [
            "Combine lines 1 through 7 and 9. This is your ",
            {
              $$mdtype: "Tag",
              name: "strong",
              attributes: {},
              children: ["additional income."],
            },
            " Enter here and on Form 1040, 1040-SR, or 1040-NR, line 8",
          ],
          box: {
            identifier: "10",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "1" },
                { type: "box_reference", box: "2a" },
                { type: "box_reference", box: "3" },
                { type: "box_reference", box: "4" },
                { type: "box_reference", box: "5" },
                { type: "box_reference", box: "6" },
                { type: "box_reference", box: "7" },
                { type: "box_reference", box: "9" },
              ],
            },
          },
        },
      ],
    },
    {
      heading: "Part II. Adjustments to Income",
      lines: [
        {
          index: "11",
          instructions: "Educator expenses",
          box: { identifier: "11", value: { type: "number_input" } },
        },
        {
          index: "12",
          instructions:
            "Certain business expenses of reservists, performing artists, and fee-basis government officials. Attach Form 2106",
          box: { identifier: "12", value: { type: "number_input" } },
        },
        {
          index: "13",
          instructions: "Health savings account deduction. Attach Form 8889",
          box: {
            identifier: "13",
            value: { type: "box_reference", box: "13", form: "f8889" },
          },
        },
        {
          index: "14",
          instructions:
            "Moving expenses for members of the Armed Forces. Attach Form 3903",
          box: { identifier: "14", value: { type: "number_input" } },
        },
        {
          index: "15",
          instructions:
            "Deductible part of self-employment tax. Attach Schedule SE",
          box: { identifier: "15", value: { type: "number_input" } },
        },
        {
          index: "16",
          instructions: "Self-employed SEP, SIMPLE, and qualified plans",
          box: { identifier: "16", value: { type: "number_input" } },
        },
        {
          index: "17",
          instructions: "Self-employed health insurance deduction",
          box: { identifier: "17", value: { type: "number_input" } },
        },
        {
          index: "18",
          instructions: "Penalty on early withdrawal of savings",
          box: { identifier: "18", value: { type: "number_input" } },
        },
        {
          index: "19a",
          instructions: "Alimony paid",
          box: { identifier: "19a", value: { type: "number_input" } },
        },
        {
          index: "19b",
          instructions: "Recipient's SSN",
          box: { identifier: "19b", value: { type: "unused" } },
        },
        {
          index: "19c",
          instructions:
            "Date of original divorce or separation agreement (see instructions)",
          box: { identifier: "19c", value: { type: "unused" } },
        },
        {
          index: "20",
          instructions: "IRA deduction",
          box: { identifier: "20", value: { type: "number_input" } },
        },
        {
          index: "21",
          instructions: "Student loan interest deduction",
          box: { identifier: "21", value: { type: "number_input" } },
        },
        {
          index: "22",
          instructions: "Reserved for future use",
          box: { identifier: "22", value: { type: "unused" } },
        },
        {
          index: "23",
          instructions: "Archer MSA deduction",
          box: { identifier: "23", value: { type: "number_input" } },
        },
        {
          index: "24",
          instructions: "Other adjustments:",
          box: { identifier: "24", value: { type: "unused" } },
        },
        {
          index: "24a",
          instructions: "Jury duty pay (see instructions)",
          box: { identifier: "24a", value: { type: "number_input" } },
        },
        {
          index: "24b",
          instructions:
            "Deductible expenses related to income reported on line 8l from the rental of personal property engaged in for profit",
          box: { identifier: "24b", value: { type: "number_input" } },
        },
        {
          index: "24c",
          instructions:
            "Nontaxable amount of the value of Olympic and Paralympic medals and USOC prize money reported on line 8m",
          box: { identifier: "24c", value: { type: "number_input" } },
        },
        {
          index: "24d",
          instructions: "Reforestation amortization and expenses",
          box: { identifier: "24d", value: { type: "number_input" } },
        },
        {
          index: "24e",
          instructions:
            "Repayment of supplemental unemployment benefits under the Trade Act of 1974",
          box: { identifier: "24e", value: { type: "number_input" } },
        },
        {
          index: "24f",
          instructions: "Contributions to section 501(c)(18)(D) pension plans",
          box: { identifier: "24f", value: { type: "number_input" } },
        },
        {
          index: "24g",
          instructions:
            "Contributions by certain chaplains to section 403(b) plans",
          box: { identifier: "24g", value: { type: "number_input" } },
        },
        {
          index: "24h",
          instructions:
            "Attorney fees and court costs for actions involving certain unlawful discrimination claims (see instructions)",
          box: { identifier: "24h", value: { type: "number_input" } },
        },
        {
          index: "24i",
          instructions:
            "Attorney fees and court costs you paid in connection with an award from the IRS for information you provided that helped the IRS detect tax law violations",
          box: { identifier: "24i", value: { type: "number_input" } },
        },
        {
          index: "24j",
          instructions: "Housing deduction from Form 2555",
          box: { identifier: "24j", value: { type: "number_input" } },
        },
        {
          index: "24k",
          instructions:
            "Excess deductions of section 67(e) expenses from Schedule K-1 (Form 1041)",
          box: { identifier: "24k", value: { type: "number_input" } },
        },
        {
          index: "24z",
          instructions: "Other adjustments. List type and amount",
          box: { identifier: "24z", value: { type: "list_amounts_input" } },
        },
        {
          index: "25",
          instructions: "Total other adjustments. Add lines 24a through 24z",
          box: {
            identifier: "25",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "24a" },
                { type: "box_reference", box: "24b" },
                { type: "box_reference", box: "24c" },
                { type: "box_reference", box: "24d" },
                { type: "box_reference", box: "24e" },
                { type: "box_reference", box: "24f" },
                { type: "box_reference", box: "24g" },
                { type: "box_reference", box: "24h" },
                { type: "box_reference", box: "24i" },
                { type: "box_reference", box: "24j" },
                { type: "box_reference", box: "24k" },
                { type: "box_reference", box: "24z" },
              ],
            },
          },
        },
        {
          index: "26",
          instructions: [
            "Add lines 11 through 23 and 25. These are your ",
            {
              $$mdtype: "Tag",
              name: "strong",
              attributes: {},
              children: ["adjustments to income."],
            },
            " Enter here and on Form 1040, 1040-SR, or 1040-NR, line 10",
          ],
          box: {
            identifier: "26",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "11" },
                { type: "box_reference", box: "12" },
                { type: "box_reference", box: "13" },
                { type: "box_reference", box: "14" },
                { type: "box_reference", box: "15" },
                { type: "box_reference", box: "16" },
                { type: "box_reference", box: "17" },
                { type: "box_reference", box: "18" },
                { type: "box_reference", box: "19a" },
                { type: "box_reference", box: "20" },
                { type: "box_reference", box: "21" },
                { type: "box_reference", box: "23" },
                { type: "box_reference", box: "25" },
              ],
            },
          },
        },
      ],
    },
  ],
};
