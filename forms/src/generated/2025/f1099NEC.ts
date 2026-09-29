import { defineFormSpecification } from "../../types/defineFormSpecification";

export const f1099NEC = defineFormSpecification({
  class: "f1099NEC",
  govAboutUrl: "https://www.irs.gov/forms-pubs/about-form-1099-nec",
  category: "income",
  maxInstances: null,
  title: "Form 1099-NEC",
  subtitle: "Nonemployee Compensation",
  commentary: {
    $$mdtype: "Tag",
    name: "p",
    attributes: {},
    children: [
      "If you receive payments during the year from a business that you're not considered an employee of, the business files this form with the IRS and sends a copy to you.",
      " ",
      "To require this form, the payments must either exceed a certain amount or be subject to ",
      {
        $$mdtype: "Tag",
        name: "GlossaryLink",
        attributes: { term: "backup-withholding" },
        children: ["backup withholding"],
      },
      ".",
    ],
  },
  sections: [
    {
      lines: [
        {
          index: "1",
          instructions: "Nonemployee compensation",
          box: {
            identifier: "1",
            value: {
              type: "number_input",
              inputKey: "nonemployee_compensation",
            },
          },
        },
        {
          index: "2",
          instructions:
            "Payer made direct sales totaling $5,000 or more of consumer products to recipient for resale",
          box: { identifier: "2", value: { type: "unused" } },
        },
        {
          index: "3",
          instructions: [
            "Excess ",
            {
              $$mdtype: "Tag",
              name: "GlossaryLink",
              attributes: { term: "golden-parachute" },
              children: ["golden parachute"],
            },
            " payments",
          ],
          box: {
            identifier: "3",
            value: {
              type: "number_input",
              inputKey: "excess_golden_parachute_payments",
            },
          },
        },
        {
          index: "4",
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
          commentary: {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "backup-withholding" },
            children: ["Backup withholding"],
          },
          box: {
            identifier: "4",
            value: {
              type: "number_input",
              inputKey: "federal_income_tax_withheld",
            },
          },
        },
        {
          index: "5",
          instructions: "State tax withheld",
          box: {
            identifier: "5",
            value: { type: "number_input", inputKey: "state_tax_withheld" },
          },
        },
        {
          index: "6",
          instructions: "State/Payer's state number",
          box: { identifier: "6", value: { type: "unused" } },
        },
        {
          index: "7",
          instructions: "State income",
          box: {
            identifier: "7",
            value: { type: "number_input", inputKey: "state_income" },
          },
        },
      ],
    },
  ],
});
