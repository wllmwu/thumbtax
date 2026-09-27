import { defineFormSpecification } from "../types/defineFormSpecification";

export const fW2 = defineFormSpecification({
  class: "fW2",
  govAboutUrl: "https://www.irs.gov/forms-pubs/about-form-w-2",
  category: "income",
  maxInstances: null,
  title: "Form W-2",
  subtitle: "Wage and Tax Statement",
  commentary: {
    $$mdtype: "Tag",
    name: "p",
    attributes: {},
    children: [
      "If you receive ",
      {
        $$mdtype: "Tag",
        name: "GlossaryLink",
        attributes: { term: "wages" },
        children: ["wages"],
      },
      " from an employer as their employee during the year, the employer files this form with the IRS and sends a copy to you.",
    ],
  },
  sections: [
    {
      lines: [
        {
          index: "1",
          instructions: "Wages, tips, other compensation",
          box: {
            identifier: "1",
            value: { type: "number_input", inputKey: "compensation" },
          },
        },
        {
          index: "2",
          instructions: [
            {
              $$mdtype: "Tag",
              name: "GlossaryLink",
              attributes: { term: "federal-income-tax" },
              children: ["Federal income tax"],
            },
            " ",
            {
              $$mdtype: "Tag",
              name: "GlossaryLink",
              attributes: { term: "withholding" },
              children: ["withheld"],
            },
          ],
          box: {
            identifier: "2",
            value: {
              type: "number_input",
              inputKey: "federal_income_tax_withheld",
            },
          },
        },
        {
          index: "3",
          instructions: "Social security wages",
          box: {
            identifier: "3",
            value: { type: "number_input", inputKey: "social_security_wages" },
          },
        },
        {
          index: "4",
          instructions: "Social security tax withheld",
          box: {
            identifier: "4",
            value: {
              type: "number_input",
              inputKey: "social_security_tax_withheld",
            },
          },
        },
        {
          index: "5",
          instructions: "Medicare wages and tips",
          box: {
            identifier: "5",
            value: {
              type: "number_input",
              inputKey: "medicare_wages_and_tips",
            },
          },
        },
        {
          index: "6",
          instructions: "Medicare tax withheld",
          box: {
            identifier: "6",
            value: { type: "number_input", inputKey: "medicare_tax_withheld" },
          },
        },
        {
          index: "7",
          instructions: "Social security tips",
          box: {
            identifier: "7",
            value: { type: "number_input", inputKey: "social_security_tips" },
          },
        },
        {
          index: "8",
          instructions: "Allocated tips",
          box: {
            identifier: "8",
            value: { type: "number_input", inputKey: "allocated_tips" },
          },
        },
        { index: "9", box: { identifier: "9", value: { type: "unused" } } },
        {
          index: "10",
          instructions: "Dependent care benefits",
          box: {
            identifier: "10",
            value: {
              type: "number_input",
              inputKey: "dependent_care_benefits",
            },
          },
        },
        {
          index: "11",
          instructions: "Nonqualified plans",
          box: {
            identifier: "11",
            value: { type: "number_input", inputKey: "nonqualified_plans" },
          },
        },
        {
          index: "12a–d",
          instructions: "Codes",
          commentary: [
            "Use ",
            {
              $$mdtype: "Tag",
              name: "FormLink",
              attributes: { formClass: "fW2_12_codes" },
              children: ["Form W-2: codes for box 12"],
            },
            "to enter the information from these boxes",
          ],
          box: { identifier: "12", value: { type: "unused" } },
        },
        { index: "13", box: { identifier: "13", value: { type: "unused" } } },
        {
          index: "14a",
          instructions: "Other",
          commentary:
            "Mostly for the employer to voluntarily provide additional information to you",
          box: {
            identifier: "14a",
            value: { type: "number_input", inputKey: "other_amount" },
          },
        },
        {
          index: "14b",
          instructions: "Treasury Tipped Occupation Code(s)",
          box: { identifier: "14b", value: { type: "unused" } },
        },
        {
          index: "15",
          instructions: "State",
          box: { identifier: "15", value: { type: "unused" } },
        },
        {
          index: "16",
          instructions: "State wages, tips, etc.",
          box: {
            identifier: "16",
            value: {
              type: "number_input",
              inputKey: "state_wages_tips_other_compensation",
            },
          },
        },
        {
          index: "17",
          instructions: "State income tax",
          box: {
            identifier: "17",
            value: { type: "number_input", inputKey: "state_income_tax" },
          },
        },
        {
          index: "18",
          instructions: "Local wages, tips, etc.",
          box: {
            identifier: "18",
            value: {
              type: "number_input",
              inputKey: "local_wages_tips_other_compensation",
            },
          },
        },
        {
          index: "19",
          instructions: "Local income tax",
          box: {
            identifier: "19",
            value: { type: "number_input", inputKey: "local_income_tax" },
          },
        },
        {
          index: "20",
          instructions: "Locality name",
          box: { identifier: "20", value: { type: "unused" } },
        },
      ],
    },
  ],
});
