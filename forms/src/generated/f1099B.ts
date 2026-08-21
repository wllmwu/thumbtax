import type { FormSpecification } from "../types/formSpecification";

export const f1099B: FormSpecification = {
  class: "f1099B",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-1099-b",
  category: "income",
  maxInstances: null,
  title: "Form 1099-B",
  subtitle: "Proceeds from Broker and Barter Exchange Transactions",
  commentary: {
    $$mdtype: "Tag",
    name: "p",
    attributes: {},
    children: [
      "If you sell stocks during the year, the brokerage files this form with the IRS and sends a copy to you.",
      " ",
      "Generally, they report each transaction on a separate Form 1099-B.",
    ],
  },
  sections: [
    {
      lines: [
        {
          index: "1a",
          instructions: "Description of property",
          box: { identifier: "1a", value: { type: "unused" } },
        },
        {
          index: "1b",
          instructions: "Date acquired",
          box: { identifier: "1b", value: { type: "unused" } },
        },
        {
          index: "1c",
          instructions: "Date sold or disposed",
          box: { identifier: "1c", value: { type: "unused" } },
        },
        {
          index: "1d",
          instructions: "Proceeds",
          commentary: "Usually the sale price",
          box: { identifier: "1d", value: { type: "number_input" } },
        },
        {
          index: "1e",
          instructions: "Cost or other basis",
          commentary: "Usually the purchase price",
          box: { identifier: "1e", value: { type: "number_input" } },
        },
        {
          index: "1f",
          instructions: "Accrued market discount",
          box: { identifier: "1f", value: { type: "number_input" } },
        },
        {
          index: "1g",
          instructions: [
            {
              $$mdtype: "Tag",
              name: "GlossaryLink",
              attributes: { term: "wash-sale" },
              children: ["Wash sale"],
            },
            " loss disallowed",
          ],
          box: { identifier: "1g", value: { type: "number_input" } },
        },
        {
          index: "2",
          instructions: "Type of gain or loss",
          box: { identifier: "2", value: { type: "unused" } },
        },
        {
          index: "3",
          instructions: [
            "Check if proceeds are from ",
            {
              $$mdtype: "Tag",
              name: "GlossaryLink",
              attributes: { term: "collectibles" },
              children: ["collectibles"],
            },
            " or from a ",
            {
              $$mdtype: "Tag",
              name: "GlossaryLink",
              attributes: { term: "qualified-opportunity-fund" },
              children: ["QOF"],
            },
          ],
          box: { identifier: "3", value: { type: "unused" } },
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
              attributes: { term: "tax-withholding" },
              children: ["withheld"],
            },
          ],
          box: { identifier: "4", value: { type: "number_input" } },
        },
        {
          index: "6",
          instructions: "Reported to IRS",
          box: { identifier: "6", value: { type: "unused" } },
        },
        {
          index: "7",
          instructions: "Check if loss not allowed based on amount in box 1d",
          box: { identifier: "7", value: { type: "unused" } },
        },
      ],
    },
  ],
};
