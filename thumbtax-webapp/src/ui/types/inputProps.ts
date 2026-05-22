import type React from "react";

export type InputProps<TValue> = {
  label?: React.ReactNode;
  "aria-label"?: string;
  placeholder?: string;
  value: TValue;
  onChange: (value: TValue) => void;
};
