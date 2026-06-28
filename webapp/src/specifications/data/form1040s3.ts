import type { FormSpecification } from "@thumbtax/forms";

export const Form1040S3: FormSpecification = {
  class: "f1040s3",
  title: "Schedule 3 (Form 1040)",
  subtitle: "Additional Credits and Payments",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-1040",
  category: "taxes",
  maxInstances: 1,
  sections: [
    {
      heading: "Part I. Nonrefundable Credits",
      lines: [
        {
          index: "1",
          description: "Foreign tax credit. Attach Form 1116 if required",
          box: {
            identifier: "1",
            value: { type: "number_input" },
          },
        },
        {
          index: "2",
          description:
            "Credit for child and dependent care expenses from Form 2441, line 11. Attach Form 2441",
          box: {
            identifier: "2",
            value: { type: "number_input" },
          },
        },
        {
          index: "3",
          description: "Education credits from Form 8863, line 19",
          box: {
            identifier: "3",
            value: { type: "number_input" },
          },
        },
        {
          index: "4",
          description:
            "Retirement savings contributions credit. Attach Form 8880",
          box: {
            identifier: "4",
            value: { type: "number_input" },
          },
        },
        {
          index: "5a",
          description:
            "Residential clean energy credit from Form 5695, line 15",
          box: {
            identifier: "5a",
            value: { type: "number_input" },
          },
        },
        {
          index: "5b",
          description:
            "Energy efficient home improvement credit from Form 5695, line 32",
          box: {
            identifier: "5b",
            value: { type: "number_input" },
          },
        },
        {
          index: "6",
          description: "Other nonrefundable credits:",
          box: {
            identifier: "6",
            value: { type: "unused" },
          },
        },
        {
          index: "6a",
          description: "General business credit. Attach Form 3800",
          box: {
            identifier: "6a",
            value: { type: "number_input" },
          },
        },
        {
          index: "6b",
          description: "Credit for prior year minimum tax. Attach Form 8801",
          box: {
            identifier: "6b",
            value: { type: "number_input" },
          },
        },
        {
          index: "6c",
          description: "Adoption credit. Attach Form 8839",
          box: {
            identifier: "6c",
            value: { type: "number_input" },
          },
        },
        {
          index: "6d",
          description: "Credit for the elderly or disabled. Attach Schedule R",
          box: {
            identifier: "6d",
            value: { type: "number_input" },
          },
        },
        {
          index: "6e",
          description: "Reserved for future use",
          box: {
            identifier: "6e",
            value: { type: "unused" },
          },
        },
        {
          index: "6f",
          description: "Clean vehicle credit. Attach Form 8936",
          box: {
            identifier: "6f",
            value: { type: "number_input" },
          },
        },
        {
          index: "6g",
          description: "Mortgage interest credit. Attach Form 8396",
          box: {
            identifier: "6g",
            value: { type: "number_input" },
          },
        },
        {
          index: "6h",
          description:
            "District of Columbia first-time homebuyer credit. Attach Form 8859",
          box: {
            identifier: "6h",
            value: { type: "number_input" },
          },
        },
        {
          index: "6i",
          description: "Qualified electric vehicle credit. Attach Form 8834",
          box: {
            identifier: "6i",
            value: { type: "number_input" },
          },
        },
        {
          index: "6j",
          description:
            "Alternative fuel vehicle refueling property credit. Attach Form 8911",
          box: {
            identifier: "6j",
            value: { type: "number_input" },
          },
        },
        {
          index: "6k",
          description:
            "Credit to holders of tax credit bonds. Attach Form 8912",
          box: {
            identifier: "6k",
            value: { type: "number_input" },
          },
        },
        {
          index: "6l",
          description: "Amount on Form 8978, line 14. See instructions",
          box: {
            identifier: "6l",
            value: { type: "number_input" },
          },
        },
        {
          index: "6m",
          description:
            "Credit for previously owned clean vehicles. Attach Form 8936",
          box: {
            identifier: "6m",
            value: { type: "number_input" },
          },
        },
        {
          index: "6z",
          description: "Other nonrefundable credits. List type and amount",
          box: {
            identifier: "6z",
            value: { type: "list_amounts_input" },
          },
        },
        {
          index: "7",
          description:
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
          description:
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
      heading: "Part II. Other Payments and Refundable Credits",
      lines: [
        {
          index: "9",
          description: "Net premium tax credit. Attach Form 8962",
          box: {
            identifier: "9",
            value: { type: "number_input" },
          },
        },
        {
          index: "10",
          description:
            "Amount paid with request for extension to file (see instructions)",
          box: {
            identifier: "10",
            value: { type: "number_input" },
          },
        },
        {
          index: "11",
          description: "Excess social security and tier 1 RRTA tax withheld",
          box: {
            identifier: "11",
            value: { type: "number_input" },
          },
        },
        {
          index: "12",
          description: "Credit for federal tax on fuels. Attach Form 4136",
          box: {
            identifier: "12",
            value: { type: "number_input" },
          },
        },
        {
          index: "13",
          description: "Other payments or refundable credits:",
          box: {
            identifier: "13",
            value: { type: "unused" },
          },
        },
        {
          index: "13a",
          description: "Form 2439",
          box: {
            identifier: "13a",
            value: { type: "number_input" },
          },
        },
        {
          index: "13b",
          description:
            "Section 1341 credit for repayment of amounts included in income from earlier years",
          box: {
            identifier: "13b",
            value: { type: "number_input" },
          },
        },
        {
          index: "13c",
          description:
            "Net elective payment election amount from Form 3800, Part III, line 6, column (j)",
          box: {
            identifier: "13c",
            value: { type: "number_input" },
          },
        },
        {
          index: "13d",
          description:
            "Deferred amount of net 965 tax liability (see instructions)",
          box: {
            identifier: "13d",
            value: { type: "number_input" },
          },
        },
        {
          index: "13z",
          description: "Other refundable credits (see instructions)",
          box: {
            identifier: "13z",
            value: { type: "list_amounts_input" },
          },
        },
        {
          index: "14",
          description:
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
          description:
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
