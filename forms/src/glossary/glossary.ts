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
  income: {
    name: "Income",
    definition: makeProse(`
Generally speaking, any money that you receive.
For the purpose of taxation, this can also include the monetary value of non-monetary things, such as physical gifts.`),
  },
  "income-tax": {
    name: "Income tax",
    definition: makeProse(`
`),
  },
  "ordinary-dividends": { name: "Ordinary dividends", definition: "TODO" },
  "qualified-dividends": { name: "Qualified dividends", definition: "TODO" },
  "qualified-opportunity-fund": {
    name: "Qualified Opportunity Fund (QOF)",
    definition: "TODO",
  },
  "section-1202": { name: "Section 1202", definition: "TODO" },
  "section-1250": { name: "Section 1250", definition: "TODO" },
  "section-199A": { name: "Section 199A", definition: "TODO" },
  "section-897": { name: "Section 897", definition: "TODO" },
  "wash-sale": { name: "Wash sale", definition: "TODO" },
  withholding: { name: "Withholding", definition: "TODO" },
};
