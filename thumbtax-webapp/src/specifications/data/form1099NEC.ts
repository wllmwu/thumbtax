import type { FormSpecification } from "#src/specifications/types/formSpecification";

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
          description: "Nonemployee compensation",
          box: {
            identifier: "1",
            value: { type: "number_input" },
          },
        },
        {
          index: "2",
          description:
            "Payer made direct sales totaling $5,000 or more of consumer products to recipient for resale",
          box: {
            identifier: "2",
            value: { type: "unused" },
          },
        },
        {
          index: "3",
          description: "Excess golden parachute payments",
          box: {
            identifier: "3",
            value: { type: "number_input" },
          },
        },
        {
          index: "4",
          description: "Federal income tax withheld",
          box: {
            identifier: "4",
            value: { type: "number_input" },
          },
        },
        {
          index: "5",
          description: "State tax withheld",
          box: {
            identifier: "5",
            value: { type: "number_input" },
          },
        },
        {
          index: "6",
          description: "State/Payer's state number",
          box: {
            identifier: "6",
            value: { type: "unused" },
          },
        },
        {
          index: "7",
          description: "State income",
          box: {
            identifier: "7",
            value: { type: "number_input" },
          },
        },
      ],
    },
  ],
};
