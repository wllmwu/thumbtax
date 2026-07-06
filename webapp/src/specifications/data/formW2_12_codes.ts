import type { FormSpecification } from "@thumbtax/forms";

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
          instructions: "Uncollected social security or RRTA tax on tips",
          box: { identifier: "A", value: { type: "number_input" } },
        },
        {
          index: "B",
          instructions: "Uncollected Medicare tax on tips",
          box: { identifier: "B", value: { type: "number_input" } },
        },
        {
          index: "C",
          instructions:
            "Taxable cost of group-term life insurance over $50,000",
          box: { identifier: "C", value: { type: "number_input" } },
        },
        {
          index: "D",
          instructions:
            "Elective deferrals under a section 401(k) cash or deferred arrangement (plan)",
          box: { identifier: "D", value: { type: "number_input" } },
        },
        {
          index: "E",
          instructions:
            "Elective deferrals under a section 403(b) salary reduction agreement",
          box: { identifier: "E", value: { type: "number_input" } },
        },
        {
          index: "F",
          instructions:
            "Elective deferrals under a section 408(k)(6) salary reduction SEP",
          box: { identifier: "F", value: { type: "number_input" } },
        },
        {
          index: "G",
          instructions:
            "Elective deferrals and employer contributions (including nonelective deferrals) to any governmental or nongovernmental section 457(b) deferred compensation plan",
          box: { identifier: "G", value: { type: "number_input" } },
        },
        {
          index: "H",
          instructions:
            "Elective deferrals under section 501(c)(18)(D) tax-exempt organization plan",
          box: { identifier: "H", value: { type: "number_input" } },
        },
        {
          index: "J",
          instructions: "Nontaxable sick pay",
          box: { identifier: "J", value: { type: "number_input" } },
        },
        {
          index: "K",
          instructions: "20% excise tax on excess golden parachute payments",
          box: { identifier: "K", value: { type: "number_input" } },
        },
        {
          index: "L",
          instructions:
            "Substantiated employee business expense reimbursements",
          box: { identifier: "L", value: { type: "number_input" } },
        },
        {
          index: "M",
          instructions:
            "Uncollected social security or RRTA tax on taxable cost of group-term life insurance over $50,000 (for former employees)",
          box: { identifier: "M", value: { type: "number_input" } },
        },
        {
          index: "N",
          instructions:
            "Uncollected Medicare tax on taxable cost of group-term life insurance over $50,000 (for former employees)",
          box: { identifier: "N", value: { type: "number_input" } },
        },
        {
          index: "P",
          instructions:
            "Excludable moving expense reimbursements paid directly to a member of the U.S. Armed Forces or intelligence community",
          box: { identifier: "P", value: { type: "number_input" } },
        },
        {
          index: "Q",
          instructions: "Nontaxable combat pay",
          box: { identifier: "Q", value: { type: "number_input" } },
        },
        {
          index: "R",
          instructions: "Employer contributions to an Archer MSA",
          box: { identifier: "R", value: { type: "number_input" } },
        },
        {
          index: "S",
          instructions:
            "Employee salary reduction contributions under a section 408(p) SIMPLE plan",
          box: { identifier: "S", value: { type: "number_input" } },
        },
        {
          index: "T",
          instructions: "Adoption benefits",
          box: { identifier: "T", value: { type: "number_input" } },
        },
        {
          index: "V",
          instructions:
            "Income from the exercise of nonstatutory stock option(s)",
          box: { identifier: "V", value: { type: "number_input" } },
        },
        {
          index: "W",
          instructions:
            "Employer contributions to a health savings account (HSA)",
          box: { identifier: "W", value: { type: "number_input" } },
        },
        {
          index: "Y",
          instructions:
            "Deferrals under a section 409A nonqualified deferred compensation plan",
          box: { identifier: "Y", value: { type: "number_input" } },
        },
        {
          index: "Z",
          instructions:
            "Income under a nonqualified deferred compensation plan that fails to satisfy section 409A",
          box: { identifier: "Z", value: { type: "number_input" } },
        },
        {
          index: "AA",
          instructions:
            "Designated Roth contributions under a section 401(k) plan",
          box: { identifier: "AA", value: { type: "number_input" } },
        },
        {
          index: "BB",
          instructions:
            "Designated Roth contributions under a section 403(b) plan",
          box: { identifier: "BB", value: { type: "number_input" } },
        },
        {
          index: "DD",
          instructions: "Cost of employer-sponsored health coverage",
          box: { identifier: "DD", value: { type: "number_input" } },
        },
        {
          index: "EE",
          instructions:
            "Designated Roth contributions under a governmental section 457(b) plan",
          box: { identifier: "EE", value: { type: "number_input" } },
        },
        {
          index: "FF",
          instructions:
            "Permitted benefits under a qualified small employer health reimbursement arrangement",
          box: { identifier: "FF", value: { type: "number_input" } },
        },
        {
          index: "GG",
          instructions:
            "Income from qualified equity grants under section 83(i)",
          box: { identifier: "GG", value: { type: "number_input" } },
        },
        {
          index: "HH",
          instructions:
            "Aggregate deferrals under section 83(i) elections as of the close of the calendar year",
          box: { identifier: "HH", value: { type: "number_input" } },
        },
        {
          index: "II",
          instructions:
            "Medicaid waiver payments excluded from gross income under Notice 2014-7",
          box: { identifier: "II", value: { type: "number_input" } },
        },
        {
          index: "TA",
          instructions:
            "Employer contributions under a section 128 Trump account contribution program paid to a Trump account of an employee or a dependent of an employee",
          box: { identifier: "TA", value: { type: "number_input" } },
        },
        {
          index: "TP",
          instructions: "Total amount of cash tips reported to the employer",
          box: { identifier: "TP", value: { type: "number_input" } },
        },
        {
          index: "TT",
          instructions: "Total amount of qualified overtime compensation",
          box: { identifier: "TT", value: { type: "number_input" } },
        },
      ],
    },
  ],
};
