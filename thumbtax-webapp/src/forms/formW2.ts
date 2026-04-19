import type { TaxFormSpecification } from "#src/types/taxFormSpecification";

export const FormW2: TaxFormSpecification = {
  class: "fW2",
  title: "Form W-2",
  subtitle: "Wage and Tax Statement",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-w-2",
  cardinality: "multiple",
  sections: [
    {
      lines: [
        {
          index: "1",
          description: "Wages, tips, other compensation",
          boxes: [
            {
              identifier: "1",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "2",
          description: "Federal income tax withheld",
          boxes: [
            {
              identifier: "2",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "3",
          description: "Social security wages",
          boxes: [
            {
              identifier: "3",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "4",
          description: "Social security tax withheld",
          boxes: [
            {
              identifier: "4",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "5",
          description: "Medicare wages and tips",
          boxes: [
            {
              identifier: "5",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "6",
          description: "Medicare tax withheld",
          boxes: [
            {
              identifier: "6",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "7",
          description: "Social security tips",
          boxes: [
            {
              identifier: "7",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "8",
          description: "Allocated tips",
          boxes: [
            {
              identifier: "8",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "9",
          boxes: [
            {
              identifier: "9",
              value: { type: "unused" },
            },
          ],
        },
        {
          index: "10",
          description: "Dependent care benefits",
          boxes: [
            {
              identifier: "10",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "11",
          description: "Nonqualified plans",
          boxes: [
            {
              identifier: "11",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "12a",
          boxes: [
            {
              identifier: "12a",
              value: { type: "unsupported" },
            },
          ],
        },
        {
          index: "12b",
          boxes: [
            {
              identifier: "12b",
              value: { type: "unsupported" },
            },
          ],
        },
        {
          index: "12c",
          boxes: [
            {
              identifier: "12c",
              value: { type: "unsupported" },
            },
          ],
        },
        {
          index: "12d",
          boxes: [
            {
              identifier: "12d",
              value: { type: "unsupported" },
            },
          ],
        },
        {
          index: "13",
          boxes: [
            {
              identifier: "13",
              value: { type: "unused" },
            },
          ],
        },
        {
          index: "14a",
          description: "Other",
          boxes: [
            {
              identifier: "14a",
              value: { type: "unused" },
            },
          ],
        },
        {
          index: "14b",
          description: "Treasury Tipped Occupation Code(s)",
          boxes: [
            {
              identifier: "14b",
              value: { type: "unused" },
            },
          ],
        },
        {
          index: "15",
          description: "State",
          boxes: [
            {
              identifier: "15",
              value: { type: "unused" },
            },
          ],
        },
        {
          index: "16",
          description: "State wages, tips, etc.",
          boxes: [
            {
              identifier: "16",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "17",
          description: "State income tax",
          boxes: [
            {
              identifier: "17",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "18",
          description: "Local wages, tips, etc.",
          boxes: [
            {
              identifier: "18",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "19",
          description: "Local income tax",
          boxes: [
            {
              identifier: "19",
              value: { type: "number_input" },
            },
          ],
        },
        {
          index: "20",
          description: "Locality name",
          boxes: [
            {
              identifier: "20",
              value: { type: "unused" },
            },
          ],
        },
      ],
    },
  ],
};
