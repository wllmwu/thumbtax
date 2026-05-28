import type { FormSpecification } from "#src/specifications/types/formSpecification";

export const FormW2_12_codes: FormSpecification = {
  class: "fW2_12_codes",
  title: "Form W-2: codes for box 12",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-w-2",
  category: "income",
  maxInstances: null,
  sections: [
    {
      lines: [
        {
          index: "A",
          description: "Uncollected social security or RRTA tax on tips",
          box: { identifier: "A", value: { type: "number_input" } },
        },
        {
          index: "B",
          description: "Uncollected Medicare tax on tips",
          box: { identifier: "B", value: { type: "number_input" } },
        },
        {
          index: "C",
          description: "Taxable cost of group-term life insurance over $50,000",
          box: { identifier: "C", value: { type: "number_input" } },
        },
        {
          index: "D",
          description:
            "Elective deferrals under a section 401(k) cash or deferred arrangement (plan)",
          box: { identifier: "D", value: { type: "number_input" } },
        },
        {
          index: "E",
          description:
            "Elective deferrals under a section 403(b) salary reduction agreement",
          box: { identifier: "E", value: { type: "number_input" } },
        },
        {
          index: "F",
          description:
            "Elective deferrals under a section 408(k)(6) salary reduction SEP",
          box: { identifier: "F", value: { type: "number_input" } },
        },
        {
          index: "G",
          description:
            "Elective deferrals and employer contributions (including nonelective deferrals) to any governmental or nongovernmental section 457(b) deferred compensation plan",
          box: { identifier: "G", value: { type: "number_input" } },
        },
        {
          index: "H",
          description:
            "Elective deferrals under section 501(c)(18)(D) tax-exempt organization plan",
          box: { identifier: "H", value: { type: "number_input" } },
        },
        {
          index: "J",
          description: "Nontaxable sick pay",
          box: { identifier: "J", value: { type: "number_input" } },
        },
        {
          index: "K",
          description: "20% excise tax on excess golden parachute payments",
          box: { identifier: "K", value: { type: "number_input" } },
        },
        {
          index: "L",
          description: "Substantiated employee business expense reimbursements",
          box: { identifier: "L", value: { type: "number_input" } },
        },
        {
          index: "M",
          description:
            "Uncollected social security or RRTA tax on taxable cost of group-term life insurance over $50,000 (for former employees)",
          box: { identifier: "M", value: { type: "number_input" } },
        },
        {
          index: "N",
          description:
            "Uncollected Medicare tax on taxable cost of group-term life insurance over $50,000 (for former employees)",
          box: { identifier: "N", value: { type: "number_input" } },
        },
        {
          index: "P",
          description:
            "Excludable moving expense reimbursements paid directly to a member of the U.S. Armed Forces or intelligence community",
          box: { identifier: "P", value: { type: "number_input" } },
        },
        {
          index: "Q",
          description: "Nontaxable combat pay",
          box: { identifier: "Q", value: { type: "number_input" } },
        },
        {
          index: "R",
          description: "Employer contributions to an Archer MSA",
          box: { identifier: "R", value: { type: "number_input" } },
        },
        {
          index: "S",
          description:
            "Employee salary reduction contributions under a section 408(p) SIMPLE plan",
          box: { identifier: "S", value: { type: "number_input" } },
        },
        {
          index: "T",
          description: "Adoption benefits",
          box: { identifier: "T", value: { type: "number_input" } },
        },
        {
          index: "V",
          description:
            "Income from the exercise of nonstatutory stock option(s)",
          box: { identifier: "V", value: { type: "number_input" } },
        },
        {
          index: "W",
          description:
            "Employer contributions to a health savings account (HSA)",
          box: { identifier: "W", value: { type: "number_input" } },
        },
        {
          index: "Y",
          description:
            "Deferrals under a section 409A nonqualified deferred compensation plan",
          box: { identifier: "Y", value: { type: "number_input" } },
        },
        {
          index: "Z",
          description:
            "Income under a nonqualified deferred compensation plan that fails to satisfy section 409A",
          box: { identifier: "Z", value: { type: "number_input" } },
        },
        {
          index: "AA",
          description:
            "Designated Roth contributions under a section 401(k) plan",
          box: {
            identifier: "AA",
            value: { type: "number_input" },
          },
        },
        {
          index: "BB",
          description:
            "Designated Roth contributions under a section 403(b) plan",
          box: {
            identifier: "BB",
            value: { type: "number_input" },
          },
        },
        {
          index: "DD",
          description: "Cost of employer-sponsored health coverage",
          box: {
            identifier: "DD",
            value: { type: "number_input" },
          },
        },
        {
          index: "EE",
          description:
            "Designated Roth contributions under a governmental section 457(b) plan",
          box: {
            identifier: "EE",
            value: { type: "number_input" },
          },
        },
        {
          index: "FF",
          description:
            "Permitted benefits under a qualified small employer health reimbursement arrangement",
          box: {
            identifier: "FF",
            value: { type: "number_input" },
          },
        },
        {
          index: "GG",
          description:
            "Income from qualified equity grants under section 83(i)",
          box: {
            identifier: "GG",
            value: { type: "number_input" },
          },
        },
        {
          index: "HH",
          description:
            "Aggregate deferrals under section 83(i) elections as of the close of the calendar year",
          box: {
            identifier: "HH",
            value: { type: "number_input" },
          },
        },
        {
          index: "II",
          description:
            "Medicaid waiver payments excluded from gross income under Notice 2014-7",
          box: {
            identifier: "II",
            value: { type: "number_input" },
          },
        },
        {
          index: "TA",
          description:
            "Employer contributions under a section 128 Trump account contribution program paid to a Trump account of an employee or a dependent of an employee",
          box: {
            identifier: "TA",
            value: { type: "number_input" },
          },
        },
        {
          index: "TP",
          description: "Total amount of cash tips reported to the employer",
          box: {
            identifier: "TP",
            value: { type: "number_input" },
          },
        },
        {
          index: "TT",
          description: "Total amount of qualified overtime compensation",
          box: {
            identifier: "TT",
            value: { type: "number_input" },
          },
        },
      ],
    },
  ],
};
