import { BOX_FORMATS, FORM_CLASSES } from "@thumbtax/common";

import { unwrapInlineTags } from "./schema/unwrapInlineTagChildren";
import { validateChildren } from "./schema/validateChildren";
import { optionTag, pieceTag, valueTag } from "./schema/valueTag";

import type { Config } from "@markdoc/markdoc";

export const config: Config = {
  tags: {
    form: {
      attributes: {
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
        category: {
          type: "String",
          required: true,
          matches: ["income", "taxes"],
          errorLevel: "error",
        },
        maxInstances: {
          type: "Number",
        },
      },
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
      validate(node) {
        const childErrors = validateChildren(unwrapInlineTags(node.children), [
          { options: [{ nodeType: "heading", attributes: { level: 2 } }] },
          { optional: true, options: [{ nodeType: "tag", tag: "columns" }] },
          { greedy: true, options: [{ nodeType: "tag", tag: "line" }] },
        ]);
        if (childErrors) {
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
          for (const line of node.children.slice(2)) {
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
          for (const line of node.children.slice(1)) {
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
      validate(node) {
        return validateChildren(unwrapInlineTags(node.children), [
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
      validate(node) {
        return validateChildren(unwrapInlineTags(node.children), [
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
      validate(node) {
        return validateChildren(unwrapInlineTags(node.children), [
          { options: [{ nodeType: "tag", tag: "value" }] },
        ]);
      },
    },
    value: valueTag,
    piece: pieceTag,
    option: optionTag,
    subtitle: {},
    instructions: {},
    commentary: {
      attributes: {
        lessCommon: {
          type: "Boolean",
          default: false,
          errorLevel: "error",
        },
      },
    },
  },
};
