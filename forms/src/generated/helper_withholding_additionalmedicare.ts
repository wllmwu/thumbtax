import { defineFormSpecification } from "../types/defineFormSpecification";

export const helper_withholding_additionalmedicare = defineFormSpecification({
  class: "helper_withholding_additionalmedicare",
  irsPageUrl: "",
  category: "income",
  maxInstances: null,
  title: "My Additional Medicare withholding",
  subtitle: "Helper form: Additional Medicare tax withholding",
  instructions: {
    $$mdtype: "Tag",
    name: "p",
    attributes: {},
    children: [
      'Thumbtax uses this "helper" form to model a part of your income tax withholding.',
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
          instructions: "Gross amount",
          box: {
            identifier: "1",
            value: {
              type: "select_instance_boxes_input",
              inputKey: "gross_amount",
              options: [{ form: "helper_income", box: "4" }],
            },
          },
        },
        {
          index: "2",
          instructions: "Amount subject to withholding",
          box: {
            identifier: "2",
            value: {
              type: "override_number_input",
              inputKey: "subject_amount",
              computedValue: {
                type: "non_negative_clamp",
                value: {
                  type: "difference",
                  minuend: { type: "box_reference", box: "1" },
                  subtrahend: { type: "number_constant", value: 200000 },
                },
              },
            },
          },
        },
        {
          index: "3",
          instructions: "Withholding rate",
          box: {
            identifier: "3",
            value: {
              type: "override_number_input",
              inputKey: "withholding_rate",
              computedValue: { type: "number_constant", value: 0.009 },
            },
            format: "percentage",
          },
        },
        {
          index: "4",
          instructions: "Additional Medicare tax withheld",
          box: {
            identifier: "4",
            value: {
              type: "override_number_input",
              inputKey: "withheld_amount",
              computedValue: {
                type: "product",
                values: [
                  { type: "box_reference", box: "2" },
                  { type: "box_reference", box: "3" },
                ],
              },
            },
          },
        },
      ],
    },
  ],
});
