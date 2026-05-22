import React from "react";

import {
  Button,
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

import type { FieldProps } from "#src/ui/types/fieldProps";

type Props = Omit<FieldProps<string>, "placeholder"> & {
  children: React.ReactNode;
};

export const SelectFieldItem = ListBoxItem;

export const SelectFieldSection = ListBoxSection;

export function SelectField({
  label,
  "aria-label": ariaLabel,
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
    <Select
      aria-label={!label ? ariaLabel : undefined}
      value={value}
      onChange={handleChange}
      isInvalid={!!errorMessage}
    >
      {label && <Label>{label}</Label>}
      <Button>
        <SelectValue />
      </Button>
      {description && <Text slot="description">{description}</Text>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
      <Popover>
        <ListBox>{children}</ListBox>
      </Popover>
    </Select>
  );
}
