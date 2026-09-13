import type { FormSpecification } from "../types/formSpecification";

export const helper_withholding_federal_backup: FormSpecification = {
  class: "helper_withholding_federal_backup",
  irsPageUrl: "",
  category: "income",
  maxInstances: null,
  title: "My federal income backup withholding",
  subtitle: "Helper form: Federal income tax backup withholding",
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
              computedValue: { type: "box_reference", box: "1" },
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
              computedValue: { type: "number_constant", value: 0.24 },
            },
            format: "percentage",
          },
        },
        {
          index: "4",
          instructions: "Federal income tax withheld",
          box: {
            identifier: "4",
            value: {
              type: "override_number_input",
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
};
