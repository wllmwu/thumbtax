import {
  CheckboxButton,
  CheckboxField as AriaCheckboxField,
  FieldError,
  Text,
} from "react-aria-components";

import type { FieldProps } from "#src/ui/types/fieldProps";

type Props = Omit<FieldProps<boolean>, "placeholder">;

export function CheckboxField({
  label,
  "aria-label": ariaLabel,
  description,
  disabled,
  readOnly,
  errorMessage,
  value,
  onChange,
}: Props) {
  return (
    <AriaCheckboxField
      aria-label={!label ? ariaLabel : undefined}
      isSelected={value}
      onChange={onChange}
      isDisabled={disabled}
      isReadOnly={readOnly}
      isInvalid={!!errorMessage}
    >
      <CheckboxButton>
        {`${value}`}
        {label}
      </CheckboxButton>
      {description && <Text slot="description">{description}</Text>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </AriaCheckboxField>
  );
}
