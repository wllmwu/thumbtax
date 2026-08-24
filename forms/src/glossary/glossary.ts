import { makeProse } from "./makeProse";

import type { GlossaryTerm } from "../types/glossaryTerm";
import type { RenderableTreeNodes } from "@markdoc/markdoc";

type GlossaryEntry = {
  name: string;
  definition: RenderableTreeNodes;
};

export const glossary: Record<GlossaryTerm, GlossaryEntry> = {
  "adjusted-gross-income": {
    name: "Adjusted gross income (AGI)",
    definition: makeProse(`
Amount of {% glossaryLink term="gross-income" %}gross income{% /glossaryLink %} after applying {% glossaryLink term="adjustment" %}adjustments{% /glossaryLink %}.
After computing this value, you subtract {% glossaryLink term="deduction" %}deductions{% /glossaryLink %} from it to get your {% glossaryLink term="taxable-income" %}taxable income{% /glossaryLink %}.`),
  },
  adjustment: {
    name: "Adjustment",
    definition: makeProse(`
Amount added to or subtracted from {% glossaryLink term="gross-income" %}gross income{% /glossaryLink %} to compute {% glossaryLink term="adjusted-gross-income" %}adjusted gross income{% /glossaryLink %}.
The law designates certain categories of expenses, contributions, and received payments as adjustments, enumerated in {% formLink formClass="f1040s1" %}Schedule 1 (Form 1040){% /formLink %}.`),
  },
  "capital-gain": {
    name: "Capital gain",
    definition: makeProse(`
Profit from selling capital assets, such as a home, a vehicle, stocks, or bonds.
Capital gain is considered {% glossaryLink term="income" %}income{% /glossaryLink %} and subject to {% glossaryLink term="income-tax" %}income tax{% /glossaryLink %}.

You earn capital gain when you sell the asset for more than it cost you to buy it.
If you sell it for less than it cost, then it's a **capital loss,** which can decrease your income and income tax up to a limit.

You have to sell ("realize") the asset in order to incur capital gain or loss.
Changes in the asset's value while you still own it don't count as income.

The tax rate for capital gains differs depending on how long you held the asset.
Typically, **short-term capital gains** are held for one year or less and are taxed as regular income.
**Long-term capital gains** are held for more than one year and are taxed at a lower rate.`),
  },
  collectibles: {
    name: "Collectibles",
    definition: makeProse(`
Category of capital asset that includes works of art, stamps, coins, cards, precious metals and gemstones, antiques, and other rare items.
Long-term {% glossaryLink term="capital-gain" %}capital gains{% /glossaryLink %} earned from selling collectibles are taxed at a special rate, up to 28%.`),
  },
  deduction: {
    name: "Deduction",
    definition: makeProse(`
Amount subtracted from {% glossaryLink term="adjusted-gross-income" %}adjusted gross income{% /glossaryLink %} to compute {% glossaryLink term="taxable-income" %}taxable income{% /glossaryLink %}.
You can typically deduct things like capital losses, business expenses, healthcare costs, other taxes you paid, and donations to charity, up to a limit.
For {% glossaryLink term="federal-income-tax" %}federal income tax{% /glossaryLink %}, you choose between the **standard deduction** (a fixed amount) and **itemized deductions** (precise amounts computed in {% formLink formClass="f1040sA" %}Schedule A (Form 1040){% /formLink %}) depending on which is larger.`),
  },
  dividend: {
    name: "Dividend",
    definition: makeProse(`
Payment from a corporation to its shareholders.
Corporations often invest some of their profits back into the company and distribute the rest as dividends.

{% glossaryLink term="ordinary-dividends" %}Ordinary{% /glossaryLink %} and {% glossaryLink term="qualified-dividends" %}qualified dividends{% /glossaryLink %} are taxed at different rates.`),
  },
  "federal-income-tax": {
    name: "Federal income tax",
    definition: makeProse(`
{% glossaryLink term="income-tax" %}Income tax{% /glossaryLink %} levied by the federal government.
It is a **progressive tax,** meaning the tax rate increases as your income increases.
In particular, your income is separated into brackets, and the money in each bracket is taxed at a specific percentage.`),
  },
  "gross-income": {
    name: "Gross income",
    definition: makeProse(`
Also called **total income.**

For **individuals,** total amount of {% glossaryLink term="income" %}income{% /glossaryLink %} during the tax year.
This generally includes all income from almost all sources, such as {% glossaryLink term="wages" %}wages{% /glossaryLink %}, {% glossaryLink term="capital-gain" %}capital gains{% /glossaryLink %}, and {% glossaryLink term="dividend" %}dividends{% /glossaryLink %}.
However, certain sources are excluded, such as gifts and child support.

After you compute your gross income, you apply {% glossaryLink term="adjustment" %}adjustments{% /glossaryLink %} to get your {% glossaryLink term="adjusted-gross-income" %}adjusted gross income{% /glossaryLink %}.

For **businesses,** revenue minus cost of goods sold.`),
  },
  income: {
    name: "Income",
    definition: makeProse(`
Generally speaking, any money that you receive.
For the purpose of taxation, this can also include the cash value of non-monetary things, such as physical gifts.`),
  },
  "income-tax": {
    name: "Income tax",
    definition: makeProse(`
Tax on {% glossaryLink term="income" %}income{% /glossaryLink %}.
There are many types of income tax that apply to different sources of income.`),
  },
  "ordinary-dividends": {
    name: "Ordinary dividends",
    definition: makeProse(`
{% glossaryLink term="dividend" %}Dividends{% /glossaryLink %} that are not {% glossaryLink term="qualified-dividends" %}qualified dividends{% /glossaryLink %}.
Ordinary dividends are {% glossaryLink term="income-tax" %}taxed as regular income{% /glossaryLink %}, whereas qualified dividends are taxed as {% glossaryLink term="capital-gain" %}capital gains{% /glossaryLink %}.
In other words, dividends are ordinary by default unless they "qualify" for the capital gains tax by meeting certain conditions.

If you receive dividends, the payor reports what amount is ordinary vs. qualified on {% formLink formClass="f1099DIV" %}Form 1099-DIV{% /formLink %}.`),
  },
  "qualified-business-income": {
    name: "Qualified business income (QBI)",
    definition: makeProse(`
Broadly, income from self-employment or small business ownership, excluding certain items and subject to certain conditions and limits.
Eligible individuals can {% glossaryLink term="deduction" %}deduct{% /glossaryLink %} their QBI to reduce their taxes.`),
  },
  "qualified-dividends": {
    name: "Qualified dividends",
    definition: makeProse(`
{% glossaryLink term="dividend" %}Dividends{% /glossaryLink %} that "qualify" as {% glossaryLink term="capital-gain" %}capital gains{% /glossaryLink %} instead of ordinary income ({% glossaryLink term="ordinary-dividends" %}ordinary dividends{% /glossaryLink %}).
If you receive dividends, the payor reports what amount is ordinary vs. qualified on {% formLink formClass="f1099DIV" %}Form 1099-DIV{% /formLink %}.

Specifically, a dividend is qualified if you held the stock for more than 60 days in the 121 day period starting 60 days before its **ex-dividend date,** which is one market day before its **record date,** which is the date that you must be marked as a shareholder in the company's records in order to receive the dividend.`),
  },
  "qualified-opportunity-fund": {
    name: "Qualified Opportunity Fund (QOF)",
    definition: makeProse(`
Fund that invests in **Qualified Opportunity Zones,** which are "economically distressed communities" designated by the U.S. government.
QOFs are meant to incentivize investment into these regions, so you can defer taxes on contributions you make to a QOF.`),
  },
  "qualified-small-business-stock": {
    name: "Qualified small business stock",
    definition: makeProse(`
Shares in a qualified small business that have tax benefits for the {% glossaryLink term="capital-gain" %}capital gains{% /glossaryLink %} tax under certain conditions.`),
  },
  "section-1202": {
    name: "Section 1202",
    definition: makeProse(`
Section of the U.S. tax code that allows individuals to exclude from {% glossaryLink term="gross-income" %}gross income{% /glossaryLink %} certain gains from the sale or exchange of {% glossaryLink term="qualified-small-business-stock" %}qualified small business stock{% /glossaryLink %}.`),
  },
  "section-1250": {
    name: "Section 1250",
    definition: makeProse(`
Section of the U.S. tax code that describes the tax treatment of certain real estate gains.`),
  },
  "section-199A": {
    name: "Section 199A",
    definition: makeProse(`
Section of the U.S. tax code that allows individuals to {% glossaryLink term="deduction" %}deduct{% /glossaryLink %} their {% glossaryLink term="qualified-business-income" %}qualified business income{% /glossaryLink %}, up to a limit.`),
  },
  "section-897": {
    name: "Section 897",
    definition: makeProse(`
Section of the U.S. tax code that requires foreign individuals or corporations who own real estate in the U.S. to pay property tax on it.`),
  },
  security: {
    name: "Security",
    definition: makeProse(`
In finance, a financial instrument with monetary value, such as stocks and bonds.`),
  },
  "taxable-income": {
    name: "Taxable income",
    definition: makeProse(`
Amount of {% glossaryLink term="income" %}income{% /glossaryLink %} used as the basis for computing {% glossaryLink term="income-tax" %}income tax{% /glossaryLink %}.
For {% glossaryLink term="federal-income-tax" %}federal income tax{% /glossaryLink %}, this is the amount left over after subtracting {% glossaryLink term="deduction" %}deductions{% /glossaryLink %} from your {% glossaryLink term="adjusted-gross-income" %}adjusted gross income{% /glossaryLink %}.`),
  },
  wages: {
    name: "Wages",
    definition: makeProse(`
{% glossaryLink term="income" %}Income{% /glossaryLink %} that an employee receives from their employer in exchange for their labor.
This includes essentially all forms of compensation: base pay, bonuses, commissions, tips, company equity, and other benefits.

There are exceptions for certain types of labor, such as agricultural labor, or employers, such as the federal government.
In these cases the employee's income might be computed differently.`),
  },
  "wash-sale": {
    name: "Wash sale",
    definition: makeProse(`
Act of selling a {% glossaryLink term="security" %}security{% /glossaryLink %} at a loss and buying a "substantially identical" security within 30 days before or after the sale.
You can't claim {% glossaryLink term="deduction" %}tax deductions{% /glossaryLink %} for losses from wash sales.
This rule is intended to prevent people from selling and immediately buying back securities just to reduce their taxes.`),
  },
  withholding: {
    name: "Withholding",
    definition: makeProse(`
Practice where someone paying {% glossaryLink term="income" %}income{% /glossaryLink %} to you sends a portion of the payment to the government to pay {% glossaryLink term="income-tax" %}income tax{% /glossaryLink %} on your behalf.
For example, in the U.S., employers are usually required to withhold income tax on your {% glossaryLink term="wages" %}wages{% /glossaryLink %} and report the withheld amount on {% formLink formClass="fW2" %}Form W-2{% /formLink %}.

Not all income sources withhold taxes, and if you have multiple income sources then the combined withheld amount might be less than the actual tax you owe (because the income tax rate increases as your income increases).
So, it's important to plan ahead in order to avoid owing a large amount at the end of the tax year.`),
  },
};
