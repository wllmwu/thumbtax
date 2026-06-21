import {
  FieldError,
  SwitchButton,
  SwitchField as AriaSwitchField,
  Text,
} from "react-aria-components";

import type { FieldProps } from "#src/ui/types/fieldProps";

type Props = Omit<FieldProps<boolean>, "placeholder">;

export function SwitchField({
  label,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  description,
  disabled,
  readOnly,
  errorMessage,
  value,
  onChange,
}: Props) {
  return (
    <AriaSwitchField
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      isSelected={value}
      onChange={onChange}
      isDisabled={disabled}
      isReadOnly={readOnly}
      isInvalid={!!errorMessage}
    >
      <SwitchButton>
        {`${value}`}
        {label}
      </SwitchButton>
      {description && <Text slot="description">{description}</Text>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </AriaSwitchField>
  );
}
