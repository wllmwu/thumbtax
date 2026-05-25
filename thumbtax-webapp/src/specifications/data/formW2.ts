import type { FormSpecification } from "#src/specifications/types/formSpecification";

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
          children: [
            {
              index: "A",
              description: "Uncollected social security or RRTA tax on tips",
              box: { identifier: "12_code_A", value: { type: "number_input" } },
            },
            {
              index: "B",
              description: "Uncollected Medicare tax on tips",
              box: { identifier: "12_code_B", value: { type: "number_input" } },
            },
            {
              index: "C",
              description:
                "Taxable cost of group-term life insurance over $50,000",
              box: { identifier: "12_code_C", value: { type: "number_input" } },
            },
            {
              index: "D",
              description:
                "Elective deferrals under a section 401(k) cash or deferred arrangement (plan)",
              box: { identifier: "12_code_D", value: { type: "number_input" } },
            },
            {
              index: "E",
              description:
                "Elective deferrals under a section 403(b) salary reduction agreement",
              box: { identifier: "12_code_E", value: { type: "number_input" } },
            },
            {
              index: "F",
              description:
                "Elective deferrals under a section 408(k)(6) salary reduction SEP",
              box: { identifier: "12_code_F", value: { type: "number_input" } },
            },
            {
              index: "G",
              description:
                "Elective deferrals and employer contributions (including nonelective deferrals) to any governmental or nongovernmental section 457(b) deferred compensation plan",
              box: { identifier: "12_code_G", value: { type: "number_input" } },
            },
            {
              index: "H",
              description:
                "Elective deferrals under section 501(c)(18)(D) tax-exempt organization plan",
              box: { identifier: "12_code_H", value: { type: "number_input" } },
            },
            {
              index: "J",
              description: "Nontaxable sick pay",
              box: { identifier: "12_code_J", value: { type: "number_input" } },
            },
            {
              index: "K",
              description: "20% excise tax on excess golden parachute payments",
              box: { identifier: "12_code_K", value: { type: "number_input" } },
            },
            {
              index: "L",
              description:
                "Substantiated employee business expense reimbursements",
              box: { identifier: "12_code_L", value: { type: "number_input" } },
            },
            {
              index: "M",
              description:
                "Uncollected social security or RRTA tax on taxable cost of group-term life insurance over $50,000 (for former employees)",
              box: { identifier: "12_code_M", value: { type: "number_input" } },
            },
            {
              index: "N",
              description:
                "Uncollected Medicare tax on taxable cost of group-term life insurance over $50,000 (for former employees)",
              box: { identifier: "12_code_N", value: { type: "number_input" } },
            },
            {
              index: "P",
              description:
                "Excludable moving expense reimbursements paid directly to a member of the U.S. Armed Forces or intelligence community",
              box: { identifier: "12_code_P", value: { type: "number_input" } },
            },
            {
              index: "Q",
              description: "Nontaxable combat pay",
              box: { identifier: "12_code_Q", value: { type: "number_input" } },
            },
            {
              index: "R",
              description: "Employer contributions to an Archer MSA",
              box: { identifier: "12_code_R", value: { type: "number_input" } },
            },
            {
              index: "S",
              description:
                "Employee salary reduction contributions under a section 408(p) SIMPLE plan",
              box: { identifier: "12_code_S", value: { type: "number_input" } },
            },
            {
              index: "T",
              description: "Adoption benefits",
              box: { identifier: "12_code_T", value: { type: "number_input" } },
            },
            {
              index: "V",
              description:
                "Income from the exercise of nonstatutory stock option(s)",
              box: { identifier: "12_code_V", value: { type: "number_input" } },
            },
            {
              index: "W",
              description:
                "Employer contributions to a health savings account (HSA)",
              box: { identifier: "12_code_W", value: { type: "number_input" } },
            },
            {
              index: "Y",
              description:
                "Deferrals under a section 409A nonqualified deferred compensation plan",
              box: { identifier: "12_code_Y", value: { type: "number_input" } },
            },
            {
              index: "Z",
              description:
                "Income under a nonqualified deferred compensation plan that fails to satisfy section 409A",
              box: { identifier: "12_code_Z", value: { type: "number_input" } },
            },
            {
              index: "AA",
              description:
                "Designated Roth contributions under a section 401(k) plan",
              box: {
                identifier: "12_code_AA",
                value: { type: "number_input" },
              },
            },
            {
              index: "BB",
              description:
                "Designated Roth contributions under a section 403(b) plan",
              box: {
                identifier: "12_code_BB",
                value: { type: "number_input" },
              },
            },
            {
              index: "DD",
              description: "Cost of employer-sponsored health coverage",
              box: {
                identifier: "12_code_DD",
                value: { type: "number_input" },
              },
            },
            {
              index: "EE",
              description:
                "Designated Roth contributions under a governmental section 457(b) plan",
              box: {
                identifier: "12_code_EE",
                value: { type: "number_input" },
              },
            },
            {
              index: "FF",
              description:
                "Permitted benefits under a qualified small employer health reimbursement arrangement",
              box: {
                identifier: "12_code_FF",
                value: { type: "number_input" },
              },
            },
            {
              index: "GG",
              description:
                "Income from qualified equity grants under section 83(i)",
              box: {
                identifier: "12_code_GG",
                value: { type: "number_input" },
              },
            },
            {
              index: "HH",
              description:
                "Aggregate deferrals under section 83(i) elections as of the close of the calendar year",
              box: {
                identifier: "12_code_HH",
                value: { type: "number_input" },
              },
            },
            {
              index: "II",
              description:
                "Medicaid waiver payments excluded from gross income under Notice 2014-7",
              box: {
                identifier: "12_code_II",
                value: { type: "number_input" },
              },
            },
            {
              index: "TA",
              description:
                "Employer contributions under a section 128 Trump account contribution program paid to a Trump account of an employee or a dependent of an employee",
              box: {
                identifier: "12_code_TA",
                value: { type: "number_input" },
              },
            },
            {
              index: "TP",
              description: "Total amount of cash tips reported to the employer",
              box: {
                identifier: "12_code_TP",
                value: { type: "number_input" },
              },
            },
            {
              index: "TT",
              description: "Total amount of qualified overtime compensation",
              box: {
                identifier: "12_code_TT",
                value: { type: "number_input" },
              },
            },
          ],
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
            value: { type: "unused" },
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
