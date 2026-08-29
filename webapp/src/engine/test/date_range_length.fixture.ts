import { Temporal } from "temporal-polyfill";

import { EPOCH_DATE } from "#src/common/epochDate";
import {
  ERROR_PROVIDER,
  type ValueProviderFixture,
} from "#src/engine/test/fixtures";

function makeDateValue(year: number, month: number, day: number): number {
  return new Temporal.PlainDate(year, month, day).since(EPOCH_DATE).days;
}

export const date_range_length: ValueProviderFixture[] = [
  {
    description: "resolves to 0 days when rangeStart is after rangeEnd",
    provider: {
      type: "date_range_length",
      rangeStart: { type: "number_constant", value: makeDateValue(2026, 2, 1) },
      rangeEnd: { type: "number_constant", value: makeDateValue(2026, 1, 1) },
      unit: "day",
    },
    expected: { value: 0, errors: [] },
  },
  {
    description: "resolves to 0 days when rangeStart equals rangeEnd",
    provider: {
      type: "date_range_length",
      rangeStart: { type: "number_constant", value: makeDateValue(2026, 2, 1) },
      rangeEnd: { type: "number_constant", value: makeDateValue(2026, 2, 1) },
      unit: "day",
    },
    expected: { value: 0, errors: [] },
  },
  {
    description: "counts days in the same week",
    provider: {
      type: "date_range_length",
      rangeStart: { type: "number_constant", value: makeDateValue(2026, 1, 5) },
      rangeEnd: { type: "number_constant", value: makeDateValue(2026, 1, 10) },
      unit: "day",
    },
    expected: { value: 5, errors: [] },
  },
  {
    description: "counts days across weeks",
    provider: {
      type: "date_range_length",
      rangeStart: {
        type: "number_constant",
        value: makeDateValue(2026, 1, 10),
      },
      rangeEnd: { type: "number_constant", value: makeDateValue(2026, 1, 31) },
      unit: "day",
    },
    expected: { value: 21, errors: [] },
  },
  {
    description: "counts days across months",
    provider: {
      type: "date_range_length",
      rangeStart: {
        type: "number_constant",
        value: makeDateValue(2026, 1, 31),
      },
      rangeEnd: { type: "number_constant", value: makeDateValue(2026, 4, 26) },
      unit: "day",
    },
    expected: { value: 85, errors: [] },
  },
  {
    description: "counts days including leap days",
    provider: {
      type: "date_range_length",
      rangeStart: {
        type: "number_constant",
        value: makeDateValue(2028, 1, 31),
      },
      rangeEnd: { type: "number_constant", value: makeDateValue(2028, 4, 26) },
      unit: "day",
    },
    expected: { value: 86, errors: [] },
  },
  {
    description: "resolves to 0 weekdays when rangeStart is after rangeEnd",
    provider: {
      type: "date_range_length",
      rangeStart: { type: "number_constant", value: makeDateValue(2026, 2, 1) },
      rangeEnd: { type: "number_constant", value: makeDateValue(2026, 1, 1) },
      unit: "weekday",
    },
    expected: { value: 0, errors: [] },
  },
  {
    description: "resolves to 0 weekdays when rangeStart equals rangeEnd",
    provider: {
      type: "date_range_length",
      rangeStart: { type: "number_constant", value: makeDateValue(2026, 2, 1) },
      rangeEnd: { type: "number_constant", value: makeDateValue(2026, 2, 1) },
      unit: "weekday",
    },
    expected: { value: 0, errors: [] },
  },
  {
    description: "counts weekdays in the same weekend",
    provider: {
      type: "date_range_length",
      rangeStart: { type: "number_constant", value: makeDateValue(2026, 1, 3) },
      rangeEnd: { type: "number_constant", value: makeDateValue(2026, 1, 5) },
      unit: "weekday",
    },
    expected: { value: 0, errors: [] },
  },
  {
    description: "counts weekdays starting on a Saturday",
    provider: {
      type: "date_range_length",
      rangeStart: { type: "number_constant", value: makeDateValue(2026, 1, 3) },
      rangeEnd: { type: "number_constant", value: makeDateValue(2026, 1, 8) },
      unit: "weekday",
    },
    expected: { value: 3, errors: [] },
  },
  {
    description: "counts weekdays starting on a Sunday",
    provider: {
      type: "date_range_length",
      rangeStart: { type: "number_constant", value: makeDateValue(2026, 1, 4) },
      rangeEnd: { type: "number_constant", value: makeDateValue(2026, 1, 8) },
      unit: "weekday",
    },
    expected: { value: 3, errors: [] },
  },
  {
    description: "counts weekdays starting on a Monday",
    provider: {
      type: "date_range_length",
      rangeStart: { type: "number_constant", value: makeDateValue(2026, 1, 5) },
      rangeEnd: { type: "number_constant", value: makeDateValue(2026, 1, 8) },
      unit: "weekday",
    },
    expected: { value: 3, errors: [] },
  },
  {
    description: "counts weekdays starting on a Tuesday",
    provider: {
      type: "date_range_length",
      rangeStart: { type: "number_constant", value: makeDateValue(2026, 1, 6) },
      rangeEnd: { type: "number_constant", value: makeDateValue(2026, 1, 8) },
      unit: "weekday",
    },
    expected: { value: 2, errors: [] },
  },
  {
    description: "counts weekdays across weeks ending on a Saturday",
    provider: {
      type: "date_range_length",
      rangeStart: { type: "number_constant", value: makeDateValue(2026, 1, 6) },
      rangeEnd: { type: "number_constant", value: makeDateValue(2026, 1, 17) },
      unit: "weekday",
    },
    expected: { value: 9, errors: [] },
  },
  {
    description: "counts weekdays across weeks ending on a Sunday",
    provider: {
      type: "date_range_length",
      rangeStart: { type: "number_constant", value: makeDateValue(2026, 1, 6) },
      rangeEnd: { type: "number_constant", value: makeDateValue(2026, 1, 18) },
      unit: "weekday",
    },
    expected: { value: 9, errors: [] },
  },
  {
    description: "counts weekdays across weeks ending on a Monday",
    provider: {
      type: "date_range_length",
      rangeStart: { type: "number_constant", value: makeDateValue(2026, 1, 6) },
      rangeEnd: { type: "number_constant", value: makeDateValue(2026, 1, 19) },
      unit: "weekday",
    },
    expected: { value: 9, errors: [] },
  },
  {
    description: "counts weekdays across weeks ending on a Tuesday",
    provider: {
      type: "date_range_length",
      rangeStart: { type: "number_constant", value: makeDateValue(2026, 1, 6) },
      rangeEnd: { type: "number_constant", value: makeDateValue(2026, 1, 20) },
      unit: "weekday",
    },
    expected: { value: 10, errors: [] },
  },
  {
    description: "counts weekdays across weeks",
    provider: {
      type: "date_range_length",
      rangeStart: { type: "number_constant", value: makeDateValue(2026, 1, 8) },
      rangeEnd: { type: "number_constant", value: makeDateValue(2026, 1, 29) },
      unit: "weekday",
    },
    expected: { value: 15, errors: [] },
  },
  {
    description: "counts weekdays across months",
    provider: {
      type: "date_range_length",
      rangeStart: {
        type: "number_constant",
        value: makeDateValue(2026, 1, 31),
      },
      rangeEnd: { type: "number_constant", value: makeDateValue(2026, 4, 26) },
      unit: "weekday",
    },
    expected: { value: 60, errors: [] },
  },
  {
    description: "counts weekdays including leap days",
    provider: {
      type: "date_range_length",
      rangeStart: {
        type: "number_constant",
        value: makeDateValue(2028, 1, 31),
      },
      rangeEnd: { type: "number_constant", value: makeDateValue(2028, 4, 26) },
      unit: "weekday",
    },
    expected: { value: 62, errors: [] },
  },
  {
    description: "propagates errors",
    provider: {
      type: "date_range_length",
      rangeStart: ERROR_PROVIDER,
      rangeEnd: ERROR_PROVIDER,
      unit: "day",
    },
    expected: {
      value: 0,
      errors: [{ type: "divide_by_zero" }, { type: "divide_by_zero" }],
    },
  },
];
