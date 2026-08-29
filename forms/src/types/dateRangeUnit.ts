export const DATE_RANGE_UNITS = ["day", "weekday"] as const;

export type DateRangeUnit = (typeof DATE_RANGE_UNITS)[number];
