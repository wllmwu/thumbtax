import type { LoadError } from "#src/persistence/types/loadError";

export type DeserializeResult<Value> =
  | { ok: true; value: Value; errors: LoadError[] }
  | { ok: false; errors: LoadError[] };
