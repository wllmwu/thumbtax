import type { FormSpecification } from "@thumbtax/forms";

export const Form1099R: FormSpecification = {
  class: "f1099R",
  title: "Form 1099-R",
  subtitle:
    "Distributions From Pensions, Annuities, Retirement or Profit-Sharing Plans, IRAs, Insurance Contracts, etc.",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-1099-r",
  category: "income",
  maxInstances: null,
  sections: [
    {
      lines: [
        {
          index: "1",
          description: "Gross distribution",
          box: {
            identifier: "1",
            value: { type: "number_input" },
          },
        },
        {
          index: "2a",
          description: "Taxable amount",
          box: {
            identifier: "2a",
            value: { type: "number_input" },
          },
        },
        {
          index: "2b",
          description: "Taxable amount not determined / Total distribution",
          box: {
            identifier: "2b",
            value: { type: "unused" },
          },
        },
        {
          index: "3",
          description: "Capital gain (included in box 2a)",
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
          description:
            "Employee contributions/Designated Roth contributions or insurance premiums",
          box: {
            identifier: "5",
            value: { type: "number_input" },
          },
        },
        {
          index: "6",
          description: "Net unrealized appreciation in employer's securities",
          box: {
            identifier: "6",
            value: { type: "number_input" },
          },
        },
        {
          index: "7",
          description: "Distribution code(s)",
          box: {
            identifier: "7",
            value: { type: "unused" },
          },
        },
        {
          index: "8",
          description: "Other",
          box: {
            identifier: "8",
            value: { type: "unsupported" },
          },
        },
        {
          index: "9a",
          description: "Your percentage of total distribution",
          box: {
            identifier: "9a",
            value: { type: "number_input" },
            format: "percentage",
          },
        },
        {
          index: "9b",
          description: "Total employee contributions",
          box: {
            identifier: "9b",
            value: { type: "number_input" },
          },
        },
        {
          index: "10",
          description: "Amount allocable to IRR within 5 years",
          box: {
            identifier: "10",
            value: { type: "number_input" },
          },
        },
        {
          index: "11",
          description: "1st year of designated Roth contributions",
          box: {
            identifier: "11",
            value: { type: "unused" },
          },
        },
        {
          index: "12",
          description: "FATCA filing requirement",
          box: {
            identifier: "12",
            value: { type: "unused" },
          },
        },
        {
          index: "13",
          description: "Date of payment",
          box: {
            identifier: "13",
            value: { type: "unused" },
          },
        },
        {
          index: "14",
          description: "State tax withheld",
          box: {
            identifier: "14",
            value: { type: "number_input" },
          },
        },
        {
          index: "15",
          description: "State/Payer's state number",
          box: {
            identifier: "15",
            value: { type: "unused" },
          },
        },
        {
          index: "16",
          description: "State distribution",
          box: {
            identifier: "16",
            value: { type: "number_input" },
          },
        },
        {
          index: "17",
          description: "Local tax withheld",
          box: {
            identifier: "17",
            value: { type: "number_input" },
          },
        },
        {
          index: "18",
          description: "Name of locality",
          box: {
            identifier: "18",
            value: { type: "unused" },
          },
        },
        {
          index: "19",
          description: "Local distribution",
          box: {
            identifier: "19",
            value: { type: "number_input" },
          },
        },
      ],
    },
  ],
};
