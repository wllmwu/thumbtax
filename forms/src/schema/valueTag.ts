import { Tag, transform as markdocTransform } from "@markdoc/markdoc";
import { FILING_STATUSES, FORM_CLASSES } from "@thumbtax/common";

import { ROUNDING_DIRECTIONS } from "../types/roundingDirection";
import {
  isValueProviderType,
  VALUE_PROVIDER_TYPES,
  type ValueProviderType,
} from "../types/valueProviderType";
import { VALUE_SLOTS, type ValueSlot } from "../types/valueSlot";
import { makeTransformer } from "./makeTransformer";
import { unwrapListItemChildren } from "./unwrapListItemChildren";
import { validateChildren } from "./validateChildren";

import type { Node, Schema, ValidationError } from "@markdoc/markdoc";

const PARTIAL_PASSTHROUGH_VALUE_TYPE = "_partial_passthrough";
type PartialPassthroughValueType = typeof PARTIAL_PASSTHROUGH_VALUE_TYPE;

const STRUCTURAL_ATTRIBUTES = [
  "filingStatusKey",
  "key",
  "label",
  "slot",
  "type",
];

function validateAttributes(
  node: Node,
  requiredAttributes: string[],
  optionalAttributes: string[],
): ValidationError[] {
  for (const attribute of requiredAttributes) {
    if (!(attribute in node.attributes)) {
      return [
        {
          id: "missing-required-attribute",
          level: "error",
          message: `Should have attribute "${attribute}"`,
        },
      ];
    }
  }

  const allowedAttributes = new Set([
    ...STRUCTURAL_ATTRIBUTES,
    ...requiredAttributes,
    ...optionalAttributes,
  ]);
  for (const attribute of Object.keys(node.attributes)) {
    if (!allowedAttributes.has(attribute)) {
      return [
        {
          id: "unexpected-attribute",
          level: "error",
          message: `Should not have attribute "${attribute}"`,
        },
      ];
    }
  }

  return [];
}

function valueChildSpec(slot?: ValueSlot) {
  return {
    nodeType: "tag" as const,
    tag: "value",
    ...(slot ? { attributes: { slot } } : {}),
  };
}

function unexpectedSlotErrors(children: Node[]): ValidationError[] {
  for (const [index, child] of children.entries()) {
    if (child.attributes.slot !== undefined) {
      return [
        {
          id: "unexpected-slot",
          level: "error",
          message: `Child number ${index + 1} should not have a slot`,
        },
      ];
    }
  }
  return [];
}

const noChildren = (node: Node) => validateChildren(node.children, []);

const oneUnslottedValue = (node: Node): ValidationError[] => {
  const unwrappedChildren = unwrapListItemChildren(node.children);
  const errors = validateChildren(unwrappedChildren, [
    { options: [valueChildSpec()] },
  ]);
  return errors.length > 0 ? errors : unexpectedSlotErrors(unwrappedChildren);
};

const unslottedValues = (node: Node): ValidationError[] => {
  const unwrappedChildren = unwrapListItemChildren(node.children);
  const errors = validateChildren(unwrappedChildren, [
    { greedy: true, options: [valueChildSpec()] },
  ]);
  return errors.length > 0 ? errors : unexpectedSlotErrors(unwrappedChildren);
};

function orderedSlots(slots: Array<{ slot: ValueSlot; optional?: boolean }>) {
  return (node: Node) =>
    validateChildren(
      unwrapListItemChildren(node.children),
      slots.map(({ slot, optional }) => ({
        optional,
        options: [valueChildSpec(slot)],
      })),
    );
}

const comparisonChildren = (node: Node): ValidationError[] => {
  const unwrappedChildren = unwrapListItemChildren(node.children);
  const errors = validateChildren(unwrappedChildren, [
    { options: [valueChildSpec()] },
    { optional: true, options: [valueChildSpec("minimum")] },
    { optional: true, options: [valueChildSpec("maximum")] },
  ]);
  return errors.length > 0
    ? errors
    : unexpectedSlotErrors(unwrappedChildren.slice(0, 1));
};

const piecewiseFunctionChildren = (node: Node): ValidationError[] =>
  validateChildren(unwrapListItemChildren(node.children), [
    { options: [valueChildSpec("input")] },
    { greedy: true, options: [{ nodeType: "tag", tag: "piece" }] },
    { options: [valueChildSpec("lastOutput")] },
  ]);

const filingStatusMapChildren = (node: Node): ValidationError[] => {
  const seenFilingStatusKeys = new Set<string>();
  const unwrappedChildren = unwrapListItemChildren(node.children);
  for (const [index, child] of unwrappedChildren.entries()) {
    if (child.type !== "tag" || child.tag !== "value") {
      return [
        {
          id: "unexpected-child",
          level: "error",
          message: `Child number ${index + 1} should be a value tag`,
        },
      ];
    }

    const { slot, filingStatusKey } = child.attributes;
    if (slot === "default") {
      if (index !== unwrappedChildren.length - 1) {
        return [
          {
            id: "default-not-last",
            level: "error",
            message: "The default value should be the last child",
          },
        ];
      }
    } else if (slot === undefined && typeof filingStatusKey === "string") {
      if (seenFilingStatusKeys.has(filingStatusKey)) {
        return [
          {
            id: "duplicate-filing-status-key",
            level: "error",
            message: `Duplicate filingStatusKey "${filingStatusKey}"`,
          },
        ];
      }
      seenFilingStatusKeys.add(filingStatusKey);
    } else {
      return [
        {
          id: "unexpected-child",
          level: "error",
          message: `Child number ${index + 1} should have filingStatusKey set or slot="default"`,
        },
      ];
    }
  }
  return [];
};

const selectInstanceBoxesInputChildren = (node: Node): ValidationError[] =>
  validateChildren(unwrapListItemChildren(node.children), [
    { greedy: true, options: [{ nodeType: "tag", tag: "option" }] },
  ]);

const selectValueInputChildren = (node: Node): ValidationError[] => {
  const unwrappedChildren = unwrapListItemChildren(node.children);
  const errors = validateChildren(unwrappedChildren, [
    { greedy: true, options: [valueChildSpec()] },
  ]);
  if (errors.length > 0) {
    return errors;
  }

  for (const [index, child] of unwrappedChildren.entries()) {
    if (
      typeof child.attributes.key !== "string" ||
      typeof child.attributes.label !== "string"
    ) {
      return [
        {
          id: "missing-key-or-label",
          level: "error",
          message: `Child number ${index + 1} should have a key and a label attribute`,
        },
      ];
    }
  }
  return [];
};

type TypeSpec = {
  requiredAttributes: string[];
  optionalAttributes: string[];
  validateChildren: (node: Node) => ValidationError[];
};

const TYPE_SPECS: Record<
  ValueProviderType | PartialPassthroughValueType,
  TypeSpec
> = {
  _partial_passthrough: {
    requiredAttributes: [],
    optionalAttributes: [],
    validateChildren: (node) =>
      validateChildren(unwrapListItemChildren(node.children), [
        { options: [{ nodeType: "tag", tag: "partial" }] },
      ]),
  },
  absolute_value: {
    requiredAttributes: [],
    optionalAttributes: [],
    validateChildren: oneUnslottedValue,
  },
  box_reference: {
    requiredAttributes: ["box"],
    optionalAttributes: ["form", "required"],
    validateChildren: noChildren,
  },
  checkbox_input: {
    requiredAttributes: [],
    optionalAttributes: [],
    validateChildren: noChildren,
  },
  comparison: {
    requiredAttributes: [],
    optionalAttributes: ["strict"],
    validateChildren: comparisonChildren,
  },
  conditional: {
    requiredAttributes: [],
    optionalAttributes: [],
    validateChildren: orderedSlots([
      { slot: "condition" },
      { slot: "trueValue" },
      { slot: "falseValue" },
    ]),
  },
  conjunction: {
    requiredAttributes: [],
    optionalAttributes: [],
    validateChildren: unslottedValues,
  },
  difference: {
    requiredAttributes: [],
    optionalAttributes: [],
    validateChildren: orderedSlots([
      { slot: "minuend" },
      { slot: "subtrahend" },
    ]),
  },
  disjunction: {
    requiredAttributes: [],
    optionalAttributes: [],
    validateChildren: unslottedValues,
  },
  filing_status_map: {
    requiredAttributes: [],
    optionalAttributes: [],
    validateChildren: filingStatusMapChildren,
  },
  form_instance_count: {
    requiredAttributes: ["form"],
    optionalAttributes: [],
    validateChildren: noChildren,
  },
  list_amounts_input: {
    requiredAttributes: [],
    optionalAttributes: [],
    validateChildren: noChildren,
  },
  logical_negation: {
    requiredAttributes: [],
    optionalAttributes: [],
    validateChildren: oneUnslottedValue,
  },
  maximum: {
    requiredAttributes: [],
    optionalAttributes: [],
    validateChildren: unslottedValues,
  },
  minimum: {
    requiredAttributes: [],
    optionalAttributes: [],
    validateChildren: unslottedValues,
  },
  non_negative_clamp: {
    requiredAttributes: [],
    optionalAttributes: [],
    validateChildren: oneUnslottedValue,
  },
  non_positive_clamp: {
    requiredAttributes: [],
    optionalAttributes: [],
    validateChildren: oneUnslottedValue,
  },
  number_constant: {
    requiredAttributes: ["value"],
    optionalAttributes: [],
    validateChildren: noChildren,
  },
  number_input: {
    requiredAttributes: [],
    optionalAttributes: ["coerceSign"],
    validateChildren: orderedSlots([{ slot: "skipCondition", optional: true }]),
  },
  numerical_negation: {
    requiredAttributes: [],
    optionalAttributes: [],
    validateChildren: oneUnslottedValue,
  },
  override_number_input: {
    requiredAttributes: [],
    optionalAttributes: ["coerceSign"],
    validateChildren: orderedSlots([{ slot: "computedValue" }]),
  },
  piecewise_function: {
    requiredAttributes: [],
    optionalAttributes: [],
    validateChildren: piecewiseFunctionChildren,
  },
  product: {
    requiredAttributes: [],
    optionalAttributes: [],
    validateChildren: unslottedValues,
  },
  quotient: {
    requiredAttributes: [],
    optionalAttributes: [],
    validateChildren: orderedSlots([{ slot: "dividend" }, { slot: "divisor" }]),
  },
  rounding: {
    requiredAttributes: ["direction"],
    optionalAttributes: [],
    validateChildren: oneUnslottedValue,
  },
  select_instance_boxes_input: {
    requiredAttributes: [],
    optionalAttributes: [],
    validateChildren: selectInstanceBoxesInputChildren,
  },
  select_value_input: {
    requiredAttributes: [],
    optionalAttributes: [],
    validateChildren: selectValueInputChildren,
  },
  sum: {
    requiredAttributes: [],
    optionalAttributes: [],
    validateChildren: unslottedValues,
  },
  unsupported: {
    requiredAttributes: [],
    optionalAttributes: [],
    validateChildren: noChildren,
  },
  unused: {
    requiredAttributes: [],
    optionalAttributes: [],
    validateChildren: noChildren,
  },
};

function isValidValueType(
  t: string,
): t is ValueProviderType | PartialPassthroughValueType {
  return isValueProviderType(t) || t === PARTIAL_PASSTHROUGH_VALUE_TYPE;
}

export const valueTag: Schema = {
  attributes: {
    slot: {
      type: "String",
      matches: [...VALUE_SLOTS],
      errorLevel: "error",
    },
    type: {
      type: "String",
      required: true,
      matches: [...VALUE_PROVIDER_TYPES, PARTIAL_PASSTHROUGH_VALUE_TYPE],
      errorLevel: "error",
    },
    box: {
      type: "String",
      errorLevel: "error",
    },
    coerceSign: {
      type: "String",
      matches: ["negative", "positive"],
      errorLevel: "error",
    },
    direction: {
      type: "String",
      matches: [...ROUNDING_DIRECTIONS],
      errorLevel: "error",
    },
    filingStatusKey: {
      type: "String",
      matches: [...FILING_STATUSES],
      errorLevel: "error",
    },
    form: {
      type: "String",
      matches: [...FORM_CLASSES],
      errorLevel: "error",
    },
    key: {
      type: "String",
      errorLevel: "error",
    },
    label: {
      type: "String",
      errorLevel: "error",
    },
    required: {
      type: "Boolean",
      errorLevel: "error",
    },
    strict: {
      type: "Boolean",
      errorLevel: "error",
    },
    value: {
      type: "Number",
      errorLevel: "error",
    },
  },
  children: ["list"],
  transform(node, config) {
    const { type: valueType, ...nodeAttributes } = node.attributes;
    if (valueType === PARTIAL_PASSTHROUGH_VALUE_TYPE) {
      const transformedPartial = markdocTransform(
        unwrapListItemChildren(node.children),
        config,
      )[0];
      if (Tag.isTag(transformedPartial)) {
        transformedPartial.attributes = {
          ...transformedPartial.attributes,
          ...nodeAttributes,
        };
      }
      return transformedPartial;
    } else {
      const transformFn = makeTransformer("value", unwrapListItemChildren);
      return transformFn(node, config);
    }
  },
  validate(node) {
    const valueType = node.attributes.type;
    if (!isValidValueType(valueType)) {
      return [];
    }
    const spec = TYPE_SPECS[valueType];
    if (!spec) {
      return [];
    }

    const attributeErrors = validateAttributes(
      node,
      spec.requiredAttributes,
      spec.optionalAttributes,
    );
    if (attributeErrors.length > 0) {
      return attributeErrors;
    }

    return spec.validateChildren(node);
  },
};

export const pieceTag: Schema = {
  children: ["list"],
  transform: makeTransformer("piece", unwrapListItemChildren),
  validate(node) {
    const attributeErrors = validateAttributes(node, [], []);
    if (attributeErrors.length > 0) {
      return attributeErrors;
    }

    return validateChildren(unwrapListItemChildren(node.children), [
      {
        options: [valueChildSpec("inputUpperBound")],
      },
      { options: [valueChildSpec("output")] },
    ]);
  },
};

export const optionTag: Schema = {
  attributes: {
    form: {
      type: "String",
      required: true,
      matches: [...FORM_CLASSES],
      errorLevel: "error",
    },
    box: {
      type: "String",
      required: true,
      errorLevel: "error",
    },
  },
  transform: makeTransformer("option"),
  validate(node) {
    const attributeErrors = validateAttributes(node, ["form", "box"], []);
    if (attributeErrors.length > 0) {
      return attributeErrors;
    }

    return validateChildren(node.children, []);
  },
};
