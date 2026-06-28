import type { FormSpecification } from "@thumbtax/forms";

export const FormW2: FormSpecification = {
  class: "fW2",
  title: "Form W-2",
  subtitle: "Wage and Tax Statement",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-w-2",
  category: "income",
  maxInstances: null,
  sections: [
    {
      lines: [
        {
          index: "1",
          description: "Wages, tips, other compensation",
          box: {
            identifier: "1",
            value: { type: "number_input" },
          },
        },
        {
          index: "2",
          description: "Federal income tax withheld",
          box: {
            identifier: "2",
            value: { type: "number_input" },
          },
        },
        {
          index: "3",
          description: "Social security wages",
          box: {
            identifier: "3",
            value: { type: "number_input" },
          },
        },
        {
          index: "4",
          description: "Social security tax withheld",
          box: {
            identifier: "4",
            value: { type: "number_input" },
          },
        },
        {
          index: "5",
          description: "Medicare wages and tips",
          box: {
            identifier: "5",
            value: { type: "number_input" },
          },
        },
        {
          index: "6",
          description: "Medicare tax withheld",
          box: {
            identifier: "6",
            value: { type: "number_input" },
          },
        },
        {
          index: "7",
          description: "Social security tips",
          box: {
            identifier: "7",
            value: { type: "number_input" },
          },
        },
        {
          index: "8",
          description: "Allocated tips",
          box: {
            identifier: "8",
            value: { type: "number_input" },
          },
        },
        {
          index: "9",
          box: {
            identifier: "9",
            value: { type: "unused" },
          },
        },
        {
          index: "10",
          description: "Dependent care benefits",
          box: {
            identifier: "10",
            value: { type: "number_input" },
          },
        },
        {
          index: "11",
          description: "Nonqualified plans",
          box: {
            identifier: "11",
            value: { type: "number_input" },
          },
        },
        {
          index: "12a\u2013d",
          description: "Codes",
          box: {
            identifier: "12",
            value: { type: "unused" },
          },
        },
        {
          index: "13",
          box: {
            identifier: "13",
            value: { type: "unused" },
          },
        },
        {
          index: "14a",
          description: "Other",
          box: {
            identifier: "14a",
            value: { type: "number_input" },
          },
        },
        {
          index: "14b",
          description: "Treasury Tipped Occupation Code(s)",
          box: {
            identifier: "14b",
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
          description: "State wages, tips, etc.",
          box: {
            identifier: "16",
            value: { type: "number_input" },
          },
        },
        {
          index: "17",
          description: "State income tax",
          box: {
            identifier: "17",
            value: { type: "number_input" },
          },
        },
        {
          index: "18",
          description: "Local wages, tips, etc.",
          box: {
            identifier: "18",
            value: { type: "number_input" },
          },
        },
        {
          index: "19",
          description: "Local income tax",
          box: {
            identifier: "19",
            value: { type: "number_input" },
          },
        },
        {
          index: "20",
          description: "Locality name",
          box: {
            identifier: "20",
            value: { type: "unused" },
          },
        },
      ],
    },
  ],
};
