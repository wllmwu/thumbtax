import { makeProse } from "./makeProse";

import type { GlossaryTerm } from "../types/glossaryTerm";
import type { RenderableTreeNodes } from "@markdoc/markdoc";

type GlossaryEntry = {
  name: string;
  definition: RenderableTreeNodes;
};

export const glossary: Record<GlossaryTerm, GlossaryEntry> = {
  "capital-gain": {
    name: "Capital gain",
    definition: makeProse(`
Profit from selling capital assets, such as a home, a vehicle, stocks, or bonds.
Capital gain is considered {% glossarylink term="income" %}income{% /glossarylink %} and subject to {% glossarylink term="income-tax" %}income tax{% /glossarylink %}.

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
Long-term {% glossarylink term="capital-gain" %}capital gains{% /glossarylink %} earned from selling collectibles are taxed at a special rate, up to 28%.`),
  },
  deduction: {
    name: "Deduction",
    definition: "TODO",
  },
  dividend: {
    name: "Dividend",
    definition: makeProse(`
Payment from a corporation to its shareholders.
Corporations often invest some of their profits back into the company and distribute the rest as dividends.

{% glossarylink term="ordinary-dividends" %}Ordinary{% /glossarylink %} and {% glossarylink term="qualified-dividends" %}qualified dividends{% /glossarylink %} are taxed at different rates.`),
  },
  "federal-income-tax": {
    name: "Federal income tax",
    definition: makeProse(`
{% glossarylink term="income-tax" %}Income tax{% /glossarylink %} levied by the federal government.
It is a **progressive tax,** meaning the tax rate increases as your income increases.
In particular, your income is separated into brackets, and the money in each bracket is taxed at a specific percentage.`),
  },
  "gross-income": {
    name: "Gross income",
    definition: "TODO",
  },
  income: {
    name: "Income",
    definition: makeProse(`
Generally speaking, any money that you receive.
For the purpose of taxation, this can also include the monetary value of non-monetary things, such as physical gifts.`),
  },
  "income-tax": {
    name: "Income tax",
    definition: makeProse(`
Tax on {% glossarylink term="income" %}income{% /glossarylink %}.
There are many types of income tax that apply to different sources of income.`),
  },
  "ordinary-dividends": {
    name: "Ordinary dividends",
    definition: makeProse(`
{% glossarylink term="dividend" %}Dividends{% /glossarylink %} that are not {% glossarylink term="qualified-dividends" %}qualified dividends{% /glossarylink %}.
Ordinary dividends are {% glossarylink term="income-tax" %}taxed as regular income{% /glossarylink %}, whereas qualified dividends are taxed as {% glossarylink term="capital-gain" %}capital gains{% /glossarylink %}.
In other words, dividends are ordinary by default unless they "qualify" for the capital gains tax by meeting certain conditions.

If you receive dividends, the payor reports what amount is ordinary vs. qualified on {% formlink formClass="f1099DIV" %}Form 1099-DIV{% /formlink %}.`),
  },
  "qualified-business-income": {
    name: "Qualified business income",
    definition: "TODO",
  },
  "qualified-dividends": {
    name: "Qualified dividends",
    definition: makeProse(`
{% glossarylink term="dividend" %}Dividends{% /glossarylink %} that "qualify" as {% glossarylink term="capital-gain" %}capital gains{% /glossarylink %} instead of ordinary income ({% glossarylink term="ordinary-dividends" %}ordinary dividends{% /glossarylink %}).
If you receive dividends, the payor reports what amount is ordinary vs. qualified on {% formlink formClass="f1099DIV" %}Form 1099-DIV{% /formlink %}.

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
    definition: "TODO",
  },
  "section-1202": {
    name: "Section 1202",
    definition: makeProse(`
Section of the U.S. tax code that allows individuals to exclude from {% glossarylink term="gross-income" %}gross income{% /glossarylink %} certain gains from the sale or exchange of {% glossarylink term="qualified-small-business-stock" %}qualified small business stock{% /glossarylink %}.`),
  },
  "section-1250": {
    name: "Section 1250",
    definition: makeProse(`
Section of the U.S. tax code that describes the tax treatment of certain real estate gains.`),
  },
  "section-199A": {
    name: "Section 199A",
    definition: makeProse(`
Section of the U.S. tax code that allows individuals to {% glossarylink term="deduction" %}deduct{% /glossarylink %} their {% glossarylink term="qualified-business-income" %}qualified business income{% /glossarylink %}, up to a limit.`),
  },
  "section-897": {
    name: "Section 897",
    definition: makeProse(`
Section of the U.S. tax code that requires foreign individuals or corporations who own real estate in the U.S. to pay property tax on it.`),
  },
  security: {
    name: "Security",
    definition: "TODO",
  },
  "tax-withholding": {
    name: "Withholding",
    definition: makeProse(`
Practice where someone paying {% glossarylink term="income" %}income{% /glossarylink %} to you sends a portion of the payment to the government to pay {% glossarylink term="income-tax" %}income tax{% /glossarylink %} on your behalf.
For example, in the U.S., employers are usually required to withhold income tax on your {% glossarylink term="wages" %}wages{% /glossarylink %} and report the withheld amount on {% formlink formClass="fW2" %}Form W-2{% /formlink %}.

Not all income sources withhold taxes, and if you have multiple income sources then the combined withheld amount might be less than the actual tax you owe (because the income tax rate increases as your income increases).
So, it's important to plan ahead in order to avoid owing a large amount at the end of the tax year.`),
  },
  wages: {
    name: "Wages",
    definition: "TODO",
  },
  "wash-sale": {
    name: "Wash sale",
    definition: makeProse(`
Act of selling a {% glossarylink term="security" %}security{% /glossarylink %} at a loss and buying a "substantially identical" security within 30 days before or after the sale.
You can't claim tax {% glossarylink term="deduction" %}deductions{% /glossarylink %} for losses from wash sales.
This rule is intended to prevent people from selling and immediately buying back securities just to reduce their taxes.`),
  },
};
