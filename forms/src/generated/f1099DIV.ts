import type { FormSpecification } from "../types/formSpecification";

export const f1099DIV: FormSpecification = {
  class: "f1099DIV",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-1099-div",
  category: "income",
  maxInstances: null,
  title: "Form 1099-DIV",
  subtitle: "Dividends and Distributions",
  commentary: {
    $$mdtype: "Tag",
    name: "p",
    attributes: {},
    children: [
      "If you earn ",
      {
        $$mdtype: "Tag",
        name: "GlossaryLink",
        attributes: { term: "dividend" },
        children: ["dividends"],
      },
      " during the year, the bank or brokerage files this form with the IRS and sends a copy to you.",
    ],
  },
  sections: [
    {
      lines: [
        {
          index: "1a",
          instructions: [
            "Total ",
            {
              $$mdtype: "Tag",
              name: "GlossaryLink",
              attributes: { term: "ordinary-dividends" },
              children: ["ordinary dividends"],
            },
          ],
          box: { identifier: "1a", value: { type: "number_input" } },
        },
        {
          index: "1b",
          instructions: {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "qualified-dividends" },
            children: ["Qualified dividends"],
          },
          box: { identifier: "1b", value: { type: "number_input" } },
        },
        {
          index: "2a",
          instructions: [
            "Total ",
            {
              $$mdtype: "Tag",
              name: "GlossaryLink",
              attributes: { term: "capital-gain" },
              children: ["capital gain"],
            },
            " distributions",
          ],
          box: { identifier: "2a", value: { type: "number_input" } },
        },
        {
          index: "2b",
          instructions: [
            "Unrecaptured ",
            {
              $$mdtype: "Tag",
              name: "GlossaryLink",
              attributes: { term: "section-1250" },
              children: ["Section 1250"],
            },
            " gain",
          ],
          box: { identifier: "2b", value: { type: "number_input" } },
        },
        {
          index: "2c",
          instructions: [
            {
              $$mdtype: "Tag",
              name: "GlossaryLink",
              attributes: { term: "section-1202" },
              children: ["Section 1202"],
            },
            " gain",
          ],
          box: { identifier: "2c", value: { type: "number_input" } },
        },
        {
          index: "2d",
          instructions: [
            {
              $$mdtype: "Tag",
              name: "GlossaryLink",
              attributes: { term: "collectibles" },
              children: ["Collectibles"],
            },
            " (28%) gain",
          ],
          box: { identifier: "2d", value: { type: "number_input" } },
        },
        {
          index: "2e",
          instructions: [
            {
              $$mdtype: "Tag",
              name: "GlossaryLink",
              attributes: { term: "section-897" },
              children: ["Section 897"],
            },
            " ordinary dividends",
          ],
          box: { identifier: "2e", value: { type: "number_input" } },
        },
        {
          index: "2f",
          instructions: [
            {
              $$mdtype: "Tag",
              name: "GlossaryLink",
              attributes: { term: "section-897" },
              children: ["Section 897"],
            },
            " capital gain",
          ],
          box: { identifier: "2f", value: { type: "number_input" } },
        },
        {
          index: "3",
          instructions: "Nondividend distributions",
          box: { identifier: "3", value: { type: "number_input" } },
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
          index: "5",
          instructions: [
            {
              $$mdtype: "Tag",
              name: "GlossaryLink",
              attributes: { term: "section-199A" },
              children: ["Section 199A"],
            },
            " dividends",
          ],
          box: { identifier: "5", value: { type: "number_input" } },
        },
        {
          index: "6",
          instructions: "Investment expenses",
          box: { identifier: "6", value: { type: "number_input" } },
        },
        {
          index: "7",
          instructions: "Foreign tax paid",
          box: { identifier: "7", value: { type: "number_input" } },
        },
        {
          index: "8",
          instructions: "Foreign country or U.S. possession",
          box: { identifier: "8", value: { type: "unused" } },
        },
        {
          index: "9",
          instructions: "Cash liquidation distributions",
          box: { identifier: "9", value: { type: "number_input" } },
        },
        {
          index: "10",
          instructions: "Noncash liquidation distributions",
          box: { identifier: "10", value: { type: "number_input" } },
        },
        {
          index: "11",
          instructions: "FATCA filing requirement",
          box: { identifier: "11", value: { type: "unused" } },
        },
        {
          index: "12",
          instructions: "Exempt-interest dividends",
          box: { identifier: "12", value: { type: "number_input" } },
        },
        {
          index: "13",
          instructions: "Specified private activity bond interest dividends",
          box: { identifier: "13", value: { type: "number_input" } },
        },
        {
          index: "14",
          instructions: "State",
          box: { identifier: "14", value: { type: "unused" } },
        },
        {
          index: "15",
          instructions: "State identification number",
          box: { identifier: "15", value: { type: "unused" } },
        },
        {
          index: "16",
          instructions: "State tax withheld",
          box: { identifier: "16", value: { type: "number_input" } },
        },
      ],
    },
  ],
};
