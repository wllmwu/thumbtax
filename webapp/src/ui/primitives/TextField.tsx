import React from "react";

import {
  FieldError,
  Input,
  Label,
  Text,
  TextField as AriaTextField,
  type TextFieldProps,
} from "react-aria-components";

import type { FieldProps } from "#src/ui/types/fieldProps";
import type { InputProps } from "#src/ui/types/inputProps";

type Props = FieldProps<string> &
  InputProps & {
    inputMode?: TextFieldProps["inputMode"];
  };

export const TextField = React.forwardRef(function TextField(
  {
    label,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    inputMode,
    placeholder,
    description,
    disabled,
    readOnly,
    errorMessage,
    value,
    onChange,
    name,
    autoFocus,
    onFocus,
    onBlur,
  }: Props,
  ref: React.ForwardedRef<React.ComponentRef<typeof AriaTextField>>,
) {
  return (
    <AriaTextField
      ref={ref}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      inputMode={inputMode}
      value={value}
      onChange={onChange}
      name={name}
      isDisabled={disabled}
      isReadOnly={readOnly}
      isInvalid={!!errorMessage}
      autoFocus={autoFocus}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {label && <Label>{label}</Label>}
      <Input placeholder={placeholder} />
      {description && <Text slot="description">{description}</Text>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </AriaTextField>
  );
});
