import type React from "react";

export type FieldProps<TValue> = {
  label?: React.ReactNode;
  "aria-label"?: string;
  placeholder?: string;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  value: TValue;
  onChange: (value: TValue) => void;
};
