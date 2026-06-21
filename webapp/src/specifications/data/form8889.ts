import type { FormSpecification } from "#src/specifications/types/formSpecification";

export const Form8889: FormSpecification = {
  class: "f8889",
  title: "Form 8889",
  subtitle: "Health Savings Accounts (HSAs)",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-8889",
  category: "taxes",
  maxInstances: 1,
  sections: [
    {
      heading: "Part I. HSA Contributions and Deduction",
      lines: [
        {
          index: "1",
          description:
            "Check the box to indicate your coverage under a high-deductible health plan (HDHP) during 2025. See instructions",
          box: { identifier: "1", value: { type: "unused" } },
        },
        {
          index: "2",
          description:
            "HSA contributions you made for 2025 (or those made on your behalf), including those made by the unextended due date of your tax return that were for 2025. Do not include employer contributions, contributions through a cafeteria plan, or rollovers. See instructions",
          box: {
            identifier: "2",
            value: { type: "number_input" },
          },
        },
        {
          index: "3",
          description:
            "If you were under age 55 at the end of 2025 and, on the first day of every month during 2025, you were, or were considered, an eligible individual with the same coverage, enter $4,300 ($8,550 for family coverage). All others, see the instructions for the amount to enter",
          box: {
            identifier: "3",
            value: {
              type: "override_number_input",
              computedValue: { type: "number_constant", value: 4300 },
            },
          },
        },
        {
          index: "4",
          description:
            "Enter the amount you and your employer contributed to your Archer MSAs for 2025 from Form 8853, lines 1 and 2. If you or your spouse had family coverage under an HDHP at any time during 2025, also include any amount contributed to your spouse's Archer MSAs",
          box: {
            identifier: "4",
            value: { type: "number_input" },
          },
        },
        {
          index: "5",
          description:
            "Subtract line 4 from line 3. If zero or less, enter -0-",
          box: {
            identifier: "5",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "3" },
                subtrahend: { type: "box_reference", box: "4" },
              },
            },
          },
        },
        {
          index: "6",
          description:
            "Enter the amount from line 5. But if you and your spouse each have separate HSAs and had family coverage under an HDHP at any time during 2025, see the instructions for the amount to enter",
          box: {
            identifier: "6",
            value: {
              type: "override_number_input",
              computedValue: { type: "box_reference", box: "5" },
            },
          },
        },
        {
          index: "7",
          description:
            "If you were age 55 or older at the end of 2025, married, and you or your spouse had family coverage under an HDHP at any time during 2025, enter your additional contribution amount. See instructions",
          box: {
            identifier: "7",
            value: { type: "number_input" },
          },
        },
        {
          index: "8",
          description: "Add lines 6 and 7",
          box: {
            identifier: "8",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "6" },
                { type: "box_reference", box: "7" },
              ],
            },
          },
        },
        {
          index: "9",
          description: "Employer contributions made to your HSAs for 2025",
          box: {
            identifier: "9",
            value: { type: "number_input" },
          },
        },
        {
          index: "10",
          description: "Qualified HSA funding distributions",
          box: {
            identifier: "10",
            value: { type: "number_input" },
          },
        },
        {
          index: "11",
          description: "Add lines 9 and 10",
          box: {
            identifier: "11",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "9" },
                { type: "box_reference", box: "10" },
              ],
            },
          },
        },
        {
          index: "12",
          description:
            "Subtract line 11 from line 8. If zero or less, enter -0-",
          box: {
            identifier: "12",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "8" },
                subtrahend: { type: "box_reference", box: "11" },
              },
            },
          },
        },
        {
          index: "13",
          description: "**HSA deduction** (see instructions)",
          box: {
            identifier: "13",
            value: {
              type: "minimum",
              values: [
                { type: "box_reference", box: "2" },
                { type: "box_reference", box: "12" },
              ],
            },
          },
        },
        {
          index: "flag_f5329",
          virtual: true,
          description:
            "Flag for whether to file Form 5329 due to excess HSA contributions",
          box: {
            identifier: "flag_f5329",
            format: "yes_no",
            value: {
              type: "comparison",
              value: { type: "box_reference", box: "2" },
              minimum: { type: "box_reference", box: "13" },
              strict: true,
            },
          },
        },
      ],
    },
    {
      heading: "Part II. HSA Distributions",
      lines: [
        {
          // TODO: Form 1099-SA
          index: "14a",
          description:
            "Total distributions you received in 2025 from all HSAs (see instructions)",
          box: {
            identifier: "14a",
            value: { type: "number_input" },
          },
        },
        {
          index: "14b",
          description:
            "Distributions included on line 14a that you rolled over to another HSA. Also include any excess contributions (and the earnings on those excess contributions) included on line 14a that were withdrawn by the due date of your return. See instructions",
          box: {
            identifier: "14b",
            value: { type: "number_input" },
          },
        },
        {
          index: "14c",
          description: "Subtract line 14b from line 14a",
          box: {
            identifier: "14c",
            value: {
              type: "difference",
              minuend: { type: "box_reference", box: "14a" },
              subtrahend: { type: "box_reference", box: "14b" },
            },
          },
        },
        {
          index: "15",
          description:
            "Qualified medical expenses paid using HSA distributions (see instructions)",
          box: {
            identifier: "15",
            value: { type: "number_input" },
          },
        },
        {
          index: "16",
          description:
            "**Taxable HSA distributions.** Subtract line 15 from line 14c. If zero or less, enter -0-. Also, include this amount in the total on Schedule 1 (Form 1040), Part I, line 8f",
          box: {
            identifier: "16",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "14c" },
                subtrahend: { type: "box_reference", box: "15" },
              },
            },
          },
        },
        {
          index: "17a",
          description:
            "If any of the distributions included on line 16 meet any of the **Exceptions to the Additional 20% Tax** (see instructions), check here",
          box: {
            identifier: "17a",
            value: { type: "checkbox_input" },
          },
        },
        {
          index: "17b",
          description:
            "**Additional 20% tax** (see instructions). Enter 20% (0.20) of the distributions included on line 16 that are subject to the additional 20% tax. Also, include this amount in the total on Schedule 2 (Form 1040), Part II, line 17c",
          box: {
            identifier: "17b",
            value: {
              type: "override_number_input",
              computedValue: {
                type: "product",
                values: [
                  { type: "box_reference", box: "16" },
                  { type: "number_constant", value: 0.2 },
                ],
              },
            },
          },
        },
      ],
    },
    {
      heading:
        "Part III. Income and Additional Tax for Failure To Maintain HDHP Coverage",
      lines: [
        {
          index: "18",
          description: "Last-month rule",
          box: {
            identifier: "18",
            value: { type: "number_input" },
          },
        },
        {
          index: "19",
          description: "Qualified HSA funding distribution",
          box: {
            identifier: "19",
            value: { type: "number_input" },
          },
        },
        {
          index: "20",
          description:
            "**Total income.** Add lines 18 and 19. Include this amount on Schedule 1 (Form 1040), Part I, line 8f",
          box: {
            identifier: "20",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "18" },
                { type: "box_reference", box: "19" },
              ],
            },
          },
        },
        {
          index: "21",
          description:
            "**Additional tax.** Multiply line 20 by 10% (0.10). Include this amount in the total on Schedule 2 (Form 1040), Part II, line 17d",
          box: {
            identifier: "21",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "20" },
                { type: "number_constant", value: 0.1 },
              ],
            },
          },
        },
      ],
    },
  ],
};
