import { transform } from "@markdoc/markdoc";
import { BOX_FORMATS, FORM_CLASSES } from "@thumbtax/common";

import { unwrapInlineTags } from "../schema/unwrapInlineTagChildren";
import { requireNumber, requireOneOf, requireString } from "./attributes";
import { extractPlainText } from "./extractPlainText";
import { mapValueProvider } from "./mapValueProvider";
import { isTagNamed } from "./nodeHelpers";

import type {
  FormBox,
  FormLine,
  FormSection,
  FormSpecification,
} from "../types/formSpecification";
import type { ValueProvider } from "../types/valueProvider";
import type { Config, Node, RenderableTreeNodes } from "@markdoc/markdoc";
import type { BoxFormat } from "@thumbtax/common";

const FORM_CATEGORIES = ["income", "taxes"] as const;

// `node.transform(config)` (the instance method) skips Markdoc's default node/tag
// schema merging that the top-level `transform()` function performs, which would
// cause built-in node types like `text` and `paragraph` to render as nothing.
function transformSync(node: Node, config: Config): RenderableTreeNodes {
  return transform(node, config);
}

function mapBoxAttributes(boxNode: Node): {
  identifier: string;
  value: ValueProvider;
  format: BoxFormat | undefined;
} {
  const [valueNode] = unwrapInlineTags(boxNode.children).filter((child) =>
    isTagNamed(child, "value"),
  );
  if (valueNode === undefined) {
    throw new Error(
      `Box "${String(boxNode.attributes.identifier)}" is missing a value tag`,
    );
  }
  return {
    identifier: requireString(boxNode.attributes.identifier),
    value: mapValueProvider(valueNode),
    format:
      boxNode.attributes.format === undefined
        ? undefined
        : requireOneOf(boxNode.attributes.format, BOX_FORMATS),
  };
}

function mapSingleColumnBox(boxNode: Node): FormBox<false> {
  return mapBoxAttributes(boxNode);
}

function mapMultiColumnBox(boxNode: Node): FormBox<true> {
  return {
    ...mapBoxAttributes(boxNode),
    column: requireString(boxNode.attributes.column),
  };
}

function mapLineAttributes(
  lineNode: Node,
  config: Config,
): {
  index: string;
  virtual: boolean;
  instructions: RenderableTreeNodes | undefined;
  commentary: RenderableTreeNodes | undefined;
  boxNodes: Node[];
} {
  const children = unwrapInlineTags(lineNode.children);
  let position = 0;

  let instructions: RenderableTreeNodes | undefined;
  const instructionsNode = children[position];
  if (isTagNamed(instructionsNode, "instructions")) {
    instructions = transformSync(instructionsNode, config);
    position++;
  }

  let commentary: RenderableTreeNodes | undefined;
  const commentaryNode = children[position];
  if (isTagNamed(commentaryNode, "commentary")) {
    commentary = transformSync(commentaryNode, config);
    position++;
  }

  return {
    index: requireString(lineNode.attributes.index),
    virtual: Boolean(lineNode.attributes.virtual),
    instructions,
    commentary,
    boxNodes: children.slice(position),
  };
}

function mapSingleColumnLine(lineNode: Node, config: Config): FormLine<false> {
  const { boxNodes, ...line } = mapLineAttributes(lineNode, config);
  const [boxNode] = boxNodes;
  if (boxNode === undefined) {
    throw new Error(`Line "${line.index}" is missing a box`);
  }
  return { ...line, box: mapSingleColumnBox(boxNode) };
}

function mapMultiColumnLine(lineNode: Node, config: Config): FormLine<true> {
  const { boxNodes, ...line } = mapLineAttributes(lineNode, config);
  return { ...line, boxes: boxNodes.map(mapMultiColumnBox) };
}

function mapColumn(
  columnNode: Node,
  config: Config,
): { index: string; instructions: RenderableTreeNodes | undefined } {
  const instructionsNode = unwrapInlineTags(columnNode.children).find((child) =>
    isTagNamed(child, "instructions"),
  );
  return {
    index: requireString(columnNode.attributes.index),
    instructions:
      instructionsNode === undefined
        ? undefined
        : transformSync(instructionsNode, config),
  };
}

function mapSection(
  sectionNode: Node,
  config: Config,
): FormSection<false> | FormSection<true> {
  const children = unwrapInlineTags(sectionNode.children);
  let position = 0;

  let heading: string | undefined;
  const headingNode = children[position];
  if (headingNode !== undefined && headingNode.type === "heading") {
    heading = extractPlainText(headingNode);
    position++;
  }

  let instructions: RenderableTreeNodes | undefined;
  const instructionsNode = children[position];
  if (isTagNamed(instructionsNode, "instructions")) {
    instructions = transformSync(instructionsNode, config);
    position++;
  }

  let commentary: RenderableTreeNodes | undefined;
  const commentaryNode = children[position];
  if (isTagNamed(commentaryNode, "commentary")) {
    commentary = transformSync(commentaryNode, config);
    position++;
  }

  const columnsNode = children[position];
  if (isTagNamed(columnsNode, "columns")) {
    position++;
    const columns = unwrapInlineTags(columnsNode.children)
      .filter((child) => isTagNamed(child, "column"))
      .map((columnNode) => mapColumn(columnNode, config));
    const lines = children
      .slice(position)
      .map((lineNode) => mapMultiColumnLine(lineNode, config));
    return { heading, instructions, commentary, columns, lines };
  }

  const lines = children
    .slice(position)
    .map((lineNode) => mapSingleColumnLine(lineNode, config));
  return { heading, instructions, commentary, lines };
}

export function mapFormSpecification(
  documentNode: Node,
  config: Config,
): FormSpecification {
  const formNode = unwrapInlineTags(documentNode.children).find((child) =>
    isTagNamed(child, "form"),
  );
  if (formNode === undefined) {
    throw new Error("Document is missing a form tag");
  }

  const children = unwrapInlineTags(formNode.children);
  let position = 0;

  const titleNode = children[position];
  if (titleNode === undefined || titleNode.type !== "heading") {
    throw new Error("Form is missing a title heading");
  }
  const title = extractPlainText(titleNode);
  position++;

  let subtitle: string | undefined;
  const subtitleNode = children[position];
  if (isTagNamed(subtitleNode, "subtitle")) {
    subtitle = extractPlainText(subtitleNode);
    position++;
  }

  let instructions: RenderableTreeNodes | undefined;
  const instructionsNode = children[position];
  if (isTagNamed(instructionsNode, "instructions")) {
    instructions = transformSync(instructionsNode, config);
    position++;
  }

  let commentary: RenderableTreeNodes | undefined;
  const commentaryNode = children[position];
  if (isTagNamed(commentaryNode, "commentary")) {
    commentary = transformSync(commentaryNode, config);
    position++;
  }

  const sections = children
    .slice(position)
    .map((sectionNode) => mapSection(sectionNode, config));

  return {
    class: requireOneOf(formNode.attributes.class, FORM_CLASSES),
    irsPageUrl: requireString(formNode.attributes.irsPageUrl),
    category: requireOneOf(formNode.attributes.category, FORM_CATEGORIES),
    maxInstances:
      formNode.attributes.maxInstances === undefined
        ? null
        : requireNumber(formNode.attributes.maxInstances),
    title,
    subtitle,
    instructions,
    commentary,
    sections,
  };
}
