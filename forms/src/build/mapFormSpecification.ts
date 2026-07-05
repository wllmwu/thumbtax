import { Tag } from "@markdoc/markdoc";
import { BOX_FORMATS, FORM_CLASSES } from "@thumbtax/common";

import { FORM_CATEGORIES } from "../types/formCategory";
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
import type { RenderableTreeNode, RenderableTreeNodes } from "@markdoc/markdoc";
import type { BoxFormat } from "@thumbtax/common";

function mapBoxAttributes(boxNode: Tag): {
  identifier: string;
  value: ValueProvider;
  format: BoxFormat | undefined;
} {
  const [valueNode] = boxNode.children.filter((child) =>
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

function mapSingleColumnBox(boxNode: Tag): FormBox<false> {
  return mapBoxAttributes(boxNode);
}

function mapMultiColumnBox(boxNode: Tag): FormBox<true> {
  return {
    ...mapBoxAttributes(boxNode),
    column: requireString(boxNode.attributes.column),
  };
}

function mapLineAttributes(lineNode: Tag): {
  index: string;
  virtual: boolean | undefined;
  instructions: RenderableTreeNodes | undefined;
  commentary: RenderableTreeNodes | undefined;
  boxNodes: Tag[];
} {
  const children = lineNode.children.filter(Tag.isTag);
  let position = 0;

  let instructions: RenderableTreeNodes | undefined;
  const instructionsNode = children[position];
  if (isTagNamed(instructionsNode, "instructions")) {
    instructions = instructionsNode.children;
    position++;
  }

  let commentary: RenderableTreeNodes | undefined;
  const commentaryNode = children[position];
  if (isTagNamed(commentaryNode, "commentary")) {
    commentary = commentaryNode.children;
    position++;
  }

  return {
    index: requireString(lineNode.attributes.index),
    virtual:
      lineNode.attributes.virtual === undefined
        ? undefined
        : Boolean(lineNode.attributes.virtual),
    instructions,
    commentary,
    boxNodes: children.slice(position),
  };
}

function mapSingleColumnLine(lineNode: Tag): FormLine<false> {
  const { boxNodes, ...line } = mapLineAttributes(lineNode);
  const [boxNode] = boxNodes;
  if (boxNode === undefined) {
    throw new Error(`Line "${line.index}" is missing a box`);
  }
  return { ...line, box: mapSingleColumnBox(boxNode) };
}

function mapMultiColumnLine(lineNode: Tag): FormLine<true> {
  const { boxNodes, ...line } = mapLineAttributes(lineNode);
  return { ...line, boxes: boxNodes.map(mapMultiColumnBox) };
}

function mapColumn(columnNode: Tag): {
  index: string;
  instructions: RenderableTreeNodes | undefined;
} {
  const instructionsNode = columnNode.children.find((child) =>
    isTagNamed(child, "instructions"),
  );
  return {
    index: requireString(columnNode.attributes.index),
    instructions: instructionsNode?.children,
  };
}

function mapSection(sectionNode: Tag): FormSection<false> | FormSection<true> {
  const children = sectionNode.children.filter(Tag.isTag);
  let position = 0;

  let heading: string | undefined;
  const headingNode = children[position];
  if (isTagNamed(headingNode, "h2")) {
    heading = extractPlainText(headingNode);
    position++;
  }

  let subtitle: string | undefined;
  const subtitleNode = children[position];
  if (isTagNamed(subtitleNode, "subtitle")) {
    subtitle = extractPlainText(subtitleNode);
    position++;
  }

  let instructions: RenderableTreeNodes | undefined;
  const instructionsNode = children[position];
  if (isTagNamed(instructionsNode, "instructions")) {
    instructions = instructionsNode.children;
    position++;
  }

  let commentary: RenderableTreeNodes | undefined;
  const commentaryNode = children[position];
  if (isTagNamed(commentaryNode, "commentary")) {
    commentary = commentaryNode.children;
    position++;
  }

  const columnsNode = children[position];
  if (isTagNamed(columnsNode, "columns")) {
    position++;
    const columns = columnsNode.children
      .filter((child) => isTagNamed(child, "column"))
      .map((columnNode) => mapColumn(columnNode));
    const linesNode = children[position];
    const lines = linesNode.children
      .filter((child) => isTagNamed(child, "line"))
      .map((lineNode) => mapMultiColumnLine(lineNode));
    return { heading, subtitle, instructions, commentary, columns, lines };
  } else {
    const linesNode = children[position];
    const lines = linesNode.children
      .filter((child) => isTagNamed(child, "line"))
      .map((lineNode) => mapSingleColumnLine(lineNode));
    return { heading, subtitle, instructions, commentary, lines };
  }
}

export function mapFormSpecification(
  documentNode: RenderableTreeNode,
): FormSpecification {
  if (!Tag.isTag(documentNode)) {
    throw new Error("Document is missing a form tag");
  }
  const formNode = documentNode.children.find((child) =>
    isTagNamed(child, "form"),
  );
  if (formNode === undefined) {
    throw new Error("Document is missing a form tag");
  }

  const children = formNode.children.filter(Tag.isTag);
  let position = 0;

  const titleNode = children[position];
  if (titleNode === undefined || titleNode.name !== "h1") {
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
    instructions = instructionsNode.children;
    position++;
  }

  let commentary: RenderableTreeNodes | undefined;
  const commentaryNode = children[position];
  if (isTagNamed(commentaryNode, "commentary")) {
    commentary = commentaryNode.children;
    position++;
  }

  const sections = children
    .slice(position)
    .map((sectionNode) => mapSection(sectionNode));

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
