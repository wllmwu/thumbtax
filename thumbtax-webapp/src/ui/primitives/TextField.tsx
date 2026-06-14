import {
  FieldError,
  Input,
  Label,
  Text,
  TextField as AriaTextField,
} from "react-aria-components";

import type { FieldProps } from "#src/ui/types/fieldProps";
import type { InputProps } from "#src/ui/types/inputProps";

type Props = FieldProps<string> & InputProps;

export function TextField({
  label,
  "aria-label": ariaLabel,
  placeholder,
  description,
  disabled,
  readOnly,
  errorMessage,
  value,
  onChange,
  autoFocus,
  onFocus,
  onBlur,
}: Props) {
  return (
    <AriaTextField
      aria-label={!label ? ariaLabel : undefined}
      value={value}
      onChange={onChange}
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
}
