import { FILING_STATUSES, FORM_CLASSES } from "@thumbtax/common";

import {
  isValueProviderType,
  VALUE_PROVIDER_TYPES,
  type ValueProviderType,
} from "../types/valueProviderType";
import { VALUE_SLOTS, type ValueSlot } from "../types/valueSlot";
import { unwrapInlineTags } from "./unwrapInlineTagChildren";
import { validateChildren } from "./validateChildren";

import type { Node, Schema, ValidationError } from "@markdoc/markdoc";

const STRUCTURAL_ATTRIBUTES = ["type", "slot", "filingStatusKey", "label"];

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
  const errors = validateChildren(unwrapInlineTags(node.children), [
    { options: [valueChildSpec()] },
  ]);
  return errors.length > 0 ? errors : unexpectedSlotErrors(node.children);
};

const unslottedValues = (node: Node): ValidationError[] => {
  const errors = validateChildren(unwrapInlineTags(node.children), [
    { greedy: true, options: [valueChildSpec()] },
  ]);
  return errors.length > 0 ? errors : unexpectedSlotErrors(node.children);
};

function orderedSlots(slots: Array<{ slot: ValueSlot; optional?: boolean }>) {
  return (node: Node) =>
    validateChildren(
      unwrapInlineTags(node.children),
      slots.map(({ slot, optional }) => ({
        optional,
        options: [valueChildSpec(slot)],
      })),
    );
}

const comparisonChildren = (node: Node): ValidationError[] => {
  const errors = validateChildren(unwrapInlineTags(node.children), [
    { options: [valueChildSpec()] },
    { optional: true, options: [valueChildSpec("comparison.minimum")] },
    { optional: true, options: [valueChildSpec("comparison.maximum")] },
  ]);
  return errors.length > 0
    ? errors
    : unexpectedSlotErrors(node.children.slice(0, 1));
};

const piecewiseFunctionChildren = (node: Node): ValidationError[] =>
  validateChildren(unwrapInlineTags(node.children), [
    { options: [valueChildSpec("piecewise_function.input")] },
    { greedy: true, options: [{ nodeType: "tag", tag: "piece" }] },
    { options: [valueChildSpec("piecewise_function.lastOutput")] },
  ]);

const filingStatusMapChildren = (node: Node): ValidationError[] => {
  const seenFilingStatusKeys = new Set<string>();
  for (const [index, child] of node.children.entries()) {
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
    if (slot === "filing_status_map.default") {
      if (index !== node.children.length - 1) {
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
          message: `Child number ${index + 1} should have filingStatusKey set or slot="filing_status_map.default"`,
        },
      ];
    }
  }
  return [];
};

const selectInstanceBoxesInputChildren = (node: Node): ValidationError[] =>
  validateChildren(unwrapInlineTags(node.children), [
    { greedy: true, options: [{ nodeType: "tag", tag: "option" }] },
  ]);

const selectValueInputChildren = (node: Node): ValidationError[] => {
  const errors = validateChildren(unwrapInlineTags(node.children), [
    { greedy: true, options: [valueChildSpec("select_value_input.options")] },
  ]);
  if (errors.length > 0) {
    return errors;
  }

  for (const [index, child] of node.children.entries()) {
    if (typeof child.attributes.label !== "string") {
      return [
        {
          id: "missing-label",
          level: "error",
          message: `Child number ${index + 1} should have a label attribute`,
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

const TYPE_SPECS: Record<ValueProviderType, TypeSpec> = {
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
      { slot: "conditional.condition" },
      { slot: "conditional.trueValue" },
      { slot: "conditional.falseValue" },
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
      { slot: "difference.minuend" },
      { slot: "difference.subtrahend" },
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
    validateChildren: orderedSlots([
      { slot: "number_input.skipCondition", optional: true },
    ]),
  },
  numerical_negation: {
    requiredAttributes: [],
    optionalAttributes: [],
    validateChildren: oneUnslottedValue,
  },
  override_number_input: {
    requiredAttributes: [],
    optionalAttributes: ["coerceSign"],
    validateChildren: orderedSlots([
      { slot: "override_number_input.computedValue" },
    ]),
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
    optionalAttributes: ["round"],
    validateChildren: orderedSlots([
      { slot: "quotient.dividend" },
      { slot: "quotient.divisor" },
    ]),
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

export const valueTag: Schema = {
  attributes: {
    type: {
      type: "String",
      required: true,
      matches: [...VALUE_PROVIDER_TYPES],
      errorLevel: "error",
    },
    slot: {
      type: "String",
      matches: [...VALUE_SLOTS],
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
    label: {
      type: "String",
      errorLevel: "error",
    },
    required: {
      type: "Boolean",
      errorLevel: "error",
    },
    round: {
      type: "String",
      matches: ["down", "up"],
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
  validate(node) {
    const valueType = node.attributes.type;
    if (!isValueProviderType(valueType)) {
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
  validate(node) {
    const attributeErrors = validateAttributes(node, [], []);
    if (attributeErrors.length > 0) {
      return attributeErrors;
    }

    return validateChildren(unwrapInlineTags(node.children), [
      {
        options: [valueChildSpec("piecewise_function.pieces.inputUpperBound")],
      },
      { options: [valueChildSpec("piecewise_function.pieces.output")] },
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
  validate(node) {
    const attributeErrors = validateAttributes(node, ["form", "box"], []);
    if (attributeErrors.length > 0) {
      return attributeErrors;
    }

    return validateChildren(node.children, []);
  },
};
