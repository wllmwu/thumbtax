import { z } from "zod";

import { FORM_CLASSES } from "#src/common/types/formClass";

// The current form-class set, used by the unversioned uiState schema (browser-
// only data with no schemaVersion). The versioned save file uses its own
// per-version copy under schemas/v1/formClassSchema.ts.
export const formClassSchema = z.enum(FORM_CLASSES);
