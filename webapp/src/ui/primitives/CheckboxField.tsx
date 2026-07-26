import {
  CheckboxButton,
  CheckboxField as AriaCheckboxField,
  FieldError,
  Text,
} from "react-aria-components";

import { racn } from "#src/ui/utils/racn";
import styles from "#src/ui/primitives/CheckboxField.module.css";
import fieldStyles from "#src/ui/primitives/fields.module.css";

import type { FieldProps } from "#src/ui/types/fieldProps";
import type React from "react";

type Props = Omit<FieldProps<boolean>, "placeholder">;

function CheckboxIndicator({ checked }: { checked: boolean }): React.ReactNode {
  return (
    <svg
      className={styles.checkboxIndicator}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1" y="1" width="14" height="14" rx="5" />
      {checked && <polyline points="3,8 7,12 13,4" />}
    </svg>
  );
}

export function CheckboxField({
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
    <AriaCheckboxField
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      className={fieldStyles.smallControlField}
      isSelected={value}
      onChange={onChange}
      isDisabled={disabled}
      isReadOnly={readOnly}
      isInvalid={!!errorMessage}
    >
      <CheckboxButton
        className={racn(fieldStyles.button, styles.checkboxButton)}
      >
        <CheckboxIndicator checked={value} />
        {label}
      </CheckboxButton>
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
      {description && <Text slot="description">{description}</Text>}
    </AriaCheckboxField>
  );
}
