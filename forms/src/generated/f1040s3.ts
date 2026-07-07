import type { FormSpecification } from "../types/formSpecification";

export const f1040s3: FormSpecification = {
  class: "f1040s3",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-1040",
  category: "taxes",
  maxInstances: 1,
  title: "Schedule 3 (Form 1040)",
  subtitle: "Additional Credits and Payments",
  sections: [
    {
      heading: "Part I",
      subtitle: "Nonrefundable Credits",
      lines: [
        {
          index: "1",
          instructions: "Foreign tax credit. Attach Form 1116 if required",
          box: { identifier: "1", value: { type: "number_input" } },
        },
        {
          index: "2",
          instructions:
            "Credit for child and dependent care expenses from Form 2441, line 11. Attach Form 2441",
          box: { identifier: "2", value: { type: "number_input" } },
        },
        {
          index: "3",
          instructions: "Education credits from Form 8863, line 19",
          box: { identifier: "3", value: { type: "number_input" } },
        },
        {
          index: "4",
          instructions:
            "Retirement savings contributions credit. Attach Form 8880",
          box: { identifier: "4", value: { type: "number_input" } },
        },
        {
          index: "5a",
          instructions:
            "Residential clean energy credit from Form 5695, line 15",
          box: { identifier: "5a", value: { type: "number_input" } },
        },
        {
          index: "5b",
          instructions:
            "Energy efficient home improvement credit from Form 5695, line 32",
          box: { identifier: "5b", value: { type: "number_input" } },
        },
        {
          index: "6",
          instructions: "Other nonrefundable credits:",
          box: { identifier: "6", value: { type: "unused" } },
        },
        {
          index: "6a",
          instructions: "General business credit. Attach Form 3800",
          box: { identifier: "6a", value: { type: "number_input" } },
        },
        {
          index: "6b",
          instructions: "Credit for prior year minimum tax. Attach Form 8801",
          box: { identifier: "6b", value: { type: "number_input" } },
        },
        {
          index: "6c",
          instructions: "Adoption credit. Attach Form 8839",
          box: { identifier: "6c", value: { type: "number_input" } },
        },
        {
          index: "6d",
          instructions: "Credit for the elderly or disabled. Attach Schedule R",
          box: { identifier: "6d", value: { type: "number_input" } },
        },
        {
          index: "6e",
          instructions: "Reserved for future use",
          box: { identifier: "6e", value: { type: "unused" } },
        },
        {
          index: "6f",
          instructions: "Clean vehicle credit. Attach Form 8936",
          box: { identifier: "6f", value: { type: "number_input" } },
        },
        {
          index: "6g",
          instructions: "Mortgage interest credit. Attach Form 8396",
          box: { identifier: "6g", value: { type: "number_input" } },
        },
        {
          index: "6h",
          instructions:
            "District of Columbia first-time homebuyer credit. Attach Form 8859",
          box: { identifier: "6h", value: { type: "number_input" } },
        },
        {
          index: "6i",
          instructions: "Qualified electric vehicle credit. Attach Form 8834",
          box: { identifier: "6i", value: { type: "number_input" } },
        },
        {
          index: "6j",
          instructions:
            "Alternative fuel vehicle refueling property credit. Attach Form 8911",
          box: { identifier: "6j", value: { type: "number_input" } },
        },
        {
          index: "6k",
          instructions:
            "Credit to holders of tax credit bonds. Attach Form 8912",
          box: { identifier: "6k", value: { type: "number_input" } },
        },
        {
          index: "6l",
          instructions: "Amount on Form 8978, line 14. See instructions",
          box: { identifier: "6l", value: { type: "number_input" } },
        },
        {
          index: "6m",
          instructions:
            "Credit for previously owned clean vehicles. Attach Form 8936",
          box: { identifier: "6m", value: { type: "number_input" } },
        },
        {
          index: "6z",
          instructions: "Other nonrefundable credits. List type and amount",
          box: { identifier: "6z", value: { type: "list_amounts_input" } },
        },
        {
          index: "7",
          instructions:
            "Total other nonrefundable credits. Add lines 6a through 6z",
          box: {
            identifier: "7",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "6a" },
                { type: "box_reference", box: "6b" },
                { type: "box_reference", box: "6c" },
                { type: "box_reference", box: "6d" },
                { type: "box_reference", box: "6e" },
                { type: "box_reference", box: "6f" },
                { type: "box_reference", box: "6g" },
                { type: "box_reference", box: "6h" },
                { type: "box_reference", box: "6i" },
                { type: "box_reference", box: "6j" },
                { type: "box_reference", box: "6k" },
                { type: "box_reference", box: "6l" },
                { type: "box_reference", box: "6m" },
                { type: "box_reference", box: "6z" },
              ],
            },
          },
        },
        {
          index: "8",
          instructions:
            "Add lines 1 through 4, 5a, 5b, and 7. Enter here and on Form 1040, 1040-SR, or 1040-NR, line 20",
          box: {
            identifier: "8",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "1" },
                { type: "box_reference", box: "2" },
                { type: "box_reference", box: "3" },
                { type: "box_reference", box: "4" },
                { type: "box_reference", box: "5a" },
                { type: "box_reference", box: "5b" },
                { type: "box_reference", box: "7" },
              ],
            },
          },
        },
      ],
    },
    {
      heading: "Part II",
      subtitle: "Other Payments and Refundable Credits",
      lines: [
        {
          index: "9",
          instructions: "Net premium tax credit. Attach Form 8962",
          box: { identifier: "9", value: { type: "number_input" } },
        },
        {
          index: "10",
          instructions:
            "Amount paid with request for extension to file (see instructions)",
          box: { identifier: "10", value: { type: "number_input" } },
        },
        {
          index: "11",
          instructions: "Excess social security and tier 1 RRTA tax withheld",
          box: { identifier: "11", value: { type: "number_input" } },
        },
        {
          index: "12",
          instructions: "Credit for federal tax on fuels. Attach Form 4136",
          box: { identifier: "12", value: { type: "number_input" } },
        },
        {
          index: "13",
          instructions: "Other payments or refundable credits:",
          box: { identifier: "13", value: { type: "unused" } },
        },
        {
          index: "13a",
          instructions: "Form 2439",
          box: { identifier: "13a", value: { type: "number_input" } },
        },
        {
          index: "13b",
          instructions:
            "Section 1341 credit for repayment of amounts included in income from earlier years",
          box: { identifier: "13b", value: { type: "number_input" } },
        },
        {
          index: "13c",
          instructions:
            "Net elective payment election amount from Form 3800, Part III, line 6, column (j)",
          box: { identifier: "13c", value: { type: "number_input" } },
        },
        {
          index: "13d",
          instructions:
            "Deferred amount of net 965 tax liability (see instructions)",
          box: { identifier: "13d", value: { type: "number_input" } },
        },
        {
          index: "13z",
          instructions: "Other refundable credits (see instructions)",
          box: { identifier: "13z", value: { type: "list_amounts_input" } },
        },
        {
          index: "14",
          instructions:
            "Total other payments or refundable credits. Add lines 13a through 13z",
          box: {
            identifier: "14",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "13a" },
                { type: "box_reference", box: "13b" },
                { type: "box_reference", box: "13c" },
                { type: "box_reference", box: "13d" },
                { type: "box_reference", box: "13z" },
              ],
            },
          },
        },
        {
          index: "15",
          instructions:
            "Add lines 9 through 12 and 14. Enter here and on Form 1040, 1040-SR, or 1040-NR, line 31",
          box: {
            identifier: "15",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "9" },
                { type: "box_reference", box: "10" },
                { type: "box_reference", box: "11" },
                { type: "box_reference", box: "12" },
                { type: "box_reference", box: "14" },
              ],
            },
          },
        },
      ],
    },
  ],
};
