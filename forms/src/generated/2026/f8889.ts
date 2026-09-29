import { defineFormSpecification } from "../../types/defineFormSpecification";

export const f8889 = defineFormSpecification({
  class: "f8889",
  govAboutUrl: "https://www.irs.gov/forms-pubs/about-form-8889",
  category: "taxes",
  maxInstances: 1,
  title: "Form 8889",
  subtitle: "Health Savings Accounts (HSAs)",
  sections: [
    {
      heading: "Part I",
      subtitle: "HSA Contributions and Deduction",
      lines: [
        {
          index: "1",
          instructions:
            "Check the box to indicate your coverage under a high-deductible health plan (HDHP) during 2025. See instructions",
          box: { identifier: "1", value: { type: "unused" } },
        },
        {
          index: "2",
          instructions:
            "HSA contributions you made for 2025 (or those made on your behalf), including those made by the unextended due date of your tax return that were for 2025. Do not include employer contributions, contributions through a cafeteria plan, or rollovers. See instructions",
          box: {
            identifier: "2",
            value: { type: "number_input", inputKey: "hsa_contributions" },
          },
        },
        {
          index: "3",
          instructions:
            "If you were under age 55 at the end of 2025 and, on the first day of every month during 2025, you were, or were considered, an eligible individual with the same coverage, enter $4,300 ($8,550 for family coverage). All others, see the instructions for the amount to enter",
          box: {
            identifier: "3",
            value: {
              type: "override_number_input",
              inputKey: "contribution_limit",
              computedValue: { type: "number_constant", value: 4300 },
            },
          },
        },
        {
          index: "4",
          instructions:
            "Enter the amount you and your employer contributed to your Archer MSAs for 2025 from Form 8853, lines 1 and 2. If you or your spouse had family coverage under an HDHP at any time during 2025, also include any amount contributed to your spouse's Archer MSAs",
          box: {
            identifier: "4",
            value: {
              type: "number_input",
              inputKey: "archer_msa_contributions",
            },
          },
        },
        {
          index: "5",
          instructions:
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
          instructions:
            "Enter the amount from line 5. But if you and your spouse each have separate HSAs and had family coverage under an HDHP at any time during 2025, see the instructions for the amount to enter",
          box: {
            identifier: "6",
            value: {
              type: "override_number_input",
              inputKey: "allocated_contribution_limit",
              computedValue: { type: "box_reference", box: "5" },
            },
          },
        },
        {
          index: "7",
          instructions:
            "If you were age 55 or older at the end of 2025, married, and you or your spouse had family coverage under an HDHP at any time during 2025, enter your additional contribution amount. See instructions",
          box: {
            identifier: "7",
            value: {
              type: "number_input",
              inputKey: "additional_contribution_amount",
            },
          },
        },
        {
          index: "8",
          instructions: "Add lines 6 and 7",
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
          instructions: "Employer contributions made to your HSAs for 2025",
          box: {
            identifier: "9",
            value: {
              type: "number_input",
              inputKey: "employer_hsa_contributions",
            },
          },
        },
        {
          index: "10",
          instructions: "Qualified HSA funding distributions",
          box: {
            identifier: "10",
            value: {
              type: "number_input",
              inputKey: "qualified_hsa_funding_distributions",
            },
          },
        },
        {
          index: "11",
          instructions: "Add lines 9 and 10",
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
          instructions:
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
          instructions: [
            {
              $$mdtype: "Tag",
              name: "strong",
              attributes: {},
              children: ["HSA deduction"],
            },
            " (see instructions)",
          ],
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
      ],
    },
    {
      heading: "Part II",
      subtitle: "HSA Distributions",
      lines: [
        {
          index: "14a",
          instructions:
            "Total distributions you received in 2025 from all HSAs (see instructions)",
          box: {
            identifier: "14a",
            value: {
              type: "number_input",
              inputKey: "total_hsa_distributions",
            },
          },
        },
        {
          index: "14b",
          instructions:
            "Distributions included on line 14a that you rolled over to another HSA. Also include any excess contributions (and the earnings on those excess contributions) included on line 14a that were withdrawn by the due date of your return. See instructions",
          box: {
            identifier: "14b",
            value: {
              type: "number_input",
              inputKey: "hsa_distributions_rolled_over",
            },
          },
        },
        {
          index: "14c",
          instructions: "Subtract line 14b from line 14a",
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
          instructions:
            "Qualified medical expenses paid using HSA distributions (see instructions)",
          box: {
            identifier: "15",
            value: {
              type: "number_input",
              inputKey: "qualified_medical_expenses_paid",
            },
          },
        },
        {
          index: "16",
          instructions: [
            {
              $$mdtype: "Tag",
              name: "strong",
              attributes: {},
              children: ["Taxable HSA distributions."],
            },
            " Subtract line 15 from line 14c. If zero or less, enter -0-. Also, include this amount in the total on ",
            {
              $$mdtype: "Tag",
              name: "FormLink",
              attributes: { formClass: "f1040s1" },
              children: ["Schedule 1 (Form 1040)"],
            },
            ", Part I, line 8f",
          ],
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
          instructions: [
            "If any of the distributions included on line 16 meet any of the ",
            {
              $$mdtype: "Tag",
              name: "strong",
              attributes: {},
              children: ["Exceptions to the Additional 20% Tax"],
            },
            " (see instructions), check here",
          ],
          box: {
            identifier: "17a",
            value: {
              type: "checkbox_input",
              inputKey:
                "distribution_additional_20_percent_tax_exception_checkbox",
            },
          },
        },
        {
          index: "17b",
          instructions: [
            {
              $$mdtype: "Tag",
              name: "strong",
              attributes: {},
              children: ["Additional 20% tax"],
            },
            " (see instructions). Enter 20% (0.20) of the distributions included on line 16 that are subject to the additional 20% tax. Also, include this amount in the total on ",
            {
              $$mdtype: "Tag",
              name: "FormLink",
              attributes: { formClass: "f1040s2" },
              children: ["Schedule 2 (Form 1040)"],
            },
            ", Part II, line 17c",
          ],
          box: {
            identifier: "17b",
            value: {
              type: "override_number_input",
              inputKey: "additional_20_percent_tax",
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
      heading: "Part III",
      subtitle:
        "Income and Additional Tax for Failure To Maintain HDHP Coverage",
      commentary: {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          "If you contribute to an HSA while you don't meet the eligibility requirements, then those contributions count as income and are subject to an extra tax.",
        ],
      },
      lines: [
        {
          index: "18",
          instructions: "Last-month rule",
          box: {
            identifier: "18",
            value: {
              type: "number_input",
              inputKey: "last_month_rule_excess_contribution",
            },
          },
        },
        {
          index: "19",
          instructions: "Qualified HSA funding distribution",
          box: {
            identifier: "19",
            value: {
              type: "number_input",
              inputKey: "ineligible_qualified_hsa_funding_distribution",
            },
          },
        },
        {
          index: "20",
          instructions: [
            {
              $$mdtype: "Tag",
              name: "strong",
              attributes: {},
              children: ["Total income."],
            },
            " Add lines 18 and 19. Include this amount on ",
            {
              $$mdtype: "Tag",
              name: "FormLink",
              attributes: { formClass: "f1040s1" },
              children: ["Schedule 1 (Form 1040)"],
            },
            ", Part I, line 8f",
          ],
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
          instructions: [
            {
              $$mdtype: "Tag",
              name: "strong",
              attributes: {},
              children: ["Additional tax."],
            },
            " Multiply line 20 by 10% (0.10). Include this amount in the total on ",
            {
              $$mdtype: "Tag",
              name: "FormLink",
              attributes: { formClass: "f1040s2" },
              children: ["Schedule 2 (Form 1040)"],
            },
            ", Part II, line 17d",
          ],
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
});
