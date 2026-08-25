import type { GlossaryEntry } from "../types/glossaryEntry";
import type { GlossaryTerm } from "../types/glossaryTerm";

export const glossary: Record<GlossaryTerm, GlossaryEntry> = {
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
  deduction: {
    name: "Deduction",
    definition: {
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
        "Tax on ",
        {
          $$mdtype: "Tag",
          name: "GlossaryLink",
          attributes: { term: "income" },
          children: ["income"],
        },
        ".",
        " ",
        "There are many types of income tax that apply to different sources of income.",
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
          "If you receive dividends, the payor reports what amount is ordinary vs. qualified on ",
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
          "If you receive dividends, the payor reports what amount is ordinary vs. qualified on ",
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
          "For example, in the U.S., employers are usually required to withhold income tax on your ",
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
          " ",
          "Any withheld amount is still included in your ",
          {
            $$mdtype: "Tag",
            name: "GlossaryLink",
            attributes: { term: "gross-income" },
            children: ["gross income"],
          },
          ".",
        ],
      },
      {
        $$mdtype: "Tag",
        name: "p",
        attributes: {},
        children: [
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
