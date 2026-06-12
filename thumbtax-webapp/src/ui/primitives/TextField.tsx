import {
  FieldError,
  Input,
  Label,
  Text,
  TextField as AriaTextField,
} from "react-aria-components";

import type { FieldProps } from "#src/ui/types/fieldProps";

type Props = FieldProps<string> & {
  autoFocus?: boolean;
};

export function TextField({
  label,
  "aria-label": ariaLabel,
  placeholder,
  description,
  disabled,
  errorMessage,
  value,
  onChange,
  autoFocus,
}: Props) {
  return (
    <AriaTextField
      aria-label={!label ? ariaLabel : undefined}
      value={value}
      onChange={onChange}
      isDisabled={disabled}
      isInvalid={!!errorMessage}
      autoFocus={autoFocus}
    >
      {label && <Label>{label}</Label>}
      <Input placeholder={placeholder} />
      {description && <Text slot="description">{description}</Text>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </AriaTextField>
  );
}
