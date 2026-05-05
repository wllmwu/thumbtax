export function absurd(x: never): never {
  throw new Error(
    `Entered code that should be unreachable. ${JSON.stringify(x)}`,
  );
}
