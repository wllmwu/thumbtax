import React from "react";

import {
  FieldError,
  SwitchButton,
  SwitchField as AriaSwitchField,
  Text,
} from "react-aria-components";

import { racn } from "#src/ui/utils/racn";
import fieldStyles from "#src/ui/primitives/fields.module.css";
import styles from "#src/ui/primitives/SwitchField.module.css";

import type { FieldProps } from "#src/ui/types/fieldProps";

type Props = Omit<FieldProps<boolean>, "placeholder">;

function SwitchIndicator({ checked }: { checked: boolean }): React.ReactNode {
  return (
    <svg
      className={styles.switchIndicator}
      viewBox="0 0 28 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1" y="1" ry="50%" width="26" height="14" />
      <circle r="6" cx={checked ? 20 : 8} cy="8" />
    </svg>
  );
}

export const SwitchField = React.forwardRef(function SwitchField(
  {
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
    name,
  }: Props,
  ref: React.ForwardedRef<React.ComponentRef<typeof AriaSwitchField>>,
) {
  return (
    <AriaSwitchField
      ref={ref}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      className={fieldStyles.smallControlField}
      isSelected={value}
      onChange={onChange}
      name={name}
      isDisabled={disabled}
      isReadOnly={readOnly}
      isInvalid={!!errorMessage}
    >
      <SwitchButton className={racn(fieldStyles.button, styles.switchButton)}>
        <SwitchIndicator checked={value} />
        {label}
      </SwitchButton>
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
      {description && <Text slot="description">{description}</Text>}
    </AriaSwitchField>
  );
});
