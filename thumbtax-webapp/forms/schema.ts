import type { Config, Node, NodeType, ValidationError } from "@markdoc/markdoc";

type ChildSpec = {
  nodeType: NodeType;
  tag?: string;
  attributes?: Record<string, unknown>;
};

function makeChildrenValidator(
  specs: Array<{
    optional?: boolean;
    greedy?: boolean;
    options: Array<ChildSpec>;
  }>,
  additionalValidation?: (node: Node) => ValidationError[],
): (node: Node) => ValidationError[] {
  return (node) => {
    let childIndex = 0;
    let specIndex = 0;
    let didSpecMatchPreviousChild = false;
    while (childIndex < node.children.length && specIndex < specs.length) {
      const child = node.children[childIndex];
      const specItem = specs[specIndex];
      const optionTypes = specItem.options
        .map(({ nodeType, tag }) => {
          if (nodeType === "tag") {
            return `tag(${tag})`;
          } else {
            return nodeType;
          }
        })
        .join(" | ");

      let error: ValidationError | undefined = undefined;
      const matchingTypeAndTag = specItem.options.filter(
        ({ nodeType, tag }) => nodeType === child.type && tag === child.tag,
      );
      if (matchingTypeAndTag.length === 0) {
        error = {
          id: "child-type",
          level: "error",
          message: `Child number ${childIndex + 1} should have type ${optionTypes}`,
        };
      } else if (
        !matchingTypeAndTag.some(
          ({ attributes }) =>
            !attributes ||
            Object.entries(attributes).every(
              ([attribute, value]) =>
                attribute in child.attributes &&
                child.attributes[attribute] === value,
            ),
        )
      ) {
        error = {
          id: "child-attributes",
          level: "error",
          message: `Child number ${childIndex + 1} should have attributes ${matchingTypeAndTag[0].attributes}`,
        };
      }

      if (error) {
        if (!specItem.optional && !specItem.greedy) {
          return [error];
        } else if (specItem.optional) {
          specIndex++;
          didSpecMatchPreviousChild = false;
        } else if (specItem.greedy) {
          if (!didSpecMatchPreviousChild) {
            return [error];
          } else {
            specIndex++;
            didSpecMatchPreviousChild = false;
          }
        } else {
          specIndex++;
          didSpecMatchPreviousChild = false;
        }
      } else {
        childIndex++;
        if (specItem.greedy) {
          didSpecMatchPreviousChild = true;
        } else {
          specIndex++;
          didSpecMatchPreviousChild = false;
        }
      }
    }

    if (
      specIndex < specs.length &&
      !specs[specIndex].greedy &&
      specs.slice(specIndex).some(({ optional }) => !optional)
    ) {
      return [
        {
          id: "missing-required-child",
          level: "error",
          message: "Missing at least one required child",
        },
      ];
    } else if (childIndex < node.children.length) {
      return [
        {
          id: "extra-child",
          level: "error",
          message: `Node has unexpected children starting with child number ${childIndex + 1}`,
        },
      ];
    }

    if (additionalValidation) {
      return additionalValidation(node);
    }
    return [];
  };
}

export const config: Config = {
  tags: {
    form: {
      attributes: {
        class: {
          type: "String",
          required: true,
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
      validate: makeChildrenValidator([
        { options: [{ nodeType: "heading", attributes: { level: 1 } }] },
        { optional: true, options: [{ nodeType: "tag", tag: "subtitle" }] },
        { optional: true, options: [{ nodeType: "tag", tag: "instructions" }] },
        { optional: true, options: [{ nodeType: "tag", tag: "commentary" }] },
        { greedy: true, options: [{ nodeType: "tag", tag: "section" }] },
      ]),
    },
    section: {
      validate: makeChildrenValidator(
        [
          { options: [{ nodeType: "heading", attributes: { level: 2 } }] },
          { optional: true, options: [{ nodeType: "tag", tag: "columns" }] },
          { greedy: true, options: [{ nodeType: "tag", tag: "line" }] },
        ],
        (node) => {
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
              const lineColumns = line.children.reduce<string[]>(
                (acc, curr) => {
                  if (
                    curr.type === "tag" &&
                    curr.tag === "box" &&
                    typeof curr.attributes.column === "string"
                  ) {
                    acc.push(curr.attributes.column);
                  }
                  return acc;
                },
                [],
              );
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
      ),
    },
    columns: {
      validate: makeChildrenValidator([
        { greedy: true, options: [{ nodeType: "tag", tag: "column" }] },
      ]),
    },
    column: {
      attributes: {
        index: {
          type: "String",
          required: true,
          errorLevel: "error",
        },
      },
      validate: makeChildrenValidator([
        { options: [{ nodeType: "paragraph" }] },
      ]),
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
      validate: makeChildrenValidator([
        { optional: true, options: [{ nodeType: "tag", tag: "instructions" }] },
        { optional: true, options: [{ nodeType: "tag", tag: "commentary" }] },
        { greedy: true, options: [{ nodeType: "tag", tag: "box" }] },
      ]),
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
          matches: ["checkbox", "financial", "percentage", "plain", "yes_no"],
          errorLevel: "error",
        },
      },
      validate: makeChildrenValidator([
        { options: [{ nodeType: "tag", tag: "value" }] },
      ]),
    },
    value: {},
    subtitle: {
      validate: makeChildrenValidator([
        { options: [{ nodeType: "paragraph" }] },
      ]),
    },
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
