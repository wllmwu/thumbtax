import type { FormSpecification } from "@thumbtax/forms";

export const Form1099INT: FormSpecification = {
  class: "f1099INT",
  title: "Form 1099-INT",
  subtitle: "Interest Income",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-1099-int",
  category: "income",
  maxInstances: null,
  sections: [
    {
      lines: [
        {
          index: "1",
          description: "Interest income",
          box: {
            identifier: "1",
            value: { type: "number_input" },
          },
        },
        {
          index: "2",
          description: "Early withdrawal penalty",
          box: {
            identifier: "2",
            value: { type: "number_input" },
          },
        },
        {
          index: "3",
          description:
            "Interest on U.S. Savings Bonds and Treasury obligations",
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
          description: "Investment expenses",
          box: {
            identifier: "5",
            value: { type: "number_input" },
          },
        },
        {
          index: "6",
          description: "Foreign tax paid",
          box: {
            identifier: "6",
            value: { type: "number_input" },
          },
        },
        {
          index: "7",
          description: "Foreign country or U.S. territory",
          box: {
            identifier: "7",
            value: { type: "unused" },
          },
        },
        {
          index: "8",
          description: "Tax-exempt interest",
          box: {
            identifier: "8",
            value: { type: "number_input" },
          },
        },
        {
          index: "9",
          description: "Specified private activity bond interest",
          box: {
            identifier: "9",
            value: { type: "number_input" },
          },
        },
        {
          index: "10",
          description: "Market discount",
          box: {
            identifier: "10",
            value: { type: "number_input" },
          },
        },
        {
          index: "11",
          description: "Bond premium",
          box: {
            identifier: "11",
            value: { type: "number_input" },
          },
        },
        {
          index: "12",
          description: "Bond premium on Treasury obligations",
          box: {
            identifier: "12",
            value: { type: "number_input" },
          },
        },
        {
          index: "13",
          description: "Bond premium on tax-exempt bond",
          box: {
            identifier: "13",
            value: { type: "number_input" },
          },
        },
        {
          index: "14",
          description: "Tax-exempt and tax credit bond CUSIP number",
          box: {
            identifier: "14",
            value: { type: "unused" },
          },
        },
        {
          index: "15",
          description: "State",
          box: {
            identifier: "15",
            value: { type: "unused" },
          },
        },
        {
          index: "16",
          description: "State identification number",
          box: {
            identifier: "16",
            value: { type: "unused" },
          },
        },
        {
          index: "17",
          description: "State tax withheld",
          box: {
            identifier: "17",
            value: { type: "number_input" },
          },
        },
      ],
    },
  ],
};
