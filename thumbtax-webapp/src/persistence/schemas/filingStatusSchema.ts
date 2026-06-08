import { z } from "zod";

import { FILING_STATUSES } from "#src/common/types/filingStatus";

export const filingStatusSchema = z.enum(FILING_STATUSES);
