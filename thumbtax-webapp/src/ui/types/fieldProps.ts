import type { InputProps } from "#src/ui/types/inputProps";
import type React from "react";

export type FieldProps<TValue> = InputProps<TValue> & {
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
};
