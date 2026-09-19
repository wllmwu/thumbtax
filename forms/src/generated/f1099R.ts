import { defineFormSpecification } from "../types/defineFormSpecification";

export const f1099R = defineFormSpecification({
  class: "f1099R",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-1099-r",
  category: "income",
  maxInstances: null,
  title: "Form 1099-R",
  subtitle:
    "Distributions From Pensions, Annuities, Retirement or Profit-Sharing Plans, IRAs, Insurance Contracts, etc.",
  sections: [
    {
      lines: [
        {
          index: "1",
          instructions: "Gross distribution",
          box: {
            identifier: "1",
            value: { type: "number_input", inputKey: "gross_distribution" },
          },
        },
        {
          index: "2a",
          instructions: "Taxable amount",
          box: {
            identifier: "2a",
            value: { type: "number_input", inputKey: "taxable_amount" },
          },
        },
        {
          index: "2b",
          instructions: "Taxable amount not determined / Total distribution",
          box: { identifier: "2b", value: { type: "unused" } },
        },
        {
          index: "3",
          instructions: "Capital gain (included in box 2a)",
          box: {
            identifier: "3",
            value: { type: "number_input", inputKey: "capital_gain" },
          },
        },
        {
          index: "4",
          instructions: "Federal income tax withheld",
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
          instructions:
            "Employee contributions/Designated Roth contributions or insurance premiums",
          box: {
            identifier: "5",
            value: {
              type: "number_input",
              inputKey: "employee_contributions_insurance_premiums",
            },
          },
        },
        {
          index: "6",
          instructions: "Net unrealized appreciation in employer's securities",
          box: {
            identifier: "6",
            value: {
              type: "number_input",
              inputKey: "net_unrealized_appreciation",
            },
          },
        },
        {
          index: "7",
          instructions: "Distribution code(s)",
          box: { identifier: "7", value: { type: "unused" } },
        },
        {
          index: "8",
          instructions: "Other",
          box: { identifier: "8", value: { type: "unsupported" } },
        },
        {
          index: "9a",
          instructions: "Your percentage of total distribution",
          box: {
            identifier: "9a",
            value: {
              type: "number_input",
              inputKey: "percentage_total_distribution",
            },
            format: "percentage",
          },
        },
        {
          index: "9b",
          instructions: "Total employee contributions",
          box: {
            identifier: "9b",
            value: {
              type: "number_input",
              inputKey: "total_employee_contributions",
            },
          },
        },
        {
          index: "10",
          instructions: "Amount allocable to IRR within 5 years",
          box: {
            identifier: "10",
            value: {
              type: "number_input",
              inputKey: "amount_allocable_to_irr_within_5_years",
            },
          },
        },
        {
          index: "11",
          instructions: "1st year of designated Roth contributions",
          box: { identifier: "11", value: { type: "unused" } },
        },
        {
          index: "12",
          instructions: "FATCA filing requirement",
          box: { identifier: "12", value: { type: "unused" } },
        },
        {
          index: "13",
          instructions: "Date of payment",
          box: { identifier: "13", value: { type: "unused" } },
        },
        {
          index: "14",
          instructions: "State tax withheld",
          box: {
            identifier: "14",
            value: { type: "number_input", inputKey: "state_tax_withheld" },
          },
        },
        {
          index: "15",
          instructions: "State/Payer's state number",
          box: { identifier: "15", value: { type: "unused" } },
        },
        {
          index: "16",
          instructions: "State distribution",
          box: {
            identifier: "16",
            value: { type: "number_input", inputKey: "state_distribution" },
          },
        },
        {
          index: "17",
          instructions: "Local tax withheld",
          box: {
            identifier: "17",
            value: { type: "number_input", inputKey: "local_tax_withheld" },
          },
        },
        {
          index: "18",
          instructions: "Name of locality",
          box: { identifier: "18", value: { type: "unused" } },
        },
        {
          index: "19",
          instructions: "Local distribution",
          box: {
            identifier: "19",
            value: { type: "number_input", inputKey: "local_distribution" },
          },
        },
      ],
    },
  ],
});
