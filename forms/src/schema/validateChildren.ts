import type { Node, NodeType, ValidationError } from "@markdoc/markdoc";

type ChildSpec = {
  nodeType: NodeType;
  tag?: string;
  attributes?: Record<string, unknown>;
};

function formatOptions(options: ChildSpec[]): string {
  return options
    .map(({ nodeType, tag }) => {
      if (nodeType === "tag" && tag) {
        return `tag(${tag})`;
      } else {
        return nodeType;
      }
    })
    .join(" | ");
}

/**
 * Validates the given Markdoc nodes.
 *
 * The `specs` parameter acts like a regular expression matching against `children`.
 * Each element of `specs` describes what child nodes are allowed at that position.
 *
 * The `options` field specifies the allowed child types and required attributes.
 * The actual attributes must be a superset of the specified attributes.
 * When the type is `"tag"`, it can further specify what kind of tag.
 * When multiple options are provided, a child at that position is accepted if it matches any of them.
 *
 * The `optional` and `greedy` fields set the allowed cardinality:
 *
 * | | optional=false | optional=true |
 * | --- | --- | --- |
 * | greedy=false | exactly 1 | 0 or 1 |
 * | greedy=true | 1 or more | 0 or more |
 */
export function validateChildren(
  children: Node[],
  specs: Array<{
    optional?: boolean;
    greedy?: boolean;
    options: Array<ChildSpec>;
  }>,
): ValidationError[] {
  let childIndex = 0;
  let specIndex = 0;
  let didSpecMatchPreviousChild = false;

  while (childIndex < children.length && specIndex < specs.length) {
    const child = children[childIndex];
    const specItem = specs[specIndex];
    const optionTypes = formatOptions(specItem.options);

    let error: ValidationError | undefined = undefined;
    const matchingTypeAndTag = specItem.options.filter(
      ({ nodeType, tag }) =>
        nodeType === child.type && (!tag || tag === child.tag),
    );
    if (matchingTypeAndTag.length === 0) {
      error = {
        id: "child-type",
        level: "error",
        message: `Child number ${childIndex + 1} should have type ${optionTypes}, got ${child.type}`,
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
        message: `Child number ${childIndex + 1} should contain attributes ${JSON.stringify(matchingTypeAndTag[0].attributes)}`,
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
        if (childIndex >= children.length) {
          specIndex++;
        }
        didSpecMatchPreviousChild = true;
      } else {
        specIndex++;
        didSpecMatchPreviousChild = false;
      }
    }
  }

  const remainingSpecs = specs.slice(specIndex);
  const nextRequiredSpec = remainingSpecs.find((spec) => !spec.optional);
  if (specIndex < specs.length && nextRequiredSpec !== undefined) {
    const optionTypes = formatOptions(nextRequiredSpec.options);
    return [
      {
        id: "missing-required-child",
        level: "error",
        message: `Missing at least one required child: ${optionTypes}`,
      },
    ];
  } else if (childIndex < children.length) {
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
