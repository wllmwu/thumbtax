import React from "react";

import {
  Button,
  ComboBox,
  FieldError,
  Input,
  type Key,
  Label,
  ListBox,
  ListBoxItem,
  ListBoxSection,
  Popover,
  Text,
} from "react-aria-components";

import type { FieldProps } from "#src/ui/types/fieldProps";

type Props = FieldProps<string | null> & {
  children: React.ReactNode;
};

export const ComboBoxFieldItem = ListBoxItem;

export const ComboBoxFieldSection = ListBoxSection;

export function ComboBoxField({
  label,
  "aria-label": ariaLabel,
  placeholder,
  description,
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
    <ComboBox
      aria-label={!label ? ariaLabel : undefined}
      value={value}
      onChange={handleChange}
      isInvalid={!!errorMessage}
      menuTrigger="focus"
    >
      {label && <Label>{label}</Label>}
      <Input placeholder={placeholder} />
      <Button>Select</Button>
      {description && <Text slot="description">{description}</Text>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
      <Popover>
        <ListBox>{children}</ListBox>
      </Popover>
    </ComboBox>
  );
}
