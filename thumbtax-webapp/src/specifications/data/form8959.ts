import type { FormSpecification } from "#src/specifications/types/formSpecification";

export const Form8959: FormSpecification = {
  class: "f8959",
  title: "Form 8959",
  subtitle: "Additional Medicare Tax",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-8959",
  category: "taxes",
  maxInstances: 1,
  sections: [
    {
      heading: "Part I Additional Medicare Tax on Medicare Wages",
      lines: [
        {
          index: "1",
          description:
            "Medicare wages and tips from Form W-2, box 5. If you have more than one Form W-2, enter the total of the amounts from box 5",
          box: {
            identifier: "1",
            value: { type: "number_input" },
          },
        },
        {
          index: "2",
          description: "Unreported tips from Form 4137, line 6",
          box: {
            identifier: "2",
            value: { type: "number_input" },
          },
        },
        {
          index: "3",
          description: "Wages from Form 8919, line 6",
          box: {
            identifier: "3",
            value: { type: "number_input" },
          },
        },
        {
          index: "4",
          description: "Add lines 1 through 3",
          box: {
            identifier: "4",
            value: { type: "number_input" },
          },
        },
        {
          index: "5",
          description:
            "Enter the following amount for your filing status: Married filing jointly $250,000 / Married filing separately $125,000 / Single, Head of household, or Qualifying surviving spouse $200,000",
          box: {
            identifier: "5",
            value: { type: "number_input" },
          },
        },
        {
          index: "6",
          description:
            "Subtract line 5 from line 4. If zero or less, enter -0-",
          box: {
            identifier: "6",
            value: { type: "number_input" },
          },
        },
        {
          index: "7",
          description:
            "Additional Medicare Tax on Medicare wages. Multiply line 6 by 0.9% (0.009). Enter here and go to Part II",
          box: {
            identifier: "7",
            value: { type: "number_input" },
          },
        },
      ],
    },
    {
      heading: "Part II Additional Medicare Tax on Self-Employment Income",
      lines: [
        {
          index: "8",
          description:
            "Self-employment income from Schedule SE (Form 1040), Part I, line 6. If you had a loss, enter -0-",
          box: {
            identifier: "8",
            value: { type: "number_input" },
          },
        },
        {
          index: "9",
          description:
            "Enter the following amount for your filing status: Married filing jointly $250,000 / Married filing separately $125,000 / Single, Head of household, or Qualifying surviving spouse $200,000",
          box: {
            identifier: "9",
            value: { type: "number_input" },
          },
        },
        {
          index: "10",
          description: "Enter the amount from line 4",
          box: {
            identifier: "10",
            value: { type: "number_input" },
          },
        },
        {
          index: "11",
          description:
            "Subtract line 10 from line 9. If zero or less, enter -0-",
          box: {
            identifier: "11",
            value: { type: "number_input" },
          },
        },
        {
          index: "12",
          description:
            "Subtract line 11 from line 8. If zero or less, enter -0-",
          box: {
            identifier: "12",
            value: { type: "number_input" },
          },
        },
        {
          index: "13",
          description:
            "Additional Medicare Tax on self-employment income. Multiply line 12 by 0.9% (0.009). Enter here and go to Part III",
          box: {
            identifier: "13",
            value: { type: "number_input" },
          },
        },
      ],
    },
    {
      heading:
        "Part III Additional Medicare Tax on Railroad Retirement Tax Act (RRTA) Compensation",
      lines: [
        {
          index: "14",
          description:
            "Railroad retirement (RRTA) compensation and tips from Form(s) W-2, box 14 (see instructions)",
          box: {
            identifier: "14",
            value: { type: "number_input" },
          },
        },
        {
          index: "15",
          description:
            "Enter the following amount for your filing status: Married filing jointly $250,000 / Married filing separately $125,000 / Single, Head of household, or Qualifying surviving spouse $200,000",
          box: {
            identifier: "15",
            value: { type: "number_input" },
          },
        },
        {
          index: "16",
          description:
            "Subtract line 15 from line 14. If zero or less, enter -0-",
          box: {
            identifier: "16",
            value: { type: "number_input" },
          },
        },
        {
          index: "17",
          description:
            "Additional Medicare Tax on railroad retirement (RRTA) compensation. Multiply line 16 by 0.9% (0.009). Enter here and go to Part IV",
          box: {
            identifier: "17",
            value: { type: "number_input" },
          },
        },
      ],
    },
    {
      heading: "Part IV Total Additional Medicare Tax",
      lines: [
        {
          index: "18",
          description:
            "Add lines 7, 13, and 17. Also include this amount on Schedule 2 (Form 1040), line 11 (Form 1040-SS filers, see instructions), and go to Part V",
          box: {
            identifier: "18",
            value: { type: "number_input" },
          },
        },
      ],
    },
    {
      heading: "Part V Withholding Reconciliation",
      lines: [
        {
          index: "19",
          description:
            "Medicare tax withheld from Form W-2, box 6. If you have more than one Form W-2, enter the total of the amounts from box 6",
          box: {
            identifier: "19",
            value: { type: "number_input" },
          },
        },
        {
          index: "20",
          description: "Enter the amount from line 1",
          box: {
            identifier: "20",
            value: { type: "number_input" },
          },
        },
        {
          index: "21",
          description:
            "Multiply line 20 by 1.45% (0.0145). This is your regular Medicare tax withholding on Medicare wages",
          box: {
            identifier: "21",
            value: { type: "number_input" },
          },
        },
        {
          index: "22",
          description:
            "Subtract line 21 from line 19. If zero or less, enter -0-. This is your Additional Medicare Tax withholding on Medicare wages",
          box: {
            identifier: "22",
            value: { type: "number_input" },
          },
        },
        {
          index: "23",
          description:
            "Additional Medicare Tax withholding on railroad retirement (RRTA) compensation from Form W-2, box 14 (see instructions)",
          box: {
            identifier: "23",
            value: { type: "number_input" },
          },
        },
        {
          index: "24",
          description:
            "Total Additional Medicare Tax withholding. Add lines 22 and 23. Also include this amount with federal income tax withholding on Form 1040, 1040-SR, or 1040-NR, line 25c (Form 1040-SS filers, see instructions)",
          box: {
            identifier: "24",
            value: { type: "number_input" },
          },
        },
      ],
    },
  ],
};
