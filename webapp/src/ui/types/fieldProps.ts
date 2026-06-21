import type { AccessibleLabelProps } from "#src/ui/types/accessibleLabelProps";
import type React from "react";

export type FieldProps<TValue> = AccessibleLabelProps & {
  label?: React.ReactNode;
  placeholder?: string;
  description?: React.ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  errorMessage?: React.ReactNode;
  value: TValue;
  onChange: (value: TValue) => void;
};
