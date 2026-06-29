export function requireString(value: unknown): string {
  if (typeof value !== "string") {
    throw new Error(
      `Expected a string attribute, got ${JSON.stringify(value)}`,
    );
  }
  return value;
}

export function requireNumber(value: unknown): number {
  if (typeof value !== "number") {
    throw new Error(
      `Expected a number attribute, got ${JSON.stringify(value)}`,
    );
  }
  return value;
}

function isOneOf<T extends string>(
  value: unknown,
  allowed: readonly T[],
): value is T {
  return (
    typeof value === "string" && allowed.some((option) => option === value)
  );
}

export function requireOneOf<T extends string>(
  value: unknown,
  allowed: readonly T[],
): T {
  if (!isOneOf(value, allowed)) {
    throw new Error(
      `Expected one of ${JSON.stringify(allowed)}, got ${JSON.stringify(value)}`,
    );
  }
  return value;
}
