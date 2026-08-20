export const GLOSSARY_TERMS = [
  "capital-gain",
  "collectibles",
  "dividend",
  "federal-income-tax",
  "income",
  "income-tax",
  "ordinary-dividends",
  "qualified-dividends",
  "qualified-opportunity-fund",
  "section-1202",
  "section-1250",
  "section-199A",
  "section-897",
  "wash-sale",
  "withholding",
] as const;

export type GlossaryTerm = (typeof GLOSSARY_TERMS)[number];
