import {
  FieldError,
  Input,
  Label,
  SearchField as AriaSearchField,
  Text,
} from "react-aria-components";

import type { FieldProps } from "#src/ui/types/fieldProps";

type Props = FieldProps<string>;

export function SearchField({
  label,
  "aria-label": ariaLabel,
  placeholder,
  description,
  errorMessage,
  value,
  onChange,
}: Props) {
  return (
    <AriaSearchField
      aria-label={!label ? ariaLabel : undefined}
      value={value}
      onChange={onChange}
      isInvalid={!!errorMessage}
    >
      {label && <Label>{label}</Label>}
      <Input placeholder={placeholder} />
      {description && <Text slot="description">{description}</Text>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </AriaSearchField>
  );
}
