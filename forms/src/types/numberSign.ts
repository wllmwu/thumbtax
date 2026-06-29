export const NUMBER_SIGNS = ["negative", "positive"] as const;

export type NumberSign = (typeof NUMBER_SIGNS)[number];
