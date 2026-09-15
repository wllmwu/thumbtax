import { defineFormSpecification } from "../types/defineFormSpecification";

export const fW2_12_codes = defineFormSpecification({
  class: "fW2_12_codes",
  irsPageUrl: "https://www.irs.gov/forms-pubs/about-form-w-2",
  category: "income",
  maxInstances: null,
  title: "Form W-2: codes for box 12",
  sections: [
    {
      lines: [
        {
          index: "A",
          instructions: "Uncollected social security or RRTA tax on tips",
          box: {
            identifier: "A",
            value: { type: "number_input", inputKey: "A" },
          },
        },
        {
          index: "B",
          instructions: "Uncollected Medicare tax on tips",
          box: {
            identifier: "B",
            value: { type: "number_input", inputKey: "B" },
          },
        },
        {
          index: "C",
          instructions:
            "Taxable cost of group-term life insurance over $50,000",
          box: {
            identifier: "C",
            value: { type: "number_input", inputKey: "C" },
          },
        },
        {
          index: "D",
          instructions:
            "Elective deferrals under a section 401(k) cash or deferred arrangement (plan)",
          box: {
            identifier: "D",
            value: { type: "number_input", inputKey: "D" },
          },
        },
        {
          index: "E",
          instructions:
            "Elective deferrals under a section 403(b) salary reduction agreement",
          box: {
            identifier: "E",
            value: { type: "number_input", inputKey: "E" },
          },
        },
        {
          index: "F",
          instructions:
            "Elective deferrals under a section 408(k)(6) salary reduction SEP",
          box: {
            identifier: "F",
            value: { type: "number_input", inputKey: "F" },
          },
        },
        {
          index: "G",
          instructions:
            "Elective deferrals and employer contributions (including nonelective deferrals) to any governmental or nongovernmental section 457(b) deferred compensation plan",
          box: {
            identifier: "G",
            value: { type: "number_input", inputKey: "G" },
          },
        },
        {
          index: "H",
          instructions:
            "Elective deferrals under section 501(c)(18)(D) tax-exempt organization plan",
          box: {
            identifier: "H",
            value: { type: "number_input", inputKey: "H" },
          },
        },
        {
          index: "J",
          instructions: "Nontaxable sick pay",
          box: {
            identifier: "J",
            value: { type: "number_input", inputKey: "J" },
          },
        },
        {
          index: "K",
          instructions: "20% excise tax on excess golden parachute payments",
          box: {
            identifier: "K",
            value: { type: "number_input", inputKey: "K" },
          },
        },
        {
          index: "L",
          instructions:
            "Substantiated employee business expense reimbursements",
          box: {
            identifier: "L",
            value: { type: "number_input", inputKey: "L" },
          },
        },
        {
          index: "M",
          instructions:
            "Uncollected social security or RRTA tax on taxable cost of group-term life insurance over $50,000 (for former employees)",
          box: {
            identifier: "M",
            value: { type: "number_input", inputKey: "M" },
          },
        },
        {
          index: "N",
          instructions:
            "Uncollected Medicare tax on taxable cost of group-term life insurance over $50,000 (for former employees)",
          box: {
            identifier: "N",
            value: { type: "number_input", inputKey: "N" },
          },
        },
        {
          index: "P",
          instructions:
            "Excludable moving expense reimbursements paid directly to a member of the U.S. Armed Forces or intelligence community",
          box: {
            identifier: "P",
            value: { type: "number_input", inputKey: "P" },
          },
        },
        {
          index: "Q",
          instructions: "Nontaxable combat pay",
          box: {
            identifier: "Q",
            value: { type: "number_input", inputKey: "Q" },
          },
        },
        {
          index: "R",
          instructions: "Employer contributions to an Archer MSA",
          box: {
            identifier: "R",
            value: { type: "number_input", inputKey: "R" },
          },
        },
        {
          index: "S",
          instructions:
            "Employee salary reduction contributions under a section 408(p) SIMPLE plan",
          box: {
            identifier: "S",
            value: { type: "number_input", inputKey: "S" },
          },
        },
        {
          index: "T",
          instructions: "Adoption benefits",
          box: {
            identifier: "T",
            value: { type: "number_input", inputKey: "T" },
          },
        },
        {
          index: "V",
          instructions:
            "Income from the exercise of nonstatutory stock option(s)",
          box: {
            identifier: "V",
            value: { type: "number_input", inputKey: "V" },
          },
        },
        {
          index: "W",
          instructions:
            "Employer contributions to a health savings account (HSA)",
          box: {
            identifier: "W",
            value: { type: "number_input", inputKey: "W" },
          },
        },
        {
          index: "Y",
          instructions:
            "Deferrals under a section 409A nonqualified deferred compensation plan",
          box: {
            identifier: "Y",
            value: { type: "number_input", inputKey: "Y" },
          },
        },
        {
          index: "Z",
          instructions:
            "Income under a nonqualified deferred compensation plan that fails to satisfy section 409A",
          box: {
            identifier: "Z",
            value: { type: "number_input", inputKey: "Z" },
          },
        },
        {
          index: "AA",
          instructions:
            "Designated Roth contributions under a section 401(k) plan",
          box: {
            identifier: "AA",
            value: { type: "number_input", inputKey: "AA" },
          },
        },
        {
          index: "BB",
          instructions:
            "Designated Roth contributions under a section 403(b) plan",
          box: {
            identifier: "BB",
            value: { type: "number_input", inputKey: "BB" },
          },
        },
        {
          index: "DD",
          instructions: "Cost of employer-sponsored health coverage",
          box: {
            identifier: "DD",
            value: { type: "number_input", inputKey: "DD" },
          },
        },
        {
          index: "EE",
          instructions:
            "Designated Roth contributions under a governmental section 457(b) plan",
          box: {
            identifier: "EE",
            value: { type: "number_input", inputKey: "EE" },
          },
        },
        {
          index: "FF",
          instructions:
            "Permitted benefits under a qualified small employer health reimbursement arrangement",
          box: {
            identifier: "FF",
            value: { type: "number_input", inputKey: "FF" },
          },
        },
        {
          index: "GG",
          instructions:
            "Income from qualified equity grants under section 83(i)",
          box: {
            identifier: "GG",
            value: { type: "number_input", inputKey: "GG" },
          },
        },
        {
          index: "HH",
          instructions:
            "Aggregate deferrals under section 83(i) elections as of the close of the calendar year",
          box: {
            identifier: "HH",
            value: { type: "number_input", inputKey: "HH" },
          },
        },
        {
          index: "II",
          instructions:
            "Medicaid waiver payments excluded from gross income under Notice 2014-7",
          box: {
            identifier: "II",
            value: { type: "number_input", inputKey: "II" },
          },
        },
        {
          index: "TA",
          instructions:
            "Employer contributions under a section 128 Trump account contribution program paid to a Trump account of an employee or a dependent of an employee",
          box: {
            identifier: "TA",
            value: { type: "number_input", inputKey: "TA" },
          },
        },
        {
          index: "TP",
          instructions: "Total amount of cash tips reported to the employer",
          box: {
            identifier: "TP",
            value: { type: "number_input", inputKey: "TP" },
          },
        },
        {
          index: "TT",
          instructions: "Total amount of qualified overtime compensation",
          box: {
            identifier: "TT",
            value: { type: "number_input", inputKey: "TT" },
          },
        },
      ],
    },
  ],
});
