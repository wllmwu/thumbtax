import type { GlossaryEntry } from "../types/glossaryEntry";
import type { GlossaryTerm } from "../types/glossaryTerm";

export const glossary: Record<GlossaryTerm, GlossaryEntry> = {
  "additional-medicare-tax": {
    name: "Additional Medicare tax",
    definition: {
      $$mdtype: "Tag",
      name: "p",
      attributes: {},
      children: [
        "Additional flat rate federal tax that applies to Medicare wages over a certain threshold.",
        " ",
        "See ",
        {
          $$mdtype: "Tag",
          name: "FormLink",
          attributes: { formClass: "f8959" },
          children: ["Form 8959"],
        },
        ".",
      ],
    },
    learnMore: {
      $$mdtype: "Tag",
      name: "a",
      attributes: { href: "https://www.irs.gov/taxtopics/tc560" },
      children: ["Additional Medicare tax (IRS topic 560)"],
    },
  },
  "adjusted-gross-income": {
    name: "Adjusted gross income (AGI)",
    definition: {
      $$mdtype: "Tag",
      name: "p",
      attributes: {},
      children: [
        "Amount of ",
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "gross-income" },
          children: ["gross income"],
        },
        " after applying ",
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "adjustment" },
          children: ["adjustments"],
        },
        ".",
        " ",
        "After computing this value, you subtract ",
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "deduction" },
          children: ["deductions"],
        },
        " from it to get your ",
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "taxable-income" },
          children: ["taxable income"],
        },
        ".",
      ],
    },
    learnMore: [
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: {
          href: "https://www.irs.gov/filing/adjusted-gross-income",
        },
        children: ["Adjusted gross income (IRS.gov)"],
      },
      " • ",
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: {
          href: "https://www.law.cornell.edu/wex/adjusted_gross_income_%28agi%29",
        },
        children: ["adjusted gross income (Cornell LII)"],
      },
    ],
  },
  adjustment: {
    name: "Adjustment",
    definition: {
      $$mdtype: "Tag",
      name: "p",
      attributes: {},
      children: [
        "Amount added to or subtracted from ",
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "gross-income" },
          children: ["gross income"],
        },
        " to compute ",
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "adjusted-gross-income" },
          children: ["adjusted gross income"],
        },
        ".",
        " ",
        "The law designates certain categories of expenses, contributions, and received payments as adjustments, enumerated in ",
        {
          $$mdtype: "Tag",
          name: "FormLink",
          attributes: { formClass: "f1040s1" },
          children: ["Schedule 1 (Form 1040)"],
        },
        ".",
      ],
    },
  },
  "alternative-minimum-tax": {
    name: "Alternative minimum tax (AMT)",
    definition: [
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "income-tax" },
            children: ["Income tax"],
          },
          " that applies to higher-income taxpayers in addition to regular ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "federal-income-tax" },
            children: ["federal income tax"],
          },
          ".",
          " ",
          "The AMT is designed to ensure that taxpayers who receive a lot of tax benefits still pay some amount of tax.",
          " ",
          "It only applies when your income is over a certain threshold.",
        ],
      },
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          "Specifically, the AMT is the excess of the ",
          {
            $$mdtype: "Tag",
            name: "strong",
            attributes: {},
            children: ["tentative minimum tax"],
          },
          " over the regular tax.",
          " ",
          "The tentative minimum tax is calculated similarly to the regular tax, but you add back certain deductions and exemptions to your ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "taxable-income" },
            children: ["taxable income"],
          },
          " first.",
          " ",
          "The full calculation is done on ",
          {
            $$mdtype: "Tag",
            name: "FormLink",
            attributes: { formClass: "f6251" },
            children: ["Form 6251"],
          },
          ".",
        ],
      },
    ],
    learnMore: [
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: {
          href: "https://www.law.cornell.edu/wex/alternative_minimum_tax_%28amt%29",
        },
        children: ["alternative minimum tax (AMT) (Cornell LII)"],
      },
      " • ",
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: { href: "https://www.irs.gov/taxtopics/tc556" },
        children: ["Alternative Minimum Tax (IRS topic 556)"],
      },
    ],
  },
  "backup-withholding": {
    name: "Backup withholding",
    definition: {
      $$mdtype: "Tag",
      name: "p",
      attributes: {},
      children: [
        "Type of ",
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "withholding" },
          children: ["withholding"],
        },
        " required when you didn't give a payer the correct taxpayer identification number or when you underreported interest or dividends to the IRS.",
        " ",
        "It can apply to most types of payments reported on Form 1099 (",
        {
          $$mdtype: "Tag",
          name: "FormLink",
          attributes: { formClass: "f1099B" },
          children: ["Form 1099-B"],
        },
        ", ",
        {
          $$mdtype: "Tag",
          name: "FormLink",
          attributes: { formClass: "f1099DIV" },
          children: ["Form 1099-DIV"],
        },
        ", etc.).",
      ],
    },
    learnMore: {
      $$mdtype: "Tag",
      name: "a",
      attributes: { href: "https://www.irs.gov/taxtopics/tc307" },
      children: ["Backup withholding (IRS topic 307)"],
    },
  },
  "capital-gain": {
    name: "Capital gain",
    definition: [
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          "Profit from selling capital assets, such as a home, a vehicle, stocks, or bonds.",
          " ",
          "Capital gain is considered ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "income" },
            children: ["income"],
          },
          " and subject to ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "income-tax" },
            children: ["income tax"],
          },
          ".",
        ],
      },
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          "You earn capital gain when you sell the asset for more than it cost you to buy it.",
          " ",
          "If you sell it for less than it cost, then it's a ",
          {
            $$mdtype: "Tag",
            name: "strong",
            attributes: {},
            children: ["capital loss,"],
          },
          " which can decrease your income and income tax up to a limit.",
        ],
      },
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          'You have to sell ("realize") the asset in order to incur capital gain or loss.',
          " ",
          "Changes in the asset's value while you still own it don't count as income.",
        ],
      },
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          "The tax rate for capital gains differs depending on how long you held the asset.",
          " ",
          "Typically, ",
          {
            $$mdtype: "Tag",
            name: "strong",
            attributes: {},
            children: ["short-term capital gains"],
          },
          " are held for one year or less and are taxed as regular income.",
          " ",
          {
            $$mdtype: "Tag",
            name: "strong",
            attributes: {},
            children: ["Long-term capital gains"],
          },
          " are held for more than one year and are taxed at a lower rate.",
        ],
      },
    ],
    learnMore: [
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: { href: "https://www.irs.gov/taxtopics/tc409" },
        children: ["Capital gains and losses (IRS topic 409)"],
      },
      " • ",
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: { href: "https://www.law.cornell.edu/wex/capital_gains" },
        children: ["capital gains (Cornell LII)"],
      },
    ],
  },
  collectibles: {
    name: "Collectibles",
    definition: {
      $$mdtype: "Tag",
      name: "p",
      attributes: {},
      children: [
        "Category of capital asset that includes works of art, stamps, coins, cards, precious metals and gemstones, antiques, and other rare items.",
        " ",
        "Long-term ",
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "capital-gain" },
          children: ["capital gains"],
        },
        " earned from selling collectibles are taxed at a special rate, up to 28%.",
      ],
    },
    learnMore: {
      $$mdtype: "Tag",
      name: "a",
      attributes: {
        href: "https://www.investopedia.com/articles/personal-finance/061715/how-are-collectibles-taxed.asp",
      },
      children: ["How Collectibles Are Taxed (Investopedia)"],
    },
  },
  credit: {
    name: "Credit",
    definition: [
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          "Amount subtracted from ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "tax-liability" },
            children: ["tax liability"],
          },
          " to compute ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "tax-due" },
            children: ["tax due"],
          },
          ".",
          " ",
          "Examples of tax credits include the ",
          {
            $$mdtype: "Tag",
            name: "a",
            attributes: {
              href: "https://www.irs.gov/credits-deductions/individuals/child-tax-credit",
            },
            children: ["child tax credit"],
          },
          " and ",
          {
            $$mdtype: "Tag",
            name: "a",
            attributes: {
              href: "https://www.irs.gov/clean-vehicle-tax-credits",
            },
            children: ["clean vehicle credits"],
          },
          ".",
          " ",
          {
            $$mdtype: "Tag",
            name: "strong",
            attributes: {},
            children: ["Deductions"],
          },
          " reduce your ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "taxable-income" },
            children: ["taxable income"],
          },
          ", while ",
          {
            $$mdtype: "Tag",
            name: "strong",
            attributes: {},
            children: ["credits"],
          },
          " reduce how much you ultimately owe the IRS.",
        ],
      },
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          {
            $$mdtype: "Tag",
            name: "strong",
            attributes: {},
            children: ["Refundable credits"],
          },
          " can increase your ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "tax-refund" },
            children: ["tax refund"],
          },
          " if your credits are more than your tax liability.",
          " ",
          "They can essentially give you negative total tax liability (a refund).",
          " ",
          "On the other hand, ",
          {
            $$mdtype: "Tag",
            name: "strong",
            attributes: {},
            children: ["nonrefundable credits"],
          },
          " can only reduce your tax liability to zero.",
        ],
      },
    ],
    learnMore: [
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: { href: "https://www.irs.gov/credits-and-deductions" },
        children: ["Credits and deductions (IRS.gov)"],
      },
      " • ",
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: { href: "https://www.law.cornell.edu/wex/tax_credit" },
        children: ["tax credit (Cornell LII)"],
      },
    ],
  },
  deduction: {
    name: "Deduction",
    definition: [
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          "Amount subtracted from ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "adjusted-gross-income" },
            children: ["adjusted gross income"],
          },
          " to compute ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "taxable-income" },
            children: ["taxable income"],
          },
          ".",
          " ",
          "You can typically deduct things like capital losses, business expenses, healthcare costs, other taxes you paid, and donations to charity, up to a limit.",
          " ",
          {
            $$mdtype: "Tag",
            name: "strong",
            attributes: {},
            children: ["Deductions"],
          },
          " reduce your taxable income, while ",
          {
            $$mdtype: "Tag",
            name: "strong",
            attributes: {},
            children: ["credits"],
          },
          " reduce how much you ultimately owe the IRS.",
        ],
      },
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          "For ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "federal-income-tax" },
            children: ["federal income tax"],
          },
          ", you choose between the ",
          {
            $$mdtype: "Tag",
            name: "strong",
            attributes: {},
            children: ["standard deduction"],
          },
          " (a fixed amount) and ",
          {
            $$mdtype: "Tag",
            name: "strong",
            attributes: {},
            children: ["itemized deductions"],
          },
          " (precise amounts computed in ",
          {
            $$mdtype: "Tag",
            name: "FormLink",
            attributes: { formClass: "f1040sA" },
            children: ["Schedule A (Form 1040)"],
          },
          ") depending on which is larger.",
        ],
      },
    ],
    learnMore: [
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: { href: "https://www.irs.gov/credits-and-deductions" },
        children: ["Credits and deductions (IRS.gov)"],
      },
      " • ",
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: { href: "https://www.law.cornell.edu/wex/deduction" },
        children: ["deduction (Cornell LII)"],
      },
    ],
  },
  dividend: {
    name: "Dividend",
    definition: [
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          "Payment from a corporation to its shareholders.",
          " ",
          "Corporations often invest some of their profits back into the company and distribute the rest as dividends.",
        ],
      },
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "ordinary-dividends" },
            children: ["Ordinary"],
          },
          " and ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "qualified-dividends" },
            children: ["qualified dividends"],
          },
          " are taxed at different rates.",
        ],
      },
    ],
    learnMore: [
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: { href: "https://www.irs.gov/taxtopics/tc404" },
        children: [
          "Dividends and other corporate distributions (IRS topic 404)",
        ],
      },
      " • ",
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: { href: "https://www.law.cornell.edu/wex/dividend" },
        children: ["dividend (Cornell LII)"],
      },
    ],
  },
  "federal-income-tax": {
    name: "Federal income tax",
    definition: {
      $$mdtype: "Tag",
      name: "p",
      attributes: {},
      children: [
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "income-tax" },
          children: ["Income tax"],
        },
        " levied by the federal government.",
        " ",
        "It is a ",
        {
          $$mdtype: "Tag",
          name: "strong",
          attributes: {},
          children: ["progressive tax,"],
        },
        " meaning the tax rate increases as your income increases.",
        " ",
        "In particular, your income is separated into brackets, and the money in each bracket is taxed at a specific percentage.",
      ],
    },
    learnMore: [
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: {
          href: "https://www.irs.gov/forms-pubs/about-publication-17",
        },
        children: ["Your Federal Income Tax (For Individuals) (IRS pub. 17)"],
      },
      " • ",
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: {
          href: "https://www.irs.gov/filing/federal-income-tax-rates-and-brackets",
        },
        children: ["Federal income tax rates and brackets (IRS.gov)"],
      },
    ],
  },
  "golden-parachute": {
    name: "Golden parachute",
    definition: [
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          "Benefits that a company agrees to give its executives if they lose their jobs after a merger with or takeover by another company.",
          " ",
          "These can include various forms of payment (such as cash, stock options, or immediate vesting) and other benefits (such as staying enrolled in pensions or insurance plans).",
        ],
      },
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          {
            $$mdtype: "Tag",
            name: "strong",
            attributes: {},
            children: ["Excess"],
          },
          " golden parachute payments are the amount that golden parachute payments exceed one's average annual compensation in a recent time range.",
        ],
      },
    ],
    learnMore: [
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: {
          href: "https://www.investopedia.com/terms/g/goldenparachute.asp",
        },
        children: [
          "Understanding Golden Parachutes: Definition, Benefits & Controversy (Investopedia)",
        ],
      },
      " • ",
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: {
          href: "https://www.law.cornell.edu/wex/golden_parachute",
        },
        children: ["golden parachute (Cornell LII)"],
      },
      " • ",
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: {
          href: "https://www.ecfr.gov/current/title-26/chapter-I/subchapter-A/part-1/subject-group-ECFR210006225231fb0/section-1.280G-1",
        },
        children: ["§ 1.280G-1 Golden parachute payments (eCFR.gov)"],
      },
    ],
  },
  "gross-income": {
    name: "Gross income",
    definition: [
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          "Also called ",
          {
            $$mdtype: "Tag",
            name: "strong",
            attributes: {},
            children: ["total income."],
          },
        ],
      },
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          "For ",
          {
            $$mdtype: "Tag",
            name: "strong",
            attributes: {},
            children: ["individuals,"],
          },
          " total amount of ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "income" },
            children: ["income"],
          },
          " during the tax year.",
          " ",
          "This generally includes all income from almost all sources, such as ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "wages" },
            children: ["wages"],
          },
          ", ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "capital-gain" },
            children: ["capital gains"],
          },
          ", and ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "dividend" },
            children: ["dividends"],
          },
          ".",
          " ",
          "However, certain sources are excluded, such as gifts and child support.",
        ],
      },
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          "After you compute your gross income, you apply ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "adjustment" },
            children: ["adjustments"],
          },
          " to get your ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "adjusted-gross-income" },
            children: ["adjusted gross income"],
          },
          ".",
        ],
      },
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          "For ",
          {
            $$mdtype: "Tag",
            name: "strong",
            attributes: {},
            children: ["businesses,"],
          },
          " revenue minus cost of goods sold.",
        ],
      },
    ],
    learnMore: {
      $$mdtype: "Tag",
      name: "a",
      attributes: { href: "https://www.law.cornell.edu/wex/gross_income" },
      children: ["gross income (Cornell LII)"],
    },
  },
  income: {
    name: "Income",
    definition: {
      $$mdtype: "Tag",
      name: "p",
      attributes: {},
      children: [
        "Generally speaking, any money that you receive.",
        " ",
        "For the purpose of taxation, this can also include the cash value of non-monetary things, such as physical gifts.",
      ],
    },
  },
  "income-tax": {
    name: "Income tax",
    definition: {
      $$mdtype: "Tag",
      name: "p",
      attributes: {},
      children: [
        "Tax you pay when you earn ",
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "income" },
          children: ["income"],
        },
        ".",
        " ",
        "The annual tax return process in the U.S. centers on figuring out how much income tax you still owe (or how much you overpaid) for the past tax year.",
        " ",
        "Other types of taxes include sales tax, which you pay when you buy something, and property tax, which you pay when you own property.",
      ],
    },
  },
  "ordinary-dividends": {
    name: "Ordinary dividends",
    definition: [
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "dividend" },
            children: ["Dividends"],
          },
          " that are not ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "qualified-dividends" },
            children: ["qualified dividends"],
          },
          ".",
          " ",
          "Ordinary dividends are ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "income-tax" },
            children: ["taxed as regular income"],
          },
          ", whereas qualified dividends are taxed as ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "capital-gain" },
            children: ["capital gains"],
          },
          ".",
          " ",
          'In other words, dividends are ordinary by default unless they "qualify" for the capital gains tax by meeting certain conditions.',
        ],
      },
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          "If you receive dividends, the payer reports what amount is ordinary vs. qualified on ",
          {
            $$mdtype: "Tag",
            name: "FormLink",
            attributes: { formClass: "f1099DIV" },
            children: ["Form 1099-DIV"],
          },
          ".",
        ],
      },
    ],
    learnMore: {
      $$mdtype: "Tag",
      name: "a",
      attributes: {
        href: "https://www.investopedia.com/terms/q/qualifieddividend.asp",
      },
      children: [
        "What Are Qualified Dividends, and How Are They Taxed? (Investopedia)",
      ],
    },
  },
  "qualified-business-income": {
    name: "Qualified business income (QBI)",
    definition: {
      $$mdtype: "Tag",
      name: "p",
      attributes: {},
      children: [
        "Broadly, income from self-employment or small business ownership, excluding certain items and subject to certain conditions and limits.",
        " ",
        "Eligible individuals can ",
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "deduction" },
          children: ["deduct"],
        },
        " their QBI to reduce their taxes.",
      ],
    },
    learnMore: {
      $$mdtype: "Tag",
      name: "a",
      attributes: {
        href: "https://www.irs.gov/newsroom/qualified-business-income-deduction",
      },
      children: ["Qualified business income deduction (IRS.gov)"],
    },
  },
  "qualified-dividends": {
    name: "Qualified dividends",
    definition: [
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "dividend" },
            children: ["Dividends"],
          },
          ' that "qualify" as ',
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "capital-gain" },
            children: ["capital gains"],
          },
          " instead of ordinary income (",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "ordinary-dividends" },
            children: ["ordinary dividends"],
          },
          ").",
          " ",
          "If you receive dividends, the payer reports what amount is ordinary vs. qualified on ",
          {
            $$mdtype: "Tag",
            name: "FormLink",
            attributes: { formClass: "f1099DIV" },
            children: ["Form 1099-DIV"],
          },
          ".",
        ],
      },
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          "Specifically, a dividend is qualified if you held the stock for more than 60 days in the 121 day period starting 60 days before its ",
          {
            $$mdtype: "Tag",
            name: "strong",
            attributes: {},
            children: ["ex-dividend date,"],
          },
          " which is one market day before its ",
          {
            $$mdtype: "Tag",
            name: "strong",
            attributes: {},
            children: ["record date,"],
          },
          " which is the date that you must be marked as a shareholder in the company's records in order to receive the dividend.",
        ],
      },
    ],
    learnMore: {
      $$mdtype: "Tag",
      name: "a",
      attributes: {
        href: "https://www.investopedia.com/terms/q/qualifieddividend.asp",
      },
      children: [
        "What Are Qualified Dividends, and How Are They Taxed? (Investopedia)",
      ],
    },
  },
  "qualified-opportunity-fund": {
    name: "Qualified Opportunity Fund (QOF)",
    definition: {
      $$mdtype: "Tag",
      name: "p",
      attributes: {},
      children: [
        "Fund that invests in ",
        {
          $$mdtype: "Tag",
          name: "strong",
          attributes: {},
          children: ["Qualified Opportunity Zones,"],
        },
        ' which are "economically distressed communities" designated by the U.S. government.',
        " ",
        "QOFs are meant to incentivize investment into these regions, so you can defer taxes on contributions you make to a QOF.",
      ],
    },
    learnMore: {
      $$mdtype: "Tag",
      name: "a",
      attributes: {
        href: "https://www.irs.gov/credits-deductions/businesses/invest-in-a-qualified-opportunity-fund",
      },
      children: ["Invest in a Qualified Opportunity Fund (IRS.gov)"],
    },
  },
  "qualified-small-business-stock": {
    name: "Qualified small business stock",
    definition: {
      $$mdtype: "Tag",
      name: "p",
      attributes: {},
      children: [
        "Shares in a qualified small business that have tax benefits for the ",
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "capital-gain" },
          children: ["capital gains"],
        },
        " tax under certain conditions.",
      ],
    },
    learnMore: {
      $$mdtype: "Tag",
      name: "a",
      attributes: {
        href: "https://www.investopedia.com/terms/q/qsbs-qualified-small-business-stock.asp",
      },
      children: [
        "Qualified Small Business Stock (QSBS): Definition and Tax Benefits (Investopedia)",
      ],
    },
  },
  recapture: {
    name: "Recapture",
    definition: {
      $$mdtype: "Tag",
      name: "p",
      attributes: {},
      children: [
        "Decrease in a tax benefit, such as a ",
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "deduction" },
          children: ["deduction"],
        },
        " or ",
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "credit" },
          children: ["credit"],
        },
        ", because you stopped meeting the required conditions.",
        " ",
        "For example, you can get a tax credit from selling certain assets, but if you sell it too soon, then the credit is reduced.",
        " ",
        "To be precise, the tax benefit lowers your tax, while the recapture raises your tax again to offset part of the benefit.",
      ],
    },
    learnMore: [
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: { href: "https://www.law.cornell.edu/wex/recapture" },
        children: ["recapture (Cornell LII)"],
      },
      " • ",
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: {
          href: "https://tax.thomsonreuters.com/en/glossary/depreciation-recapture-tax",
        },
        children: ["Depreciation recapture tax (Thomson Reuters)"],
      },
    ],
  },
  "section-1202": {
    name: "Section 1202",
    definition: {
      $$mdtype: "Tag",
      name: "p",
      attributes: {},
      children: [
        "Section of the U.S. tax code that allows individuals to exclude from ",
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "gross-income" },
          children: ["gross income"],
        },
        " certain gains from the sale or exchange of ",
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "qualified-small-business-stock" },
          children: ["qualified small business stock"],
        },
        ".",
      ],
    },
    learnMore: {
      $$mdtype: "Tag",
      name: "a",
      attributes: { href: "https://www.law.cornell.edu/uscode/text/26/1202" },
      children: [
        "26 U.S. Code § 1202 - Partial exclusion for gain from certain small business stock (Cornell LII)",
      ],
    },
  },
  "section-1250": {
    name: "Section 1250",
    definition: {
      $$mdtype: "Tag",
      name: "p",
      attributes: {},
      children: [
        "Section of the U.S. tax code that describes the tax treatment of certain real estate gains.",
      ],
    },
    learnMore: {
      $$mdtype: "Tag",
      name: "a",
      attributes: { href: "https://www.law.cornell.edu/uscode/text/26/1250" },
      children: [
        "26 U.S. Code § 1250 - Gain from dispositions of certain depreciable realty (Cornell LII)",
      ],
    },
  },
  "section-199A": {
    name: "Section 199A",
    definition: {
      $$mdtype: "Tag",
      name: "p",
      attributes: {},
      children: [
        "Section of the U.S. tax code that allows individuals to ",
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "deduction" },
          children: ["deduct"],
        },
        " their ",
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "qualified-business-income" },
          children: ["qualified business income"],
        },
        ", up to a limit.",
      ],
    },
    learnMore: {
      $$mdtype: "Tag",
      name: "a",
      attributes: { href: "https://www.law.cornell.edu/uscode/text/26/199A" },
      children: [
        "26 U.S. Code § 199A - Qualified business income (Cornell LII)",
      ],
    },
  },
  "section-897": {
    name: "Section 897",
    definition: {
      $$mdtype: "Tag",
      name: "p",
      attributes: {},
      children: [
        "Section of the U.S. tax code that requires foreign individuals or corporations who own real estate in the U.S. to pay property tax on it.",
      ],
    },
    learnMore: {
      $$mdtype: "Tag",
      name: "a",
      attributes: { href: "https://www.law.cornell.edu/uscode/text/26/897" },
      children: [
        "26 U.S. Code § 897 - Disposition of investment in United States real property (Cornell LII)",
      ],
    },
  },
  security: {
    name: "Security",
    definition: {
      $$mdtype: "Tag",
      name: "p",
      attributes: {},
      children: [
        "In finance, a financial instrument with monetary value, such as stocks and bonds.",
      ],
    },
    learnMore: [
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: { href: "https://www.law.cornell.edu/wex/security" },
        children: ["security (Cornell LII)"],
      },
      " • ",
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: {
          href: "https://www.investopedia.com/terms/s/security.asp",
        },
        children: ["What Are Financial Securities? (Investopedia)"],
      },
    ],
  },
  "specified-private-activity-bond": {
    name: "Specified private activity bond",
    definition: [
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          "A ",
          {
            $$mdtype: "Tag",
            name: "strong",
            attributes: {},
            children: ["private activity bond"],
          },
          " is a bond issued to fund private business activity.",
        ],
      },
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          "A ",
          {
            $$mdtype: "Tag",
            name: "strong",
            attributes: {},
            children: ["specified"],
          },
          " private activity bond is one whose interest isn't included in ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "gross-income" },
            children: ["gross income"],
          },
          " under certain conditions.",
        ],
      },
    ],
    learnMore: [
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: {
          href: "https://www.law.cornell.edu/uscode/text/26/57#a_5_C",
        },
        children: [
          "26 U.S. Code § 57(a)(5)(C) - Specified private activity bonds (Cornell LII)",
        ],
      },
      " • ",
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: { href: "https://www.law.cornell.edu/uscode/text/26/141" },
        children: [
          "26 U.S. Code § 141 - Private activity bond; qualified bond (Cornell LII)",
        ],
      },
    ],
  },
  "tax-due": {
    name: "Tax due",
    definition: {
      $$mdtype: "Tag",
      name: "p",
      attributes: {},
      children: [
        "Amount you must pay to the IRS for the tax year.",
        " ",
        "If you already paid more than this amount, for example through ",
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "withholding" },
          children: ["withholding"],
        },
        " on your wages, then you'll receive a ",
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "tax-refund" },
          children: ["tax refund"],
        },
        " instead.",
      ],
    },
  },
  "tax-liability": {
    name: "Tax liability",
    definition: [
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          "Also called ",
          {
            $$mdtype: "Tag",
            name: "strong",
            attributes: {},
            children: ["tax obligation."],
          },
        ],
      },
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          "Sum of taxes you owe for the tax year.",
          " ",
          "This can be reduced by ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "credit" },
            children: ["tax credits"],
          },
          " to get your actual ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "tax-due" },
            children: ["tax due"],
          },
          ".",
        ],
      },
    ],
  },
  "tax-refund": {
    name: "Tax refund",
    definition: {
      $$mdtype: "Tag",
      name: "p",
      attributes: {},
      children: [
        "Amount the IRS pays back to you for the tax year.",
        " ",
        "This is how much you paid them in excess of your ",
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "tax-due" },
          children: ["tax due"],
        },
        ".",
      ],
    },
  },
  "taxable-income": {
    name: "Taxable income",
    definition: {
      $$mdtype: "Tag",
      name: "p",
      attributes: {},
      children: [
        "Amount of ",
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "income" },
          children: ["income"],
        },
        " used as the basis for computing ",
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "income-tax" },
          children: ["income tax"],
        },
        ".",
        " ",
        "For ",
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "federal-income-tax" },
          children: ["federal income tax"],
        },
        ", this is the amount left over after subtracting ",
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "deduction" },
          children: ["deductions"],
        },
        " from your ",
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "adjusted-gross-income" },
          children: ["adjusted gross income"],
        },
        ".",
      ],
    },
    learnMore: [
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: { href: "https://www.irs.gov/filing/taxable-income" },
        children: ["Taxable income (IRS.gov)"],
      },
      " • ",
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: {
          href: "https://www.irs.gov/businesses/small-businesses-self-employed/what-is-taxable-and-nontaxable-income",
        },
        children: ["What is taxable and nontaxable income? (IRS.gov)"],
      },
      " • ",
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: { href: "https://www.law.cornell.edu/wex/taxable_income" },
        children: ["taxable income (Cornell LII)"],
      },
    ],
  },
  wages: {
    name: "Wages",
    definition: [
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "income" },
            children: ["Income"],
          },
          " that an employee receives from their employer in exchange for their labor.",
          " ",
          "This includes essentially all forms of compensation: base pay, bonuses, commissions, tips, company equity, and other benefits.",
        ],
      },
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          "There are exceptions for certain types of labor, such as agricultural labor, or employers, such as the federal government.",
          " ",
          "In these cases the employee's income might be computed differently.",
        ],
      },
    ],
    learnMore: [
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: { href: "https://www.irs.gov/taxtopics/tc401" },
        children: ["Wages and salaries (IRS topic 401)"],
      },
      " • ",
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: { href: "https://www.law.cornell.edu/wex/wages" },
        children: ["wages (Cornell LII)"],
      },
    ],
  },
  "wash-sale": {
    name: "Wash sale",
    definition: {
      $$mdtype: "Tag",
      name: "p",
      attributes: {},
      children: [
        "Act of selling a ",
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "security" },
          children: ["security"],
        },
        ' at a loss and buying a "substantially identical" security within 30 days before or after the sale.',
        " ",
        "You can't claim ",
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "deduction" },
          children: ["tax deductions"],
        },
        " for losses from wash sales.",
        " ",
        "This rule is intended to prevent people from selling and immediately buying back securities just to reduce their taxes.",
      ],
    },
    learnMore: [
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: {
          href: "https://www.investor.gov/introduction-investing/investing-basics/glossary/wash-sales",
        },
        children: ["Wash Sales (Investor.gov)"],
      },
      " • ",
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: { href: "https://www.law.cornell.edu/wex/wash_sale" },
        children: ["wash sale (Cornell LII)"],
      },
    ],
  },
  withholding: {
    name: "Withholding",
    definition: [
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          "Practice where someone paying ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "income" },
            children: ["income"],
          },
          " to you sends a portion of the payment to the government to pay ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "income-tax" },
            children: ["income tax"],
          },
          " on your behalf.",
          " ",
          "For example, in the U.S., employers are usually required to withhold ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "federal-income-tax" },
            children: ["federal income tax"],
          },
          " on your ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "wages" },
            children: ["wages"],
          },
          " and report the withheld amount on ",
          {
            $$mdtype: "Tag",
            name: "FormLink",
            attributes: { formClass: "fW2" },
            children: ["Form W-2"],
          },
          ".",
        ],
      },
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          "Withholding doesn't change your ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "tax-liability" },
            children: ["tax liability"],
          },
          "; any withheld amount still counts as part of your ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "gross-income" },
            children: ["gross income"],
          },
          ".",
          " ",
          "It just lets the government collect the money sooner.",
        ],
      },
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
          "Different income taxes have different withholding rules governing who should withhold, when, and how much.",
          " ",
          "Not all income sources withhold taxes, and if you have multiple income sources then the combined withheld amount might be less than the actual tax you owe (because the income tax rate increases as your income increases).",
          " ",
          "So, it's important to plan ahead in order to avoid owing a large amount at the end of the tax year.",
        ],
      },
    ],
    learnMore: [
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: {
          href: "https://www.irs.gov/individuals/employees/tax-withholding",
        },
        children: ["Tax withholding (IRS.gov)"],
      },
      " • ",
      {
        $$mdtype: "Tag",
        name: "a",
        attributes: { href: "https://www.law.cornell.edu/wex/tax_withholding" },
        children: ["tax withholding (Cornell LII)"],
      },
    ],
  },
};
