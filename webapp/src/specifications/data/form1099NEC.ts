import type { FormSpecification } from "@thumbtax/forms";

export const Form1099NEC: FormSpecification = {
  class: "f1099NEC",
  title: "Form 1099-NEC",
  subtitle: "Nonemployee Compensation",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-1099-nec",
  category: "income",
  maxInstances: null,
  sections: [
    {
      lines: [
        {
          index: "1",
          instructions: "Nonemployee compensation",
          box: { identifier: "1", value: { type: "number_input" } },
        },
        {
          index: "2",
          instructions:
            "Payer made direct sales totaling $5,000 or more of consumer products to recipient for resale",
          box: { identifier: "2", value: { type: "unused" } },
        },
        {
          index: "3",
          instructions: "Excess golden parachute payments",
          box: { identifier: "3", value: { type: "number_input" } },
        },
        {
          index: "4",
          instructions: "Federal income tax withheld",
          box: { identifier: "4", value: { type: "number_input" } },
        },
        {
          index: "5",
          instructions: "State tax withheld",
          box: { identifier: "5", value: { type: "number_input" } },
        },
        {
          index: "6",
          instructions: "State/Payer's state number",
          box: { identifier: "6", value: { type: "unused" } },
        },
        {
          index: "7",
          instructions: "State income",
          box: { identifier: "7", value: { type: "number_input" } },
        },
      ],
    },
  ],
};
