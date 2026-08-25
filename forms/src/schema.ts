import { nodes, parse } from "@markdoc/markdoc";
import { BOX_FORMATS, FORM_CLASSES } from "@thumbtax/common";

import alternativeMinimumTaxComputationPartial from "./data/partials/alternativeMinimumTaxComputation.mdoc";
import taxComputationPartial from "./data/partials/taxComputation.mdoc";
import { formLinkTag, glossaryLinkTag } from "./schema/contentTags";
import { makeTransformer } from "./schema/makeTransformer";
import { unwrapInlineTags } from "./schema/unwrapInlineTagChildren";
import { unwrapListItemChildren } from "./schema/unwrapListItemChildren";
import { unwrapParagraphChild } from "./schema/unwrapParagraphChild";
import { validateChildren } from "./schema/validateChildren";
import { validatePlainTextContent } from "./schema/validatePlainTextContent";
import { validateProseContent } from "./schema/validateProseContent";
import { optionTag, pieceTag, valueTag } from "./schema/valueTag";
import { GLOSSARY_TERMS } from "./types/glossaryTerm";

import type { GlossaryTerm } from "./types/glossaryTerm";
import type { Config, ValidationError } from "@markdoc/markdoc";

export const config: Config = {
  nodes: {
    heading: {
      ...nodes.heading,
      validate: validatePlainTextContent,
    },
  },
  tags: {
    form: {
      attributes: {
        category: {
          type: "String",
          required: true,
          matches: ["income", "taxes"],
          errorLevel: "error",
        },
        class: {
          type: "String",
          required: true,
          matches: [...FORM_CLASSES],
          errorLevel: "error",
        },
        irsPageUrl: {
          type: "String",
          required: true,
          errorLevel: "error",
        },
        maxInstances: {
          type: "Number",
        },
      },
      transform: makeTransformer("form", unwrapInlineTags),
      validate(node) {
        return validateChildren(unwrapInlineTags(node.children), [
          { options: [{ nodeType: "heading", attributes: { level: 1 } }] },
          { optional: true, options: [{ nodeType: "tag", tag: "subtitle" }] },
          {
            optional: true,
            options: [{ nodeType: "tag", tag: "instructions" }],
          },
          { optional: true, options: [{ nodeType: "tag", tag: "commentary" }] },
          { greedy: true, options: [{ nodeType: "tag", tag: "section" }] },
        ]);
      },
    },
    section: {
      transform: makeTransformer("section", unwrapInlineTags),
      validate(node) {
        const childErrors = validateChildren(unwrapInlineTags(node.children), [
          {
            optional: true,
            options: [{ nodeType: "heading", attributes: { level: 2 } }],
          },
          {
            optional: true,
            options: [{ nodeType: "tag", tag: "subtitle" }],
          },
          {
            optional: true,
            options: [{ nodeType: "tag", tag: "instructions" }],
          },
          { optional: true, options: [{ nodeType: "tag", tag: "commentary" }] },
          { optional: true, options: [{ nodeType: "tag", tag: "columns" }] },
          { options: [{ nodeType: "tag", tag: "lines" }] },
        ]);
        if (childErrors.length > 0) {
          return childErrors;
        }

        const maybeColumnsTag = node.children.at(1);
        if (
          maybeColumnsTag?.type === "tag" &&
          maybeColumnsTag?.tag === "columns"
        ) {
          const sectionColumns = maybeColumnsTag.children.reduce<string[]>(
            (acc, curr) => {
              if (
                curr.type === "tag" &&
                curr.tag === "column" &&
                typeof curr.attributes.index === "string"
              ) {
                acc.push(curr.attributes.index);
              }
              return acc;
            },
            [],
          );
          const lines = unwrapListItemChildren(node.children[2].children);
          for (const line of lines) {
            const lineColumns = line.children.reduce<string[]>((acc, curr) => {
              if (
                curr.type === "tag" &&
                curr.tag === "box" &&
                typeof curr.attributes.column === "string"
              ) {
                acc.push(curr.attributes.column);
              }
              return acc;
            }, []);
            if (
              lineColumns.length !== sectionColumns.length ||
              !lineColumns.every(
                (column, index) => column === sectionColumns[index],
              )
            ) {
              return [
                {
                  id: "line-columns",
                  level: "error",
                  message: `Line ${line.attributes.index} should have columns ${JSON.stringify(sectionColumns)}`,
                },
              ];
            }
          }
        } else {
          const lines = unwrapListItemChildren(node.children[1].children);
          for (const line of lines) {
            const boxes = line.children.filter(
              (child) => child.type === "tag" && child.tag === "box",
            );
            if (
              boxes.length !== 1 ||
              boxes.some(
                ({ attributes }) => typeof attributes.column === "string",
              )
            ) {
              return [
                {
                  id: "line-no-columns",
                  level: "error",
                  message: `Line ${line.attributes.index} should have 1 box with no column`,
                },
              ];
            }
          }
        }
        return [];
      },
    },
    columns: {
      children: ["list"],
      transform: makeTransformer("columns", unwrapListItemChildren),
      validate(node) {
        return validateChildren(unwrapListItemChildren(node.children), [
          { greedy: true, options: [{ nodeType: "tag", tag: "column" }] },
        ]);
      },
    },
    column: {
      attributes: {
        index: {
          type: "String",
          required: true,
          errorLevel: "error",
        },
      },
      transform: makeTransformer("column", unwrapInlineTags),
      validate(node) {
        return validateChildren(unwrapInlineTags(node.children), [
          {
            optional: true,
            options: [{ nodeType: "tag", tag: "instructions" }],
          },
        ]);
      },
    },
    lines: {
      transform: makeTransformer("lines", unwrapListItemChildren),
      validate(node) {
        return validateChildren(unwrapListItemChildren(node.children), [
          { greedy: true, options: [{ nodeType: "tag", tag: "line" }] },
        ]);
      },
    },
    line: {
      attributes: {
        index: {
          type: "String",
          required: true,
          errorLevel: "error",
        },
        virtual: {
          type: "Boolean",
          default: false,
        },
      },
      transform: makeTransformer("line", unwrapListItemChildren),
      validate(node) {
        return validateChildren(unwrapListItemChildren(node.children), [
          {
            optional: true,
            options: [{ nodeType: "tag", tag: "instructions" }],
          },
          { optional: true, options: [{ nodeType: "tag", tag: "commentary" }] },
          { greedy: true, options: [{ nodeType: "tag", tag: "box" }] },
        ]);
      },
    },
    box: {
      attributes: {
        identifier: {
          type: "String",
          required: true,
          errorLevel: "error",
        },
        column: {
          type: "String",
        },
        format: {
          type: "String",
          matches: [...BOX_FORMATS],
          errorLevel: "error",
        },
      },
      transform: makeTransformer("box", unwrapInlineTags),
      validate(node) {
        return validateChildren(unwrapInlineTags(node.children), [
          {
            options: [
              { nodeType: "tag", tag: "value" },
              { nodeType: "tag", tag: "partial" },
            ],
          },
        ]);
      },
    },
    value: valueTag,
    piece: pieceTag,
    option: optionTag,
    subtitle: {
      transform: makeTransformer("subtitle"),
      validate: validatePlainTextContent,
    },
    instructions: {
      transform: makeTransformer("instructions"),
      validate: validateProseContent,
    },
    commentary: {
      transform: makeTransformer("commentary"),
      validate: validateProseContent,
    },
    formLink: formLinkTag,
    glossaryLink: glossaryLinkTag,
    glossary: {
      transform: makeTransformer("glossary", unwrapListItemChildren),
      validate(node) {
        const children = unwrapListItemChildren(node.children);
        const childErrors = validateChildren(children, [
          {
            greedy: true,
            options: [{ nodeType: "tag", tag: "glossaryEntry" }],
          },
        ]);
        if (childErrors.length > 0) {
          return childErrors;
        }

        const termErrors: ValidationError[] = [];

        const allTerms = new Set(GLOSSARY_TERMS);
        const foundTerms = new Set<GlossaryTerm>();
        for (const child of children) {
          const term = child.attributes?.term;
          if (!term) {
            continue;
          }
          if (foundTerms.has(term)) {
            termErrors.push({
              id: "duplicate-glossary-term",
              level: "error",
              message: `Term ${term} appears more than once`,
            });
          }
          foundTerms.add(term);
        }
        const missingTerms = allTerms.difference(foundTerms);
        if (missingTerms.size > 0) {
          termErrors.push({
            id: "glossary-entry-missing",
            level: "error",
            message: `Missing entries for: ${missingTerms.values().toArray().join(", ")}`,
          });
        }

        for (let i = 0; i < children.length - 1; i++) {
          const termA = children[i].attributes?.term;
          const termB = children[i + 1].attributes?.term;
          const nameA = children[i].attributes?.name;
          const nameB = children[i + 1].attributes?.name;
          if (typeof nameA !== "string" || typeof nameB !== "string") {
            continue;
          }
          const comparison = nameA.localeCompare(nameB);
          if (comparison === 0) {
            termErrors.push({
              id: "terms-same-name",
              level: "error",
              message: `Terms ${termA} and ${termB} have the same name`,
            });
          } else if (comparison > 0) {
            termErrors.push({
              id: "terms-out-of-order",
              level: "error",
              message: `Terms ${termA} and ${termB} are not in locale order`,
            });
          }
        }

        return termErrors;
      },
    },
    glossaryEntry: {
      attributes: {
        term: {
          type: "String",
          matches: [...GLOSSARY_TERMS],
          required: true,
          errorLevel: "error",
        },
        name: {
          type: "String",
          required: true,
          errorLevel: "error",
        },
      },
      transform: makeTransformer("glossaryEntry", unwrapListItemChildren),
      validate(node) {
        return validateChildren(unwrapListItemChildren(node.children), [
          { options: [{ nodeType: "tag", tag: "definition" }] },
          { optional: true, options: [{ nodeType: "tag", tag: "learnMore" }] },
        ]);
      },
    },
    definition: {
      transform: makeTransformer("definition"),
      validate: validateProseContent,
    },
    learnMore: {
      transform: makeTransformer("learnMore", unwrapParagraphChild),
      validate(node) {
        return validateChildren(unwrapParagraphChild(node.children), [
          {
            greedy: true,
            options: [{ nodeType: "link" }, { nodeType: "text" }],
          },
        ]);
      },
    },
  },
  partials: {
    alternativeMinimumTaxComputation: parse(
      alternativeMinimumTaxComputationPartial,
    ),
    taxComputation: parse(taxComputationPartial),
  },
};
