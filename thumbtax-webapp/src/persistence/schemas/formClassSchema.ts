import { z } from "zod";

import { FORM_CLASSES } from "#src/common/types/formClass";

export const formClassSchema = z.enum(FORM_CLASSES);
