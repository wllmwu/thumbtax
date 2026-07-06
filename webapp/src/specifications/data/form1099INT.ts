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
          instructions: "Interest income",
          box: { identifier: "1", value: { type: "number_input" } },
        },
        {
          index: "2",
          instructions: "Early withdrawal penalty",
          box: { identifier: "2", value: { type: "number_input" } },
        },
        {
          index: "3",
          instructions:
            "Interest on U.S. Savings Bonds and Treasury obligations",
          box: { identifier: "3", value: { type: "number_input" } },
        },
        {
          index: "4",
          instructions: "Federal income tax withheld",
          box: { identifier: "4", value: { type: "number_input" } },
        },
        {
          index: "5",
          instructions: "Investment expenses",
          box: { identifier: "5", value: { type: "number_input" } },
        },
        {
          index: "6",
          instructions: "Foreign tax paid",
          box: { identifier: "6", value: { type: "number_input" } },
        },
        {
          index: "7",
          instructions: "Foreign country or U.S. territory",
          box: { identifier: "7", value: { type: "unused" } },
        },
        {
          index: "8",
          instructions: "Tax-exempt interest",
          box: { identifier: "8", value: { type: "number_input" } },
        },
        {
          index: "9",
          instructions: "Specified private activity bond interest",
          box: { identifier: "9", value: { type: "number_input" } },
        },
        {
          index: "10",
          instructions: "Market discount",
          box: { identifier: "10", value: { type: "number_input" } },
        },
        {
          index: "11",
          instructions: "Bond premium",
          box: { identifier: "11", value: { type: "number_input" } },
        },
        {
          index: "12",
          instructions: "Bond premium on Treasury obligations",
          box: { identifier: "12", value: { type: "number_input" } },
        },
        {
          index: "13",
          instructions: "Bond premium on tax-exempt bond",
          box: { identifier: "13", value: { type: "number_input" } },
        },
        {
          index: "14",
          instructions: "Tax-exempt and tax credit bond CUSIP number",
          box: { identifier: "14", value: { type: "unused" } },
        },
        {
          index: "15",
          instructions: "State",
          box: { identifier: "15", value: { type: "unused" } },
        },
        {
          index: "16",
          instructions: "State identification number",
          box: { identifier: "16", value: { type: "unused" } },
        },
        {
          index: "17",
          instructions: "State tax withheld",
          box: { identifier: "17", value: { type: "number_input" } },
        },
      ],
    },
  ],
};
