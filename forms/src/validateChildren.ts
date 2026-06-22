import type { Node, NodeType, ValidationError } from "@markdoc/markdoc";

type ChildSpec = {
  nodeType: NodeType;
  tag?: string;
  attributes?: Record<string, unknown>;
};

export function validateChildren(
  node: Node,
  specs: Array<{
    optional?: boolean;
    greedy?: boolean;
    options: Array<ChildSpec>;
  }>,
): ValidationError[] {
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

  return [];
}
