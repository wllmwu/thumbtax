import { FORM_CLASSES } from "@thumbtax/common";
import { z } from "zod";

// The v1 snapshot of the form-class set, used by the versioned persistedState
// schema. It derives from the live FORM_CLASSES constant on purpose: adding a
// new form is backward-compatible (an old save file simply lacks it), so it
// should not force a schema-version bump. A *breaking* change to a form (a
// structural change, or removing a class) is what warrants a new vN snapshot
// and a migration; at that point this would be frozen to inline literals.
export const formClassSchema = z.enum(FORM_CLASSES);
