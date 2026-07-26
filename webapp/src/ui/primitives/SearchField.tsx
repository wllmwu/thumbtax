import {
  FieldError,
  Input,
  Label,
  SearchField as AriaSearchField,
  Text,
} from "react-aria-components";

import { racn } from "#src/ui/utils/racn";
import fieldStyles from "#src/ui/primitives/fields.module.css";

import type { FieldProps } from "#src/ui/types/fieldProps";

type Props = FieldProps<string> & {
  autoFocus?: boolean;
  className?: string;
};

export function SearchField({
  label,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  className,
  placeholder,
  description,
  disabled,
  readOnly,
  errorMessage,
  value,
  onChange,
  autoFocus,
}: Props) {
  return (
    <AriaSearchField
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      className={racn(fieldStyles.inputBoxField, className)}
      value={value}
      onChange={onChange}
      autoFocus={autoFocus}
      isDisabled={disabled}
      isReadOnly={readOnly}
      isInvalid={!!errorMessage}
    >
      {label && <Label>{label}</Label>}
      <Input placeholder={placeholder} />
      {description && <Text slot="description">{description}</Text>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </AriaSearchField>
  );
}
