import { FILING_STATUSES } from "@thumbtax/common";

import { VALUE_PROVIDER_TYPES } from "./valueProviderType";

import type { Schema } from "@markdoc/markdoc";

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
      matches: [
        "comparison.maximum",
        "comparison.minimum",
        "conditional.condition",
        "conditional.falseValue",
        "conditional.trueValue",
        "difference.minuend",
        "difference.subtrahend",
        "filing_status_map.default",
        "number_input.skipCondition",
        "override_number_input.computedValue",
        "piecewise_function.input",
        "piecewise_function.lastOutput",
        "piecewise_function.pieces.inputUpperBound",
        "piecewise_function.pieces.output",
        "quotient.dividend",
        "quotient.divisor",
      ],
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
      errorLevel: "error",
    },
    options: {
      type: "Array",
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
  },
};
