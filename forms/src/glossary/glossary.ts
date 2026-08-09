import type { GlossaryTerm } from "../types/glossaryTerm";
import type { RenderableTreeNode } from "@markdoc/markdoc";

type GlossaryEntry = {
  name: string;
  definition: RenderableTreeNode;
};

export const glossary: Record<GlossaryTerm, GlossaryEntry> = {
  test1: { name: "Test 1", definition: "Test 1 definition" },
  test2: { name: "Test 2", definition: "Test 2 definition" },
};
