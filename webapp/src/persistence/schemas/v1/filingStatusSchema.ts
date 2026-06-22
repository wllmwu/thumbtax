import { FILING_STATUSES } from "@thumbtax/common";
import { z } from "zod";

export const filingStatusSchema = z.enum(FILING_STATUSES);
