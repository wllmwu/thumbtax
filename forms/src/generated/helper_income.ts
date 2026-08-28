import type { FormSpecification } from "../types/formSpecification";

export const helper_income: FormSpecification = {
  class: "helper_income",
  irsPageUrl: "",
  category: "income",
  maxInstances: null,
  title: "My income",
  subtitle: "Helper form: My income",
  instructions: {
    $$mdtype: "Tag",
    name: "p",
    attributes: {},
    children: [
      'Thumbtax uses this "helper" form to model a part of your income.',
      " ",
      "This isn't a real tax form.",
      " ",
      "You can modify these values directly or use the wizard again to replace them.",
    ],
  },
  sections: [
    {
      lines: [
        {
          index: "1",
          instructions: "Amount",
          box: { identifier: "1", value: { type: "number_input" } },
        },
        {
          index: "2",
          instructions: "Interval",
          box: {
            identifier: "2",
            value: {
              type: "select_value_input",
              options: [
                {
                  key: "year",
                  label: "One time or whole year",
                  value: { type: "number_constant", value: 1 },
                },
                {
                  key: "hour",
                  label: "Per hour",
                  value: { type: "unsupported" },
                },
                {
                  key: "week",
                  label: "Per week",
                  value: { type: "unsupported" },
                },
                {
                  key: "two_weeks",
                  label: "Per 2 weeks",
                  value: { type: "unsupported" },
                },
                {
                  key: "month",
                  label: "Per month",
                  value: { type: "number_constant", value: 12 },
                },
              ],
            },
          },
        },
        {
          index: "3",
          instructions: "Annual multiplier",
          box: { identifier: "3", value: { type: "box_reference", box: "2" } },
        },
        {
          index: "4",
          instructions: "Annual amount",
          box: {
            identifier: "4",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "1" },
                { type: "box_reference", box: "3" },
              ],
            },
          },
        },
        {
          index: "5",
          instructions: "Start date",
          box: { identifier: "5", value: { type: "unsupported" } },
        },
        {
          index: "6",
          instructions: "End date",
          box: { identifier: "6", value: { type: "unsupported" } },
        },
        {
          index: "7",
          instructions: "Proration basis",
          box: {
            identifier: "7",
            value: {
              type: "select_value_input",
              options: [
                {
                  key: "business_days",
                  label: "Business days",
                  value: { type: "unsupported" },
                },
                {
                  key: "calendar_days",
                  label: "Calendar days",
                  value: { type: "unsupported" },
                },
              ],
            },
          },
        },
        {
          index: "8",
          instructions: "Proration factor",
          box: { identifier: "8", value: { type: "box_reference", box: "7" } },
        },
        {
          index: "9",
          instructions: "Gross amount",
          box: {
            identifier: "9",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "4" },
                { type: "box_reference", box: "8" },
              ],
            },
          },
        },
      ],
    },
  ],
};
