export const ROUNDING_DIRECTIONS = ["down", "up"] as const;

export type RoundingDirection = (typeof ROUNDING_DIRECTIONS)[number];
