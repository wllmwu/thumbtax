import type { BoxIdentifier } from "#src/common/types/boxIdentifier";
import type { FormClass } from "#src/common/types/formClass";
import type { ComputedValueProvider } from "#src/specifications/types/valueProvider";

export function taxComputation(taxableIncome: {
  form?: FormClass;
  box: BoxIdentifier;
}): ComputedValueProvider {
  const input = { type: "box_reference" as const, ...taxableIncome };
  return {
    type: "filing_status_map",
    values: {
      head_of_household: {
        type: "piecewise_function",
        input,
        pieces: [
          {
            inputUpperBound: { type: "number_constant", value: 103350 },
            output: {
              type: "difference",
              minuend: {
                type: "product",
                values: [input, { type: "number_constant", value: 0.22 }],
              },
              subtrahend: { type: "number_constant", value: 6825 },
            },
          },
          {
            inputUpperBound: { type: "number_constant", value: 197300 },
            output: {
              type: "difference",
              minuend: {
                type: "product",
                values: [input, { type: "number_constant", value: 0.24 }],
              },
              subtrahend: { type: "number_constant", value: 8892 },
            },
          },
          {
            inputUpperBound: { type: "number_constant", value: 250500 },
            output: {
              type: "difference",
              minuend: {
                type: "product",
                values: [input, { type: "number_constant", value: 0.32 }],
              },
              subtrahend: { type: "number_constant", value: 24676 },
            },
          },
          {
            inputUpperBound: { type: "number_constant", value: 626350 },
            output: {
              type: "difference",
              minuend: {
                type: "product",
                values: [input, { type: "number_constant", value: 0.35 }],
              },
              subtrahend: { type: "number_constant", value: 32191 },
            },
          },
        ],
        lastOutput: {
          type: "difference",
          minuend: {
            type: "product",
            values: [input, { type: "number_constant", value: 0.37 }],
          },
          subtrahend: { type: "number_constant", value: 44718 },
        },
      },
      married_filing_separately: {
        type: "piecewise_function",
        input,
        pieces: [
          {
            inputUpperBound: { type: "number_constant", value: 103350 },
            output: {
              type: "difference",
              minuend: {
                type: "product",
                values: [input, { type: "number_constant", value: 0.22 }],
              },
              subtrahend: { type: "number_constant", value: 5086 },
            },
          },
          {
            inputUpperBound: { type: "number_constant", value: 197300 },
            output: {
              type: "difference",
              minuend: {
                type: "product",
                values: [input, { type: "number_constant", value: 0.24 }],
              },
              subtrahend: { type: "number_constant", value: 7153 },
            },
          },
          {
            inputUpperBound: { type: "number_constant", value: 250525 },
            output: {
              type: "difference",
              minuend: {
                type: "product",
                values: [input, { type: "number_constant", value: 0.32 }],
              },
              subtrahend: { type: "number_constant", value: 22937 },
            },
          },
          {
            inputUpperBound: { type: "number_constant", value: 375800 },
            output: {
              type: "difference",
              minuend: {
                type: "product",
                values: [input, { type: "number_constant", value: 0.35 }],
              },
              subtrahend: { type: "number_constant", value: 30452.75 },
            },
          },
        ],
        lastOutput: {
          type: "difference",
          minuend: {
            type: "product",
            values: [input, { type: "number_constant", value: 0.37 }],
          },
          subtrahend: { type: "number_constant", value: 37968.75 },
        },
      },
      single: {
        type: "piecewise_function",
        input,
        pieces: [
          {
            inputUpperBound: { type: "number_constant", value: 103350 },
            output: {
              type: "difference",
              minuend: {
                type: "product",
                values: [input, { type: "number_constant", value: 0.22 }],
              },
              subtrahend: { type: "number_constant", value: 5086 },
            },
          },
          {
            inputUpperBound: { type: "number_constant", value: 197300 },
            output: {
              type: "difference",
              minuend: {
                type: "product",
                values: [input, { type: "number_constant", value: 0.24 }],
              },
              subtrahend: { type: "number_constant", value: 7153 },
            },
          },
          {
            inputUpperBound: { type: "number_constant", value: 250525 },
            output: {
              type: "difference",
              minuend: {
                type: "product",
                values: [input, { type: "number_constant", value: 0.32 }],
              },
              subtrahend: { type: "number_constant", value: 22937 },
            },
          },
          {
            inputUpperBound: { type: "number_constant", value: 626350 },
            output: {
              type: "difference",
              minuend: {
                type: "product",
                values: [input, { type: "number_constant", value: 0.35 }],
              },
              subtrahend: { type: "number_constant", value: 30452.75 },
            },
          },
        ],
        lastOutput: {
          type: "difference",
          minuend: {
            type: "product",
            values: [input, { type: "number_constant", value: 0.37 }],
          },
          subtrahend: { type: "number_constant", value: 42979.75 },
        },
      },
    },
    default: {
      type: "piecewise_function",
      input,
      pieces: [
        {
          inputUpperBound: { type: "number_constant", value: 206700 },
          output: {
            type: "difference",
            minuend: {
              type: "product",
              values: [input, { type: "number_constant", value: 0.22 }],
            },
            subtrahend: { type: "number_constant", value: 10172 },
          },
        },
        {
          inputUpperBound: { type: "number_constant", value: 394600 },
          output: {
            type: "difference",
            minuend: {
              type: "product",
              values: [input, { type: "number_constant", value: 0.24 }],
            },
            subtrahend: { type: "number_constant", value: 14306 },
          },
        },
        {
          inputUpperBound: { type: "number_constant", value: 501050 },
          output: {
            type: "difference",
            minuend: {
              type: "product",
              values: [input, { type: "number_constant", value: 0.32 }],
            },
            subtrahend: { type: "number_constant", value: 45874 },
          },
        },
        {
          inputUpperBound: { type: "number_constant", value: 751600 },
          output: {
            type: "difference",
            minuend: {
              type: "product",
              values: [input, { type: "number_constant", value: 0.35 }],
            },
            subtrahend: { type: "number_constant", value: 60905.5 },
          },
        },
      ],
      lastOutput: {
        type: "difference",
        minuend: {
          type: "product",
          values: [input, { type: "number_constant", value: 0.37 }],
        },
        subtrahend: { type: "number_constant", value: 75937.5 },
      },
    },
  };
}
