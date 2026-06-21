import type { FormSpecification } from "#src/specifications/types/formSpecification";

export const Form1099B: FormSpecification = {
  class: "f1099B",
  title: "Form 1099-B",
  subtitle: "Proceeds from Broker and Barter Exchange Transactions",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-1099-b",
  category: "income",
  maxInstances: null,
  sections: [
    {
      lines: [
        {
          index: "1a",
          description: "Description of property",
          box: {
            identifier: "1a",
            value: { type: "unused" },
          },
        },
        {
          index: "1b",
          description: "Date acquired",
          box: {
            identifier: "1b",
            value: { type: "unused" },
          },
        },
        {
          index: "1c",
          description: "Date sold or disposed",
          box: {
            identifier: "1c",
            value: { type: "unused" },
          },
        },
        {
          index: "1d",
          description: "Proceeds",
          box: {
            identifier: "1d",
            value: { type: "number_input" },
          },
        },
        {
          index: "1e",
          description: "Cost or other basis",
          box: {
            identifier: "1e",
            value: { type: "number_input" },
          },
        },
        {
          index: "1f",
          description: "Accrued market discount",
          box: {
            identifier: "1f",
            value: { type: "number_input" },
          },
        },
        {
          index: "1g",
          description: "Wash sale loss disallowed",
          box: {
            identifier: "1g",
            value: { type: "number_input" },
          },
        },
        {
          index: "2",
          description: "Type of gain or loss",
          box: {
            identifier: "2",
            value: { type: "unused" },
          },
        },
        {
          index: "3",
          description: "Check if proceeds are from collectibles or from a QOF",
          box: {
            identifier: "3",
            value: { type: "unused" },
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
          index: "6",
          description: "Reported to IRS",
          box: {
            identifier: "6",
            value: { type: "unused" },
          },
        },
        {
          index: "7",
          description: "Check if loss not allowed based on amount in box 1d",
          box: {
            identifier: "7",
            value: { type: "unused" },
          },
        },
      ],
    },
  ],
};
