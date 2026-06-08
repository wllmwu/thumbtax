import { uiStateSchema } from "#src/persistence/schemas/uiStateSchema";
import { validationFailed } from "#src/persistence/zodIssuesToLoadError";

import type { DeserializeResult } from "#src/persistence/types/deserializeResult";
import type { UiState } from "#src/state/types/uiState";

export function deserializeUiState(raw: unknown): DeserializeResult<UiState> {
  const parsed = uiStateSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, errors: [validationFailed(parsed.error)] };
  }
  return { ok: true, value: parsed.data, errors: [] };
}
