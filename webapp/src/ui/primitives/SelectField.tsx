import React from "react";

import { ChevronsUpDown } from "lucide-react";
import {
  FieldError,
  type Key,
  Label,
  ListBox,
  ListBoxItem,
  ListBoxSection,
  Popover,
  Select,
  SelectValue,
  Text,
} from "react-aria-components";

import { Button } from "#src/ui/primitives/Button";
import fieldStyles from "#src/ui/primitives/fields.module.css";
import styles from "#src/ui/primitives/SelectField.module.css";

import type { FieldProps } from "#src/ui/types/fieldProps";

type Props = Omit<FieldProps<string>, "placeholder" | "readonly"> & {
  children: React.ReactNode;
};

export const SelectFieldItem = ListBoxItem;

export const SelectFieldSection = ListBoxSection;

export function SelectorButton({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <Button className={styles.selectorButton}>
      {children}
      <ChevronsUpDown className={styles.chevrons} />
    </Button>
  );
}

export function SelectField({
  label,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  description,
  disabled,
  errorMessage,
  value,
  onChange,
  children,
}: Props) {
  const handleChange = React.useCallback(
    (value: Key | null) => {
      if (typeof value === "string") {
        onChange(value);
      }
    },
    [onChange],
  );

  return (
    <Select
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      className={fieldStyles.inputBoxField}
      value={value}
      onChange={handleChange}
      isDisabled={disabled}
      isInvalid={!!errorMessage}
    >
      {label && <Label>{label}</Label>}
      <SelectorButton>
        <SelectValue />
      </SelectorButton>
      {description && <Text slot="description">{description}</Text>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
      <Popover>
        <ListBox>{children}</ListBox>
      </Popover>
    </Select>
  );
}
