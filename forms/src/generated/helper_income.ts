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
          index: "virtual_year_start",
          virtual: true,
          box: {
            identifier: "virtual_year_start",
            value: { type: "number_constant", value: 20454 },
          },
        },
        {
          index: "virtual_year_end",
          virtual: true,
          box: {
            identifier: "virtual_year_end",
            value: { type: "number_constant", value: 20819 },
          },
        },
        {
          index: "1",
          instructions: "Amount",
          box: { identifier: "1", value: { type: "number_input" } },
        },
        {
          index: "2a",
          instructions: "Hours per week",
          box: { identifier: "2a", value: { type: "number_input" } },
        },
        {
          index: "2b",
          instructions: "Interval",
          box: {
            identifier: "2b",
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
                  value: {
                    type: "product",
                    values: [
                      { type: "box_reference", box: "2a" },
                      { type: "number_constant", value: 52 },
                    ],
                  },
                },
                {
                  key: "week",
                  label: "Per week",
                  value: { type: "number_constant", value: 52 },
                },
                {
                  key: "two_weeks",
                  label: "Per 2 weeks",
                  value: { type: "number_constant", value: 26 },
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
          index: "2c",
          instructions: "Annual multiplier",
          box: {
            identifier: "2c",
            value: { type: "box_reference", box: "2b" },
          },
        },
        {
          index: "2d",
          instructions: "Annual amount",
          box: {
            identifier: "2d",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "1" },
                { type: "box_reference", box: "2c" },
              ],
            },
          },
        },
        {
          index: "3a",
          instructions: "Start date",
          box: { identifier: "3a", value: { type: "date_input" } },
        },
        {
          index: "3b",
          instructions: "End date",
          box: { identifier: "3b", value: { type: "date_input" } },
        },
        {
          index: "3c",
          instructions: "Proration basis",
          box: {
            identifier: "3c",
            value: {
              type: "select_value_input",
              options: [
                {
                  key: "calendar_days",
                  label: "Calendar days",
                  value: {
                    type: "quotient",
                    dividend: {
                      type: "date_range_length",
                      unit: "day",
                      rangeStart: { type: "box_reference", box: "3a" },
                      rangeEnd: { type: "box_reference", box: "3b" },
                    },
                    divisor: {
                      type: "date_range_length",
                      unit: "day",
                      rangeStart: {
                        type: "box_reference",
                        box: "virtual_year_start",
                      },
                      rangeEnd: {
                        type: "box_reference",
                        box: "virtual_year_start",
                      },
                    },
                  },
                },
                {
                  key: "weekdays",
                  label: "Weekdays",
                  value: {
                    type: "quotient",
                    dividend: {
                      type: "date_range_length",
                      unit: "weekday",
                      rangeStart: { type: "box_reference", box: "3a" },
                      rangeEnd: { type: "box_reference", box: "3b" },
                    },
                    divisor: {
                      type: "date_range_length",
                      unit: "weekday",
                      rangeStart: {
                        type: "box_reference",
                        box: "virtual_year_start",
                      },
                      rangeEnd: {
                        type: "box_reference",
                        box: "virtual_year_start",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          index: "3d",
          instructions: "Proration factor",
          box: {
            identifier: "3d",
            value: { type: "box_reference", box: "3c" },
          },
        },
        {
          index: "4",
          instructions: "Gross amount",
          box: {
            identifier: "4",
            value: {
              type: "product",
              values: [
                { type: "box_reference", box: "2d" },
                { type: "box_reference", box: "3d" },
              ],
            },
          },
        },
      ],
    },
  ],
};
