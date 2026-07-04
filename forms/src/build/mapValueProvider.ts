import { absurd, FILING_STATUSES, FORM_CLASSES } from "@thumbtax/common";

import { unwrapListItemChildren } from "../schema/unwrapListItemChildren";
import { NUMBER_SIGNS } from "../types/numberSign";
import { ROUNDING_DIRECTIONS } from "../types/roundingDirection";
import {
  COMPUTED_VALUE_PROVIDER_TYPES,
  isValueProviderType,
} from "../types/valueProviderType";
import { requireNumber, requireOneOf, requireString } from "./attributes";
import { isTagNamed } from "./nodeHelpers";

import type {
  ComputedValueProvider,
  ValueProvider,
} from "../types/valueProvider";
import type { ValueSlot } from "../types/valueSlot";
import type { Node } from "@markdoc/markdoc";
import type { FilingStatus } from "@thumbtax/common";

function isComputedValueProvider(
  value: ValueProvider,
): value is ComputedValueProvider {
  return (
    COMPUTED_VALUE_PROVIDER_TYPES.findIndex((t) => t === value.type) !== -1
  );
}

function mapComputedValueProvider(node: Node): ComputedValueProvider {
  const value = mapValueProvider(node);
  if (!isComputedValueProvider(value)) {
    throw new Error(
      `Expected a computed value provider, got type "${value.type}"`,
    );
  }
  return value;
}

function valueTagChildren(node: Node): Node[] {
  return unwrapListItemChildren(node.children).filter((child) =>
    isTagNamed(child, "value"),
  );
}

function findBySlot(children: Node[], slot: ValueSlot): Node {
  const match = children.find((child) => child.attributes.slot === slot);
  if (match === undefined) {
    throw new Error(`Missing value child with slot "${slot}"`);
  }
  return match;
}

function findOptionalBySlot(
  children: Node[],
  slot: ValueSlot,
): Node | undefined {
  return children.find((child) => child.attributes.slot === slot);
}

function findUnslotted(children: Node[]): Node[] {
  return children.filter((child) => child.attributes.slot === undefined);
}

function findSingleUnslotted(children: Node[]): Node {
  const [match] = findUnslotted(children);
  if (match === undefined) {
    throw new Error("Missing unslotted value child");
  }
  return match;
}

function mapPiece(pieceNode: Node): {
  inputUpperBound: ComputedValueProvider;
  output: ComputedValueProvider;
} {
  const children = valueTagChildren(pieceNode);
  return {
    inputUpperBound: mapComputedValueProvider(
      findBySlot(children, "inputUpperBound"),
    ),
    output: mapComputedValueProvider(findBySlot(children, "output")),
  };
}

export function mapValueProvider(node: Node): ValueProvider {
  const valueType = node.attributes.type;
  if (!isValueProviderType(valueType)) {
    throw new Error(`Unknown value provider type "${String(valueType)}"`);
  }

  switch (valueType) {
    case "absolute_value":
    case "logical_negation":
    case "non_negative_clamp":
    case "non_positive_clamp":
    case "numerical_negation":
      return {
        type: valueType,
        value: mapComputedValueProvider(
          findSingleUnslotted(valueTagChildren(node)),
        ),
      };

    case "box_reference":
      return {
        type: valueType,
        box: requireString(node.attributes.box),
        form:
          node.attributes.form === undefined
            ? undefined
            : requireOneOf(node.attributes.form, FORM_CLASSES),
        required:
          node.attributes.required === undefined
            ? undefined
            : Boolean(node.attributes.required),
      };

    case "checkbox_input":
    case "list_amounts_input":
    case "unsupported":
    case "unused":
      return { type: valueType };

    case "comparison": {
      const children = valueTagChildren(node);
      const minimumNode = findOptionalBySlot(children, "minimum");
      const maximumNode = findOptionalBySlot(children, "maximum");
      return {
        type: valueType,
        value: mapComputedValueProvider(findSingleUnslotted(children)),
        minimum:
          minimumNode === undefined
            ? undefined
            : mapComputedValueProvider(minimumNode),
        maximum:
          maximumNode === undefined
            ? undefined
            : mapComputedValueProvider(maximumNode),
        strict:
          node.attributes.strict === undefined
            ? undefined
            : Boolean(node.attributes.strict),
      };
    }

    case "conditional": {
      const children = valueTagChildren(node);
      return {
        type: valueType,
        condition: mapComputedValueProvider(findBySlot(children, "condition")),
        trueValue: mapComputedValueProvider(findBySlot(children, "trueValue")),
        falseValue: mapComputedValueProvider(
          findBySlot(children, "falseValue"),
        ),
      };
    }

    case "conjunction":
    case "disjunction":
    case "maximum":
    case "minimum":
    case "product":
    case "sum":
      return {
        type: valueType,
        values: findUnslotted(valueTagChildren(node)).map(
          mapComputedValueProvider,
        ),
      };

    case "difference": {
      const children = valueTagChildren(node);
      return {
        type: valueType,
        minuend: mapComputedValueProvider(findBySlot(children, "minuend")),
        subtrahend: mapComputedValueProvider(
          findBySlot(children, "subtrahend"),
        ),
      };
    }

    case "filing_status_map": {
      const values: Partial<Record<FilingStatus, ComputedValueProvider>> = {};
      let defaultValue: ComputedValueProvider | undefined;
      for (const child of node.children) {
        if (child.attributes.slot === "default") {
          defaultValue = mapComputedValueProvider(child);
        } else {
          const filingStatusKey = requireOneOf(
            child.attributes.filingStatusKey,
            FILING_STATUSES,
          );
          values[filingStatusKey] = mapComputedValueProvider(child);
        }
      }
      return { type: valueType, values, default: defaultValue };
    }

    case "form_instance_count":
      return {
        type: valueType,
        form: requireOneOf(node.attributes.form, FORM_CLASSES),
      };

    case "number_constant":
      return { type: valueType, value: requireNumber(node.attributes.value) };

    case "number_input": {
      const skipConditionNode = findOptionalBySlot(
        valueTagChildren(node),
        "skipCondition",
      );
      return {
        type: valueType,
        coerceSign:
          node.attributes.coerceSign === undefined
            ? undefined
            : requireOneOf(node.attributes.coerceSign, NUMBER_SIGNS),
        skipCondition:
          skipConditionNode === undefined
            ? undefined
            : mapComputedValueProvider(skipConditionNode),
      };
    }

    case "override_number_input":
      return {
        type: valueType,
        computedValue: mapComputedValueProvider(
          findBySlot(valueTagChildren(node), "computedValue"),
        ),
        coerceSign:
          node.attributes.coerceSign === undefined
            ? undefined
            : requireOneOf(node.attributes.coerceSign, NUMBER_SIGNS),
      };

    case "piecewise_function": {
      const children = valueTagChildren(node);
      const pieceNodes = unwrapListItemChildren(node.children).filter((child) =>
        isTagNamed(child, "piece"),
      );
      return {
        type: valueType,
        input: mapComputedValueProvider(findBySlot(children, "input")),
        pieces: pieceNodes.map(mapPiece),
        lastOutput: mapComputedValueProvider(
          findBySlot(children, "lastOutput"),
        ),
      };
    }

    case "quotient":
      return {
        type: valueType,
        dividend: mapComputedValueProvider(
          findBySlot(valueTagChildren(node), "dividend"),
        ),
        divisor: mapComputedValueProvider(
          findBySlot(valueTagChildren(node), "divisor"),
        ),
        round:
          node.attributes.round === undefined
            ? undefined
            : requireOneOf(node.attributes.round, ROUNDING_DIRECTIONS),
      };

    case "select_instance_boxes_input": {
      const optionNodes = unwrapListItemChildren(node.children).filter(
        (child) => isTagNamed(child, "option"),
      );
      return {
        type: valueType,
        options: optionNodes.map((optionNode) => ({
          form: requireOneOf(optionNode.attributes.form, FORM_CLASSES),
          box: requireString(optionNode.attributes.box),
        })),
      };
    }

    case "select_value_input":
      return {
        type: valueType,
        options: valueTagChildren(node).map((child) => ({
          label: requireString(child.attributes.label),
          value: mapComputedValueProvider(child),
        })),
      };

    default:
      return absurd(valueType);
  }
}
