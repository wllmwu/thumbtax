import { userPreferencesSchema } from "#src/persistence/schemas/userPreferencesSchema";
import { validationFailed } from "#src/persistence/zodIssuesToLoadError";

import type { DeserializeResult } from "#src/persistence/types/deserializeResult";
import type { UserPreferences } from "#src/state/types/userPreferences";

export function deserializeUserPreferences(
  raw: unknown,
): DeserializeResult<UserPreferences> {
  const parsed = userPreferencesSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, errors: [validationFailed(parsed.error)] };
  }
  return { ok: true, value: parsed.data, errors: [] };
}
