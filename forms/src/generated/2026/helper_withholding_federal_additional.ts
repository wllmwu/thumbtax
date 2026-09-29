import { defineFormSpecification } from "../../types/defineFormSpecification";

export const helper_withholding_federal_additional = defineFormSpecification({
  class: "helper_withholding_federal_additional",
  category: "income",
  maxInstances: null,
  title: "My federal income withholding (additional)",
  subtitle: "Helper form: Federal income tax withholding (additional)",
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
          instructions: "Federal income tax additional withholding amount",
          box: {
            identifier: "1",
            value: { type: "number_input", inputKey: "withheld_amount" },
          },
        },
      ],
    },
  ],
});
