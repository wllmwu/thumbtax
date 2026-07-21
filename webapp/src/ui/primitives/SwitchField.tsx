import classNames from "classnames";
import {
  FieldError,
  SwitchButton,
  SwitchField as AriaSwitchField,
  Text,
} from "react-aria-components";

import fieldStyles from "#src/ui/primitives/fields.module.css";
import styles from "#src/ui/primitives/SwitchField.module.css";

import type { FieldProps } from "#src/ui/types/fieldProps";
import type React from "react";

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
      className={fieldStyles.smallControlField}
      isSelected={value}
      onChange={onChange}
      isDisabled={disabled}
      isReadOnly={readOnly}
      isInvalid={!!errorMessage}
    >
      <SwitchButton
        className={classNames(fieldStyles.button, styles.switchButton)}
      >
        <SwitchIndicator checked={value} />
        {label}
      </SwitchButton>
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
      {description && <Text slot="description">{description}</Text>}
    </AriaSwitchField>
  );
}
