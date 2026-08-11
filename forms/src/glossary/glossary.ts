import type { GlossaryTerm } from "../types/glossaryTerm";
import type { RenderableTreeNode } from "@markdoc/markdoc";

type GlossaryEntry = {
  name: string;
  definition: RenderableTreeNode;
};

export const glossary: Record<GlossaryTerm, GlossaryEntry> = {
  "capital-gain": { name: "Capital gain", definition: "TODO" },
  collectibles: { name: "Collectibles", definition: "TODO" },
  dividends: { name: "Dividends", definition: "TODO" },
  "federal-income-tax": { name: "Federal income tax", definition: "TODO" },
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
