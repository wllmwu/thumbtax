import { defineFormSpecification } from "../../types/defineFormSpecification";

export const f8959 = defineFormSpecification({
  class: "f8959",
  govAboutUrl: "https://www.irs.gov/forms-pubs/about-form-8959",
  category: "taxes",
  maxInstances: 1,
  title: "Form 8959",
  subtitle: "Additional Medicare Tax",
  commentary: {
    $$mdtype: "Tag",
    name: "p",
    attributes: {},
    children: [
      "This form computes your ",
      {
        $$mdtype: "Tag",
        name: "GlossaryLink",
        attributes: { term: "additional-medicare-tax" },
        children: ["Additional Medicare tax"],
      },
      " and ",
      {
        $$mdtype: "Tag",
        name: "GlossaryLink",
        attributes: { term: "withholding" },
        children: ["withholding"],
      },
      " for the year.",
    ],
  },
  sections: [
    {
      heading: "Part I",
      subtitle: "Additional Medicare Tax on Medicare Wages",
      lines: [
        {
          index: "1",
          instructions: [
            "Medicare wages and tips from ",
            {
              $$mdtype: "Tag",
              name: "FormLink",
              attributes: { formClass: "fW2" },
              children: ["Form W-2"],
            },
            ", box 5. If you have more than one Form W-2, enter the total of the amounts from box 5",
          ],
          box: {
            identifier: "1",
            value: { type: "box_reference", box: "5", form: "fW2" },
          },
        },
        {
          index: "2",
          instructions: "Unreported tips from Form 4137, line 6",
          box: {
            identifier: "2",
            value: { type: "number_input", inputKey: "unreported_tips" },
          },
        },
        {
          index: "3",
          instructions: "Wages from Form 8919, line 6",
          box: {
            identifier: "3",
            value: {
              type: "number_input",
              inputKey: "wages_with_tax_not_withheld",
            },
          },
        },
        {
          index: "4",
          instructions: "Add lines 1 through 3",
          box: {
            identifier: "4",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "1" },
                { type: "box_reference", box: "2" },
                { type: "box_reference", box: "3" },
              ],
            },
          },
        },
        {
          index: "5",
          instructions: [
            {
              $$mdtype: "Tag",
              name: "p",
              attributes: {},
              children: ["Enter the following amount for your filing status:"],
            },
            {
              $$mdtype: "Tag",
              name: "ul",
              attributes: {},
              children: [
                {
                  $$mdtype: "Tag",
                  name: "li",
                  attributes: {},
                  children: ["Married filing jointly $250,000"],
                },
                {
                  $$mdtype: "Tag",
                  name: "li",
                  attributes: {},
                  children: ["Married filing separately $125,000"],
                },
                {
                  $$mdtype: "Tag",
                  name: "li",
                  attributes: {},
                  children: [
                    "Single, Head of household, or Qualifying surviving spouse $200,000",
                  ],
                },
              ],
            },
          ],
          box: {
            identifier: "5",
            value: {
              type: "filing_status_map",
              values: {
                married_filing_jointly: {
                  type: "number_constant",
                  value: 250000,
                },
                married_filing_separately: {
                  type: "number_constant",
                  value: 125000,
                },
              },
              default: { type: "number_constant", value: 200000 },
            },
          },
        },
        {
          index: "6",
          instructions:
            "Subtract line 5 from line 4. If zero or less, enter -0-",
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
          instructions:
            "Additional Medicare Tax on Medicare wages. Multiply line 6 by 0.9% (0.009). Enter here and go to Part II",
          box: {
            identifier: "7",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "6" },
                { type: "number_constant", value: 0.009 },
              ],
            },
          },
        },
      ],
    },
    {
      heading: "Part II",
      subtitle: "Additional Medicare Tax on Self-Employment Income",
      lines: [
        {
          index: "8",
          instructions:
            "Self-employment income from Schedule SE (Form 1040), Part I, line 6. If you had a loss, enter -0-",
          box: {
            identifier: "8",
            value: { type: "number_input", inputKey: "self_employment_income" },
          },
        },
        {
          index: "9",
          instructions: [
            {
              $$mdtype: "Tag",
              name: "p",
              attributes: {},
              children: ["Enter the following amount for your filing status:"],
            },
            {
              $$mdtype: "Tag",
              name: "ul",
              attributes: {},
              children: [
                {
                  $$mdtype: "Tag",
                  name: "li",
                  attributes: {},
                  children: ["Married filing jointly $250,000"],
                },
                {
                  $$mdtype: "Tag",
                  name: "li",
                  attributes: {},
                  children: ["Married filing separately $125,000"],
                },
                {
                  $$mdtype: "Tag",
                  name: "li",
                  attributes: {},
                  children: [
                    "Single, Head of household, or Qualifying surviving spouse $200,000",
                  ],
                },
              ],
            },
          ],
          box: {
            identifier: "9",
            value: {
              type: "filing_status_map",
              values: {
                married_filing_jointly: {
                  type: "number_constant",
                  value: 250000,
                },
                married_filing_separately: {
                  type: "number_constant",
                  value: 125000,
                },
              },
              default: { type: "number_constant", value: 200000 },
            },
          },
        },
        {
          index: "10",
          instructions: "Enter the amount from line 4",
          box: { identifier: "10", value: { type: "box_reference", box: "4" } },
        },
        {
          index: "11",
          instructions:
            "Subtract line 10 from line 9. If zero or less, enter -0-",
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
          instructions:
            "Additional Medicare Tax on self-employment income. Multiply line 12 by 0.9% (0.009). Enter here and go to Part III",
          box: {
            identifier: "13",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "12" },
                { type: "number_constant", value: 0.009 },
              ],
            },
          },
        },
      ],
    },
    {
      heading: "Part III",
      subtitle:
        "Additional Medicare Tax on Railroad Retirement Tax Act (RRTA) Compensation",
      lines: [
        {
          index: "14",
          instructions: [
            "Railroad retirement (RRTA) compensation and tips from ",
            {
              $$mdtype: "Tag",
              name: "FormLink",
              attributes: { formClass: "fW2" },
              children: ["Form(s) W-2"],
            },
            ", box 14 (see instructions)",
          ],
          box: {
            identifier: "14",
            value: {
              type: "select_instance_boxes_input",
              inputKey: "rrta_compensation_and_tips",
              options: [{ form: "fW2", box: "14a" }],
            },
          },
        },
        {
          index: "15",
          instructions: [
            {
              $$mdtype: "Tag",
              name: "p",
              attributes: {},
              children: ["Enter the following amount for your filing status:"],
            },
            {
              $$mdtype: "Tag",
              name: "ul",
              attributes: {},
              children: [
                {
                  $$mdtype: "Tag",
                  name: "li",
                  attributes: {},
                  children: ["Married filing jointly $250,000"],
                },
                {
                  $$mdtype: "Tag",
                  name: "li",
                  attributes: {},
                  children: ["Married filing separately $125,000"],
                },
                {
                  $$mdtype: "Tag",
                  name: "li",
                  attributes: {},
                  children: [
                    "Single, Head of household, or Qualifying surviving spouse $200,000",
                  ],
                },
              ],
            },
          ],
          box: {
            identifier: "15",
            value: {
              type: "filing_status_map",
              values: {
                married_filing_jointly: {
                  type: "number_constant",
                  value: 250000,
                },
                married_filing_separately: {
                  type: "number_constant",
                  value: 125000,
                },
              },
              default: { type: "number_constant", value: 200000 },
            },
          },
        },
        {
          index: "16",
          instructions:
            "Subtract line 15 from line 14. If zero or less, enter -0-",
          box: {
            identifier: "16",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "14" },
                subtrahend: { type: "box_reference", box: "15" },
              },
            },
          },
        },
        {
          index: "17",
          instructions:
            "Additional Medicare Tax on railroad retirement (RRTA) compensation. Multiply line 16 by 0.9% (0.009). Enter here and go to Part IV",
          box: {
            identifier: "17",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "16" },
                { type: "number_constant", value: 0.009 },
              ],
            },
          },
        },
      ],
    },
    {
      heading: "Part IV",
      subtitle: "Total Additional Medicare Tax",
      lines: [
        {
          index: "18",
          instructions: [
            "Add lines 7, 13, and 17. Also include this amount on ",
            {
              $$mdtype: "Tag",
              name: "FormLink",
              attributes: { formClass: "f1040s2" },
              children: ["Schedule 2 (Form 1040)"],
            },
            ", line 11 (Form 1040-SS filers, see instructions), and go to Part V",
          ],
          box: {
            identifier: "18",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "7" },
                { type: "box_reference", box: "13" },
                { type: "box_reference", box: "17" },
              ],
            },
          },
        },
      ],
    },
    {
      heading: "Part V",
      subtitle: "Withholding Reconciliation",
      lines: [
        {
          index: "19",
          instructions: [
            "Medicare tax withheld from ",
            {
              $$mdtype: "Tag",
              name: "FormLink",
              attributes: { formClass: "fW2" },
              children: ["Form W-2"],
            },
            ", box 6. If you have more than one Form W-2, enter the total of the amounts from box 6",
          ],
          box: {
            identifier: "19",
            value: { type: "box_reference", box: "6", form: "fW2" },
          },
        },
        {
          index: "20",
          instructions: "Enter the amount from line 1",
          box: { identifier: "20", value: { type: "box_reference", box: "1" } },
        },
        {
          index: "21",
          instructions:
            "Multiply line 20 by 1.45% (0.0145). This is your regular Medicare tax withholding on Medicare wages",
          box: {
            identifier: "21",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "20" },
                { type: "number_constant", value: 0.0145 },
              ],
            },
          },
        },
        {
          index: "22",
          instructions:
            "Subtract line 21 from line 19. If zero or less, enter -0-. This is your Additional Medicare Tax withholding on Medicare wages",
          box: {
            identifier: "22",
            value: {
              type: "non_negative_clamp",
              value: {
                type: "difference",
                minuend: { type: "box_reference", box: "19" },
                subtrahend: { type: "box_reference", box: "21" },
              },
            },
          },
        },
        {
          index: "23",
          instructions: [
            "Additional Medicare Tax withholding on railroad retirement (RRTA) compensation from ",
            {
              $$mdtype: "Tag",
              name: "FormLink",
              attributes: { formClass: "fW2" },
              children: ["Form W-2"],
            },
            ", box 14 (see instructions)",
          ],
          box: {
            identifier: "23",
            value: {
              type: "number_input",
              inputKey: "rrta_additional_medicare_tax_withheld",
            },
          },
        },
        {
          index: "24",
          instructions: [
            {
              $$mdtype: "Tag",
              name: "strong",
              attributes: {},
              children: ["Total Additional Medicare Tax withholding."],
            },
            " Add lines 22 and 23. Also include this amount with federal income tax withholding on ",
            {
              $$mdtype: "Tag",
              name: "FormLink",
              attributes: { formClass: "f1040" },
              children: ["Form 1040"],
            },
            ", 1040-SR, or 1040-NR, line 25c (Form 1040-SS filers, see instructions)",
          ],
          box: {
            identifier: "24",
            value: {
              type: "sum",
              values: [
                { type: "box_reference", box: "22" },
                { type: "box_reference", box: "23" },
              ],
            },
          },
        },
      ],
    },
  ],
});
