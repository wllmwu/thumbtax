import {
  FieldError,
  Input,
  Label,
  NumberField as AriaNumberField,
  Text,
} from "react-aria-components";

import type { FieldProps } from "#src/ui/types/fieldProps";

type Props = FieldProps<number>;

export function NumberField({
  label,
  "aria-label": ariaLabel,
  description,
  errorMessage,
  value,
  onChange,
}: Props) {
  return (
    <AriaNumberField
      aria-label={!label ? ariaLabel : undefined}
      value={value}
      onChange={onChange}
      isInvalid={!!errorMessage}
    >
      {label && <Label>{label}</Label>}
      <Input />
      {description && <Text slot="description">{description}</Text>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </AriaNumberField>
  );
}
