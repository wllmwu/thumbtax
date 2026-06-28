import type { FormSpecification } from "@thumbtax/forms";

export const Form1099DIV: FormSpecification = {
  class: "f1099DIV",
  title: "Form 1099-DIV",
  subtitle: "Dividends and Distributions",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-1099-div",
  category: "income",
  maxInstances: null,
  sections: [
    {
      lines: [
        {
          index: "1a",
          description: "Total ordinary dividends",
          box: {
            identifier: "1a",
            value: { type: "number_input" },
          },
        },
        {
          index: "1b",
          description: "Qualified dividends",
          box: {
            identifier: "1b",
            value: { type: "number_input" },
          },
        },
        {
          index: "2a",
          description: "Total capital gain distributions",
          box: {
            identifier: "2a",
            value: { type: "number_input" },
          },
        },
        {
          index: "2b",
          description: "Unrecaptured Section 1250 gain",
          box: {
            identifier: "2b",
            value: { type: "number_input" },
          },
        },
        {
          index: "2c",
          description: "Section 1202 gain",
          box: {
            identifier: "2c",
            value: { type: "number_input" },
          },
        },
        {
          index: "2d",
          description: "Collectibles (28%) gain",
          box: {
            identifier: "2d",
            value: { type: "number_input" },
          },
        },
        {
          index: "2e",
          description: "Section 897 ordinary dividends",
          box: {
            identifier: "2e",
            value: { type: "number_input" },
          },
        },
        {
          index: "2f",
          description: "Section 897 capital gain",
          box: {
            identifier: "2f",
            value: { type: "number_input" },
          },
        },
        {
          index: "3",
          description: "Nondividend distributions",
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
          description: "Section 199A dividends",
          box: {
            identifier: "5",
            value: { type: "number_input" },
          },
        },
        {
          index: "6",
          description: "Investment expenses",
          box: {
            identifier: "6",
            value: { type: "number_input" },
          },
        },
        {
          index: "7",
          description: "Foreign tax paid",
          box: {
            identifier: "7",
            value: { type: "number_input" },
          },
        },
        {
          index: "8",
          description: "Foreign country or U.S. possession",
          box: {
            identifier: "8",
            value: { type: "unused" },
          },
        },
        {
          index: "9",
          description: "Cash liquidation distributions",
          box: {
            identifier: "9",
            value: { type: "number_input" },
          },
        },
        {
          index: "10",
          description: "Noncash liquidation distributions",
          box: {
            identifier: "10",
            value: { type: "number_input" },
          },
        },
        {
          index: "11",
          description: "FATCA filing requirement",
          box: {
            identifier: "11",
            value: { type: "unused" },
          },
        },
        {
          index: "12",
          description: "Exempt-interest dividends",
          box: {
            identifier: "12",
            value: { type: "number_input" },
          },
        },
        {
          index: "13",
          description: "Specified private activity bond interest dividends",
          box: {
            identifier: "13",
            value: { type: "number_input" },
          },
        },
        {
          index: "14",
          description: "State",
          box: {
            identifier: "14",
            value: { type: "unused" },
          },
        },
        {
          index: "15",
          description: "State identification number",
          box: {
            identifier: "15",
            value: { type: "unused" },
          },
        },
        {
          index: "16",
          description: "State tax withheld",
          box: {
            identifier: "16",
            value: { type: "number_input" },
          },
        },
      ],
    },
  ],
};
