import type { LabelingProps } from "#src/ui/types/labelingProps";
import type React from "react";

export type FieldProps<TValue> = LabelingProps & {
  label?: React.ReactNode;
  placeholder?: string;
  description?: React.ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  errorMessage?: React.ReactNode;
  value: TValue;
  onChange: (value: TValue) => void;
};
