import { defineFormSpecification } from "../types/defineFormSpecification";

export const fW2_12_codes = defineFormSpecification({
  class: "fW2_12_codes",
  govAboutUrl: "https://www.irs.gov/forms-pubs/about-form-w-2",
  category: "income",
  maxInstances: null,
  title: "Form W-2: codes for box 12",
  commentary: {
    $$mdtype: "Tag",
    name: "p",
    attributes: {},
    children: [
      "If your employer reported anything on ",
      {
        $$mdtype: "Tag",
        name: "FormLink",
        attributes: { formClass: "fW2" },
        children: ["Form W-2"],
      },
      ", box 12a through 12d, then enter those numbers on this form.",
      " ",
      "This isn't a real tax form, it just works better with Thumbtax to model it this way.",
    ],
  },
  sections: [
    {
      lines: [
        {
          index: "A",
          instructions: "Uncollected social security or RRTA tax on tips",
          box: {
            identifier: "A",
            value: {
              type: "number_input",
              inputKey: "uncollected_social_security_tax_tips",
            },
          },
        },
        {
          index: "B",
          instructions: "Uncollected Medicare tax on tips",
          box: {
            identifier: "B",
            value: {
              type: "number_input",
              inputKey: "uncollected_medicare_tax_tips",
            },
          },
        },
        {
          index: "C",
          instructions:
            "Taxable cost of group-term life insurance over $50,000",
          box: {
            identifier: "C",
            value: {
              type: "number_input",
              inputKey: "group_term_life_insurance_taxable_cost",
            },
          },
        },
        {
          index: "D",
          instructions:
            "Elective deferrals under a section 401(k) cash or deferred arrangement (plan)",
          box: {
            identifier: "D",
            value: {
              type: "number_input",
              inputKey: "section_401(k)_elective_deferrals",
            },
          },
        },
        {
          index: "E",
          instructions:
            "Elective deferrals under a section 403(b) salary reduction agreement",
          box: {
            identifier: "E",
            value: {
              type: "number_input",
              inputKey: "section_403(b)_elective_deferrals",
            },
          },
        },
        {
          index: "F",
          instructions:
            "Elective deferrals under a section 408(k)(6) salary reduction SEP",
          box: {
            identifier: "F",
            value: {
              type: "number_input",
              inputKey: "section_408(k)(6)_elective_deferrals",
            },
          },
        },
        {
          index: "G",
          instructions:
            "Elective deferrals and employer contributions (including nonelective deferrals) to any governmental or nongovernmental section 457(b) deferred compensation plan",
          box: {
            identifier: "G",
            value: {
              type: "number_input",
              inputKey: "section_457(b)_elective_deferrals",
            },
          },
        },
        {
          index: "H",
          instructions:
            "Elective deferrals under section 501(c)(18)(D) tax-exempt organization plan",
          box: {
            identifier: "H",
            value: {
              type: "number_input",
              inputKey: "section_501(c)(18)(D)_elective_deferrals",
            },
          },
        },
        {
          index: "J",
          instructions: "Nontaxable sick pay",
          box: {
            identifier: "J",
            value: { type: "number_input", inputKey: "nontaxable_sick_pay" },
          },
        },
        {
          index: "K",
          instructions: [
            "20% excise tax on excess ",
            {
              $$mdtype: "Tag",
              name: "GlossaryLink",
              attributes: { term: "golden-parachute" },
              children: ["golden parachute"],
            },
            " payments",
          ],
          box: {
            identifier: "K",
            value: {
              type: "number_input",
              inputKey: "excess_golden_parachute_payments_excise_tax",
            },
          },
        },
        {
          index: "L",
          instructions:
            "Substantiated employee business expense reimbursements",
          box: {
            identifier: "L",
            value: {
              type: "number_input",
              inputKey: "business_expense_reimbursements",
            },
          },
        },
        {
          index: "M",
          instructions:
            "Uncollected social security or RRTA tax on taxable cost of group-term life insurance over $50,000 (for former employees)",
          box: {
            identifier: "M",
            value: {
              type: "number_input",
              inputKey:
                "uncollected_social_security_tax_group_term_life_insurance_former_employees",
            },
          },
        },
        {
          index: "N",
          instructions:
            "Uncollected Medicare tax on taxable cost of group-term life insurance over $50,000 (for former employees)",
          box: {
            identifier: "N",
            value: {
              type: "number_input",
              inputKey:
                "uncollected_medicare_tax_group_term_life_insurance_former_employees",
            },
          },
        },
        {
          index: "P",
          instructions:
            "Excludable moving expense reimbursements paid directly to a member of the U.S. Armed Forces or intelligence community",
          box: {
            identifier: "P",
            value: {
              type: "number_input",
              inputKey: "armed_forces_moving_expense_reimbursements",
            },
          },
        },
        {
          index: "Q",
          instructions: "Nontaxable combat pay",
          box: {
            identifier: "Q",
            value: { type: "number_input", inputKey: "nontaxable_combat_pay" },
          },
        },
        {
          index: "R",
          instructions: "Employer contributions to an Archer MSA",
          box: {
            identifier: "R",
            value: {
              type: "number_input",
              inputKey: "archer_msa_employer_contributions",
            },
          },
        },
        {
          index: "S",
          instructions:
            "Employee salary reduction contributions under a section 408(p) SIMPLE plan",
          box: {
            identifier: "S",
            value: {
              type: "number_input",
              inputKey: "simple_plan_salary_reduction_contributions",
            },
          },
        },
        {
          index: "T",
          instructions: "Adoption benefits",
          box: {
            identifier: "T",
            value: { type: "number_input", inputKey: "adoption_benefits" },
          },
        },
        {
          index: "V",
          instructions:
            "Income from the exercise of nonstatutory stock option(s)",
          box: {
            identifier: "V",
            value: {
              type: "number_input",
              inputKey: "nonstatutory_stock_option_exercise_income",
            },
          },
        },
        {
          index: "W",
          instructions:
            "Employer contributions to a health savings account (HSA)",
          box: {
            identifier: "W",
            value: {
              type: "number_input",
              inputKey: "hsa_employer_contributions",
            },
          },
        },
        {
          index: "Y",
          instructions:
            "Deferrals under a section 409A nonqualified deferred compensation plan",
          box: {
            identifier: "Y",
            value: { type: "number_input", inputKey: "section_409A_deferrals" },
          },
        },
        {
          index: "Z",
          instructions:
            "Income under a nonqualified deferred compensation plan that fails to satisfy section 409A",
          box: {
            identifier: "Z",
            value: {
              type: "number_input",
              inputKey: "non_section_409A_plan_income",
            },
          },
        },
        {
          index: "AA",
          instructions:
            "Designated Roth contributions under a section 401(k) plan",
          box: {
            identifier: "AA",
            value: {
              type: "number_input",
              inputKey: "section_401(k)_roth_contributions",
            },
          },
        },
        {
          index: "BB",
          instructions:
            "Designated Roth contributions under a section 403(b) plan",
          box: {
            identifier: "BB",
            value: {
              type: "number_input",
              inputKey: "section_403(b)_roth_contributions",
            },
          },
        },
        {
          index: "DD",
          instructions: "Cost of employer-sponsored health coverage",
          box: {
            identifier: "DD",
            value: {
              type: "number_input",
              inputKey: "employer_health_coverage_cost",
            },
          },
        },
        {
          index: "EE",
          instructions:
            "Designated Roth contributions under a governmental section 457(b) plan",
          box: {
            identifier: "EE",
            value: {
              type: "number_input",
              inputKey: "section_457(b)_roth_contributions",
            },
          },
        },
        {
          index: "FF",
          instructions:
            "Permitted benefits under a qualified small employer health reimbursement arrangement",
          box: {
            identifier: "FF",
            value: {
              type: "number_input",
              inputKey:
                "small_employer_health_reimbursement_arrangement_benefits",
            },
          },
        },
        {
          index: "GG",
          instructions:
            "Income from qualified equity grants under section 83(i)",
          box: {
            identifier: "GG",
            value: {
              type: "number_input",
              inputKey: "section_83(i)_equity_grant_income",
            },
          },
        },
        {
          index: "HH",
          instructions:
            "Aggregate deferrals under section 83(i) elections as of the close of the calendar year",
          box: {
            identifier: "HH",
            value: {
              type: "number_input",
              inputKey: "section_83(i)_aggregate_deferrals",
            },
          },
        },
        {
          index: "II",
          instructions:
            "Medicaid waiver payments excluded from gross income under Notice 2014-7",
          box: {
            identifier: "II",
            value: {
              type: "number_input",
              inputKey: "excluded_medicaid_waiver_payments",
            },
          },
        },
        {
          index: "TA",
          instructions:
            "Employer contributions under a section 128 Trump account contribution program paid to a Trump account of an employee or a dependent of an employee",
          box: {
            identifier: "TA",
            value: {
              type: "number_input",
              inputKey: "section_128_trump_account_employer_contributions",
            },
          },
        },
        {
          index: "TP",
          instructions: "Total amount of cash tips reported to the employer",
          box: {
            identifier: "TP",
            value: {
              type: "number_input",
              inputKey: "total_cash_tips_reported",
            },
          },
        },
        {
          index: "TT",
          instructions: "Total amount of qualified overtime compensation",
          box: {
            identifier: "TT",
            value: {
              type: "number_input",
              inputKey: "total_qualified_overtime_compensation",
            },
          },
        },
      ],
    },
  ],
});
