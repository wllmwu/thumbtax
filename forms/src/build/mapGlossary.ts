import { Tag } from "@markdoc/markdoc";

import { GLOSSARY_TERMS } from "../types/glossaryTerm";
import { requireOneOf, requireString } from "./attributeRequires";
import { extractProse } from "./extractProse";
import { isTagNamed } from "./isTagNamed";

import type { GlossaryEntry } from "../types/glossaryEntry";
import type { GlossaryTerm } from "../types/glossaryTerm";
import type { RenderableTreeNode } from "@markdoc/markdoc";

function mapGlossaryEntry(entryNode: Tag): GlossaryEntry {
  const definitionNode = entryNode.children.find((child) =>
    isTagNamed(child, "definition"),
  );
  if (definitionNode === undefined) {
    throw new Error(
      `Glossary entry "${String(entryNode.attributes.term)}" is missing a definition`,
    );
  }
  return {
    name: requireString(entryNode.attributes.name),
    definition: extractProse(definitionNode),
  };
}

function assertGlossaryComplete(
  entries: Partial<Record<GlossaryTerm, GlossaryEntry>>,
): asserts entries is Record<GlossaryTerm, GlossaryEntry> {
  const missingTerms = GLOSSARY_TERMS.filter(
    (term) => entries[term] === undefined,
  );
  if (missingTerms.length > 0) {
    throw new Error(
      `Glossary is missing entries for: ${missingTerms.join(", ")}`,
    );
  }
}

export function mapGlossary(
  documentNode: RenderableTreeNode,
): Record<GlossaryTerm, GlossaryEntry> {
  if (!Tag.isTag(documentNode)) {
    throw new Error("Document is missing a glossary tag");
  }
  const glossaryNode = documentNode.children.find((child) =>
    isTagNamed(child, "glossary"),
  );
  if (glossaryNode === undefined) {
    throw new Error("Document is missing a glossary tag");
  }

  const entries: Partial<Record<GlossaryTerm, GlossaryEntry>> = {};
  for (const entryNode of glossaryNode.children.filter(Tag.isTag)) {
    const term = requireOneOf(entryNode.attributes.term, GLOSSARY_TERMS);
    entries[term] = mapGlossaryEntry(entryNode);
  }

  assertGlossaryComplete(entries);
  return entries;
}
