import type { AccessibleLabelProps } from "#src/ui/types/accessibleLabelProps";
import type React from "react";

export type FieldProps<
  TValue,
  TOnChangeValue = TValue,
> = AccessibleLabelProps & {
  label?: React.ReactNode;
  placeholder?: string;
  description?: React.ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  errorMessage?: React.ReactNode;
  value: TValue;
  onChange: (value: TOnChangeValue) => void;
  name?: string;
};
